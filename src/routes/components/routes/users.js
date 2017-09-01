import express from 'express';
import MongoDB from '../../../lib/mongodb';

let router = express.Router();

router.get('/getUsers', (req, res, next) => {
  MongoDB.find('users', {}, {}, (err, result) => {
    return res.send(result);
  });
})


export default router;
