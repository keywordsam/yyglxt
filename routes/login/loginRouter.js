var express = require("express");
var router = express.Router();
// 加密模块
const crypto=require('crypto')
const sqlQuery = require("../../module/lcMysql");
const jiami=require('../../module/jiami')


/* GET users listing. */
router.get("/register", function (req, res, next) {
  res.render("login/register.ejs");
});
router.get("/login", function (req, res, next) {
  res.render("login/login.ejs");
});

router.post("/register", async (req, res) => {
  // 获取username和密码
  let username = req.body.username;
  let password = req.body.password;
  // console.log(username,password)
  let moblie = req.body.moblie;
  // 判断用户是否存在，如果没有用户才进行插入
  let sqlStr = "select * from user where username = ?";
  let result = await sqlQuery(sqlStr, [username]);
  if (result.length != 0) {
    //  告知此用户名已存在，请直接登录或者寻找密码
    res.render("info/info", {
      title: "注册失败",
      content: "用户已存在",
      href: "/rl/register",
      hrefText: "注册页",
    });
  } else {
    // 告知注册成功
    sqlStr = "insert into user (username,password,moblie,roleid) values (?,?,?,1)";
    await sqlQuery(sqlStr, [username, jiami(password),moblie]);
    res.render("info/info", {
      title: "注册成功",
      content: "注册成功，即将进入登录页",
      href: "/rl/login",
      hrefText: "登录页",
    });
  }
});

// 处理登录提交的post请求
router.post("/login", async (req, res) => {
  // 获取username and password
  let username = req.body.username;
  let password = req.body.password;
  let sqlStr = "select * from user where username=? and password =?";
  let result = await sqlQuery(sqlStr, [username, jiami(password)]);
  if (result.length == 0) {
    //  告知此用户名已登录失败
    res.render("info/info", {
      title: "登录失败",
      content: "用户或密码错误",
      href: "/rl/login",
      hrefText: "登录页",
    });
  } else {
    req.session.username = username; 
    //  告知此用户名已登录成功
    res.render("info/info", {
      title: "登录成功",
      content: "立即跳转至后台页面",
      href: "/admin ",
      hrefText: "后台",
    });
  }
});

// 退出登录
router.get('/loginout',(req,res)=>{
  req.session.destroy()
  res.render("info/info", {
    title: "退出登录成功",
    content: "立即跳转至登录页面",
    href: "/rl/login ",
    hrefText: "登录",
  });
})


module.exports = router;
