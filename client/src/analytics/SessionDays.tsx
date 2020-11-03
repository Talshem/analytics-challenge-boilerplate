import React, { useState, useEffect } from 'react'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  } from 'recharts';

interface Props {
events: any[]
}

const SessionDays: React.FC<Props> = ({ events }) => {
const [chartData, setChartData] = useState([])

    return (
        <LineChart
        width={500}
        height={300}
        data={events}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
      </LineChart>
    )
}

export default SessionDays
