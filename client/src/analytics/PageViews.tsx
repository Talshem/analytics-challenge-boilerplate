import React, { useState, useEffect } from 'react'
import {
    BarChart, XAxis, YAxis, Bar, Tooltip, Legend, Cell
  } from 'recharts';
import { httpClient } from "../utils/asyncUtils";

const colors = ['#26C6DA', '#81C784', '#FBC02D ', '#FF8A65']

const PageViews: React.FC = () => {
const [events, setEvents] = useState([])
const [date, setDate] = useState<number>(1601543622678)

useEffect(() => {
const fetchData = async () => {
  const { data } = await httpClient.get(`http://localhost:3001/events/chart/pageview/${date}`)
  setEvents(data)
}; fetchData();
}, [date])


    return (
        <>
<h1>Page Views</h1>
<BarChart width={600} height={380} data={events}>
  <XAxis tickFormatter={val => `${val[0].toUpperCase()}${val.substr(1,val.length)}`} dataKey="page" />
  <YAxis tickFormatter={val => `${val} sec`}/>
  <Tooltip />
  <Bar dataKey="views" fill="#8884d8" />
</BarChart>
</>
    )
}

export default PageViews
