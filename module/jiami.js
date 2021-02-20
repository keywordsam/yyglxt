const crypto=require('crypto')

// 加密
function jiami(str){
  let salt ='lksdjafkl'
  let obj=crypto.createHash('md5')
  str=salt+str
  obj.update(str)
  return obj.digest('hex')
}
module.exports=jiami