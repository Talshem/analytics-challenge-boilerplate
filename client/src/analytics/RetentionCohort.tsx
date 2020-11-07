import React, { useState, useEffect } from 'react'
import { httpClient } from "../utils/asyncUtils";
import { Table, TableRow, TableData, TableHeader } from "../Styles/Styles"
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  dateInput: {
    margin: theme.spacing(1),
    position:'static',
    float:'right',
    marginRight:'50px',
    transform: 'scale(1.5)',
    marginTop:'-70px',
  }
  }));

const RetentionCohort: React.FC = () => {
const [events, setEvents] = useState<any[]>([])
const [users, setUsers] = useState<number>(0)
const [dayZero, setDayZero] = useState(1601543622678)
const classes = useStyles();

useEffect(() => {
const fetchData = async () => {
const { data } = await httpClient.get(`http://localhost:3001/events/retention?dayZero=${dayZero}`)
setEvents(data.events)
setUsers(data.users)
}; fetchData();
}, [dayZero]);


    return (
      <>
      <h1>Retention Data</h1>
       <Table>
           <tbody>
        <TableRow>
            <TableHeader></TableHeader>
            <TableHeader>Week 0</TableHeader>
{events.map((e, index) => < TableHeader key={index}>{e.week}</TableHeader>)}
        </TableRow>

        <TableRow>
<TableData> <strong>All Users</strong> <br/> <span style={{color:'grey'}}> {users} users </span> </TableData>
<TableData style={{background:'#f0f0f0'}}> 100.00% </TableData>
{events.map((e, index) => <TableData key={index} retention={(e.activeUsers.length / users * 100)}>{(e.activeUsers.length / users * 100).toFixed(2)}%</TableData>)}
        </TableRow>

{events.map((e, index) => { return (
<TableRow key={index}>
<TableData>{new Date(e.from).toDateString().split(' ').slice(1).join(' ')} - {new Date(e.to).toDateString().split(' ').slice(1).join(' ')} <br/> <span style={{color:'grey'}}> {e.signedUsers.length} users </span></TableData>
<TableData style={{background:'#f0f0f0'}}>100.00%</TableData>
{e.retention.map((e: number, index: number) => <TableData key={index} retention={e}>{e.toFixed(2)}%</TableData>)}
</TableRow>
)})}
</tbody>
       </Table>
              <TextField
       label="Date"
       type='date' 
       className={classes.dateInput}
       value={new Date(dayZero).toISOString().substr(0, 10)}
       onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDayZero(Date.parse(event.target.value))}
       />
    </>
    )
}

export default RetentionCohort
