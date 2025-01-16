<template>
  <header class="header-container">
    <!-- 标题 -->
    <IconTitle>
      <template #icon>
        <Group20Filled />
      </template>
      <template #default>
        <span style="font-family: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif; font-size: 20px; font-weight: 600; color: #2c3e50;">
          分组工具 2.0
        </span>
      </template>
    </IconTitle>
    <!-- 搜索框 -->
    <div class="search-box-container">
      <SearchBox ref="searchBox" />
    </div>
    <!-- 右上角github链接 -->
    <div class="github-link">
      <a
        href="https://github.com/SleepyCelery/GroupToolBackend"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub Repository"
      >
        <n-icon>
          <LogoGithub />
        </n-icon>
      </a>
    </div>
  </header>
</template>

<script setup lang="ts">
import IconTitle from './IconTitle.vue'
import SearchBox from './SearchBox.vue'
import { LogoGithub } from '@vicons/ionicons5'
import { Group20Filled } from '@vicons/fluent'
import { NIcon } from 'naive-ui'
import { ref } from 'vue'

const searchBox = ref<InstanceType<typeof SearchBox>>()
</script>

<style scoped>
.header-container {
  background-color: rgb(136, 182, 231);
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  position: relative;
}

.search-box-container {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.github-link {
  display: flex;
  align-items: center;
  height: 100%;
}

.github-link .n-icon {
  color: black;
  transition: transform 0.2s ease;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.github-link:hover .n-icon {
  transform: scale(1.1);
}
</style>
