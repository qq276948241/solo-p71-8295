import { ref, computed, watch } from 'vue'
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
  }
}
