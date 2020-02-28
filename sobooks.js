/**
 * 获取https://sobooks.cc/ 所有书名和电子书的链接
 */

const puppeteer = require('puppeteer')
const axios = require('axios')
const url = require('url')

// 进入网站，获取整个网站列表的页数

// 访问网址
let httpUrl = 'https://sobooks.cc/';
(async function() {
    // 调试选项
    let debugOptions = {
        defaultViewport: {
            width: 1440,
            height: 800
        },
        headless: false,
        // 放慢每个步骤的毫秒数
        slowMo: 250
    }
    let browser = await puppeteer.launch(debugOptions)
    // 获取列表页数
    async function getAllNum() {
        let page = await browser.newPage()
        // 截取谷歌请求
        await page.setRequestInterception(true);
        page.on('request', interceptedRequest => {
            // 通过url模块对请求的地址进行解析
            let urlObj = url.parse(interceptedRequest.url())
            if (urlObj.hostname == 'googleads.g.doubleclick.net') {
                // 如果是谷歌的广告请求，那么就放弃当次请求，因为谷歌广告响应太慢
                interceptedRequest.abort();
            }else{
                interceptedRequest.continue();
            }
        })
        await page.goto(httpUrl)
        // 设置选择器，获取总页数
        let pageNum = await page.$eval(".pagination li:last-child span", element => {
            let text = element.innerHTML;
            // 共 240 页 截取去空格
            text = text.substring(1, text.length-2).trim()
            return text
        })
        // 关闭页面
        page.close()
        return pageNum
    }
    // 书籍列表的总页数
    let pageNum = await getAllNum()
    
    // 获取列表页
    async function pageList(num) {
        let pageListUrl = `https://sobooks.cc/page/${num}`;
        let page = await browser.newPage()
        await page.goto(pageListUrl)
        let arrPage = await page.$$eval('.card .card-item .thumb-img>a', elements => {
            let arr = []
            elements.forEach(item => {
                let obj = {
                    href: item.getAttribute('href'),
                    title: item.getAttribute('title')
                }
                arr.push(obj)
            })
            console.log(arr);
            return arr
        })
        // 关闭页面
        page.close()
        // 通过获取的数组的地址和标题去请求书籍的详情页
        arrPage.forEach(pageObj => {
            getPageInfo(pageObj)
        })
    }

    // 获取详情页
    async function getPageInfo(pageObj) {
        let page = await browser.newPage()
        // 截取谷歌请求
        await page.setRequestInterception(true);
        page.on('request', interceptedRequest => {
            // 通过url模块对请求的地址进行解析
            let urlObj = url.parse(interceptedRequest.url())
            if (urlObj.hostname == 'googleads.g.doubleclick.net') {
                // 如果是谷歌的广告请求，那么就放弃当次请求，因为谷歌广告响应太慢
                interceptedRequest.abort();
            }else{
                interceptedRequest.continue();
            }
        })
        await page.goto(pageObj.href)
        let eleA = await page.$('.dltable tr:nth-child(3) a:last-child')
        let aHref = await eleA.getProperty('href')
        aHref = aHref._remoteObject.value
        console.log(aHref);
    }
    pageList(1)
})()



// 获取列表页的所有链接


// 进入每个电子书的详情页获取下载电子书的网盘地址