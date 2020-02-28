const puppeteer = require('puppeteer')


async function test() {
    // 浏览器配置对象
    let options = {
        // 设置视窗的宽高
        defaultViewport: {
            width: 1440,
            height: 800
        },
        // 浏览器有界面
        headless: false
    }
    // 打开浏览器
    let browser = await puppeteer.launch(options)
    // 打开新页面
    let page = await browser.newPage()
    // 访问页面
    page.goto('https://www.dytt8.net/')
}

test()