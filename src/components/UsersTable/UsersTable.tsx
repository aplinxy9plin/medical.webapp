import { useState, useEffect } from 'react'
import { getAllUsers, getFullSchema } from '../../api/useRequest';
import { Schema } from '../../types/schema';
import { DataGrid } from '@mui/x-data-grid';

const UsersTable = () => {
  const [users, setUsers] = useState(null)
  const [schema, setSchema] = useState<Schema | null>(null)

  useEffect(() => {
    getFullSchema().then((gotSchema) => {
      setSchema(gotSchema)
      const tmpUsers: any = [];
      // const tmpSchema = Object.assign({}, ...gotSchema.map((x) => ({[x.id]: {
      //   ...x,
      // }})));
      getAllUsers().then((data) => {
        // setUsers()
        data.forEach((item) => {
          const tmpObject: any = {
            // ...tmpSchema,
            ...item,
          }
          for (let i = 0; i < gotSchema.length; i++) {
            tmpObject[gotSchema[i].id] = item.report.find(item => item.id === gotSchema[i].id)?.value
          }
          tmpObject.id = item._id;
          // for (let i = 0; i < item.report.length; i++) {
          //   tmpObject[item.report[i].id] = item.report[i].value;
          // }
          delete tmpObject.report;
          tmpUsers.push(tmpObject)
        })
        console.log(tmpUsers)
        setUsers(tmpUsers);
        console.log(gotSchema.map((item) => ({
          field: item.id,
          headerName: item.title,
          width: 150,
        })))
      })
    })
  }, [])

  return (
    <div>
      {
        (schema && users) && (
          <DataGrid
            rows={users}
            columns={[
              {
                'field': "email",
                'headerName': 'Почта',
                width: 150,
              },
              {
                'field': "firstName",
                'headerName': 'Имя',
                width: 150,
              },
              {
                'field': "lastName",
                'headerName': 'Фамилия',
                width: 150,
              },
              {
                'field': "middleName",
                'headerName': 'Отчество',
                width: 150,
              },
              {
                'field': "sex",
                'headerName': 'Пол',
                width: 150,
              },
              ...schema.map((item) => ({
                field: item.id,
                headerName: item.title,
                width: 150,
              })),
            ]}
          />
        )
      }
    </div>
  )
}

export default UsersTable