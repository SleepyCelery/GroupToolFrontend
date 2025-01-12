<template>
  <div class="search-wrapper" :class="{ expanded: isExpanded }">
    <n-auto-complete
      v-model:value="searchValue"
      :options="formattedOptions"
      placeholder="搜索分组ID或名称"
      clearable
      :style="{ width: isMobile ? (isExpanded ? 'calc(100vw - 100px)' : '0') : '400px' }"
      @update:value="handleSearch"
      @blur="handleBlur"
      @select="handleOptionSelect"
      ref="autoComplete"
    />
    <n-icon v-if="isMobile && !isExpanded" @click="toggleSearch" class="search-icon">
      <search-icon />
    </n-icon>
  </div>
  <DetailGroupInfoModal ref="detailModal" />
  <PasswordRequired
    ref="passwordModal"
    @confirm="({ id, password }) => detailModal?.open(id, password)"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { NAutoComplete, NIcon } from 'naive-ui'
import { Search20Filled as SearchIcon } from '@vicons/fluent'
import { request } from '@/api'
import DetailGroupInfoModal from '@/components/DetailGroupInfoModal.vue'
import PasswordRequired from '@/components/PasswordRequired.vue'

interface Group {
  id: number
  group_name: string
  is_public: boolean
  created_at: string
}

interface GroupMap {
  [key: number]: Group
}

const searchValue = ref('')
const groupMap = ref<GroupMap>({})
const isMobile = ref(false)
const isExpanded = ref(false)
const autoComplete = ref<InstanceType<typeof NAutoComplete>>()
const detailModal = ref<InstanceType<typeof DetailGroupInfoModal> | null>(null)
const passwordModal = ref<InstanceType<typeof PasswordRequired>>()

const formattedOptions = computed(() => {
  return Object.values(groupMap.value).map((group) => ({
    label: `${group.group_name} (ID: ${group.id})`,
    value: group.id.toString(),
    isPublic: group.is_public,
  }))
})

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

const toggleSearch = () => {
  if (isMobile.value) {
    isExpanded.value = !isExpanded.value
    if (isExpanded.value) {
      setTimeout(() => {
        autoComplete.value?.focus()
      }, 100)
    }
  }
}

const handleSearch = async (value: string) => {
  if (!value) {
    groupMap.value = {}
    return
  }

  try {
    const data = await request<{ groups: Group[] }>('GET', '/search_groups', {
      params: { query: value },
    })

    groupMap.value = data.groups.reduce((acc, group) => {
      acc[group.id] = group
      return acc
    }, {} as GroupMap)
  } catch (error) {
    console.error('搜索失败:', error)
    groupMap.value = {}
  }
}

const handleBlur = () => {
  if (isMobile.value) {
    isExpanded.value = false
  }
}

const handleOptionSelect = (value: string) => {
  const groupId = parseInt(value)
  const group = groupMap.value[groupId]
  if (!group) return

  if (group.is_public) {
    detailModal.value?.open(group.id)
  } else {
    passwordModal.value?.open(group.id)
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.search-wrapper {
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.n-auto-complete {
  transition: width 0.3s ease;
  overflow: hidden;
  /* z-index: 1001; 提高层级避免被遮挡 */
  background-color: white; /* 添加背景色 */
  /* 添加阴影增加层次感 */
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-icon {
  cursor: pointer;
  padding: 0 8px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  opacity: 1;
  transition: opacity 0.3s ease;
  font-size: 24px;
  color: #000;
}

@media (min-width: 768px) {
  .search-icon {
    display: none;
  }
}

@media (max-width: 768px) {
  .search-wrapper.expanded .search-icon {
    display: none;
  }
}
</style>
