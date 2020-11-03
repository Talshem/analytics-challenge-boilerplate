import React, { useState, useEffect } from 'react'
import {
    PieChart, Pie, Sector, Cell,
  } from 'recharts';

interface Props {
events: any[]
}
const SessionHours: React.FC<Props> = ({ events }) => {
const [chartData, setChartData] = useState([])

    return (
        <PieChart width={400} height={400}>
        <Pie data={events} dataKey="value" cx={200} cy={200} outerRadius={60} fill="#8884d8" />
        <Pie data={events} dataKey="value" cx={200} cy={200} innerRadius={70} outerRadius={90} fill="#82ca9d" label />
      </PieChart>
    )
}

export default SessionHours
