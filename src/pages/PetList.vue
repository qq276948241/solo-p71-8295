<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Calendar, Trash2 } from 'lucide-vue-next'
import { usePetStore } from '@/composables/usePetStore'
import type { Pet, Species } from '@/types'

const router = useRouter()
const { pets, addPet, deletePet, calculateAge } = usePetStore()

const dialogVisible = ref(false)

const form = reactive({
  name: '',
  species: 'cat' as Species,
  breed: '',
  avatar: '🐱',
  birthday: '',
  currentWeight: 0,
  lastCheckup: '',
})

const catAvatars = ['🐱', '😺', '😸', '🐈', '🐈‍⬛', '😻']
const dogAvatars = ['🐕', '🐶', '🐩', '🦮', '🐕‍🦺', '🐺']

const avatarOptions = ref(catAvatars)

const selectAvatar = (a: string) => {
  form.avatar = a
}

const onSpeciesChange = () => {
  avatarOptions.value = form.species === 'cat' ? catAvatars : dogAvatars
  form.avatar = avatarOptions.value[0]
}

const resetForm = () => {
  form.name = ''
  form.species = 'cat'
  form.breed = ''
  form.avatar = '🐱'
  form.birthday = ''
  form.currentWeight = 0
  form.lastCheckup = ''
  avatarOptions.value = catAvatars
}

const handleSubmit = () => {
  if (!form.name.trim()) {
    ElMessage.warning('请输入宠物名字')
    return
  }
  if (!form.birthday) {
    ElMessage.warning('请选择出生日期')
    return
  }
  addPet({
    name: form.name.trim(),
    species: form.species,
    breed: form.breed.trim(),
    avatar: form.avatar,
    birthday: form.birthday,
    currentWeight: form.currentWeight || 0,
    lastCheckup: form.lastCheckup || form.birthday,
  })
  dialogVisible.value = false
  resetForm()
  ElMessage.success('新增成功')
}

const goDetail = (pet: Pet) => {
  router.push(`/pet/${pet.id}`)
}

const goCalendar = () => {
  router.push('/calendar')
}

const handleDelete = async (pet: Pet, e: Event) => {
  e.stopPropagation()
  try {
    await ElMessageBox.confirm(`确定要删除「${pet.name}」吗？相关健康记录也会一并删除。`, '提示', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      confirmButtonClass: 'el-button--danger',
    })
    deletePet(pet.id)
    ElMessage.success('已删除')
  } catch {
    /* cancel */
  }
}
</script>

<template>
  <div class="min-h-screen bg-cream-100">
    <header class="sticky top-0 z-10 bg-cream-100/90 backdrop-blur-sm border-b border-cream-200">
      <div class="container max-w-5xl py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🐾</span>
          <h1 class="text-xl font-semibold text-[#4a4036]">宠物健康档案</h1>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="goCalendar"
            class="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white shadow-card text-[#4a4036] hover:bg-cream-50 transition-colors"
          >
            <Calendar class="w-4 h-4" />
            <span class="text-sm">日历</span>
          </button>
          <button
            @click="dialogVisible = true"
            class="flex items-center gap-1.5 px-4 py-2 rounded-full bg-orange-500 text-white shadow-soft hover:bg-orange-600 transition-colors"
          >
            <Plus class="w-4 h-4" />
            <span class="text-sm font-medium">新增</span>
          </button>
        </div>
      </div>
    </header>

    <main class="container max-w-5xl py-8">
      <div v-if="pets.length === 0" class="text-center py-20">
        <div class="text-6xl mb-4">🐾</div>
        <p class="text-[#8a7e6e] mb-4">还没有添加宠物档案</p>
        <button
          @click="dialogVisible = true"
          class="px-6 py-2.5 rounded-full bg-orange-500 text-white shadow-soft hover:bg-orange-600 transition-colors"
        >
          添加第一只宠物
        </button>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="pet in pets"
          :key="pet.id"
          @click="goDetail(pet)"
          class="group relative bg-white rounded-2xl p-5 shadow-card hover:shadow-soft transition-all cursor-pointer border border-cream-100 hover:border-orange-100"
        >
          <button
            @click="handleDelete(pet, $event)"
            class="absolute top-3 right-3 p-1.5 rounded-lg text-[#c9bca8] hover:text-red-400 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
          >
            <Trash2 class="w-4 h-4" />
          </button>

          <div class="flex items-start gap-4">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-orange-100 to-cream-200 flex items-center justify-center text-3xl border-2 border-orange-200 shrink-0">
              {{ pet.avatar }}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-semibold text-[#4a4036] truncate">{{ pet.name }}</h3>
              <p class="text-sm text-[#8a7e6e] mt-0.5">
                {{ pet.species === 'cat' ? '猫咪' : '狗狗' }} · {{ pet.breed || '未知品种' }}
              </p>
              <p class="text-sm text-[#8a7e6e] mt-0.5">
                {{ calculateAge(pet.birthday) }}
              </p>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-cream-100 flex items-center justify-between">
            <div class="flex items-center gap-1.5 text-sm text-[#8a7e6e]">
              <span class="text-base">🩺</span>
              <span>最近体检</span>
            </div>
            <span class="text-sm font-medium text-[#4a4036]">{{ pet.lastCheckup }}</span>
          </div>

          <div class="mt-3 flex items-center justify-between">
            <div class="flex items-center gap-1.5 text-sm text-[#8a7e6e]">
              <span class="text-base">⚖️</span>
              <span>当前体重</span>
            </div>
            <span class="text-sm font-medium text-orange-500">{{ pet.currentWeight }} kg</span>
          </div>
        </div>
      </div>
    </main>

    <el-dialog
      v-model="dialogVisible"
      title="添加新宠物"
      width="420px"
      :close-on-click-modal="false"
      @closed="resetForm"
    >
      <el-form label-position="top" class="mt-4">
        <el-form-item label="头像">
          <div class="flex gap-2 flex-wrap">
            <button
              v-for="a in avatarOptions"
              :key="a"
              type="button"
              @click="selectAvatar(a)"
              :class="[
                'w-11 h-11 rounded-xl text-2xl flex items-center justify-center transition-all',
                form.avatar === a ? 'bg-orange-100 ring-2 ring-orange-400' : 'bg-cream-50 hover:bg-cream-100'
              ]"
            >
              {{ a }}
            </button>
          </div>
        </el-form-item>

        <el-form-item label="名字">
          <el-input v-model="form.name" placeholder="请输入宠物名字" clearable />
        </el-form-item>

        <el-form-item label="种类">
          <el-radio-group v-model="form.species" @change="onSpeciesChange">
            <el-radio-button value="cat">🐱 猫咪</el-radio-button>
            <el-radio-button value="dog">🐕 狗狗</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="品种">
          <el-input v-model="form.breed" placeholder="如：英短、柴犬" clearable />
        </el-form-item>

        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="出生日期">
            <el-date-picker
              v-model="form.birthday"
              type="date"
              placeholder="选择日期"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </el-form-item>

          <el-form-item label="体重 (kg)">
            <el-input-number v-model="form.currentWeight" :min="0" :precision="1" :step="0.1" style="width: 100%" />
          </el-form-item>
        </div>

        <el-form-item label="最近体检日期">
          <el-date-picker
            v-model="form.lastCheckup"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
