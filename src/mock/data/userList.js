// 用户信息数据
import Mock from 'mockjs'
const userList=['zj','zjj']
const USER=[];
for(let i=0;i<userList.length;i++){
  USER.push(Mock.mock({
    username:userList[i],
    password:"111111",
  }))
}
export default USER
