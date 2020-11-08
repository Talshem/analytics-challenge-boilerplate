import React, { useState, useEffect } from 'react'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  } from 'recharts';
import { httpClient } from "../utils/asyncUtils";
import TextField from '@material-ui/core/TextField';

const SessionDays: React.FC = () => {
const [events, setEvents] = useState([])
const [dateFrom, setDateFrom] = useState('2020-10-24')
const [dateTo, setDateTo] = useState('2020-10-25')

useEffect(() => {
const fetchData = async () => {
  const { data } = await httpClient.get(`http://localhost:3001/events/by-hours/0`)
  let from = data.find((object: any) =>
  Number(object.date.split('-')[0]) === Number(dateFrom.substr(0,4)) &&
  Number(object.date.split('-')[1]) === Number(dateFrom.substr(5,2)) &&
  Number(object.date.split('-')[2].split(',')[0]) === Number(dateFrom.substr(8,2)))

  let to = data.find((object: any) =>
  Number(object.date.split('-')[0]) === Number(dateTo.substr(0,4)) &&
  Number(object.date.split('-')[1]) === Number(dateTo.substr(5,2)) &&
  Number(object.date.split('-')[2].split(',')[0]) === Number(dateTo.substr(8,2)))

  setEvents(
  data.slice(data.indexOf(from), data.indexOf(to)))
}; fetchData();
}, [dateFrom, dateTo])

    return (
      <>
      <h1>Sessions (Hours)</h1>
       <TextField style={{marginLeft:'25px', marginRight:'50px'}} label='From' type='date' value={dateFrom} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDateFrom(event.target.value)}/>
        <TextField label='To' type='date' value={dateTo} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDateTo(event.target.value)}/>
        <LineChart
        width={600}
        height={350}
        data={events}

      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tickFormatter={val => val.split(', ')[1]}/>
        <YAxis />
        <Tooltip />
        <Legend />
        <Line strokeWidth={3} type="monotone" dataKey="sessions" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </>
    )
}

export default SessionDays
