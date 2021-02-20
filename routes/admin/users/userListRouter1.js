var express = require("express");
var router = express.Router();
const sqlQuery = require("../../../module/lcMysql");

/* GET home page. */
router.get("/", async function (req, res, next) {
  // 查找数据库的用户表
  // ?page=1
  let page = req.query.page;
  page = page ? page : 1;
  // 查找语句
  let sqlStr = "select *from user limit ? ,5";
  let result = await sqlQuery(sqlStr, [(parseInt(page) - 1) * 5]);
  let options = {
    userlist: Array.from(result),
  };
  res.render("admin/users/userlist1", options);
});

router.post('/deluser',async(req,res)=>{
  console.log(req.body)
  let dellist =req.body['dellist[]']
  dellist.forEach(async(item,i)=>{
    let sqlStr="delete from user where id = ?"
    await sqlQuery(sqlStr,item)
  })
  console.log(dellist)
  res.json({
     state:"ok",
     content:"删除成功"
  })
})

module.exports = router;
