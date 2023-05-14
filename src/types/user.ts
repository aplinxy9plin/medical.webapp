export type User = {
  email: string;
  birthdate: Date
  firstName: string
  lastName: string
  middleName?: string
  sex: string
  report: {
    title: string,
    value: string | number | Date | boolean,
    id: string,
    type: string,
  }[],
  reportVersion: number,
  _id: string
}