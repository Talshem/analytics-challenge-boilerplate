import React, { useState, useEffect } from 'react'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  } from 'recharts';
import { httpClient } from "../utils/asyncUtils";
import { Table, TableRow, TableData, TableHeader } from "../Styles/Styles"

const RetentionCohort: React.FC = () => {
const [events, setEvents] = useState<any[]>([])
const [users, setUsers] = useState<number>(0)
const [dayZero, setDayZero] = useState(1599177600000)

useEffect(() => {
const fetchData = async () => {
const { data } = await httpClient.get(`http://localhost:3001/events/retention?dayZero=${dayZero}`)
setEvents(data.events)
setUsers(data.users)
}; fetchData();
}, [dayZero]);


    return (
      <>
       <input type='date' value={new Date(dayZero).toISOString().substr(0, 10)} onChange={(event) => setDayZero(Date.parse(event.target.value))}/>

       <Table>
        <TableRow>
            <TableHeader></TableHeader>
            <TableHeader>Week 0</TableHeader>
{events.map(e => <TableHeader>{e.week}</TableHeader>)}
        </TableRow>

        <TableRow>
<TableData>All Users <br/> {users} users </TableData>
<TableData> 100.00% </TableData>
{events.map(e => <TableData>{(e.activeUsers.length / users * 100).toFixed(2)}%</TableData>)}
        </TableRow>

{events.map(e => { return (
    <TableRow>
<TableData>{new Date(e.from).toDateString().split(' ').slice(1).join(' ')} - {new Date(e.to).toDateString().split(' ').slice(1).join(' ')} <br/> {e.signedUsers.length} users</TableData>
<TableData>100.00%</TableData>
{e.retention.map((e: number) => <TableData>{e.toFixed(2)}%</TableData>)}
</TableRow>
)})}

       </Table>
    </>
    )
}

export default RetentionCohort
