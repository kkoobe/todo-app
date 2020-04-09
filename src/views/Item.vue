<template>
  <transition name="slide-fade">
    <div class="list-item  editingClass editing " :class="{checked: item.checked}" v-show="!item.isDelete">
      <label class="checkbox">
        <input type="checkbox" v-model="item.checked" name="checked" @change="onChange" :disabled="locked">
        <span class="checkbox-custom"></span>
      </label>
      <input type="text" v-model="item.text" placeholder='写点什么。。。'  :disabled=" item.checked || locked" @keyup.enter="onChange">
      <a class="delete-item" v-if="item.checked && !locked" @click="item.isDelete = true;onChange()">
        <span class="icon-trash"></span>
      </a>
    </div>
  </transition>
</template>
<script>
// item 是todo的子组件,他接受一个对象item,来进行处理
import { editRecord } from '../api/api';
export default {
  props: {
    item: {
      type: Object,
      default: () => {
        return {
          checked: false,
          text: '你好,世界'
        };
      }
    },
    'index': {

    },
    'id': {

    },
    'init': {

    },
    'locked': {
    }
  },
  methods: {
    // 用户无论删除,修改，锁定都可以利用这个方法。
    onChange() {
      editRecord({
        id: this.id, record: this.item, index: this.index
      }).then(data => {
        this.init();
        this.$store.dispatch('getTodo');
      });
    }
  }
};
</script>
<style lang="less">
@import '../common/style/utils.less';

.list-items .list-item {
  .font-s2;

  // Layout of list-item children
  display: flex;
  flex-wrap: wrap;
  height: 3rem;
  width: 100%;

  .checkbox {
    flex: 0, 0, 44px;
    cursor: pointer;
  }
  input[type="text"] { flex: 1; }
  .delete-item { flex: 0, 0, 3rem; }


  // Style of list-item children
  input[type="text"] {
    background: transparent;
    cursor: pointer;

    &:focus { cursor: text; }
  }

  .delete-item {
    color: @color-medium-rare;
    line-height: 3rem;
    text-align: center;

    &:hover { color: @color-primary; }
    &:active { color: @color-well; }
    .icon-trash { font-size: 1.1em; }
  }


  // Border between list items
  & + .list-item { border-top: 1px solid #f0f9fb; }

  // Checked
  &.checked {
    input[type="text"] {
      color: @color-medium-rare;
      text-decoration: line-through;
    }

    .delete-item { display: inline-block; }
  }

  // Editing
  .delete-item { display: none; }
  &.editing .delete-item { display: inline-block; padding: 0 10px;}
}

.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-active {
  transform: translateX(10px);
  opacity: 0;
}
</style>
