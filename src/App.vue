<script setup lang="ts">
import HeaderComponent from './components/header/HeaderComponent.vue'
import FooterComponent from './components/FooterComponent.vue'
import { NButton } from 'naive-ui'
import BriefGroupInfoCard from './components/BriefGroupInfoCard.vue'
import { request } from './api'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { message, dialog } from './plugins/naive-ui'
import CreateNewGroup from './components/CreateNewGroup.vue'
import DetailGroupInfoModal from './components/DetailGroupInfoModal.vue'
import { useClipboardStore } from '@/stores/clipboard'

interface Group {
  id: number
  group_name: string
  created_at: string
  is_public: boolean
}

const groupList = ref<Group[]>([])
let pollingInterval: number | null = null
const createGroupModalRef = ref<InstanceType<typeof CreateNewGroup> | null>(null)
const detailModalRef = ref<InstanceType<typeof DetailGroupInfoModal> | null>(null)

const clipboardStore = useClipboardStore()

// 比较两个分组列表是否相同
const isGroupListChanged = (newGroups: Group[], oldGroups: Group[]) => {
  if (newGroups.length !== oldGroups.length) return true
  return newGroups.some((group, index) => group.id !== oldGroups[index]?.id)
}

const fetchLatestGroups = async () => {
  try {
    const data = await request<{ groups: Group[] }>('GET', '/latest_groups')
    const newGroups = data.groups

    // 检查是否有新分组
    if (isGroupListChanged(newGroups, groupList.value)) {
      if (groupList.value.length > 0) {
        message.info('分组结果已更新')
      }
      groupList.value = newGroups
    }
  } catch (error) {
    console.error('获取分组数据失败:', error)
  }
}

// 启动轮询
const startPolling = () => {
  pollingInterval = window.setInterval(fetchLatestGroups, 5000)
}

// 停止轮询
const stopPolling = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval)
    pollingInterval = null
  }
}

// 检查剪贴板内容
const checkClipboard = async () => {
  try {
    // 检查是否有剪贴板读取权限
    const permission = await navigator.permissions.query({
      name: 'clipboard-read' as PermissionName,
    })
    if (permission.state !== 'granted') {
      console.warn('没有剪贴板读取权限')
      return
    }

    const text = await navigator.clipboard.readText()
    const regex = /##GroupToolShare##(\d+)##(.*?)##/
    const match = text.match(regex)

    // 如果剪贴板内容发生变化且符合格式
    if (match && text !== clipboardStore.lastContent) {
      clipboardStore.updateContent(text) // 更新store中的内容
      const [, id, password] = match
      console.log(id, password)
      dialog.info({
        title: '分组分享',
        content: `你的好友向你分享了ID为 ${id} 的分组结果，是否打开？`,
        positiveText: '打开',
        negativeText: '取消',
        onPositiveClick: () => {
          detailModalRef.value?.open(Number(id), password)
        },
      })
    }
  } catch (error) {
    console.error('读取剪贴板失败:', error)
    message.error('读取剪贴板失败')
  } finally {
    if (clipboardCheckInterval !== null) {
      clearInterval(clipboardCheckInterval)
    }
  }
}

let clipboardCheckInterval: number | null = null

onMounted(() => {
  fetchLatestGroups()
  startPolling()

  // 立即检查剪贴板
  checkClipboard()

  // 设置定期检查剪贴板的定时器
  clipboardCheckInterval = window.setInterval(checkClipboard, 5000)

  // 在组件卸载时清除定时器
  onBeforeUnmount(() => {
    stopPolling()
    if (clipboardCheckInterval) {
      clearInterval(clipboardCheckInterval)
    }
  })
})

if (!navigator.clipboard) {
  message.error('当前浏览器不支持剪贴板功能')
}
</script>

<template>
  <header class="app-header">
    <HeaderComponent />
  </header>

  <main>
    <div class="title-row">
      <h2 class="title">最近的分组结果</h2>
      <n-button type="primary" @click="createGroupModalRef?.open()"> 创建新的分组 </n-button>
    </div>
    <CreateNewGroup ref="createGroupModalRef" />
    <div class="group-grid" v-if="groupList.length > 0">
      <BriefGroupInfoCard
        v-for="group in groupList"
        :key="group.id"
        :groupId="group.id"
        :groupName="group.group_name"
        :createTime="group.created_at"
        :isPublic="group.is_public"
      />
    </div>
    <div v-else>
      <div class="empty-container">
        <n-empty description="暂无数据" size="large" />
      </div>
    </div>
  </main>

  <FooterComponent />

  <DetailGroupInfoModal ref="detailModalRef" />
</template>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 1000;
}

main {
  background-color: #f0f4f8;
  padding-top: 64px; /* 给header留出空间 */
  padding-bottom: 55px; /* 给footer留出空间 */
  min-height: 100vh; /* 确保内容区域占满剩余空间 */
  width: 100%; /* 确保宽度占满 */
  max-width: 100%; /* 防止内容溢出 */
  margin: 0 auto; /* 居中布局 */
  padding-left: 20px;
  padding-right: 20px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
}

.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

/* 添加网格布局样式 */
.group-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

/* 移动设备适配 */
@media (max-width: 640px) {
  .group-grid {
    grid-template-columns: 1fr; /* 移动设备上单列显示 */
  }

  .group-card {
    width: 100%; /* 卡片宽度占满容器 */
  }
}

/* 中等屏幕尺寸适配 */
@media (min-width: 641px) and (max-width: 1024px) {
  .group-grid {
    grid-template-columns: repeat(2, 1fr); /* 中等屏幕显示两列 */
  }
}
</style>
