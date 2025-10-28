export interface Settings {
  rows: number
  columns: number
  avoidSameSeat: boolean
  avoidSamePartner: boolean
  avoidBackRow: boolean
}

export const defaultSettings: Settings = {
  rows: 4,
  columns: 8,
  avoidSameSeat: true,
  avoidSamePartner: true,
  avoidBackRow: true,
}