import React, { useState, useEffect } from 'react'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  } from 'recharts';
import { httpClient } from "../utils/asyncUtils";
import { Event } from '../models/event'
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  dateInput: {
  margin: theme.spacing(1),
  },
  textField: {
  float: 'left',
  marginLeft:'50px',
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
  let { data } = await httpClient.get(`http://localhost:3001/events/chart/os/${date}`)
  setEvents(data)
}; fetchData();
}, [date])

    return (
      <>
      <h1>Users Activity</h1>
      <TextField className={classes.textField} size='small' onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearh(event.target.value as string)} id="outlined-basic" label="Search" variant="outlined" />

      <TextField
       label="Date"
       type='date' 
       className={classes.dateInput}
       value={new Date(date).toISOString().substr(0, 10)}
       onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDate(Date.parse(event.target.value))}
       />
        <LineChart
        width={500}
        height={290}
        data={events[events.indexOf(events.find((item => item.userFullName.toUpperCase().includes(search.toUpperCase()))))] && events[events.indexOf(events.find((item => item.userFullName.toUpperCase().includes(search.toUpperCase()))))].views}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Line strokeWidth={3} type="monotone" name="Sign Up" dataKey="visits.signup" stroke="#26C6DA" activeDot={{ r: 8 }} />
        <Line strokeWidth={3} type="monotone" name="Home" dataKey="visits.home" stroke="#81C784" activeDot={{ r: 8 }} />
        <Line strokeWidth={3} type="monotone" name="Login" dataKey="visits.login" stroke="#FBC02D" activeDot={{ r: 8 }} />
        <Line strokeWidth={3} type="monotone" name="Admin" dataKey="visits.admin" stroke="#FF8A65" activeDot={{ r: 8 }} />
      </LineChart>
       <strong style={{fontSize:'30px'}}>{events[events.indexOf(events.find((item => item.userFullName.toUpperCase().includes(search.toUpperCase()))))] && events[events.indexOf(events.find((item => item.userFullName.toUpperCase().includes(search.toUpperCase()))))].userFullName}</strong>
      </>
    )
      }


export default TimeOnUrl;
