const mysql = require("mysql");

let options = {
  host: "localhost",
  user: "root",
  password: "admin",
  database: "yygl",
};
// 创建与数据库的连接对象
let con = mysql.createConnection(options);

// 建立连接
con.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("数据库连接成功");
  }
});
function sqlQuery(strSql, arr) {
  return new Promise(function (resolve, reject) {
    con.query(strSql, arr, (err, results) => {
      if (err) {
        reject(err);
        console.log(err);
      } else {
        resolve(results);
        console.log(results);
      }
    });
  });
}

module.exports = sqlQuery;
