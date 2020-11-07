import React, { useState, useEffect } from 'react'
import {
    PieChart, Pie, Sector, Cell, Tooltip, Legend
  } from 'recharts';
import { httpClient } from "../utils/asyncUtils";

const colors = ['#26C6DA', '#81C784', '#FBC02D ', '#FF8A65']

const TimeAverage: React.FC = () => {
const [events, setEvents] = useState([])
const [date, setDate] = useState<number>(1601543622678)

useEffect(() => {
const fetchData = async () => {
  const { data } = await httpClient.get(`http://localhost:3001/events/chart/timeaverage/${date}`)
  setEvents(data)
}; fetchData();
}, [date])

    return (
      <>
      <h1>All Users Time on URL Average (Hours)</h1>
        <PieChart width={600} height={400}>
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
      </>
    )
}

export default TimeAverage
