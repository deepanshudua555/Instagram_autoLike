// npm install puppeteer
// node instagram_autamation.js --url=https://www.instagram.com/ --config=config.json


let minimist = require("minimist");
let fs = require("fs");
let puppeteer = require("puppeteer");

let args = minimist(process.argv);
let configJson = fs.readFileSync(args.config, "utf-8");
let config = JSON.parse(configJson);

run();

async function run() {
    //start browser 
    let browser = await puppeteer.launch({
        defaultViewport: null,
        args: [
            "--start-maximized"
        ],
        headless: false
    });

    //get a tab
    let pages = await browser.pages();
    let page = pages[0];

    //go to url
    await page.goto(args.url);

    await page.waitForSelector("input[name='username']");
    await page.type("input[name='username']", config.userid, { delay: 200 });


    await page.waitForSelector("input[name='password']");
    await page.type("input[name='password']", config.password, { delay: 200 });

    await page.waitForSelector("button[type='submit']");
    await page.click("button[type='submit']");

    await page.waitForSelector("div.cmbtv");
    await page.click("div.cmbtv");


    await page.waitForSelector("button.HoLwm");
    await page.click("button.HoLwm");



    await autoScroll(page);
    await page.waitFor(5000);
    await page.waitForSelector("span.fr66n > button.wpO6b");
    let likesArray = await page.$$("span.fr66n > button.wpO6b");

    console.log(likesArray.length);
    for (let i = 0; i < likesArray.length; i++) {


        await likesArray[i].click({ delay: 100 });

    }

}

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= 1438) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}