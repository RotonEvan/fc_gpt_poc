import { Router } from 'express';
const router = Router();
import axios from 'axios';
import { load } from 'cheerio';

import openai from './controllers/openai.js';
import searchTopic from './controllers/search.js';

function getContent(url) {
    // get data from url
    // url = "https://medium.com/@nandinikhandelwal2003/my-code-for-good-23-experience-e9dc1319c8d1"
    let cnt = axios(url).then(response => {
        const data = response.data;
        const $ = load(data);
        let content = $('body').text();
        content = content.replace(/\s\s+/g, ' ');
        content = content.replace(/\n/g, ' ');
        content = content.replace(/\t/g, ' ');
        content = content.replace(/\r/g, ' ');
        // remove all html tags
        content = content.replace(/<[^>]*>/g, '');

        // const root = parse(data);
        // const content = root.querySelector('body').text;
        console.log("returning content");
        return content;
    }).catch(err => {
        console.log("error in getContent");
        return "";
    });
    return cnt;
}

async function pipeline(content, topic, prompts, clientID, taskID) {
    let model3 = "gpt-3.5-turbo";
    let model4 = "gpt-4-1106-preview"

    // search for topic on google
    let sites = [];
    for (let i = 0; i < prompts.length; i++) {
        let items = await searchTopic(prompts[i]);
        for (let j = 0; j < items.length; j++) {
            sites.push(items[j].link);
        }
    }
    // console.log(sites);

    global.clients[clientID].socket.emit('task_progress', { taskID: taskID, topic, progress: 25 });

    // get content from sites
    let contents = "";
    let sites_completed = [];
    for (let i = 0; i < sites.length; i++) {
        if (sites[i] in sites_completed) {
            continue;
        }
        let cnt = await getContent(sites[i]);
        sites_completed.push(sites[i]);
        contents += cnt;
    }
    console.log(contents.length);
    console.log(sites_completed);

    global.clients[clientID].socket.emit('task_progress', { taskID: taskID, topic, progress: 50 });

    // break into 10000 character chunks and create messages for GPT
    let messages2 = [
        { "role": "system", "content": "You are given a topic: " + topic + ". Your task is to read the given text content from a news article, use only the human readable text and learn about the content. Only consider the texts that are related to the given topic. These are scrapped texts from new sites so can contain many garbage texts (from ads, headlines, etc.), so don't consider them. Stick to the topic. Finally you need to compare the gathered knowledge about the topic with the following article and determine how true the given article is. I will give the learning content next, and the article at the end." },
    ];
    let chunk = 10000;
    let step = contents.length / 15;
    for (let i = 0; i < contents.length; i += step) {
        messages2.push({ "role": "user", "content": contents.substring(i, i + chunk) });
    }
    messages2.push({ "role": "user", "content": "The following is the article to compare with the gathered knowledge. Article: " + content.substring(0, 10000) });
    messages2.push({ "role": "system", "content": "How true is the article? Also give the excerpts from the article that contradicts your gathered knowledge." });

    // get truthfulness of article from GPT
    const response2 = await openai.chat.completions.create({
        messages: messages2,
        model: model4,
    });
    let res2 = response2.choices[0].message.content;
    console.log(res2);
    return res2;
}

router.post('/url', async(req, res) => {
    // get url sent from client in body as json
    const url = req.body.url;
    const clientID = req.body.clientID;
    const taskID = req.body.taskID;
    global.clients[clientID].pending_tasks.push(taskID);
    global.tasks[taskID] = { clientID: clientID, status: "pending" };
    console.log(url);
    let content;
    if (req.body.urlFlag) {
        content = await getContent(url);
    } else {
        content = url;
    }
    let model3 = "gpt-3.5-turbo";
    let model4 = "gpt-4-1106-preview"
    let messages = [
        { "role": "system", "content": "Your task is to read the given text content from a webpage, use only the human readable text and return the topic of the content. The topic can be a line or two but not a paragraoh. Also return a few search prompts that I can Google to get information on all sides of the topic. Respond in json format - {topic: 'topic', prompts: ['prompt1', 'prompt2', ...]}." },
        { "role": "user", "content": content.substring(0, 10000) },
    ]
    const response = await openai.chat.completions.create({
        messages: messages,
        model: "gpt-3.5-turbo-1106",
        response_format: { "type": "json_object" },
    });
    let resp = response.choices[0].message.content;

    // clean res and convert to json
    resp = resp.replace(/\s\s+/g, ' ');
    console.log(resp);
    resp = JSON.parse(resp);
    let topic = resp.topic;
    let prompts = resp.prompts;
    console.log(topic);
    console.log(prompts);
    res.json({ topic, prompts });
    global.clients[clientID].socket.emit('task_progress', { taskID: taskID, topic, progress: 25 });
    const analysis = await pipeline(content, topic, prompts, clientID, taskID);
    global.tasks[taskID].status = "completed";
    global.clients[clientID].completed_tasks.push(taskID);
    global.clients[clientID].pending_tasks.splice(global.clients[clientID].pending_tasks.indexOf(taskID), 1);
    global.clients[clientID].socket.emit('task_completed', { taskID: taskID, analysis: analysis });
    // res.json({ analysis });
});

export default router;