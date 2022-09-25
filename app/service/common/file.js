'use strict';

const Service = require('../../core/CoreService');
const path = require('path');
const pump = require('mz-modules/pump');
const md5 = require('md5');
const fs = require('fs');
const crypto = require('crypto');

class CommonService extends Service {
  async uploadImageByBase64(imgDataBase64) {
    // 生成二维码
    const base64Data = imgDataBase64.replace(/^data:image\/\w+;base64,/, '');
    const dataBuffer = Buffer.from(base64Data, 'base64');

    // base64Data的图片MD5加密后生成图片
    const filename = `${this.ctx.session.openid}-${md5(base64Data)}.png`;
    const urlImg = `public/upload/${filename}`;

    const dirPath = path.join(this.config.baseDir, 'app/public/upload');

    const existDir = await (async () => {
      return new Promise(resolve => {
        fs.stat(dirPath, (err, stats) => {
          if (err) {
            resolve(false);
          } else {
            resolve(stats);
          }
        });
      });
    })();

    if (!existDir) {
      await (async () => {
        return new Promise(resolve => {
          fs.mkdir(dirPath, err => {
            if (err) {
              resolve(false);
            } else {
              resolve(true);
            }
          });
        });
      })();
    }

    return new Promise((resolve, reject) => {
      const target = path.join(this.config.baseDir, 'app/public/upload', filename);
      fs.writeFile(target, dataBuffer, err => {
        if (err) {
          reject(err);
        } else {
          resolve(urlImg);
        }
      });
    });
  }

  /**
   *上传图片
   * @param {*} dataBuffer
   */
  async uploadImageByBuffer(dataBuffer, filename) {
    const urlImg = `public/upload/${filename}`;
    const dirPath = path.join(this.config.baseDir, 'app/public/upload');
    const existDir = await (async () => {
      return new Promise(resolve => {
        fs.stat(dirPath, (err, stats) => {
          if (err) {
            resolve(false);
          } else {
            resolve(stats);
          }
        });
      });
    })();

    if (!existDir) {
      await (async () => {
        return new Promise(resolve => {
          fs.mkdir(dirPath, err => {
            if (err) {
              resolve(false);
            } else {
              resolve(true);
            }
          });
        });
      })();
    }

    return new Promise((resolve, reject) => {
      const target = path.join(this.config.baseDir, 'app/public/upload', filename);
      fs.writeFile(target, dataBuffer, err => {
        if (err) {
          reject(err);
        } else {
          resolve(urlImg);
        }
      });
    });
  }

  async uploadFile(dir = 'upload') {
    const { ctx } = this;
    console.log('ctx.request.files: ', ctx.request.files);
    const file = ctx.request.files[0];
    if (!file) {
      return this.failed({ err_msg: '未找到文件' });
    }

    const filename = await this.helperGetFileMD5Name(file.filepath) + path.extname(file.filename).toLowerCase();
    const targetPath = path.join(this.config.baseDir, `app/public/${dir}`, filename);
    const source = fs.createReadStream(file.filepath);
    const target = fs.createWriteStream(targetPath);

    try {
      await pump(source, target);
      ctx.logger.warn('save %s to %s', file.filepath, targetPath);
    } finally {
      await ctx.cleanupRequestFiles();
    }

    return this.success({
      data: `/public/${dir}/` + filename,
    });
  }

  async helperGetFileMD5Name(path) {
    return new Promise(resolve => {
      const start = new Date().getTime();
      const md5sum = crypto.createHash('md5');
      const stream = fs.createReadStream(path);

      stream.on('data', function(chunk) {
        md5sum.update(chunk);
      });

      stream.on('end', function() {
        const str = md5sum.digest('hex').toUpperCase();
        console.log('文件:' + path + ',MD5签名为:' + str + '.耗时:' + (new Date().getTime() - start) / 1000.0 + '秒');
        return resolve(str);
      });
    });
  }
}

module.exports = CommonService;
