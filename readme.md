
### 常见问题
1. [Failed to set up Chromium r901912! Set "PUPPETEER_SKIP_DOWNLOAD" env variable to skip download.](https://stdworkflow.com/706/error-failed-to-set-up-chromium-r901912-set-puppeteer-skip-download-env-variable-to-skip-download)

### 安装依赖
```
yum install libXcomposite.x86_64 pango.x86_64 libXcursor.x86_64 libXdamage.x86_64 libXext.x86_64 libXi.x86_64 libXtst.x86_64 cups-libs.x86_64 libXrandr.x86_64 libXScrnSaver.x86_64 GConf2.x86_64 atk.x86_64 alsa-lib.x86_64 gtk3.x86_64 -y
```

### puppeteer 安装失败使用cnpm 安装
```
npm install -S puppeteer //安装puppeteer时，总是提示安装不上，一种情况是跳过安装chrome，但是我个人不建议，因为后面会有版本问题，亲测麻烦的很。后面使用cnpm
```


