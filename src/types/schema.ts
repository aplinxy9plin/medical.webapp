export type Schema = {
  title: string
  value: string | number | Date | boolean
  type: AvailableTypes
  id: string
}[]

export type AvailableTypes = 'string' | 'int' | 'double' | 'date' | 'boolean'

export const typesArray = ['string', 'int', 'double', 'date', 'boolean']