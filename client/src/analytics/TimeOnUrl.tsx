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
const [chartData, setChartData] = useState(events)

    return (
         <BarChart
        width={500}
        height={300}
        data={events}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="userFullName" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="url" fill="#8884d8" />
        <Bar dataKey="admin" fill="#8884d8" />
        <Bar dataKey="login" fill="red" />
      </BarChart>
    )
}

export default TimeOnUrl
