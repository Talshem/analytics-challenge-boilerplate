import React, { useState, useEffect } from 'react'
import {
    PieChart, Pie, Sector, Cell, Tooltip, Legend
  } from 'recharts';
import { httpClient } from "../utils/asyncUtils";

const colors = ['red', 'blue', 'yellow', 'green']

const SessionHours: React.FC = () => {
const [events, setEvents] = useState([])
const [date, setDate] = useState<number>(1601543622678)
const [users, setUsers] = useState([])

useEffect(() => {
const fetchData = async () => {
  const { data } = await httpClient.get(`http://localhost:3001/events/chart/pageview/${date}`)
  setEvents(data.events)
  setUsers(data.users)
}; fetchData();
}, [date])

console.log(events, users)


    return (
        <PieChart width={550} height={400}>
        <Pie data={events} dataKey="sessions" nameKey="page" cx="50%" cy="50%" outerRadius={150} label>
         {
      events.map((entry, index) => (
        <Cell key={index} fill={colors[index]}/>
      ))
    }    
    </Pie>
              <Tooltip />
              <Legend />
      </PieChart>
    )
}

export default SessionHours
