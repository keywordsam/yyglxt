var express = require("express");
const sqlQuery = require("../../../module/lcMysql");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("admin/users/userlist2");
});

router.get("/api/userlist", async (req, res) => {
  let page = parseInt(req.query.page);
  let limitNum = parseInt(req.query.limit);
  let sqlStr =
    "SELECT `user`.id,`user`.username,`user`.email, `user`.moblie,`user`.imgheader,`user`.roleid, role.rolename " +
    "FROM`user` " +
    "LEFT JOIN role ON `user`.roleid = role.id " +
    "LIMIT ?,?";
  let arr = [(page - 1) * limitNum, limitNum];
  let result = await sqlQuery(sqlStr, arr);
  // 获取user的综上述
  let sqlStrNum="select count(id) as usersnum from user"
  let resultNum=await sqlQuery(sqlStrNum)
  let count=resultNum[0].usersnum
  console.log(count)
  let options = {
    code: 0,
    msg: "",
    count: count,
    data: Array.from(result),
  };
  res.json(options);
});

module.exports = router;
