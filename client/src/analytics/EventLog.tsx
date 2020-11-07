import React, { useState, useEffect } from 'react'
import { Event } from '../models/event'
import { httpClient } from "../utils/asyncUtils";
import InfiniteScroll from 'react-infinite-scroll-component';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    maxWidth: 100,
  },
  eventLog: {
   border: '1px solid #c1c1c1',
   marginBottom: '2px',
   borderRadius: '3px',
   padding: '10px',
   textAlign:'left',
   width: '100%'
  }
}));


const EventLog: React.FC = () => {
const [events, setEvents] = useState([])
const [type, setType] = useState<'pageView'|'login'|'signup'>('pageView')
const [sort, setSort] = useState<'asc'|'desc'>('asc')
const [browser, setBrowser] = useState<'ie'|'edge'|'firefox'|'safari'|'chrome'|'other'>('ie')
const [page, setPage] = useState<number>(10)
const classes = useStyles();
const [search, setSearh] = useState<string>('')



useEffect(() => {
const fetchData = async () => {
  let { data } = await httpClient.get(`http://localhost:3001/events/all`)
if (sort === 'desc') data = data.reverse()
data = data.filter((event: any) => event.eventName === type && event.browser === browser)
if (search !== '') data = data.filter((event: any) => event.userFullName.toUpperCase().includes(search.toUpperCase()))
setEvents(data)
}; fetchData();
}, [type, browser, sort, search])
    

    return (
      <>
      <h1>Events Log</h1>
        <div style={{display:'flex'}}>
         <div style={{flex:'1'}}>
       <TextField label="Search" variant="standard" size='small' className={classes.formControl} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearh(event.target.value as string)}/>
<br/><br/>
        <FormControl size="small" variant="outlined" className={classes.formControl}>
        <InputLabel id="demo-simple-select-outlined-label">Sort</InputLabel>
        <Select label="Sort"onChange={(event) => setSort(event.target.value as 'asc'|'desc')} value={sort}>
        <MenuItem value='asc'> Newest</MenuItem>
        <MenuItem value='desc'> Oldest</MenuItem>
        </Select>
        </FormControl>
<br/>
        <FormControl size="small" variant="outlined" className={classes.formControl}>
        <InputLabel id="demo-simple-select-outlined-label">Type</InputLabel>
        <Select label="Type" onChange={(event) => setType(event.target.value as 'pageView'|'login'|'signup')} value={type}>
        <MenuItem value='pageView'> Page views</MenuItem>
        <MenuItem value='login'> Login</MenuItem>
        <MenuItem value='signup'> Register</MenuItem>
        </Select>
         </FormControl>
<br/>
        <FormControl size="small" variant="outlined" className={classes.formControl}>
        <InputLabel id="demo-simple-select-outlined-label">Browser</InputLabel>
        <Select label="Browser" onChange={(event) => setBrowser(event.target.value as 'ie'|'edge'|'firefox'|'safari'|'chrome'|'other')} value={browser}>
        <MenuItem value='ie'> Explorer </MenuItem>
        <MenuItem value='edge'> Edge</MenuItem>
        <MenuItem value='firefox'> Firefox</MenuItem>
        <MenuItem value='safari'> Safari</MenuItem>
        <MenuItem value='chrome'> Chrome</MenuItem>
        <MenuItem value='other'> Other</MenuItem>
        </Select>
         </FormControl>

        </div>
        <div  style={{height:'90%', overflow:'hidden', flex:'3', marginTop:'5px'}}>
        <InfiniteScroll
        dataLength={page}
        next={() => setTimeout(() => {
        setPage(page => page + 5)    
        }, 500)}
        hasMore={events.length >= page}
        height={390}
        loader={(<p style={{color:'black'}}>Loading...</p>)}>
{events.slice(0, page).map((e : any, index: number) =>
<div className={classes.eventLog} key={index}> &#x25cf; <strong>{e.userFullName}</strong> - {new Date(e.date.from).toISOString().replace('T',', ').substr(0, 20)}</div>)}
        </InfiniteScroll>
        </div>
        </div>
        </>
    )
}

export default React.memo(EventLog)
