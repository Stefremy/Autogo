(async () => {
  try {
    const puppeteer = require('puppeteer');
    console.log('puppeteer version ok');
    const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'], headless: true, timeout: 10000 });
    console.log('launched');
    const pages = await browser.pages();
    console.log('open pages', pages.length);
    await browser.close();
    console.log('closed');
  } catch (e) {
    console.error('ERR', e && e.message ? e.message : e);
    process.exit(1);
  }
})();
