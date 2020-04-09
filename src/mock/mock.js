import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Mock from 'mockjs';
import deepclone from 'deepclone'
import {
  userList
} from './data/todoList'; // 导入Todos数据
// import e from 'express';

export default {
  /**
   * mock start
   */
  start() { // 初始化函数
    const userListCopy=deepclone(userList)

    // 新建用户的数据
     const newUserTodo=[{
      id: Mock.Random.guid(), // 随机id
      title:"", // 随机标题
      isDelete: false, // 是否删除
      locked: false, // 随机锁定
      record: []
    }]
    // 删除完后的用户数据
    const delUserTodo=[{
      id:'', // 随机id
      title:"", // 随机标题
      isDelete: false, // 是否删除
      locked: false, // 随机锁定
      record: []
    }]

    let mock = new MockAdapter(axios); // 创建 MockAdapter 实例
    let userIndex=0; //用于存放使用用户的索引
    let updateId=''
    if(window.localStorage.getItem('username')&&window.localStorage.getItem('token')){
       userListCopy.forEach((value,index)=>{
          if(value.username==window.localStorage.getItem('username'))
            userIndex=index
            updateId=value.data[0].id
        })
        // console.log(userIndex)
    }
    // 登陆验证
    mock.onPost('/login').reply(config=>{
      // console.log(config)
      let user=userListCopy.filter((value,index)=>{
        // console.log(config)
        let data=JSON.parse(config.data)
        // console.log(data)
        if(value.username==data.username && value.password==data.password){
          userIndex=index
          return true
        }

      })
      console.log(user)
      if(user.length){
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve([200,{code:0,msg:"登陆成功",username:user[0].username,token:parseInt(Math.random()*10),id:user[0].data[0].id}]);
          }, 200);
        });
      }else{
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve([200,{code:1,msg:"登录失败"}]);
          }, 200);
        });
      }
    })
    //注册用户
    mock.onPost('/register').reply(config=>{
      let data=JSON.parse(config.data)
      let userl=userListCopy.filter((value,index)=>{
        if(value.username==data.username){
          return true
        }
      })
      if(userl.length){
        return new Promise((resolve,reject)=>{
          setTimeout(() => {
            resolve([200,{code:1,msg:"该用户名已存在，请重新注册！"}])
          }, 200);
        })
      }else{
        console.log(config)
        let username=data.username;
        let password=data.password;
        userListCopy.push({username,password,data:newUserTodo})
        console.log(userListCopy)
        return new Promise((resolve,reject)=>{
          resolve([200,{code:0,msg:'注册成功！'}])
        })
      }
    })
    // 获取todo列表
    mock.onGet('/todo/list').reply(config => { //  config 指 前台传过来的值
          // console.log(111)
          let mockTodo = userListCopy[userIndex].data.map(todo => { // 重组 Todos数组，变成我们想要的数据
            return {
              id: todo.id,
              title: todo.title,
              count: todo.record.filter((data) => {
                if (data.checked === false) return true;
                return false;
              }).length, // 过滤到record里面 ‘checked’ 为true的数据，因为它们已经被完成了
              locked: todo.locked,
              isDelete: todo.isDelete
            };
          }).filter(todo => {
            if (todo.isDelete === true) return false; // 过滤掉 ‘isDelete’为true，因为已经被删除了。
            return true;
          });
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              if(mockTodo.length){
                console.log(1111)
              resolve([200, {
                todos: mockTodo // 返回状态为200，并且返回todos数据
              }]);
            }else{

              mockTodo=delUserTodo
              mockTodo[0].id=updateId
              resolve([200, {

                todos: mockTodo // 返回状态为200，并且返回todos数据
              }]);
            }
            }, 200);
          });
      //   }
      // }
    });
    // 新增一条todo
    mock.onPost('/todo/addTodo').reply(config => {
      // data=JSON.parse(config.data)
      // for(let i =0;i<userListCopy.length;i++){
      //   if(userListCopy[i].username==data.username){
          userListCopy[userIndex].data.push({
            id: Mock.Random.guid(),
            title: 'newList',
            isDelete: false,
            locked: false,
            record: []
          });
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve([200]);
            }, 200);
          });
      //   }
      // }
    });
    // 获取todo单个列表
    mock.onGet('/todo/listId').reply(config => {
      // console.log(config)
      let { id } = config.params;
      console.log(id)
      // id 是传进来的值
      // todo 是根据id和现有的Todos数据匹配，找出id相等的数据，在进行返回
      if(id==1){
        id=updateId
        console.log(id)
      }
      let todo = userListCopy[userIndex].data.find(todo => {
        return id && todo.id === id;
      });
      // todo.count (等待完成数目)等于 todo.record（代办事项列表下面未被选择的数据
      todo ? todo.count = todo ? todo.record.filter((data) => {
        return data.checked === false;
      }).length : null : false;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            todo: todo
          }]);
        }, 200);
      });
    });
    // 新增一条代办事项
    mock.onPost('/todo/addRecord').reply(config => {
      let {
        id,
        text
      } = JSON.parse(config.data);
      // id 是传进来的值唯一待办项的id
      // text 用户新增输入的数据
      userListCopy[userIndex].data.some((t, index) => {
        if (t.id === id) {
          t.record.push({
            text: text,
            isDelete: false,
            checked: false
          });
          return true;
        }
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200]);
        }, 200);
      });
    });

    // 修改事项
    mock.onPost('/todo/editTodo').reply(config => {
      let {
        todo
      } = JSON.parse(config.data);
      userListCopy[userIndex].data.some((t, index) => {
        if (t.id === todo.id) {
          t.title = todo.title;
          t.locked = todo.locked;
          t.isDelete = todo.isDelete;
          return true;
        }
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200]);
        }, 200);
      });
    });
    // 修改标题
    mock.onPost('/todo/editRecord').reply(config => {
      let {
        id,
        record,
        index
      } = JSON.parse(config.data);
      userListCopy[userIndex].data.some((t) => {
        if (t.id === id) {
          t.record[index] = record;
          return true;
        }
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200]);
        }, 200);
      });
    });
  }
};
