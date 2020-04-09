<template>
  <div class="register-con">
    <div class="form-item username-con">
      <label for="username" style="font-size:16px;color:#eee">用户名：</label>
      <input type="text" autocomplete="off" @blur="handleUserNameBlur" placeholder="请输入用户名" v-model="username" style="width:200px">
      <div class="notice-con">
        <p v-show="usernameMsg">{{usernameMsg}}</p>
      </div>
    </div>
    <div class="form-item password-con">
      <label for="password" style="font-size:16px;color:#eee">密码：</label>
      <input v-if="!showPwd" type="password"  @blur="handlePasswordBlur" placeholder="请输入密码！" v-model="password" style="width:200px">
      <input v-else autocomplete="off" id="password"  @blur="handlePasswordBlur" v-model="isPassword" type="text" placeholder="请输入密码！" style="width: 200px"  />
      <i v-if="!showPwd" @click="triggerShowPwd" class="iconfont icon-caozuo-xianshihaoma"></i>
      <i v-else @click="triggerShowPwd" class="iconfont icon-caozuo-yincangmima"></i>
      <div class="notice-con">
        <p v-show="passwordMsg">{{passwordMsg}}</p>
      </div>
    </div>
    <div class="form-item ispassword-con">
      <label for="ispassword" style="font-size:16px;color:#eee">确认密码：</label>
      <input v-if="!showPwd" id="ispassword" type="password"  @blur="handleIsPasswordBlur" placeholder="再次输入密码！" v-model="isPassword" style="width:200px">
      <input v-else autocomplete="off" id="password" v-model="password" type="text"  @blur="handleIsPasswordBlur" placeholder="再次输入密码！" style="width: 200px"  />
      <i v-if="!isShowPwd" @click="triggerIsShowPwd" class="iconfont icon-caozuo-xianshihaoma"></i>
      <i v-else @click="triggerIsShowPwd" class="iconfont icon-caozuo-yincangmima"></i>
      <div class="notice-con">
        <p v-show="isPasswordMsg">{{isPasswordMsg}}</p>
      </div>
    </div>
    <div>
      <Button class="register-btn" @click="handleRegister" type="primary">点击注册</Button>
    </div>
  </div>
</template>
<script>
import {reqRegister} from '../api/api'
    export default {
        data () {
           return{
             username:'',
             password:'',
             isPassword:'',
             showPwd:false,
             isShowPwd:false,
             usernameMsg:'',
             passwordMsg:'',
             isPasswordMsg:''
           }
        },
        methods:{
          handleRegister(){
            reqRegister({username:this.username,password:this.password}).then(res=>{
                this.$Message.info(res.msg)
                if(res.code==0){
                  this.$router.push({name:'login'})
                }
            })
          },
          triggerShowPwd(){
            this.showPwd=!this.showPwd
          },
          triggerIsShowPwd(){
            this.isShowPwd=!this.isShowPwd
          },
          handleUserNameBlur(e){
            if(!this.username){
              this.usernameMsg="请输入用户名";
              e.target.focus()
            }else{
              this.usernameMsg=""
            }
          },
          handlePasswordBlur(e){
            if(!this.password){
              this.passwordMsg="请输入密码"
              e.target.focus()
            }else{
              this.passwordMsg=""
            }
          },
          handleIsPasswordBlur(e){
            if(this.password!==this.isPassword){
              this.passwordMsg="两次密码不相同，请重新设置";
              this.password="";
              this.isPassword="";
            }else{
              this.isPasswordMsg=""
            }
          }
        }
    }
</script>

<style>
  .register-con {
    width: 400px;
    height: 500px;
    border: solid gray 1px;
    border-radius: 4px;
    margin: auto;
    padding-top:30px ;
  }
    .notice-con {
    height: 30px;
    font-size: 16px;
    line-height: 30px;
    padding-left:75px;
    margin-top: 10px;
    color: red;
  }
  .username-con {
    padding-right:16px;
  }
  .ispassword-con {
    padding-right: 32px;
    position: relative;
  }
  .password-con {
    position: relative;
  }
  .register-btn {
    margin-left: 30px;
  }
  .iconfont {
    position: absolute;
    top: 8px;
    left: 300px;
    font-size: 20px;
  }
</style>
