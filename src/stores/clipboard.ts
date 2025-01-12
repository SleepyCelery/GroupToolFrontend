import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useClipboardStore = defineStore('clipboard', () => {
  const lastContent = ref('') // 存储上次剪贴板内容

  // 更新剪贴板内容
  function updateContent(newContent: string) {
    lastContent.value = newContent
  }

  return { lastContent, updateContent }
})
