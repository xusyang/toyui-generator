'use strict';

const Controller = require('./../core/ApiController');
const Exceptions = require('./../exception');
const dayjs = require('dayjs');
const jwt = require('jsonwebtoken');
const nanoid = require('nanoid');
const path = require('path');
const fs = require('fs');
const util = require('util');

const puppeteer = require('puppeteer');
let browser = null;
let args = [
  '--no-sandbox',
  '--disable-infobars ', // don't show information bar
  '--window-size=2480,3508', // resize window view port size
  '--lang=zh-CN',
  '--disable-dev-shm-usage',
  '--disable-extensions',
];

class HomeController extends Controller {
  constructor(options) {
    super(options);
    this.today = dayjs().format('YYYY-MM-DD');
  }

  async awaitTime(time) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, time || 1000);
    });
  }

  // 生成海报
  async genHaibao() {
    let { url } = this.ctx.request.body;
    url =
      url ||
      'http://localhost:5173/?mode=download#/report-pdf/200/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiaW5zaWdodCJdLCJleHAiOjE2Njk2MzQ5NTgsInVzZXJfbmFtZSI6IntcImVtYWlsXCI6XCI3OTI4NjU3MjZAcXEuY29tXCIsXCJlbXBDb2RlXCI6XCJ4dXlhbmdcIixcImZ1bGxuYW1lXCI6XCJ4dXlhbmdcIixcInBhc3N3b3JkXCI6XCIkMmEkMTAkUVVUYzdFcE9qc0d6YXNsV2RvQjRJLmdpTGU3MWhJUDR2U3d6QWVXWTNCbHd6bzBZdVFVLldcIn0iLCJqdGkiOiI5ZGVjMDMxMC1iYTA4LTQyYTAtYjdiZS05ZTI5YTQ4YTJjZGQiLCJjbGllbnRfaWQiOiJyZXNvdXJjZTEiLCJzY29wZSI6WyJpbnNpZ2h0Il19.OctNJfW9Gr7ILBBPGdeuBcyqlaKDPKqzh5O_yFbJAds';
    const id = nanoid();
    this._genHaibao(id, url);
    this.success({ data: id });
  }

  // 获取海报
  async getHaibao() {
    const { id } = this.ctx.request.body;
    if (!id) return this.failed({ err_msg: '参数不存在' });
    const pathfile = path.resolve(__dirname, `./../public/${id}.png`);
    const exists = await util.promisify(fs.exists)(pathfile);
    if (exists) {
      this.success({ data: id });
    } else {
      this.success({ data: '' });
    }
  }

  async _genHaibao(id, url) {
    if (!browser) {
      browser = await puppeteer.launch({
        defaultViewport: { width: 1680, height: 1680 },
        ignoreHTTPSErrors: true,
        headless: true,
        args: args,
      });
    }

    const headerTemplate = `<div>
      <span style="color: red; font-size: 12px;">页头</span>
    </div>`;
    // 页脚模板（pageNumber处会自动注入当前页码）
    const footerTemplate = `<div style="display:flex; justify-content: space-between;">
      <span style="color: red; font-size: 10px;">页尾</span>
      <span style="color: red; font-size: 13px;" class="pageNumber"></span>
    </div>`;

    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: 'networkidle0',
    });

    console.debug('等待页面加载完成');

    const options = {
      //纸张尺寸
      format: 'A4', //打印背景,默认为false
      landscape: true,
      printBackground: true,
      displayHeaderFooter: false, //页眉与页脚样式,可在此处展示页码等
      headerTemplate,
      footerTemplate,
      margin: {
        top: '0px',
        bottom: '0px',
        left: '0px',
        right: '0px',
      },
      path: path.resolve(__dirname, `./../public/${id}.pdf`),
    };

    console.debug('保存截图');

    await page.pdf(options);

    console.debug('关闭页面');
    await page.close();
  }

  async textCensor() {
    const { text } = this.ctx.request.body;
    const res = await this.ctx.helper.sendHttp({
      url: 'https://aip.baidubce.com/rest/2.0/solution/v1/text_censor/v2/user_defined?access_token=24.dd5248244ef83c51b794fb81daddfe05.2592000.1636824715.282335-21233565',
      data: {
        text,
      },
    });

    this.success({
      data: text.includes('我靠') ? '不合规' : res.data.conclusion,
    });
  }
}

module.exports = HomeController;
