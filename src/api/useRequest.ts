import { Schema } from "../types/schema"
import { User } from "../types/user"

type UploadType = {
  users: {
    email: string,
    firstName: string,
    lastName: string,
    middleName: string,
    sex: string,
    birthdate: Date | string,
    report: Schema,
    reportVersion: number
  }[]
}

const url = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const getSchema = async () => {
  const data: { report: Schema, reportVersion: number } = (await (await fetch(`${url}/reports/get`)).json())
  return data;
}

export const getFullSchema = async () => {
  const data: Schema = (await (await fetch(`${url}/reports/fullSchema`)).json())
  return data;
}

export const getAllUsers = async () => {
  const data: User[] = (await (await fetch(`${url}/auth/get`)).json())
  return data;
}

export const autocomplete = async (value: string) => {
  if(value){
    const data = (await (await fetch(`${url}/reports/autoComplete?value=${value}`)).text())
    console.log(data)
    return data;
  }
  return null;
}

export const updateSchema = async (newSchema: Schema) => {
  const data = (await (await fetch(`${url}/reports/updateSchema`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ report:  newSchema })
  })).json())
  return data
}

export const uploadUser = async (uploadData: UploadType) => {
  const data = (await (await fetch(`${url}/auth/upload`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(uploadData)
  })).json())
  return data
}
