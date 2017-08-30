exports.id = 0;
exports.modules = {

/***/ 7:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = __webpack_require__(1);

var _express2 = _interopRequireDefault(_express);

var _mongoose = __webpack_require__(2);

var _mongoose2 = _interopRequireDefault(_mongoose);

var _userModel = __webpack_require__(8);

var _userModel2 = _interopRequireDefault(_userModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
var DB_URL = "mongodb://localhost:27017/oa";

router.get('/', function (req, res, next) {
  res.send('hello world!');
});

_mongoose2.default.connect(DB_URL, { useMongoClient: true });
var db = _mongoose2.default.connection;

db.on('error', console.error.bind(console, '连接错误:'));
db.once('open', function () {
  console.log('连接成功');
});

_mongoose2.default.model("User", _userModel2.default);

exports.default = router;

/***/ })

};