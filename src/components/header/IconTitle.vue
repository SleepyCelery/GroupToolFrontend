<template>
  <div class="icon-title">
    <n-icon class="icon">
      <slot name="icon"></slot>
    </n-icon>
    <span class="title">
      <slot></slot>
    </span>
  </div>
</template>

<script setup lang="ts">
// 使用setup语法
import { NIcon } from 'naive-ui'
</script>

<style scoped>
.icon-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon {
  font-size: 32px;
}

.title {
  font-size: 20px;
  font-weight: 500;
  color: black;
}
</style>
