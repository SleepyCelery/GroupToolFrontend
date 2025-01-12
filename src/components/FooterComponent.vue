<template>
  <footer class="footer-container">
    <div class="footer-content">
      <span>
        Powered by
        <a href="https://fastapi.tiangolo.com/" target="_blank" rel="noopener noreferrer">
          <img src="@/assets/fastapi.svg" class="fastapi-icon" alt="FastAPI Logo" />
          FastAPI
        </a>
        and
        <a href="https://vuejs.org/" target="_blank" rel="noopener noreferrer">
          <n-icon class="vue-icon"><LogoVue /></n-icon>
          Vue3
        </a>
        <br />
        Built with <n-icon class="heart-icon"><HeartFilled /></n-icon> by SleepyCelery
      </span>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { NIcon } from 'naive-ui'
import { HeartFilled } from '@vicons/antd'
import { LogoVue } from '@vicons/ionicons5'
</script>

<style scoped>
.footer-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #f5f5f5;
  padding: 5px 0;
  text-align: center;
  z-index: 1000;
}

.footer-content {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.heart-icon {
  color: #ff6b6b;
  font-size: 16px;
}

.vue-icon {
  color: #42b983;
  font-size: 16px;
}

.fastapi-icon {
  width: 16px;
  height: 16px;
  vertical-align: middle;
  margin: 0 4px;
  display: inline-block;
}
</style>
