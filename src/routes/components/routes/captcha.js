import express from 'express';
import captchapng from 'captchapng';

let router = express.Router();

/*
  * 获取验证码
*/
router.get('/captcha', (req, res, next) => {
  let code = parseInt(Math.random()*9000+1000);
  var p = new captchapng(100,40,code); // width,height,numeric captcha
  req.session.captcha = code;
  p.color(0, 0, 0, 0);  // First color: background (red, green, blue, alpha)
  p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)

  var img = p.getBase64();
  var imgbase64 = new Buffer(img,'base64');
  res.writeHead(200, {
      'Content-Type': 'image/png'
  });
  res.end(imgbase64);
})

export default router;
