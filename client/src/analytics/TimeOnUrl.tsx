import React, { useState, useEffect } from 'react'
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { httpClient } from "../utils/asyncUtils";
import { Event } from '../models/event'

interface Props {
events: any
}


const TimeOnUrl: React.FC<Props> = ({ events }) => {
const [chartData, setChartData] = useState([])


  useEffect(() => {
  const fetchData = async () => {
  let array = [];
      for ( let event of events){
      const { data } = await httpClient.get(`http://localhost:3001/users/${event.distinct_user_id}`)
      }
      setChartData(data)
    }; fetchData()
  }, []);

    return (
         <BarChart
        width={500}
        height={300}
        data={chartData}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="fullname" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="contacts" fill="#8884d8" />
        <Bar dataKey="notifications" fill="#8884d8" />
        <Bar dataKey="bankaccounts" fill="#8884d8" />
        <Bar dataKey="home" fill="#82ca9d" />
      </BarChart>
    )
}

export default TimeOnUrl
