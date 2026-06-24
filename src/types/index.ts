export type Species = 'cat' | 'dog'

export interface Pet {
  id: string
  name: string
  species: Species
  breed: string
  avatar: string
  birthday: string
  currentWeight: number
  lastCheckup: string
}

export interface WeightRecord {
  id: string
  petId: string
  date: string
  weight: number
}

export interface VaccineRecord {
  id: string
  petId: string
  name: string
  date: string
  nextDate: string
}

export type LogType = 'vaccine' | 'deworm' | 'bath' | 'medical' | 'checkup' | 'other'

export interface HealthLog {
  id: string
  petId: string
  type: LogType
  date: string
  title: string
  note: string
}

export const LOG_TYPE_LABEL: Record<LogType, string> = {
  vaccine: '疫苗',
  deworm: '驱虫',
  bath: '洗澡',
  medical: '就医',
  checkup: '体检',
  other: '其他',
}

export const LOG_TYPE_COLOR: Record<LogType, string> = {
  vaccine: '#7FB3D5',
  deworm: '#68B684',
  bath: '#FFAF75',
  medical: '#E57373',
  checkup: '#B39DDB',
  other: '#90A4AE',
}

export const LOG_TYPE_EMOJI: Record<LogType, string> = {
  vaccine: '💉',
  deworm: '🐛',
  bath: '🛁',
  medical: '🏥',
  checkup: '🩺',
  other: '📝',
}
