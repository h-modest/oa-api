import express from 'express';
import crypto from 'crypto';
import _ from 'underscore';
import MongoDB from '../../../lib/mongodb';
import captchapng from 'captchapng';

let router = express.Router();

function encrypt(data) {
  return crypto.createHash('md5').update(data).digest('hex');
}

function autoCreateData(obj) {
  let now = new Date();
  let new_psd = obj + now;
  return encrypt(new_psd);
}

/*
  * 登录
*/
router.post('/login', (req, res, next) => {
  if (!req.body) return res.sendStatus(400);
  let access_token = req.cookies.access_token;
  if (!_.isEmpty(access_token) && _.isEqual(access_token, req.body.access_token)) {
    res.send({ code: 200, msg: 'login successful' });
  } else {
    if (!req.body.username || !req.body.password)
      return res.send({code: 401, msg: 'required cannot be empty'});
    let username = req.body.username;
    let new_psd = encrypt(req.body.password);
    let user = {
      username: username,
      password: new_psd,
    };
    MongoDB.where('users', user, {}, (err, result) => {
      if (_.isEmpty(result))
        res.send({code: 401, msg: 'user does not exist'});
      else {
        let data = { code: 200, msg: 'login successful' };
        req.session.user = user;
        if (req.body.is_remember) {
          let access_token = autoCreateData(req.body.username);
          res.cookie('access_token', access_token, { maxAge: 900000, httpOnly: true });
          data = Object.assign(data, { access_token: access_token });
        }
        res.send(data);
      }
    })
  }
});

/*
  * 注册
*/
router.post('/register', (req, res, next) => {
  if (!req.body) return res.sendStatus(400);
  if (!req.body.username || !req.body.password)
    return res.send({ code: 401, msg: 'required cannot be empty' });
  MongoDB.find('users', { username: req.body.username }, {}, (err, result) => {
    if (_.isEmpty(result)) {
      let new_psd =encrypt(req.body.password);
      let uid = autoCreateData(req.body.username);
      MongoDB.save('users', { uid: uid, username: req.body.username, password: new_psd }, function(error, oncogs) {
        if (!error)
          res.send({ code: 200, msg: 'register successful' });
        else
          res.send({ code: 500, error: error });
      })
    } else
      res.send({ code: 401, msg: 'user already exists' });
  })
});

/*
  * 忘记密码
*/
router.post('/forget', (req, res, next) => {
  if (!req.body) return res.sendStatus(400);
  if (!req.body.username)
    return res.send({ code: 401, msg: 'required cannot be empty' });
  MongoDB.where('users', { username: req.body.username }, {fields: "uid username"}, (err, result) => {
    if (_.isEmpty(result))
      res.send({code: 401, msg: 'user does not exist'});
    else
      res.send({code: 200, data: result});
  })
})

/*
  * 修改密码
*/
router.post('/change-pass', (req, res, next) => {
  let query = req.body;
  const { uid, password, comfirm_password } = query;
  if(!query) return res.sendStatus(400);
  if (!uid || !password || !comfirm_password)
    res.send({code: 401, msg: 'required cannot be empty'});
  if (!_.isEqual(password, comfirm_password))
    res.send({code: 401, msg: 'the password is different' });
  let new_psd = encrypt(req.body.password);
  MongoDB.update('users', { uid: uid }, { password: new_psd}, function(err, result) {
    if(!err)
      res.send({ code: 200, msg: 'change-pass successful' });
  })
})

export default router;
