const puppeteer = require('puppeteer');
const fs = require('fs')

// 获取数据
let mi_data = fs.readFileSync('./小米商城数据/newPro.json', 'utf-8')
// 转对象
mi_data = JSON.parse(mi_data)
// 全局index
let gIndex = 0;
// 全局数组
let gArr = []


async function getDetail(obj) {
    // 浏览器配置对象
    // let options = {
    //     // 设置视窗的宽高
    //     defaultViewport: {
    //         width: 1440,
    //         height: 800
    //     },
    //     // 浏览器有界面
    //     headless: false
    // }
    // 打开浏览器
    let browser = await puppeteer.launch({headless: true})
    // 打开新页面
    let page = await browser.newPage()
    // 访问页面
    await page.goto(`https://m.mi.com/commodity/detail/${obj.product_i}`)
    await page.waitFor(2000);
    let pageObj = {}
    let title = await page.$eval('#commodityDetail > div:nth-child(4) > div > div.overview.overview-goods-name > div', e => {
        console.log(e);
        return e.innerHTML.split('<!---->')[1];
    })
    pageObj.title = title;
    let arrImg = await page.$$eval('#commodityDetail > div:nth-child(2) > div > div > div.swiper-wrapper > div.swiper-slide.h792 img', (e) => {
        let arr = []
        e.forEach(item => {
            if(item.src){
                arr.push(item.src)
            }else{
                arr.push(`https:${item.getAttribute('data-src')}`)
            }
        })
        return arr
    })
    // 将详情页图片存入对象中
    pageObj.img_url = arrImg
    let detail = await page.$eval('#commodityDetail > div:nth-child(5) > div > div .goods-brief', e => {
        return e.innerHTML;
    })
    // 将详情页详情介绍存入对象
    pageObj.detail = detail
    let price = await page.$eval('#commodityDetail > div:nth-child(6) > div > div > div > div', e => {
       return e.innerHTML.split('<!---->')[0];
    })
    // 将详情页价格传入对象
    pageObj.new_price = price
    pageObj.old_price = Math.ceil(price*1.2)
    pageObj.product_i = obj.product_i
    gArr.push(pageObj)
    await page.close()
    await browser.close()
}


async function run (){
    while(mi_data[gIndex]) {
        await getDetail((mi_data[gIndex]))
        await new Promise((resolve, reject) => {
          setTimeout(() => {
              resolve()
          }, 3000-gIndex);
        })
        console.log(gIndex);
        gIndex++;
    }
    fs.writeFileSync('./detail.json', JSON.stringify(gArr))
}

run()

