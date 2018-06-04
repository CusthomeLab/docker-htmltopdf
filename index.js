/**
 * @see https://github.com/GoogleChrome/puppeteer/issues/422
 */

'use strict';

const express = require('express');
const puppeteer = require('puppeteer');
const tmp = require('tmp');
const fs = require('fs');

// Constants
const HTMLTOPDF_PORT = 8080;
const HTMLTOPDF_HOST = '0.0.0.0';

// App
const app = express();
app.use(express.json({limit: '50mb'}))

app.get('/', (req, res) => {
    res.send('htmltopdf is ready !\n');
});

app.post('/', async (req, res) => {
    let html = req.body.html;
    let tmpHtmlFile = tmp.fileSync({ 'postfix': '.html' });
    fs.appendFileSync(tmpHtmlFile.name, html);
    console.log("-- html", html);

    let settings = req.body.settings;
    console.log("-- settings", settings);

    const browser = await puppeteer.launch({
        // executablePath: '/usr/bin/chromium-browser',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage'
        ]
    });

    const page = await browser.newPage();

    await page.goto('file://' + tmpHtmlFile.name, {waitUntil: 'networkidle0'});

    let pdf = await page.pdf(settings);

    await browser.close();

    res.write(pdf,'binary');
    res.end(undefined,'binary');

});

app.listen(HTMLTOPDF_PORT, HTMLTOPDF_HOST);
console.log(`Running on http://${HTMLTOPDF_PORT}:${HTMLTOPDF_HOST}`);