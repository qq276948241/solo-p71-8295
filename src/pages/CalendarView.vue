<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, ChevronLeft, ChevronRight, Trash2 } from 'lucide-vue-next'
import { ElMessage, ElMessageBox } from 'element-plus'
import { usePetStore } from '@/composables/usePetStore'
import { LOG_TYPE_LABEL, LOG_TYPE_COLOR, LOG_TYPE_EMOJI } from '@/types'
import type { HealthLog } from '@/types'

const router = useRouter()
const { hasLogsOnDate, getLogsByDate, getPetById, deleteLog } = usePetStore()

const today = new Date()
const currentYear = ref(today.getFullYear())
const currentMonth = ref(today.getMonth())
const selectedDate = ref<string>(today.toISOString().slice(0, 10))
const drawerVisible = ref(false)

const weekDays = ['日', '一', '二', '三', '四', '五', '六']

const monthTitle = computed(() => `${currentYear.value}年${currentMonth.value + 1}月`)

const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startWeekday = firstDay.getDay()
  const daysInMonth = lastDay.getDate()

  const days: Array<{ date: string; day: number; inMonth: boolean; isToday: boolean }> = []

  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = startWeekday - 1; i >= 0; i--) {
    const d = prevMonthLastDay - i
    const prevMonthDate = new Date(year, month - 1, d)
    days.push({
      date: prevMonthDate.toISOString().slice(0, 10),
      day: d,
      inMonth: false,
      isToday: false,
    })
  }

  const todayStr = today.toISOString().slice(0, 10)
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d)
    const dateStr = dateObj.toISOString().slice(0, 10)
    days.push({
      date: dateStr,
      day: d,
      inMonth: true,
      isToday: dateStr === todayStr,
    })
  }

  while (days.length % 7 !== 0) {
    const lastDate = new Date(days[days.length - 1].date)
    lastDate.setDate(lastDate.getDate() + 1)
    days.push({
      date: lastDate.toISOString().slice(0, 10),
      day: lastDate.getDate(),
      inMonth: false,
      isToday: false,
    })
  }

  return days
})

const selectedLogs = computed((): HealthLog[] => {
  return getLogsByDate(selectedDate.value)
})

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

const goToday = () => {
  currentYear.value = today.getFullYear()
  currentMonth.value = today.getMonth()
  selectedDate.value = today.toISOString().slice(0, 10)
}

const selectDate = (date: string) => {
  selectedDate.value = date
  drawerVisible.value = true
}

const getPetName = (petId: string): string => {
  const pet = getPetById(petId)
  return pet ? pet.name : '未知'
}

const getPetAvatar = (petId: string): string => {
  const pet = getPetById(petId)
  return pet ? pet.avatar : '🐾'
}

const goPetDetail = (petId: string) => {
  drawerVisible.value = false
  router.push(`/pet/${petId}`)
}

const handleDeleteLog = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定删除这条记录吗？', '提示', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
    deleteLog(id)
    ElMessage.success('已删除')
  } catch {
    /* cancel */
  }
}

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-cream-100">
    <header class="sticky top-0 z-10 bg-cream-100/90 backdrop-blur-sm border-b border-cream-200">
      <div class="container max-w-3xl py-4 flex items-center justify-between">
        <button
          @click="goBack"
          class="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-cream-200/60 text-[#4a4036] transition-colors"
        >
          <ArrowLeft class="w-4 h-4" />
          <span class="text-sm">返回</span>
        </button>
        <h1 class="text-lg font-semibold text-[#4a4036]">健康日历</h1>
        <div class="w-20"></div>
      </div>
    </header>

    <main class="container max-w-3xl py-6">
      <div class="bg-white rounded-2xl p-5 shadow-card">
        <div class="flex items-center justify-between mb-5">
          <button
            @click="prevMonth"
            class="p-2 rounded-xl hover:bg-cream-100 text-[#4a4036] transition-colors"
          >
            <ChevronLeft class="w-5 h-5" />
          </button>
          <div class="flex items-center gap-3">
            <h2 class="text-xl font-semibold text-[#4a4036]">{{ monthTitle }}</h2>
            <button
              @click="goToday"
              class="px-3 py-1 text-xs rounded-full bg-cream-100 text-[#8a7e6e] hover:bg-cream-200 transition-colors"
            >
              今天
            </button>
          </div>
          <button
            @click="nextMonth"
            class="p-2 rounded-xl hover:bg-cream-100 text-[#4a4036] transition-colors"
          >
            <ChevronRight class="w-5 h-5" />
          </button>
        </div>

        <div class="grid grid-cols-7 mb-2">
          <div
            v-for="wd in weekDays"
            :key="wd"
            class="text-center text-xs font-medium py-2"
            :class="wd === '日' || wd === '六' ? 'text-orange-400' : 'text-[#8a7e6e]'"
          >
            {{ wd }}
          </div>
        </div>

        <div class="grid grid-cols-7 gap-1">
          <button
            v-for="d in calendarDays"
            :key="d.date"
            @click="selectDate(d.date)"
            class="relative aspect-square flex flex-col items-center justify-center rounded-xl transition-all"
            :class="[
              d.inMonth ? 'text-[#4a4036]' : 'text-[#d4c9b8]',
              d.isToday ? 'bg-orange-500 text-white font-semibold' : 'hover:bg-cream-50',
              selectedDate === d.date && !d.isToday ? 'ring-2 ring-orange-300 bg-orange-50' : '',
            ]"
          >
            <span class="text-sm leading-none">{{ d.day }}</span>
            <div v-if="d.inMonth" class="flex gap-0.5 mt-1">
              <span
                v-if="hasLogsOnDate(d.date).hasVaccine"
                class="w-1.5 h-1.5 rounded-full bg-sky-500"
              ></span>
              <span
                v-if="hasLogsOnDate(d.date).hasDeworm"
                class="w-1.5 h-1.5 rounded-full bg-sage-500"
              ></span>
              <span
                v-if="hasLogsOnDate(d.date).hasOther"
                class="w-1.5 h-1.5 rounded-full bg-orange-400"
              ></span>
            </div>
          </button>
        </div>

        <div class="flex items-center justify-center gap-5 mt-5 pt-4 border-t border-cream-100 text-xs text-[#8a7e6e]">
          <div class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-sky-500"></span>
            疫苗
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-sage-500"></span>
            驱虫
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-orange-400"></span>
            其他
          </div>
        </div>
      </div>
    </main>

    <el-drawer
      v-model="drawerVisible"
      :title="selectedDate"
      direction="btt"
      size="70%"
      class="calendar-drawer"
    >
      <div v-if="selectedLogs.length === 0" class="text-center py-16">
        <div class="text-5xl mb-3">🌤️</div>
        <p class="text-[#8a7e6e]">当天暂无健康记录</p>
      </div>

      <div v-else class="space-y-4">
        <p class="text-sm text-[#8a7e6e] mb-4">共 {{ selectedLogs.length }} 条记录</p>
        <div
          v-for="log in selectedLogs"
          :key="log.id"
          class="bg-cream-50 rounded-xl p-4 border border-cream-100"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-start gap-3 flex-1 min-w-0">
              <button
                @click="goPetDetail(log.petId)"
                class="w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center text-2xl shrink-0 border border-cream-100 hover:border-orange-200 transition-colors"
              >
                {{ getPetAvatar(log.petId) }}
              </button>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap mb-1.5">
                  <span
                    class="text-xs px-2 py-0.5 rounded-full font-medium"
                    :style="{ backgroundColor: LOG_TYPE_COLOR[log.type] + '25', color: LOG_TYPE_COLOR[log.type] }"
                  >
                    {{ LOG_TYPE_EMOJI[log.type] }} {{ LOG_TYPE_LABEL[log.type] }}
                  </span>
                  <button
                    @click="goPetDetail(log.petId)"
                    class="text-xs text-[#8a7e6e] hover:text-orange-500 transition-colors"
                  >
                    {{ getPetName(log.petId) }} →
                  </button>
                </div>
                <h4 class="font-medium text-[#4a4036]">{{ log.title }}</h4>
                <p v-if="log.note" class="text-sm text-[#8a7e6e] mt-1 leading-relaxed">{{ log.note }}</p>
              </div>
            </div>
            <button
              @click="handleDeleteLog(log.id)"
              class="p-1.5 rounded-lg text-[#c9bca8] hover:text-red-400 hover:bg-red-50 transition-colors shrink-0"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<style scoped>
.calendar-drawer :deep(.el-drawer) {
  border-radius: 20px 20px 0 0;
}
.calendar-drawer :deep(.el-drawer__header) {
  margin-bottom: 12px;
  padding: 16px 20px 0;
}
.calendar-drawer :deep(.el-drawer__body) {
  padding: 8px 20px 24px;
}
</style>
