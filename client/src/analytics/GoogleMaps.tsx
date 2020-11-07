import React, { useState, useEffect } from 'react'
import { GoogleMap, LoadScript, Marker  } from '@react-google-maps/api';
import { Event } from '../models/event'
import { httpClient } from "../utils/asyncUtils";
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    maxWidth: 100,
    position:'static',
    marginLeft:'-982px',
    marginTop:'-48px'
  }
  }));

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRight: '2px solid #c1c1c1'
};
 
const center = {
  lat: 	31.771959,
  lng: 35.217018
};

const GoogleMaps: React.FC = () => {
const [map, setMap] = useState(null)
const [events, setEvents] = useState([])
const [time, setTime] = useState<'week'|'today'|'all'>('all')
const classes = useStyles();

useEffect(() => {
const fetchData = async () => {
  const { data } = await httpClient.get(`http://localhost:3001/events/${time}`)
  setEvents(data)
}; fetchData();
}, [time])

    return (
  <> 
      <LoadScript 
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_KEY as string}>
     <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={1}
      >
    {events && events.map((e: Event, index: number ) => {
return (
<Marker
key={index}
position={e.geolocation.location}
/>
)})}
      </GoogleMap>
      </LoadScript>

 <FormControl  className={classes.formControl}>
<InputLabel id="demo-simple-select-label">Since</InputLabel>
<Select style={{background:'white'}} label='Since' value={time} onChange={(event) => setTime(event.target.value as 'week'|'today'|'all')}>
<MenuItem value='week'>Last Week</MenuItem>
<MenuItem value='today'>Last Day</MenuItem>
<MenuItem value='all'>All Time</MenuItem>
</Select>
</FormControl>

</>
    )
}

export default React.memo(GoogleMaps)
