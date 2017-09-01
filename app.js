import Express from 'express';
import bodyParser from 'body-parser';
import multipart from 'connect-multiparty';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import Mongo from 'connect-mongo';

let app = Express();
let port = process.env.PORT || 8091;
let MongoStore = Mongo(session);

import Index from './src/routes/routes';
import Users from './src/routes/components/routes/users';
import Account from './src/routes/components/routes/account';
import Captcha from './src/routes/components/routes/captcha';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multipart());
app.use(cookieParser('sessiontest'));
app.use(session({
  cookie: { maxAge: 24 * 60 * 60 * 1000 }, //默认1天
  secret: 'sessiontest',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    url: 'mongodb://127.0.0.1/oa',
    collection: 'sessions',
  })
}));

app.all('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", 'http://www.oa.hxq.local');
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "Content-Type, Content-length, Authorization, Accept, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  if (req.method == "OPTIONS") res.send(200);
  else next();
});

app.use('/api', Index);

//用户user
app.use('/api/user', Users);

//账户Account
app.use('/api/account', Account);

//验证码captcha
app.use('/api', Captcha);

app.listen(port, () => {
    console.log('server running http://localhost:'+port+'');
});
