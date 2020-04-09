<template>
  <div class="login-con" draggable="false">
    <div class="username-con">
        <label for="username" style="font-size:16px;color:#eee">用户名：</label>
        <input class="input-con" autocomplete="off" id="username" type="text"
         v-model="username" placeholder="请输入用户名！"  @blur="handleUserNameBlur" style="width: 200px" />
        <div class="notice-con">
           <p v-show="usernameMsg">{{usernameMsg}}</p>
        </div>
    </div>
    <div class="password-con">
        <label for="password" style="font-size:16px;color:#eee">密码：</label>
        <input v-if="showPwd" class="input-con" id="password" @click="handlePasswordBlur" v-model="password" type="password" placeholder="请输入密码！" style="width: 200px"  />
        <input v-else class="input-con" id="password"  @blur="handlePasswordBlur" v-model="password" type="text" placeholder="请输入密码！" style="width: 200px"  />
          <i v-if="!showPwd" class="iconfont icon-caozuo-xianshihaoma" @click="triggerShowPwd"></i>
          <i v-else class="iconfont icon-caozuo-yincangmima" @click="triggerShowPwd"></i>
          <div class="notice-con">
            <p v-show="passwordMsg">{{passwordMsg}}</p>
          </div>
    </div>
    <Button class="login-btn" @click="handleLogin" type="primary">登录</Button>
    <Button type="primary" @click="$router.push('/register')">注册</Button>
  </div>
</template>
<script>
import {reqLogin} from '../api/api'
import {mapMutations} from 'vuex'
    export default {
      data(){
        return {
          password:'',
          username:'',
          showPwd:true,
          usernameMsg:'',
          passwordMsg:'',
        }
      },
      methods:{
        triggerShowPwd(){
          this.showPwd=!this.showPwd
        },
        handleUserNameBlur(e){
          if(!this.username){
            this.usernameMsg="请输入用户名"
            e.target.focus()
            // console.log(e)
          }
        },
        handlePasswordBlur(e){
          if(!this.password){
            this.passwordMsg="请输入密码"
            e.target.focus()
          }
        },
        handleLogin(){
          reqLogin({username:this.username,password:this.password}).then(res=>{
            this.$Message.info(res.msg)
            console.log(res)
            setTimeout(() => {
              if(res.code==0){
                // console.log(111)
                // this.$store.state.user.username=username
                let id=res.id
                console.log(id);
                let token=res.token
                let username=res.username
                this.SET_TOKEN({token,username,id})
                // console.log(this.$store.state.user.username)
                this.$router.push('/')
              }
            }, 1500);
          })
            // console.log(result)
        },
        ...mapMutations('user',['SET_TOKEN'])

      },
  }
</script>

<style>

  .login-con{
    width:400px;
    height:400px;
    margin: 0 auto;
    /* position:relative; */
    /*position:absolute;
    left:50%;
    top:50%;
    transform:translate(-70%,-50%); */
    border:solid gray 1px;
    border-radius: 10px;
    padding-top:30px ;
  }
  @media screen and (max-width: 768px ){
    .login-con{
      border: none;
    }
  }
  .username-con {
    padding-right:16px;
  }
  .password-con {
    position: relative;
  }
  .notice-con {
    width: 200px;
    height: 30px;
    font-size: 16px;
    line-height: 30px;
    padding-left:75px;
    margin-top: 10px;
    color: red;
  }
  .login-btn {
    margin-right: 30px;
  }
   .login-con .input-con {
    padding: 0.3rem;
    color: #515a6e;
  }
  .iconfont {
    position: absolute;
    top: 8px;
    left: 300px;
    font-size: 20px;
  }
</style>
