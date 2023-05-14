import { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowsProp, useGridApiRef } from '@mui/x-data-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomUpdatedDate,
} from '@mui/x-data-grid-generator';
import { typesArray } from '../../types/schema';
import { getSchema, updateSchema } from '../../api/useRequest';
import { Schema } from '../../types/schema';
import { Button, IconButton, Snackbar } from '@mui/material';
import { GridTreeNodeWithRender } from '@mui/x-data-grid';

export default function EditableTable() {
  const [schema, setSchema] = useState<Schema | null>(null)
  const [openSnack, setOpenSnack] = useState(false)

  const apiGrid = useGridApiRef()

  useEffect(() => {
    getSchema().then((data) => setSchema(data.report))
  }, [])

  const save = async (): Promise<void> => {
    const arr: any = [...Array.from(apiGrid.current.getRowModels().values()).filter(item => item.title && item.type)]
    setSchema(arr)
    console.log(arr)
    await updateSchema(arr)
    setOpenSnack(true)
  }

  const remove = (pr: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => {
    if(schema){
      setSchema([...schema.filter(item => item.id !== pr.id)])
    }
  }

  const addField = () => {
    if(schema){
      setSchema([...schema, {
        "id": 'null',
        "title": '',
        "type": "string",
        "value": ""
      }])
    }
  }

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Название', width: 300, editable: true, },
    {
      field: 'type',
      headerName: 'Type',
      type: 'singleSelect',
      valueOptions: typesArray,
      width: 220,
      editable: true,
    },
    {
      field: 'remove',
      headerName: 'remove',
      width: 200,
      renderCell: (props) => (
        <Button
          style={{ width: 200, margin: 8 }}
          variant="outlined"
          color="error"
          onClick={() => remove(props)}
        >Удалить</Button>
      )
    }
  ];

  return (
    <div style={{ width: '100%' }}>
      {
        schema && (
          <DataGrid
            apiRef={apiGrid}
            rows={schema}
            columns={columns}
            slots={{
              toolbar: (props) => (
                <div style={{ display: 'flex', }}>
                  <Button
                    style={{ width: 150, margin: 8 }}
                    onClick={save}
                    variant="outlined"
                  >Сохранить</Button>
                  <Button
                    style={{ width: 200, margin: 8, marginLeft: 16 }}
                    onClick={addField}
                    variant="outlined"
                  >Добавить поле +</Button>
                </div>
              ),
            }}
          />
        )
      }
      <Snackbar
        open={openSnack}
        autoHideDuration={3000}
        onClose={() => setOpenSnack(false)}
        message="Сохранено"
      />
    </div>
  );
}