import { useEffect } from 'react'
import EditableTable from '../../components/EditableTable/EditableTable'
import UsersTable from '../../components/UsersTable/UsersTable'
import { Typography } from '@mui/material'

const Admin = () => {

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: 32 }}>
        <Typography variant="h3">Текущие вопросы анкеты</Typography>
        <EditableTable />
      </div>
      <Typography variant="h3">Пользователи</Typography>
      <UsersTable />
    </div>
  )
}

export default Admin