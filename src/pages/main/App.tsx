/* eslint-disable no-fallthrough */
import { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField';
import { Schema } from '../../types/schema';
import { Box, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, FormGroup, Typography, Button } from '@mui/material';
import { DateField } from '@mui/x-date-pickers/DateField';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { autocomplete, getSchema, uploadUser } from '../../api/useRequest';
import AutoCompleteCustom from '../../components/AutoCompleteCustom/AutoCompleteCustom';

function App() {
  const [defaultFields, setDefaultFields] = useState({
    email: '',
    firstName: '',
    lastName: '',
    middleName: '',
    sex: '',
    birthdate: new Date(),
  })
  const [schema, setSchema] = useState<Schema | null>(null)
  const [reportVersion, setReportVersion] = useState(1);
  const [predicts, setPredicts] = useState<{ id: string, predict: string[] }[]>([])

  useEffect(() => {
    getSchema().then((data) => {setSchema(data.report); setReportVersion(data.reportVersion)})
  }, [])
  
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDefaultFields({...defaultFields, [e.currentTarget.name]: e.currentTarget.value});
  }

  const onChangeBySchema = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if(schema){
      console.log(e.currentTarget.name, e.currentTarget.value)
      setSchema([...schema.map((item) => {
        if(item.id === e.currentTarget.name){
          console.log(item, item.type, e.currentTarget.value)
          switch (item.type) {
            case "boolean":
              item.value = e.currentTarget.value === "true"
              break
            case "string":
              item.value = e.currentTarget.value
              break
            case "double":
              item.value = parseFloat(e.currentTarget.value)
              break
            case "int":
              item.value = parseInt(e.currentTarget.value, 10)
              break
            default:
          }
        }
        return item
      })])
    }
  }

  const onChangeDateBySchema = (e: Date, id: string) => {
    if(schema){
      setSchema([...schema.map((item) => {
        if(item.id === id){
          item.value = e.toString()
        }
        return item
      })])
    }
  }

  const upload = async () => {
    if(schema){
      uploadUser({
        users: [
          {
            ...defaultFields,
            report: schema,
            reportVersion,
          }
        ]
      }).then((data) => {
        if(data){
          alert('Успешно!')
          window.location.reload()
        }
      })
    }
  }

  const onBlur = async () => {
    if(schema){
      for (let i = 0; i < schema.length; i++) {
        console.log(schema.filter(item => item.value).length)
        if(!schema[i].value && schema.filter(item => item.value).length > 2){
          let condition = ''
          let requestString = ''
          let str: string | null = ''
          switch (schema[i].type) {
            case 'string':
              condition = schema.filter(item => item.value).map(item => `учитывая, что ${item.title} это ${item.value}`.toLowerCase()).join(' и ')
              requestString = `Это медицинская анкета, представь, что ты врач. Назови 5 возможных ${schema[i].title} ` +
              condition + ' ' +
              '.\nНапиши названия без вступления, пояснений, переноса строк, пример: answer1, answer2. Ответы в одну строку через запятую.'
              console.log(requestString)
              // eslint-disable-next-line no-case-declarations
              str = await autocomplete(requestString)
              console.log(str);
              try {
                if(
                  str &&
                  str?.toLowerCase().indexOf('сожалению') === -1 &&
                  str?.toLowerCase().indexOf('answer') === -1
                ){
                  const prediction = str?.split(',')
                  if(prediction){
                    setPredicts([...predicts, {
                      id: schema[i].id,
                      predict: prediction
                    }])
                  }
                }
              } catch (error) {
                console.log('bad ')
              }
              // console.log()
              break;
            // case 'int':
            //   condition = schema.filter(item => item.value).map(item => `учитывая, что ${item.title} это ${item.value}`.toLowerCase()).join(' и ')
            //   requestString = `Это медицинская анкета, представь, что ты врач. Назови 5 возможных вариантов ${schema[i].title} ` +
            //   condition + ' ' +
            //   '.\nНапиши названия без вступления, пояснений, ответы в одну строку через запятую, ответы на русском языке. пример: answer1, answer2.'
            //   console.log(requestString)
            //   console.log(await autocomplete(requestString))
            //   break;
          
            default:
              break;
          }
        }
      }
      // Назови 5 
    }
  }

  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
      style={{ maxWidth: 1280, margin: 0 }}
    >
      <FormGroup>
        {/* <AutoCompleteCustom /> */}
        <Typography variant="h1">Анкета</Typography>
        <TextField name="email" onChange={onChange} style={{ marginBottom: 16 }} id="outlined-basic" label="Email" variant="outlined" />
        <TextField name="firstName" onChange={onChange} style={{ marginBottom: 16 }} id="outlined-basic" label="Имя" variant="outlined" />
        <TextField name="lastName" onChange={onChange} style={{ marginBottom: 16 }} id="outlined-basic" label="Фамилия" variant="outlined" />
        <TextField name="middleName" onChange={onChange} style={{ marginBottom: 16 }} id="outlined-basic" label="Отчество" variant="outlined" />
        <FormControl style={{ marginBottom: 16 }}>
          <FormLabel id="sex">Пол</FormLabel>
          <RadioGroup
            aria-labelledby="sex"
            defaultValue="female"
            name="sex"
            onChange={onChange}
          >
            <FormControlLabel value="male" control={<Radio />} label="Мужчина" />
            <FormControlLabel value="female" control={<Radio />} label="Женщина" />
          </RadioGroup>
          <LocalizationProvider dateAdapter={AdapterLuxon}>
            {/* <DemoContainer components={['DatePicker']}> */}
              <DateField name="birthdate" onChange={(e: any) => setDefaultFields({...defaultFields, birthdate: new Date(e)})} label="Дата рождения" />
            {/* </DemoContainer> */}
          </LocalizationProvider>
        </FormControl>
        {
          schema && (
            schema.map((item) => {
              switch (item.type) {
                case 'string':
                  return <AutoCompleteCustom predict={predicts.find((predict) => predict.id === item.id)?.predict} onBlur={onBlur} onChange={onChangeBySchema} name={item.id} style={{ marginBottom: 16 }} key={item.id} id="outlined-basic" label={item.title} variant="outlined" />
                case 'double':
                  return <TextField onBlur={onBlur} onChange={onChangeBySchema} name={item.id} style={{ marginBottom: 16 }} key={item.id} type="number" id="outlined-basic" label={item.title} variant="outlined" />
                case 'date':
                  return (
                    <LocalizationProvider key={item.id} dateAdapter={AdapterLuxon}>
                      {/* <DemoContainer components={['DatePicker']}> */}
                        <DateField onBlur={onBlur} onChange={(e: any) => onChangeDateBySchema(new Date(e), item.id)} label={item.title} />
                      {/* </DemoContainer> */}
                    </LocalizationProvider>
                  )
                case 'boolean':
                  return (
                    <FormControl style={{ marginBottom: 16 }} key={item.id}>
                      <FormLabel id="demo-radio-buttons-group-label">{item.title}</FormLabel>
                      <RadioGroup
                        onBlur={onBlur}
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="female"
                        name={item.id}
                        onChange={onChangeBySchema}
                      >
                        <FormControlLabel value="true" control={<Radio />} label="Да" />
                        <FormControlLabel value="false" control={<Radio />} label="Нет" />
                      </RadioGroup>
                    </FormControl>
                  )
                case 'int':
                  // TODO: change int type
                  return <TextField name={item.id} onBlur={onBlur} onChange={onChangeBySchema} style={{ marginBottom: 16 }} key={item.id} type="number" id="outlined-basic" label={item.title} variant="outlined" />
                
                default:
                  break;
              }
              return null
            })
          )
        }
        <Button onClick={upload} variant="contained">Отправить</Button>
        {/* <Button onClick={() => autocomplete('Напиши 5 случайных слов через запятую')} variant="contained">Autocomplete</Button> */}
      </FormGroup>
    </Box>
  )
}

export default App
