import type { Pet, WeightRecord, VaccineRecord, HealthLog } from '@/types'

export function getMockPets(): Pet[] {
  return [
    {
      id: 'pet-001',
      name: '豆豆',
      species: 'cat',
      breed: '英国短毛猫',
      avatar: '🐱',
      birthday: '2022-05-15',
      currentWeight: 4.8,
      lastCheckup: '2026-05-10',
    },
    {
      id: 'pet-002',
      name: '旺财',
      species: 'dog',
      breed: '柴犬',
      avatar: '🐕',
      birthday: '2021-08-20',
      currentWeight: 9.2,
      lastCheckup: '2026-04-22',
    },
  ]
}

export function getMockWeights(): WeightRecord[] {
  const now = new Date()
  const months = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 15)
    months.push(d.toISOString().slice(0, 10))
  }
  return [
    { id: 'w-1', petId: 'pet-001', date: months[0], weight: 4.1 },
    { id: 'w-2', petId: 'pet-001', date: months[1], weight: 4.3 },
    { id: 'w-3', petId: 'pet-001', date: months[2], weight: 4.5 },
    { id: 'w-4', petId: 'pet-001', date: months[3], weight: 4.6 },
    { id: 'w-5', petId: 'pet-001', date: months[4], weight: 4.7 },
    { id: 'w-6', petId: 'pet-001', date: months[5], weight: 4.8 },
    { id: 'w-7', petId: 'pet-002', date: months[0], weight: 8.5 },
    { id: 'w-8', petId: 'pet-002', date: months[1], weight: 8.7 },
    { id: 'w-9', petId: 'pet-002', date: months[2], weight: 8.9 },
    { id: 'w-10', petId: 'pet-002', date: months[3], weight: 9.0 },
    { id: 'w-11', petId: 'pet-002', date: months[4], weight: 9.1 },
    { id: 'w-12', petId: 'pet-002', date: months[5], weight: 9.2 },
  ]
}

export function getMockVaccines(): VaccineRecord[] {
  return [
    { id: 'v-1', petId: 'pet-001', name: '猫三联疫苗', date: '2026-03-10', nextDate: '2027-03-10' },
    { id: 'v-2', petId: 'pet-001', name: '狂犬疫苗', date: '2026-03-10', nextDate: '2027-03-10' },
    { id: 'v-3', petId: 'pet-002', name: '六联疫苗', date: '2026-02-15', nextDate: '2027-02-15' },
    { id: 'v-4', petId: 'pet-002', name: '狂犬疫苗', date: '2026-02-15', nextDate: '2027-02-15' },
  ]
}

export function getMockLogs(): HealthLog[] {
  return [
    { id: 'l-1', petId: 'pet-001', type: 'vaccine', date: '2026-03-10', title: '接种猫三联+狂犬疫苗', note: '宠物医院接种，状态良好' },
    { id: 'l-2', petId: 'pet-001', type: 'deworm', date: '2026-06-05', title: '体内外驱虫', note: '拜耳驱虫药' },
    { id: 'l-3', petId: 'pet-001', type: 'bath', date: '2026-06-18', title: '洗澡美容', note: '宠物美容院洗澡+修毛' },
    { id: 'l-4', petId: 'pet-001', type: 'checkup', date: '2026-05-10', title: '年度体检', note: '血常规、生化检查均正常' },
    { id: 'l-5', petId: 'pet-002', type: 'vaccine', date: '2026-02-15', title: '接种六联+狂犬疫苗', note: '社区宠物医院接种' },
    { id: 'l-6', petId: 'pet-002', type: 'deworm', date: '2026-06-10', title: '体内驱虫', note: '按体重给药' },
    { id: 'l-7', petId: 'pet-002', type: 'medical', date: '2026-05-02', title: '皮肤炎就诊', note: '外用药膏，一周后复诊已痊愈' },
    { id: 'l-8', petId: 'pet-002', type: 'checkup', date: '2026-04-22', title: '常规体检', note: '各项指标正常' },
    { id: 'l-9', petId: 'pet-001', type: 'deworm', date: '2026-07-05', title: '下次驱虫', note: '提醒：体外驱虫' },
    { id: 'l-10', petId: 'pet-002', type: 'vaccine', date: '2027-02-15', title: '下次疫苗接种', note: '六联+狂犬疫苗到期' },
  ]
}
