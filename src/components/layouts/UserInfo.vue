<template>
  <div>
    <a-popover placement="top" trigger="hover" overlayClassName="logout-popover">
      <template #content>
        <div class="logout-content">
          <div class="btn">
            <PoweroffOutlined />
            <div class="logout-tip">退出登录</div>
          </div>
        </div>
      </template>
      <div class="user-info">
        <!-- <a-avatar class="avatar" size="small" shape="circle">
        {{
          ldap !== undefined ? ldap.substring(0, 1).toUpperCase() : '-'
        }}
      </a-avatar> -->
        <div class="username">{{ ldap }}</div>
      </div>
    </a-popover>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store'
import { defineComponent, computed } from 'vue'
import { PoweroffOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  name: 'UserInfo',
  components: { PoweroffOutlined },
  setup() {
    const store = useStore()
    const ldap = computed(() => store.state.ldap)
    store.dispatch('getUserInfo')
    return {
      ldap
    }
  }
})
</script>

<style lang="less" scoped>
.logout-popover {
  .ant-popover-inner-content {
    padding: 8px 0;
  }
}

.logout-content {
  width: 140px;
  .btn {
    padding: 7px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: backgroundColor 0.25s ease-in-out;
    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }

    .logout-tip {
      margin-left: 8px;
    }
  }
}

.user-info {
  align-items: center;
  display: flex;
  cursor: pointer;
  line-height: 64px;

  .avatar {
    background-color: rgba(0, 0, 0, 0.65);
    vertical-align: 'middle';
    font-weight: bold;
  }

  .username {
    margin-left: 6px;
    font-size: 14px;
    color: #fff;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    transform: translateY(-3px);
  }
}
</style>
