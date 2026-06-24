import { ref, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Pet, WeightRecord, VaccineRecord, HealthLog, LogType } from '@/types'
import { STORAGE_KEYS, getFromStorage, setToStorage, generateId } from '@/utils/storage'
import { getMockPets, getMockWeights, getMockVaccines, getMockLogs } from '@/utils/mock'

const initialized = getFromStorage<boolean>(STORAGE_KEYS.initialized, false)

if (!initialized) {
  setToStorage(STORAGE_KEYS.pets, getMockPets())
  setToStorage(STORAGE_KEYS.weights, getMockWeights())
  setToStorage(STORAGE_KEYS.vaccines, getMockVaccines())
  setToStorage(STORAGE_KEYS.logs, getMockLogs())
  setToStorage(STORAGE_KEYS.initialized, true)
}

const pets = ref<Pet[]>(getFromStorage<Pet[]>(STORAGE_KEYS.pets, []))
const weights = ref<WeightRecord[]>(getFromStorage<WeightRecord[]>(STORAGE_KEYS.weights, []))
const vaccines = ref<VaccineRecord[]>(getFromStorage<VaccineRecord[]>(STORAGE_KEYS.vaccines, []))
const logs = ref<HealthLog[]>(getFromStorage<HealthLog[]>(STORAGE_KEYS.logs, []))

watch(pets, v => setToStorage(STORAGE_KEYS.pets, v), { deep: true })
watch(weights, v => setToStorage(STORAGE_KEYS.weights, v), { deep: true })
watch(vaccines, v => setToStorage(STORAGE_KEYS.vaccines, v), { deep: true })
watch(logs, v => setToStorage(STORAGE_KEYS.logs, v), { deep: true })

export function usePetStore() {
  const addPet = (pet: Omit<Pet, 'id'>): Pet => {
    const newPet: Pet = { ...pet, id: generateId() }
    pets.value.push(newPet)
    return newPet
  }

  const updatePet = (id: string, data: Partial<Pet>) => {
    const idx = pets.value.findIndex(p => p.id === id)
    if (idx > -1) {
      pets.value[idx] = { ...pets.value[idx], ...data }
    }
  }

  const deletePet = (id: string) => {
    pets.value = pets.value.filter(p => p.id !== id)
    weights.value = weights.value.filter(w => w.petId !== id)
    vaccines.value = vaccines.value.filter(v => v.petId !== id)
    logs.value = logs.value.filter(l => l.petId !== id)
  }

  const getPetById = (id: string): Pet | undefined => {
    return pets.value.find(p => p.id === id)
  }

  const getWeightsByPetId = (petId: string): WeightRecord[] => {
    return weights.value
      .filter(w => w.petId === petId)
      .sort((a, b) => a.date.localeCompare(b.date))
  }

  const addWeight = (record: Omit<WeightRecord, 'id'>) => {
    weights.value.push({ ...record, id: generateId() })
  }

  const getVaccinesByPetId = (petId: string): VaccineRecord[] => {
    return vaccines.value
      .filter(v => v.petId === petId)
      .sort((a, b) => b.date.localeCompare(a.date))
  }

  const addVaccine = (record: Omit<VaccineRecord, 'id'>) => {
    vaccines.value.push({ ...record, id: generateId() })
  }

  const deleteVaccine = (id: string) => {
    vaccines.value = vaccines.value.filter(v => v.id !== id)
  }

  const getLogsByPetId = (petId: string): HealthLog[] => {
    return logs.value
      .filter(l => l.petId === petId)
      .sort((a, b) => b.date.localeCompare(a.date))
  }

  const getLogsByDate = (date: string): HealthLog[] => {
    return logs.value
      .filter(l => l.date === date)
      .sort((a, b) => b.date.localeCompare(a.date))
  }

  const getLogsByDateRange = (startDate: string, endDate: string): HealthLog[] => {
    return logs.value.filter(l => l.date >= startDate && l.date <= endDate)
  }

  const addLog = (log: Omit<HealthLog, 'id'>) => {
    logs.value.push({ ...log, id: generateId() })
  }

  const deleteLog = (id: string) => {
    logs.value = logs.value.filter(l => l.id !== id)
  }

  const hasLogsOnDate = (date: string): { hasVaccine: boolean; hasDeworm: boolean; hasOther: boolean } => {
    const dayLogs = logs.value.filter(l => l.date === date)
    return {
      hasVaccine: dayLogs.some(l => l.type === 'vaccine'),
      hasDeworm: dayLogs.some(l => l.type === 'deworm'),
      hasOther: dayLogs.some(l => l.type !== 'vaccine' && l.type !== 'deworm'),
    }
  }

  const calculateAge = (birthday: string): string => {
    const birth = new Date(birthday)
    const now = new Date()
    let years = now.getFullYear() - birth.getFullYear()
    let months = now.getMonth() - birth.getMonth()
    if (months < 0) {
      years--
      months += 12
    }
    if (years > 0) {
      return months > 0 ? `${years}岁${months}个月` : `${years}岁`
    }
    return `${Math.max(months, 0)}个月`
  }

  const buildExportJson = (): string => {
    return JSON.stringify(
      {
        version: 1,
        exportedAt: new Date().toISOString(),
        pets: pets.value,
        weights: weights.value,
        vaccines: vaccines.value,
        logs: logs.value,
      },
      null,
      2
    )
  }

  const exportData = () => {
    const blob = new Blob([buildExportJson()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const date = new Date().toISOString().slice(0, 10)
    a.href = url
    a.download = `pet-health-backup-${date}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    ElMessage.success('备份文件已下载')
  }

  const applyImport = (json: string): string => {
    const data = JSON.parse(json)
    if (!data || typeof data !== 'object') throw new Error('format')
    if (Array.isArray(data.pets)) pets.value = data.pets
    if (Array.isArray(data.weights)) weights.value = data.weights
    if (Array.isArray(data.vaccines)) vaccines.value = data.vaccines
    if (Array.isArray(data.logs)) logs.value = data.logs
    return `已恢复 ${data.pets?.length ?? 0} 只宠物档案`
  }

  const importData = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json,application/json'
    input.className = 'hidden'
    document.body.appendChild(input)

    input.onchange = async () => {
      const file = input.files?.[0]
      document.body.removeChild(input)
      if (!file) return

      try {
        await ElMessageBox.confirm(
          '恢复备份会覆盖当前所有数据，确定继续吗？',
          '确认恢复',
          {
            type: 'warning',
            confirmButtonText: '确认恢复',
            cancelButtonText: '取消',
          }
        )
        const text = await file.text()
        const msg = applyImport(text)
        ElMessage.success(msg)
      } catch (e) {
        if (e === 'cancel' || (e as any)?.action === 'cancel') return
        ElMessage.error(
          (e as Error)?.message === 'format'
            ? '文件格式不正确'
            : 'JSON 解析失败，文件可能已损坏'
        )
      }
    }

    input.click()
  }

  const sortedPets = computed(() => pets.value)

  return {
    pets: sortedPets,
    weights,
    vaccines,
    logs,
    addPet,
    updatePet,
    deletePet,
    getPetById,
    getWeightsByPetId,
    addWeight,
    getVaccinesByPetId,
    addVaccine,
    deleteVaccine,
    getLogsByPetId,
    getLogsByDate,
    getLogsByDateRange,
    addLog,
    deleteLog,
    hasLogsOnDate,
    calculateAge,
    exportData,
    importData,
  }
}
