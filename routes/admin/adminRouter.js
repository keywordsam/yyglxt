var express = require("express");
var router = express.Router();
var userRouter = require("./userRouter");
var newsRouter = require("./newsRouter");
var doctorsRouter = require("./doctorsRouter");
var patientsRouter = require("./patientsRouter");

// 判断是否符合条件进入后台中间件
function permisson(req,res,next){
  if(req.session.username==undefined){
    // 尚未登录，返回登录页
    res.render('info/info',{
      title:"尚未登录",
      content:"请重新登录，即将进入登录页",
      href:"rl/login",
      hrefText:"登录页"
    })
  }else{
    // 正常进入
    next()
  }
}

// 后台首页
// router.get("/",permisson, function (req, res, next) {
//   res.render('admin/index')
// });
router.get("/",function (req, res, next) {
  res.render('admin/index',{username:req.session.username})
});
// 后台用户管理模块
router.use("/users", userRouter);
// 后台新闻管理
router.use("/news", newsRouter);
// 后台医生管理
router.use("/doctors", doctorsRouter);
// 后台患者管理
router.use("/patients", patientsRouter);

module.exports = router;
