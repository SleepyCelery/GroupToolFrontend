<template>
  <n-modal v-model:show="showModal">
    <n-card :style="{ width: isMobile ? '90%' : '600px' }" title="分组详情">
      <n-spin v-if="loading">
        <template #description>加载中...</template>
      </n-spin>
      <n-space vertical v-else>
        <n-form label-placement="left" label-width="100px">
          <n-form-item label="分组ID">
            <n-text>{{ groupInfo.id }}</n-text>
          </n-form-item>
          <n-form-item label="创建时间">
            <n-text>{{ formatDate(groupInfo.created_at) }}</n-text>
          </n-form-item>
          <n-form-item label="分组名称">
            <n-text>{{ groupInfo.group_name }}</n-text>
          </n-form-item>
          <n-form-item label="是否公开">
            <n-tag :type="groupInfo.is_public ? 'success' : 'warning'">
              {{ groupInfo.is_public ? '公开' : '私有' }}
            </n-tag>
          </n-form-item>
          <n-form-item label="分组数量">
            <n-text>{{ groupInfo.group_count }}</n-text>
          </n-form-item>
          <n-form-item label="每组大小" v-if="groupInfo.group_mode === 'size'">
            <n-text>{{ groupInfo.group_size }}</n-text>
          </n-form-item>
          <n-form-item label="分组模式" v-if="groupInfo.group_mode">
            <template v-if="groupInfo.group_mode === 'size'">
              <n-text>按固定数量分配每组元素</n-text>
            </template>
            <template v-else-if="groupInfo.group_mode === 'equal'">
              <n-text>根据组数均等分配所有元素</n-text>
            </template>
          </n-form-item>
          <n-form-item label="元素池">
            <n-dynamic-tags
              :value="groupInfo.source_elements || []"
              disabled
              v-if="groupInfo.source_elements && groupInfo.source_elements.length > 0"
            />
            <n-text v-else>无</n-text>
          </n-form-item>
          <n-form-item label="数据源">
            <n-dynamic-tags :value="groupInfo.data_source || []" disabled />
          </n-form-item>
          <n-form-item label="分组结果">
            <n-collapse>
              <n-collapse-item
                v-for="(group, index) in groupInfo.group_result"
                :key="index"
                :title="`第 ${index + 1} 组`"
              >
                <n-space>
                  <n-tag v-for="(item, i) in group" :key="i">{{ item }}</n-tag>
                </n-space>
              </n-collapse-item>
            </n-collapse>
          </n-form-item>
        </n-form>
      </n-space>
      <template #footer>
        <n-space justify="end">
          <n-button @click="handleCopyShare">复制分享链接</n-button>
          <n-button @click="handleCancel">关闭</n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  NModal,
  NCard,
  NForm,
  NFormItem,
  NText,
  NTag,
  NDynamicTags,
  NCollapse,
  NCollapseItem,
  NSpace,
  NButton,
  NSpin,
} from 'naive-ui'
import { request } from '../api'
import { message } from '../plugins/naive-ui'
import { useClipboardStore } from '@/stores/clipboard'

interface GroupInfo {
  id: number
  group_name: string
  group_size: number
  data_source: string[]
  group_result: string[][]
  group_mode: string
  created_at: string
  is_public: boolean
  source_elements: string[]
  group_count: number
  private_password: string
}

const showModal = ref(false)
const groupInfo = ref<GroupInfo>({
  id: 0,
  group_name: '',
  group_size: 0,
  data_source: [],
  group_result: [],
  group_mode: '',
  created_at: '',
  is_public: false,
  source_elements: [],
  group_count: 0,
  private_password: '',
})

const isMobile = ref(false)

if (window.innerWidth < 768) {
  isMobile.value = true
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const timezoneOffset = new Date().getTimezoneOffset()
  const localDate = new Date(date.getTime() - timezoneOffset * 60 * 1000)
  return localDate.toLocaleString()
}

const loading = ref(false)

const clipboardStore = useClipboardStore()

const open = async (id: number, password: string = '') => {
  try {
    loading.value = true
    const data = await request('GET', '/group_result', {
      params: {
        group_id: id,
        password: password,
      },
    })
    groupInfo.value = {
      ...(groupInfo.value as GroupInfo),
      ...(data as GroupInfo),
    }
    showModal.value = true
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid password') {
      message.error('密码错误')
    } else {
      message.error('获取分组详情失败')
    }
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleCopyShare = () => {
  const shareText = `复制此文本并打开链接${window.location.href}查看分组结果：##GroupToolShare##${groupInfo.value.id}##${groupInfo.value.private_password}##`

  navigator.clipboard.writeText(shareText)
  clipboardStore.updateContent(shareText)
  message.success('已复制分享链接')
}

const handleCancel = () => {
  showModal.value = false
}

defineExpose({
  open,
})
</script>

<style scoped>
.n-card {
  max-height: 80vh;
  overflow-y: auto;
}

.n-collapse {
  width: 100%;
}
</style>
