import dotenv from "dotenv";
dotenv.config();
import axios from "axios";

const searchTopic = (topic) => {
    return new Promise((resolve, reject) => {
        let url = "https://customsearch.googleapis.com/customsearch/v1";
        let q = topic;
        let key = process.env.CSE_API_KEY_mine;
        axios.get(url, {
            params: {
                q: q,
                key: key,
                cx: process.env.CSE_ID,
            },
        }).then(response => {
            // console.log(response.data.items);
            resolve(response.data.items.slice(0, 3));
        }).catch(err => {
            console.log(err);
            reject(err);
        });
    });
}

// async function search(topic) {

//     let url = "https://customsearch.googleapis.com/customsearch/v1";
//     let q = topic;
//     let key = process.env.CSE_API_KEY_mine;
//     axios.get(url, {
//         params: {
//             q: q,
//             key: key,
//             cx: process.env.CSE_ID,
//         },
//     }).then(response => {
//         console.log(response.items);
//         return response.items;
//     }).catch(err => {
//         console.log(err);
//         return err;
//     });
// }

export default searchTopic;