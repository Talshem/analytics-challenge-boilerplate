import React, { useState, useEffect } from 'react'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  } from 'recharts';
import { httpClient } from "../utils/asyncUtils";
import TextField from '@material-ui/core/TextField';


const SessionDays: React.FC = () => {
const [events, setEvents] = useState([])
const [date, setDate] = useState('2020-10-01')

useEffect(() => {
const fetchData = async () => {
  const { data } = await httpClient.get(`http://localhost:3001/events/by-days/0`)
  let day = data.find((object: any) =>
  Number(object.date.split('-')[0]) === Number(date.substr(0,4)) &&
  Number(object.date.split('-')[1]) === Number(date.substr(5,2)) &&
  Number(object.date.split('-')[2]) === Number(date.substr(8,2)))

  setEvents(
  data.slice(data.indexOf(day), data.indexOf(day) + 7))
}; fetchData();
}, [date])


    return (
      <>
      <h1>Session (Days)</h1>
      <TextField label='Date' type='date' value={date} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDate(event.target.value)}/>
        <LineChart
        width={600}
        height={350}
        data={events}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line strokeWidth={3} type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
      </>
    )
}

export default SessionDays
