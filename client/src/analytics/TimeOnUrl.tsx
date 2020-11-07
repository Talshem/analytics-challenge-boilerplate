import React, { useState, useEffect } from 'react'
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { httpClient } from "../utils/asyncUtils";
import { Event } from '../models/event'
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  dateInput: {
  margin: theme.spacing(1),
  marginRight: '550px',
  },
  textField: {
  marginTop:'16px',

  }
  }));


const TimeOnUrl: React.FC = () => {
const [events, setEvents] = useState<any[]>([])
const [date, setDate] = useState<number>(1601543622678)
const [search, setSearh] = useState<string>('')
const classes = useStyles();


useEffect(() => {
const fetchData = async () => {
  let { data } = await httpClient.get(`http://localhost:3001/events/chart/timeonurl/${date}`)
  setEvents(data)
}; fetchData();
}, [date])



    return (
      <>
      <h1>Time On URL (Seconds)</h1>
      <TextField className={classes.textField} size='small' onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearh(event.target.value as string)} id="outlined-basic" label="Search" variant="outlined" />

      <TextField
       label="Date"
       type='date' 
       className={classes.dateInput}
       value={new Date(date).toISOString().substr(0, 10)}
       onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDate(Date.parse(event.target.value))}
       />
         <BarChart
        width={1250}
        height={330}
        data={search === '' ? events.slice(0, 8) : events.filter(item => item.userFullName.toUpperCase().includes(search.toUpperCase())).slice(0, 8)}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="userFullName" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="home" fill="#FBC02D"/>
        <Bar dataKey="admin" fill="#26C6DA" />
        <Bar dataKey="login" fill="#FF8A65" />
      </BarChart>
      </>
    )
      }

export default TimeOnUrl;
