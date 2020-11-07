import React, { useState, useEffect } from 'react'
import { GoogleMap, LoadScript, Marker  } from '@react-google-maps/api';
import { Event } from '../models/event'
import { httpClient } from "../utils/asyncUtils";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  dateInput: {
    margin: theme.spacing(1),
    width: 150,
    transform: 'scale(1.5)',
    position:'static',
    marginTop:'-80px'
  }
  }));

const containerStyle = {
  width: '100%',
  height: '84%',
  borderRight: '2px solid #c1c1c1'
};
 
const center = {
  lat: 	31.771959,
  lng: 35.217018
};

const GoogleMaps: React.FC = () => {
const [map, setMap] = useState(null)
const [events, setEvents] = useState([])
const [time, setTime] = useState(1601543622678)
const classes = useStyles();

useEffect(() => {
const fetchData = async () => {
  const { data } = await httpClient.get(`http://localhost:3001/events/chart/geolocation/${time}`)
  setEvents(data)
}; fetchData();
}, [time])


    return (
  <> 
  <h1>Views By Location</h1>
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

 <TextField
       label="Date"
       type='date' 
       className={classes.dateInput}
       value={new Date(time).toISOString().substr(0, 10)}
       onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTime(Date.parse(event.target.value))}
       />

</>
    )
}

export default React.memo(GoogleMaps)
