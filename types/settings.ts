export interface Settings {
  rows: number
  columns: number
  avoidSameSeat: boolean
  avoidSamePartner: boolean
  avoidBackRow: boolean
}

export const defaultSettings: Settings = {
  rows: 8,
  columns: 4,
  avoidSameSeat: true,
  avoidSamePartner: true,
  avoidBackRow: true,
}