var express = require("express");
var router = express.Router();
// 引入上传模块
let multer = require("multer");
// 配置上传对象
let upload = multer({
  dest: "./public/upload",
});
const fs = require("fs");
const sqlQuery = require("../../module/lcMysql");
const jiami=require('../../module/jiami')
// 引入userlist路由
const userListRouter1=require('./users/userListRouter1')
const userListRouter2=require('./users/userListRouter2')

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("用户管理");
});

// 个人信息路由
router.get("/selfinfo", async (req, res) => {
  // 获取用户名
  let username = req.session.username;
  // 通过用户名查找所有的信息
  let sqlStr = "select * from user where username = ?";
  let result = await sqlQuery(sqlStr, [username]);
  let users = result[0];
  // 通过角色表获取所有 角色
  let roles = await getRoles();
  let options = { users, roles };
  res.render("admin/users/selfinfo", options);
});

router.post("/selfimgUpload", upload.single("imgfile"), async (req, res) => {
  let username = req.session.username;
  let result = rename(req);
  // console.log(result);
  // 将改名后的结果，上传到数据库
  let strSql = "update user set imgheader = ? where username = ?";
  await sqlQuery(strSql, [result.imgUrl, username]);
  res.json(result);
});

function rename(req) {
  let oldPath = req.file.destination + "/" + req.file.filename;
  let newPath =
    req.file.destination + "/" + req.file.filename + req.file.originalname;
  fs.rename(oldPath, newPath, () => {
    console.log("改名成功");
  });
  return {
    state: "OK",
    imgUrl: "/upload/" + req.file.filename + req.file.originalname,
  };
}

async function getRoles() {
  let sqlStr = "select * from role";
  let result = await sqlQuery(sqlStr);
  return Array.from(result);
}

router.post("/selfinfo",async (req, res) => {
  console.log(req.body);
  // 更新数据
  let password = jiami(req.body.password);
  let email = req.body.email;
  let moblie = req.body.moblie;
  let roleid = req.body.roleid;
  let username = req.body.username;
  console.log(password,email,moblie, roleid,username)
  let sqlStr =
    "update user set password = ?,email = ?,moblie = ?,roleid = ? where username = ?";
  let arr = [password,email,moblie, roleid,username];
  console.log(arr)
  await sqlQuery(sqlStr,arr)
  res.json({
    state:'ok',
    content:"个人信息更新成功 "
  })
});


router.use('/userlist1',userListRouter1)
router.use('/userlist2',userListRouter2)


module.exports = router;
