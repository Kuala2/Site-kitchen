import {chromium} from 'playwright';
import path from 'node:path';

const output=path.resolve('public/og-image-square-v3.png');
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1024,height:1024},deviceScaleFactor:1});
await page.setContent(`<!doctype html><style>
  *{box-sizing:border-box}html,body{margin:0;width:1024px;height:1024px;overflow:hidden;background:#1d1e1a}
  .mark{position:relative;width:1024px;height:1024px;display:grid;place-items:center;background:#1d1e1a;color:#f4efe5;font-family:Arial,sans-serif}
  .frame{position:absolute;inset:66px;border:12px solid #f4efe5}
  .cabinet{position:absolute;right:66px;top:66px;width:27%;height:36%;border-left:12px solid #f4efe5;border-bottom:12px solid #f4efe5}
  .cabinet:before,.cabinet:after{content:'';position:absolute;background:#f4efe5}.cabinet:before{left:47%;top:0;width:12px;height:100%}.cabinet:after{left:0;top:47%;width:100%;height:12px}
  .number{position:relative;z-index:2;display:flex;align-items:baseline;letter-spacing:-70px;font-size:570px;font-weight:900;line-height:.8;transform:translate(-22px,20px)}
  .number span:last-child{color:#c86648}
  .accent{position:absolute;left:66px;bottom:66px;width:220px;height:30px;background:#c86648}
</style><div class="mark"><div class="frame"></div><div class="cabinet"></div><div class="number"><span>5</span><span>2</span></div><div class="accent"></div></div>`);
await page.locator('.mark').screenshot({path:output});
await browser.close();
console.log(output);
