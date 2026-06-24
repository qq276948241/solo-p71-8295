<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Plus, Trash2, Syringe } from 'lucide-vue-next'
import { usePetStore } from '@/composables/usePetStore'
import WeightChart from '@/components/WeightChart.vue'
import { LOG_TYPE_LABEL, LOG_TYPE_COLOR, LOG_TYPE_EMOJI } from '@/types'
import type { LogType, VaccineRecord } from '@/types'

const route = useRoute()
const router = useRouter()
const petId = route.params.id as string

const {
  getPetById,
  getWeightsByPetId,
  getVaccinesByPetId,
  getLogsByPetId,
  addLog,
  deleteLog,
  addVaccine,
  deleteVaccine,
  calculateAge,
} = usePetStore()

const pet = computed(() => getPetById(petId))
const weights = computed(() => getWeightsByPetId(petId))
const vaccines = computed(() => getVaccinesByPetId(petId))
const logs = computed(() => getLogsByPetId(petId))

const logDialogVisible = ref(false)
const vaccineDialogVisible = ref(false)

const logForm = reactive({
  type: 'bath' as LogType,
  date: '',
  title: '',
  note: '',
})

const vaccineForm = reactive({
  name: '',
  date: '',
  nextDate: '',
})

const today = new Date().toISOString().slice(0, 10)

const logTypeOptions = Object.entries(LOG_TYPE_LABEL).map(([value, label]) => ({
  value: value as LogType,
  label: `${LOG_TYPE_EMOJI[value as LogType]} ${label}`,
}))

const resetLogForm = () => {
  logForm.type = 'bath'
  logForm.date = today
  logForm.title = ''
  logForm.note = ''
}

const resetVaccineForm = () => {
  vaccineForm.name = ''
  vaccineForm.date = today
  vaccineForm.nextDate = ''
}

onMounted(() => {
  logForm.date = today
  vaccineForm.date = today
})

const handleAddLog = () => {
  if (!logForm.title.trim()) {
    ElMessage.warning('请输入事件标题')
    return
  }
  if (!logForm.date) {
    ElMessage.warning('请选择日期')
    return
  }
  addLog({
    petId,
    type: logForm.type,
    date: logForm.date,
    title: logForm.title.trim(),
    note: logForm.note.trim(),
  })
  logDialogVisible.value = false
  resetLogForm()
  ElMessage.success('已添加')
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

const handleAddVaccine = () => {
  if (!vaccineForm.name.trim()) {
    ElMessage.warning('请输入疫苗名称')
    return
  }
  if (!vaccineForm.date) {
    ElMessage.warning('请选择接种日期')
    return
  }
  addVaccine({
    petId,
    name: vaccineForm.name.trim(),
    date: vaccineForm.date,
    nextDate: vaccineForm.nextDate || '',
  })
  vaccineDialogVisible.value = false
  resetVaccineForm()
  ElMessage.success('已添加')
}

const handleDeleteVaccine = async (id: string, name: string) => {
  try {
    await ElMessageBox.confirm(`确定删除「${name}」记录吗？`, '提示', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
    deleteVaccine(id)
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
  <div class="min-h-screen bg-cream-100" v-if="pet">
    <header class="sticky top-0 z-10 bg-cream-100/90 backdrop-blur-sm border-b border-cream-200">
      <div class="container max-w-4xl py-4 flex items-center justify-between">
        <button
          @click="goBack"
          class="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-cream-200/60 text-[#4a4036] transition-colors"
        >
          <ArrowLeft class="w-4 h-4" />
          <span class="text-sm">返回</span>
        </button>
        <h1 class="text-lg font-semibold text-[#4a4036]">{{ pet.name }} 的健康档案</h1>
        <div class="w-20"></div>
      </div>
    </header>

    <main class="container max-w-4xl py-6 space-y-5">
      <section class="bg-white rounded-2xl p-6 shadow-card">
        <div class="flex flex-col sm:flex-row sm:items-center gap-5">
          <div class="w-24 h-24 rounded-full bg-gradient-to-br from-orange-100 to-cream-200 flex items-center justify-center text-5xl border-3 border-orange-200 shrink-0">
            {{ pet.avatar }}
          </div>
          <div class="flex-1 space-y-2">
            <h2 class="text-2xl font-semibold text-[#4a4036]">{{ pet.name }}</h2>
            <div class="flex flex-wrap gap-x-5 gap-y-1 text-sm text-[#8a7e6e]">
              <span>{{ pet.species === 'cat' ? '🐱 猫咪' : '🐕 狗狗' }} · {{ pet.breed || '未知品种' }}</span>
              <span>🎂 {{ calculateAge(pet.birthday) }}（{{ pet.birthday }}）</span>
            </div>
            <div class="flex flex-wrap gap-3 pt-1">
              <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 text-sm">
                <span>⚖️</span>
                <span class="text-[#8a7e6e]">当前体重</span>
                <span class="font-semibold text-orange-500">{{ pet.currentWeight }} kg</span>
              </div>
              <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sage-400/15 text-sm">
                <span>🩺</span>
                <span class="text-[#8a7e6e]">最近体检</span>
                <span class="font-semibold text-sage-600">{{ pet.lastCheckup }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-white rounded-2xl p-6 shadow-card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-[#4a4036] flex items-center gap-2">
            <span>📈</span>近半年体重变化
          </h3>
        </div>
        <WeightChart v-if="weights.length > 0" :data="weights" :pet-name="pet.name" />
        <div v-else class="text-center py-10 text-[#8a7e6e]">暂无体重记录</div>
      </section>

      <section class="bg-white rounded-2xl p-6 shadow-card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-[#4a4036] flex items-center gap-2">
            <Syringe class="w-5 h-5 text-sky-500" />疫苗记录
          </h3>
          <button
            @click="vaccineDialogVisible = true"
            class="flex items-center gap-1 px-3 py-1.5 rounded-full bg-sky-50 text-sky-600 hover:bg-sky-100 text-sm transition-colors"
          >
            <Plus class="w-3.5 h-3.5" />
            添加
          </button>
        </div>
        <div v-if="vaccines.length === 0" class="text-center py-8 text-[#8a7e6e] text-sm">
          暂无疫苗记录，点击右上角添加
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-[#8a7e6e] border-b border-cream-100">
                <th class="text-left py-3 px-2 font-medium">疫苗名称</th>
                <th class="text-left py-3 px-2 font-medium">接种日期</th>
                <th class="text-left py-3 px-2 font-medium">下次接种</th>
                <th class="text-right py-3 px-2 font-medium w-16">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="v in vaccines" :key="v.id" class="border-b border-cream-50 hover:bg-cream-50/50">
                <td class="py-3 px-2 text-[#4a4036] font-medium">{{ v.name }}</td>
                <td class="py-3 px-2 text-[#6a6056]">{{ v.date }}</td>
                <td class="py-3 px-2">
                  <span v-if="v.nextDate" class="text-orange-500">{{ v.nextDate }}</span>
                  <span v-else class="text-[#b9ad9e]">—</span>
                </td>
                <td class="py-3 px-2 text-right">
                  <button
                    @click="handleDeleteVaccine(v.id, v.name)"
                    class="p-1.5 rounded-lg text-[#c9bca8] hover:text-red-400 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="bg-white rounded-2xl p-6 shadow-card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-[#4a4036] flex items-center gap-2">
            <span>📋</span>健康日志
          </h3>
          <button
            @click="logDialogVisible = true"
            class="flex items-center gap-1 px-3 py-1.5 rounded-full bg-orange-50 text-orange-600 hover:bg-orange-100 text-sm transition-colors"
          >
            <Plus class="w-3.5 h-3.5" />
            记录
          </button>
        </div>

        <div v-if="logs.length === 0" class="text-center py-10 text-[#8a7e6e] text-sm">
          暂无健康日志
        </div>

        <div v-else class="relative">
          <div class="absolute left-[19px] top-2 bottom-2 w-0.5 bg-cream-200"></div>
          <div class="space-y-5">
            <div v-for="log in logs" :key="log.id" class="relative flex gap-4 pl-1">
              <div
                class="relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 shadow-sm"
                :style="{ backgroundColor: LOG_TYPE_COLOR[log.type] + '20', border: `2px solid ${LOG_TYPE_COLOR[log.type]}` }"
              >
                {{ LOG_TYPE_EMOJI[log.type] }}
              </div>
              <div class="flex-1 min-w-0 pb-5">
                <div class="flex items-start justify-between gap-2">
                  <div class="min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                      <span
                        class="text-xs px-2 py-0.5 rounded-full font-medium"
                        :style="{ backgroundColor: LOG_TYPE_COLOR[log.type] + '20', color: LOG_TYPE_COLOR[log.type] }"
                      >
                        {{ LOG_TYPE_LABEL[log.type] }}
                      </span>
                      <span class="text-xs text-[#8a7e6e]">{{ log.date }}</span>
                    </div>
                    <h4 class="text-[15px] font-medium text-[#4a4036] mt-1.5">{{ log.title }}</h4>
                    <p v-if="log.note" class="text-sm text-[#8a7e6e] mt-1 leading-relaxed">{{ log.note }}</p>
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
          </div>
        </div>
      </section>
    </main>

    <el-dialog
      v-model="logDialogVisible"
      title="添加健康日志"
      width="420px"
      :close-on-click-modal="false"
      @closed="resetLogForm"
    >
      <el-form label-position="top" class="mt-2">
        <el-form-item label="事件类型">
          <el-select v-model="logForm.type" style="width: 100%">
            <el-option
              v-for="opt in logTypeOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="logForm.date"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="事件标题">
          <el-input v-model="logForm.title" placeholder="如：体内驱虫、年度体检..." clearable />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="logForm.note" type="textarea" :rows="3" placeholder="可选，添加详细说明" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="logDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddLog">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="vaccineDialogVisible"
      title="添加疫苗记录"
      width="420px"
      :close-on-click-modal="false"
      @closed="resetVaccineForm"
    >
      <el-form label-position="top" class="mt-2">
        <el-form-item label="疫苗名称">
          <el-input v-model="vaccineForm.name" placeholder="如：猫三联、狂犬疫苗..." clearable />
        </el-form-item>
        <el-form-item label="接种日期">
          <el-date-picker
            v-model="vaccineForm.date"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="下次接种日期（可选）">
          <el-date-picker
            v-model="vaccineForm.nextDate"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="vaccineDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddVaccine">保存</el-button>
      </template>
    </el-dialog>
  </div>

  <div v-else class="min-h-screen bg-cream-100 flex items-center justify-center">
    <div class="text-center">
      <div class="text-5xl mb-3">🐾</div>
      <p class="text-[#8a7e6e] mb-4">未找到该宠物</p>
      <button @click="goBack" class="px-5 py-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors">
        返回列表
      </button>
    </div>
  </div>
</template>
