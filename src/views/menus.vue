<template>
  <!--绑定点击事件goList,并且判断当todoId 时候 item.id时,文字高亮度-->
  <div class="list-todos">
    <div v-if="!username">请登录！</div>
    <div v-else class="name-con">用户：{{username}}</div>
    <!-- 绑定class，当items循环中的id等于我们设置的选中todoId时候,就会加上active这个class,这样样式就会发生变化。-->
    <a @click="goList(item.id)" class="list-todo list activeListClass" :class="{'active': item.id === todoId}" v-for="(item,index) in todoList" :key="index">
      <span class="icon-lock" v-if="item.locked"></span>
      <span class="count-list" v-if="item.count > 0">{{item.count}}</span>
      {{item.title}}
    </a>
    <a class=" link-list-new" @click="addTodoList">
      <span class="icon-plus">
      </span>
      新增
    </a>
    <a class="logout" href="javascript:;" @click="logout">退出登录</a>
  </div>
</template>
<script>
import { addTodo } from '../api/api';  // 引入我们 封装好的两个接口函数。
import {mapState,mapMutations} from 'vuex'
export default {
  data() {
    return {
      // items: [], // 菜单数据
      todoId: '', // 默认选中id,
      todoNum: 0 // 新增一个状态来判断代办事项的数据
    };
  },
  watch: {
    'todoId'(id) {
      this.$router.push({ name: 'todo', params: { id: id } }); //参数为描述地址的对象
    }
  },
  computed: {
    ...mapState('user',['username','token']),
    todoList() {
      const number = this.$store.getters.getTodoList.length;
      if (number < this.todoNum) {
         this.goList(this.$store.getters.getTodoList[0].id);//默认 添加列 高亮显示
      }
      this.todoNum = number;
      return this.$store.getters.getTodoList; // 返回vuex getters.js 定义的getTodoList数据
    }
  },
  created() { // 调用请求菜单列表数据的接口
    // getTodoList({}).then(res => {
    //   const TODOS = res.data.todos; // 数据都会返回在res.data里面。
    //   this.items = TODOS; // 我的把菜单数据赋值给定义的this.items
    //   this.todoId = TODOS[0].id; // 把菜单数据的默认的第一个对象的id赋值给默认选中的id
    // });
    this.$store.dispatch('getTodo').then(() => { // 调用vuex actions.js 里面的 getTodo函数
      this.$nextTick(() => {
        this.goList(this.todoList[0].id);
      });
    });
  },
  methods: {
    ...mapMutations('user',['SET_INIT']),
    goList(id) { // 点击菜单时候,替换选中id
      this.todoId = id;
    },
    addTodoList() { // 点击新增按钮时候
      // 调用vuex actions.js 里面的 getTodo函数
      addTodo({}).then(data => {
        this.$store.dispatch('getTodo').then(() => {
          this.$nextTick(() => {
            setTimeout(() => {
              this.goList(this.todoList[this.todoList.length - 1].id); //为新增列表 高亮显示
            }, 100);
          });
        });
      });
    },
    logout(){
      this.SET_INIT();
      this.login();
    },
    login(){
      this.$router.push('/login')
    }
  }
};
</script>

<style lang="less">
@import '../common/style/utils.less';
.menu {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  .language-toggle {
    text-align: center;
    margin-top: 1em;
    font-size: .8rem;
    .active {
      border-bottom: 1px solid;
      padding-bottom: 1px;
      color: @color-secondary;
    }
  }

  .btns-group,
  .btns-group-vertical {
    margin: 1em auto 2em;
    width: 80%;

    .btn-secondary {
      .font-s1;
      padding-top: .5em;
      padding-bottom: .5em;
    }
  }

  .btns-group-vertical .btn-secondary {
    .force-wrap;
    padding-right: 2.5em;
    text-align: left;
    text-indent: 0;
    white-space: normal; // Resets wrapping
    width: 100%;

    & + .btn-secondary {
      margin-top: .5rem;

      &:before {
        .position(absolute, -.5rem, 50%, auto, auto, 1px, .5rem);
        background: lighten(#517096, 5%);
        content: '';
      }
    }

    [class^="icon-"],
    [class*=" icon-"] {
      .position(absolute, .5em, .5em, auto, auto);
      line-height: 20px;
    }
  }

  .list-todos {
    a {
      box-shadow: rgba(255,255,255,.15) 0 1px 0 0;
      display: block;
      line-height: 1.5em;
      padding: .75em 2.5em;
      position: relative;
      text-decoration: none;
      text-align: left;
      cursor: pointer;
      overflow:hidden;
    }
    .logout {
      text-align: center;
      width: 100px;
      height:35px;
      color: white;
      font-size: 17px;
      border-radius: 10px;
      background-color:@color-secondary;
      margin: 10px auto;
      padding: 0 0;
      padding-top:6px;
    }
    .link-list-new {
      text-align: left;
      color: @color-secondary;
      cursor: pointer;
    }
    .name-con {
      color: rgb(63, 158, 247);
      font-size: 18px;
    }
    .count-list {
      transition: all 200ms ease-in;
      background: rgba(255,255,255,.1);
      border-radius: 1em;
      float: right;
      font-size: .7rem;
      line-height: 1;
      margin-top: .25rem;
      margin-right: -1.5em;
      padding: .3em .5em;
    }

    [class^="icon-"],
    [class*=" icon-"] {
      .font-s2;
      float: left;
      margin-left: -1.5rem;
      margin-right: .5rem;
      margin-top: .1rem;
      width: 1em;
    }

    .icon-lock {
      .font-s1;
      margin-top: .2rem;
      opacity: .8;
    }

    .list-todo {
      color: rgba(255,255,255,.4);

      &:hover,
      &:active,
      &.active {
        color: @color-empty;
        .count-list { background: @color-primary; }
      }

      .cordova &:hover {
        // Prevent hover states from being noticeable on Cordova apps
        color: rgba(255,255,255,.4);
      }
    }
  }
}
</style>

