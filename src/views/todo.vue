<template>
  <div class="page lists-show" v-show="!todo.isDelete">
    <!-- 头部模块 -->
    <nav>
      <!-- 当用户浏览车窗口尺寸小于40em时候，显示手机端的菜单图标 -->
      <div class="form list-edit-form" v-show="isUpdate">
        <!-- 当用户点击标题进入修改状态，就显示当前内容可以修改 -->
        <input type="text" v-model="todo.title" @keyup.enter="updateTitle" :disabled="todo.locked">
        <div class="nav-group right">
          <a class="nav-item" @click="isUpdate = false">
            <span class="icon-close">
            </span>
          </a>
        </div>
      </div>
      <div class="nav-group" @click="$store.dispatch('updateMenu')" v-show="!isUpdate">
        <!-- 在菜单的图标下面添加updateMenu事件，他可以直接调用vuex actions.js里面的updateMenu方法 -->
        <a class="nav-item">
          <span class="icon-list-unordered">
          </span>
        </a>
      </div>
      <!-- 显示标题和数字模块 -->
      <h1 class="title-page" v-show="!isUpdate" @click="isUpdate = true">
        <span class="title-wrapper">{{todo.title}}</span>
        <!-- title:标题 绑定标题 -->
        <span class="count-list">{{todo.count || 0}}</span>
        <!-- count:数量 绑定代办单项熟练-->
      </h1>
      <!-- 右边显示删除图标和锁定图标的模块 -->
      <div class="nav-group right" v-show="!isUpdate">
        <div class="options-web">
          <a class=" nav-item" @click="onlock">
            <!-- cicon-lock锁定的图标
            icon-unlock：非锁定的图标
             -->
            <span class="icon-lock" v-if="todo.locked"></span>
            <span class="icon-unlock" v-else>
            </span>
          </a>
          <a class="nav-item">
            <span class="icon-trash" @click="onDelete">
            </span>
          </a>
        </div>
      </div>
      <!-- 用户新增代办事项的input模块 -->
      <div class=" form todo-new input-symbol">
        <!-- 绑定disabled值，当todo.locked为绑定的时候，禁止input输入,双向绑定text,和监听input的回车事件@keyup.enter -->
        <input type="text" v-model="text" placeholder='请输入' @keyup.enter="onAdd" :disabled="todo.locked" />
        <span class="icon-add" @click="onAdd"></span>
      </div>
    </nav>
    <!-- 列表主体模块 -->
    <div class="content-scrollable list-items">
      <div v-for="(item,index) in items" :key="index">
        <Item :item="item" :index="index" :id="todo.id" :init="init" :locked="todo.locked"></Item>
      </div>
    </div>
  </div>
</template>
<script>

import Item from './Item';
import { addRecord, getTodo, editTodo } from '../api/api';
import {mapState} from 'vuex'
export default {
  data() {
    return {
      todo: {
        title: '星期一', // 标题
        count: 12, // 数量
        locked: false // 是否绑定
      },
      items: [  // 代办单项列表
      ],
      text: '', // 用户输入单项项绑定的输入
      isUpdate: false // 新增修改状态
    };
  },
  components: {
    Item
  },
  watch: {
    '$route.params.id'() {
      // 监听$route.params.id的变化，如果这个id即代表用户点击了其他的待办项需要重新请求数据。
      this.init();
    }
  },
  created() {
    // created生命周期，在实例已经创建完成，页面还没渲染时调用init方法。
    this.init();
  },
  computed:{
    ...mapState('user',['id'])
  },
  methods: {
    init() {
      let _this=this
      // console.log(111);
      const ID = _this.$route.params.id==''?1:_this.$route.params.id;
      // console.log(ID)
      getTodo({id:ID}).then(res => {
        let { id, title, count, isDelete, locked, record
        } = res.data.todo;
        _this.items = record;
        _this.todo = {
          id: id,
          title: title,
          count: count,
          locked: locked,
          isDelete: isDelete
        };
      });
    },
    onAdd() {
      const ID = this.$route.params.id;
      addRecord({ id: ID, text: this.text }).then(res => {
        this.text = '';
        this.init();
        this.$store.dispatch('getTodo');
      });
    },
    updateTodo() {
      let _this = this;
      editTodo({
        todo: this.todo
      }).then(data => {
        // _this.init();
        let id=_this.$route.params.id
        console.log(id)
        _this.$store.dispatch('getTodo',{id});
      });
    },
    updateTitle() {
      this.updateTodo();
      this.isUpdate = false;
    },
    onDelete() {
      this.todo.isDelete = true;
      this.updateTodo();
    },
    onlock() {
      this.todo.locked = !this.todo.locked;
      this.updateTodo();
    }
  }
};
</script>

<style lang = "less" >
@import '../common/style/utils.less';
// Generic nav positioning and styles
nav {
  .position(absolute, 0, 0, auto, 0);
  transform: translate3d(0,0,0);
  transition: all 200ms ease-out;
  z-index: 10;

  .nav-item {
    .font-m1;
    color: @color-ancillary;
    display: inline-block;
    height: 3rem;
    text-align: center;
    width: 3rem;

    &:active { opacity: .5; }

    [class^="icon-"],
    [class*=" icon-"] {
      line-height: 3rem;
      vertical-align: middle;
    }
  }
  .nav-group {
    .position(absolute, 0, auto, auto, 0);
    z-index: 1;

    &.right {
      left: auto;
      right: 0;
    }
  }
}
// Custom nav for auth
@media screen and (min-width: 40em) {
  .page.auth .nav-group { display: none; }
  .page.not-found .nav-group { display: none; }
  /* .right {width: 10px;height: 10px;} */
}

// Standard text input
input[type="text"],
input[type="email"],
input[type="password"],
textarea {
  // Sizing
  .font-s2;
  .type-regular;
  padding: .3rem .2rem; //total height ~48
  line-height: 1.5rem !important;
  // Style
  ::placeholder {
    color: @color-complementary;
  }

  border: none;
  border-radius: 0;
  box-sizing: border-box;
  color: @color-full;
  outline: none;

  &[disabled] { opacity: .5; }
}

// Remove chrome/saf autofill yellow background
input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 1000px @color-empty inset;
}

// Custom checkbox
.checkbox {
  display: inline-block;
  height: 3rem;
  position: relative;
  vertical-align: middle;
  width: 44px;

  input[type="checkbox"] {
    font-size: 1em;
    visibility: hidden;

    & + span:before {
      .position(absolute, 50%, auto, auto, 50%, .85em, .85em);
      transform: translate3d(-50%, -50%, 0);
      background: transparent;
      box-shadow: #abdfe3 0 0 0 1px inset;
      content: '';
      display: block;
    }

    &:checked + span:before {
      box-shadow: none;
      color: @color-medium-rare;

      // Icon family from icon.lessimport
      font-family: 'todos';
    	speak: none;
    	font-style: normal;
    	font-weight: normal;
    	font-variant: normal;
    	text-transform: none;
    	line-height: 1;

    	// Better Font Rendering
    	-webkit-font-smoothing: antialiased;
    	-moz-osx-font-smoothing: grayscale;

    	// Checkmark icon
      content: "\e612";
    }
  }
}

// Input with an icon
.input-symbol {
  display: inline-block;
  position: relative;

  &.error [class^="icon-"],
  &.error [class*=" icon-"] {
    color: @color-negative;
  }

  // Position & padding
  [class^="icon-"],
  [class*=" icon-"] {
    left: 1em;
  }

  input { padding-left: 3em; }

  // Styling
  input {
    width: 100%;

    &:focus {
      & + [class^="icon-"],
      & + [class*=" icon-"] {
        color: @color-primary;
      }
    }
  }

  [class^="icon-"],
  [class*=" icon-"] {
    transition: all 300ms ease-in;
    transform: translate3d(0,-50%,0);
    background: transparent;
    color: @color-medium;
    font-size: 1em;
    height: 1em;
    position: absolute;
    top: 50%;
    width: 1em;
  }
}

.page.lists-show {
  .content-scrollable {
    background: @color-empty;
    top: 5em !important;
  } // Custom nav for lists-show
  nav {
    background: linear-gradient(to bottom, #d0edf5, #e1e5f0 100%);
    height: 5em;
    text-align: center;
    @media screen and (min-width: 40em) {
      text-align: left;
    }
    .title-page {
      .position(absolute, 0, 3rem, auto, 3rem);
      @media screen and (min-width: 40em) {
        left: 1rem;
        right: 6rem;
      }
      cursor: pointer;
      font-size: 1.125em; // 18px
      white-space: nowrap;
          margin: 10px 0px;
      .title-wrapper {
        .ellipsized;
        color: @color-ancillary;
        display: inline-block;
        padding-right: 1.5rem;
        vertical-align: top;
        max-width: 100%;
      }
      .count-list {
        background: @color-primary;
        border-radius: 1em;
        color: @color-empty;
        display: inline-block;
        font-size: .7rem;
        line-height: 1;
        margin-left: -1.25rem;
        margin-top: -4px;
        padding: .3em .5em;
        vertical-align: middle;
      }
    }
    .form.todo-new {
      .position(absolute, 3em, 0, auto, 0);

      input[type="text"] {
        background: transparent;
        padding-bottom: .25em;
        padding-left: 44px !important;
        padding-top: .25em;
      }
    }
    .form.list-edit-form {
      position: relative;

      input[type="text"] {
        background: transparent;
        font-size: 1.125em; // 18px
        width: 100%;
        padding-right: 3em;
        padding-left: 1rem;
      }
    }

    select.list-edit {
      .font-s2;
      .position(absolute, 0, 0, 0, 0);
      background: transparent;
      opacity: 0; // allows the cog to appear
    }

    .options-web {
      /* display: none; */

      .nav-item {
        .font-s3;
        width: 2rem;

        &:last-child {
          margin-right: .5rem;
        }
      }
    } // Hide & show options and nav icons
    @media screen and (min-width: 40em) {
      .nav-group:not(.right) {
        display: none !important;
      }
      .options-mobile {
        display: none;
      }
      .options-web {
        display: block;
      }
    }
  }
}
</style>
