<template>
  <n-modal v-model:show="showModal">
    <n-card :style="{ width: isMobile ? '90%' : '600px' }" title="创建新的分组">
      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
      >
        <!-- 分组名称 -->
        <n-form-item label="分组名称" path="groupName" inline>
          <n-input
            v-model:value="formData.groupName"
            maxlength="20"
            placeholder="请输入分组名称，最多20字符"
          />
        </n-form-item>

        <!-- 是否公开 -->
        <n-form-item label="是否公开" path="isPublic" inline required>
          <n-radio-group v-model:value="formData.isPublic" inline>
            <n-radio :value="true">公开</n-radio>
            <n-radio :value="false">私有</n-radio>
          </n-radio-group>
        </n-form-item>

        <!-- 私有分组密码 -->
        <n-form-item v-show="!formData.isPublic" label="分组密码" path="password" inline required>
          <n-input
            v-model:value="formData.password"
            type="password"
            placeholder="请输入私有分组密码"
            show-password-on="click"
          />
        </n-form-item>

        <!-- 分组数量 -->
        <n-form-item label="分组数量" path="groupCount" inline>
          <n-input-number
            v-model:value="formData.groupCount"
            :min="1"
            :max="100"
            placeholder="请输入分组数量"
          />
        </n-form-item>

        <!-- 分组模式 -->
        <n-form-item label="分组模式" path="groupMode" inline required>
          <n-radio-group v-model:value="formData.groupMode">
            <n-radio value="equal">根据组数均等分配所有元素</n-radio>
            <n-radio value="size">按固定数量分配每组元素</n-radio>
          </n-radio-group>
        </n-form-item>

        <!-- 每组元素数量 -->
        <n-form-item
          v-if="formData.groupMode === 'size'"
          label="每组元素数量"
          path="groupSize"
          inline
        >
          <n-input-number
            v-model:value="formData.groupSize"
            :min="1"
            :max="100"
            placeholder="请输入每组元素数量"
          />
        </n-form-item>

        <!-- 元素池 -->
        <n-form-item label="元素池">
          <div class="element-pool-container">
            <n-dynamic-tags v-model:value="formData.sourceElements" />
            <n-button @click="loadPopularElements" type="primary" class="load-button">
              加载热门元素
            </n-button>
          </div>
        </n-form-item>

        <!-- 数据源 -->
        <n-form-item path="dataSource" inline>
          <template #label>
            <div style="display: flex; align-items: center; gap: 4px">
              <span>数据源</span>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-icon size="16" style="color: #808080; cursor: help">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="1em"
                      height="1em"
                    >
                      <path
                        fill="currentColor"
                        d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8a8 8 0 0 1-8 8zm0-13a1 1 0 0 0-1 1v6a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1zm0 10a1 1 0 1 0 1 1a1 1 0 0 0-1-1z"
                      />
                    </svg>
                  </n-icon>
                </template>
                数据源是指外部数据元素集合，选择某个数据源即添加了一组元素到元素池中
              </n-tooltip>
            </div>
          </template>
          <n-select
            v-model:value="formData.dataSource"
            multiple
            filterable
            placeholder="请选择数据源"
            :options="dataSourceOptions"
          />
        </n-form-item>
      </n-form>

      <template #footer>
        <n-space justify="end">
          <n-button @click="handleCancel">关闭</n-button>
          <n-button type="primary" :loading="isSubmitting" @click="handleSubmit">
            确认创建
          </n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
  <DetailGroupInfoModal ref="detailGroupInfoModalRef" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  NModal,
  NCard,
  NForm,
  NFormItem,
  NInput,
  NRadioGroup,
  NRadio,
  NInputNumber,
  NDynamicTags,
  NSelect,
  NButton,
  NSpace,
  type FormRules,
  type FormInst,
  NIcon,
} from 'naive-ui'
import { request } from '@/api'
import { message } from '@/plugins/naive-ui'
import DetailGroupInfoModal from './DetailGroupInfoModal.vue'

interface FormData {
  groupName: string
  isPublic: boolean
  password: string
  groupCount: number | null
  groupMode: 'equal' | 'size'
  groupSize: number | null
  sourceElements: string[]
  dataSource: string[]
}

const showModal = ref(false)
const formRef = ref<FormInst | null>(null)
const detailGroupInfoModalRef = ref<typeof DetailGroupInfoModal | null>(null)

const formData = ref<FormData>({
  groupName: '',
  isPublic: true,
  password: '',
  groupCount: null,
  groupMode: 'equal',
  groupSize: null,
  sourceElements: [],
  dataSource: [],
})

const rules: FormRules = {
  groupName: {
    required: true,
    message: '请输入分组名称',
    trigger: 'blur',
  },
  groupCount: {
    required: true,
    type: 'number',
    message: '请输入分组数量',
    trigger: 'blur',
  },
  groupSize: {
    required: true,
    type: 'number',
    message: '请输入每组元素数量',
    trigger: 'blur',
    validator: (rule, value) => {
      if (formData.value.groupMode === 'size' && !value) {
        return new Error('请输入每组元素数量')
      }
      return true
    },
  },
  sourceElements: {
    validator: (rule, value) => {
      if (value.length === 0 && formData.value.dataSource.length === 0) {
        return new Error('元素池和数据源不能同时为空')
      }
      return true
    },
    trigger: 'change',
  },
  dataSource: {
    validator: (rule, value) => {
      if (value.length === 0 && formData.value.sourceElements.length === 0) {
        return new Error('元素池和数据源不能同时为空')
      }
      return true
    },
    trigger: 'change',
  },
}

const dataSourceOptions = ref<{ label: string; value: string }[]>([])
const isMobile = computed(() => window.innerWidth < 768)

const loadPopularElements = async () => {
  try {
    const data = await request<string[]>('GET', '/hot_elements')
    const originalLength = formData.value.sourceElements.length
    formData.value.sourceElements = [...new Set([...formData.value.sourceElements, ...data])]
    const addedCount = formData.value.sourceElements.length - originalLength
    if (addedCount > 0) {
      message.success(`成功加载${addedCount}个热门元素`)
    } else {
      message.info('没有新的热门元素可加载')
    }
  } catch (error) {
    message.error('加载热门元素失败')
    console.error(error)
  }
}

const loadDataSource = async () => {
  try {
    const data = await request<string[]>('GET', '/data_sources')
    dataSourceOptions.value = data.map((item) => ({ label: item, value: item }))
  } catch (error) {
    message.error('加载数据源失败')
    console.error(error)
  }
}

const isSubmitting = ref(false)

const handleSubmit = async () => {
  isSubmitting.value = true

  formRef.value?.validate(async (errors) => {
    if (!errors) {
      try {
        // 构造请求数据
        const requestData = {
          group_name: formData.value.groupName,
          is_public: formData.value.isPublic,
          private_password: formData.value.isPublic ? '' : formData.value.password,
          source_elements: formData.value.sourceElements,
          data_source: formData.value.dataSource,
          group_mode: formData.value.groupMode,
          group_count: formData.value.groupCount,
          group_size: formData.value.groupMode === 'size' ? formData.value.groupSize : 0,
        }

        // 发送请求
        const response = await request<{ id: string }>('POST', '/group_result', requestData)

        // 处理成功响应
        message.success('创建分组成功')
        showModal.value = false
        // 直接调用DetailGroupInfoModal的open方法
        detailGroupInfoModalRef.value?.open(response.id, formData.value.password)
        // 重置表单数据
        formData.value = {
          groupName: '',
          isPublic: true,
          password: '',
          groupCount: 2,
          groupMode: 'equal',
          groupSize: 0,
          sourceElements: [],
          dataSource: [],
        }
      } catch (error) {
        console.error('创建分组失败:', error)
        message.error('创建分组失败，请稍后重试')
      } finally {
        isSubmitting.value = false
      }
    } else {
      message.error('请检查表单')
      isSubmitting.value = false
    }
  })
}

const handleCancel = () => {
  showModal.value = false
  // 重置表单数据
  formData.value = {
    groupName: '',
    isPublic: true,
    password: '',
    groupCount: 2,
    groupMode: 'equal',
    groupSize: 0,
    sourceElements: [],
    dataSource: [],
  }
}

const open = () => {
  showModal.value = true
  loadDataSource()
}

defineExpose({
  open,
})
</script>

<style scoped>
.element-pool-container {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.load-button {
  flex-shrink: 0;
}

/* :deep(.n-form-item) {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

:deep(.n-form-item__label) {
  flex: 0 0 100px;
  text-align: right;
}

:deep(.n-form-item-blank) {
  flex: 1;
  max-width: 400px;
}

:deep(.n-select) {
  width: 100%;
  max-width: 400px;
}

:deep(.n-input),
:deep(.n-input-number) {
  width: 100%;
  max-width: 400px;
}

:deep(.n-radio-group) {
  width: 100%;
  max-width: 400px;
} */
</style>
