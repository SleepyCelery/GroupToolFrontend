<template>
  <n-card style="border-radius: 10px" @click="handleClick">
    <div class="card-content">
      <div class="info-row">
        <span class="group-name">{{ groupName }}</span>
        <n-tag v-if="isPublic" type="success" size="small">公开</n-tag>
        <n-tag v-else type="warning" size="small">私有</n-tag>
      </div>

      <div class="info-row compact">
        <n-icon size="16">
          <IdcardFilled />
        </n-icon>
        <span class="compact-text">ID: {{ groupId }}</span>
        <n-icon size="16">
          <Calendar />
        </n-icon>
        <span class="compact-text">{{ formatDate(createTime) }}</span>
      </div>
    </div>
  </n-card>

  <DetailGroupInfoModal ref="detailModal" />
  <PasswordRequired ref="passwordModal" @confirm="handlePasswordConfirm" />
</template>

<script setup lang="ts">
import { NCard, NIcon, NTag } from 'naive-ui'
import { IdcardFilled } from '@vicons/antd'
import { Calendar } from '@vicons/ionicons5'
import { ref } from 'vue'
import DetailGroupInfoModal from './DetailGroupInfoModal.vue'
import PasswordRequired from './PasswordRequired.vue'

const detailModal = ref<InstanceType<typeof DetailGroupInfoModal>>()
const passwordModal = ref<InstanceType<typeof PasswordRequired>>()

const props = defineProps({
  groupId: {
    type: Number,
    required: true,
  },
  createTime: {
    type: String,
    required: true,
  },
  groupName: {
    type: String,
    required: true,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
})

const handleClick = () => {
  if (props.isPublic) {
    detailModal.value?.open(props.groupId)
  } else {
    passwordModal.value?.open(props.groupId)
  }
}

const handlePasswordConfirm = ({ id, password }: { id: number; password: string }) => {
  detailModal.value?.open(id, password)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const timezoneOffset = new Date().getTimezoneOffset()
  const localDate = new Date(date.getTime() - timezoneOffset * 60 * 1000)
  return localDate.toLocaleString()
}
</script>

<style scoped>
.group-card {
  width: 280px;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.n-card:hover {
  border-color: rgba(136, 182, 231, 0.5);
  box-shadow: 0 0 8px rgba(136, 182, 231, 0.8);
  transform: translateY(-2px);
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-row.compact {
  gap: 8px;
}

.compact-text {
  font-size: 14px;
  color: #666;
}

.group-name {
  font-weight: 500;
  font-size: 16px;
}
</style>
