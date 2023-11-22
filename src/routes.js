const express = require('express');
const router = express.Router();
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

router.post('/url', async(req, res) => {
    // get url sent from client in body as json
    const url = req.body.url;
    // console.log(req.body);
    // get text content from url
    const response = await fetch(url);
    const text = await response.text();
    console.log(text);
    // create dom from text
    const dom = new JSDOM(text);
    // console.log(dom.window.document.body);
    // get html from dom
    const body = dom.window.document.querySelector('body');
    // get body from html    
    // let  body = html.;
    // console.log(body);
});

module.exports = router;