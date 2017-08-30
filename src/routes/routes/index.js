import express from 'express';

let router = express.Router();

router.get('/', (req, res, next) => {
  res.send(`welcome to oa!`);
})

export default router;
