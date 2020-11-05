import React, { useState, useEffect } from 'react'
import { GoogleMap, LoadScript, Marker  } from '@react-google-maps/api';
import { Event } from '../models/event'
import { httpClient } from "../utils/asyncUtils";

const containerStyle = {
  width: '100%',
  height: '100%'
};
 
const center = {
  lat: 	31.771959,
  lng: 35.217018
};

const GoogleMaps: React.FC = () => {
const [map, setMap] = useState(null)
const [events, setEvents] = useState([])
const [time, setTime] = useState<'week'|'today'|'all'>('all')


useEffect(() => {
const fetchData = async () => {
  const { data } = await httpClient.get(`http://localhost:3001/events/${time}`)
  setEvents(data)
}; fetchData();
}, [time])

    return (
      <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_KEY as string}>
<select value={time} onChange={(event) => setTime(event.target.value as 'week'|'today'|'all')}>
<option value='week'>Last Week</option>
<option value='today'>Last Day</option>
<option value='all'>All Time</option>
</select>
     <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={1}
      >
    {events && events.map((e: Event ) => {
return (
<Marker
position={e.geolocation.location}
/>
)})}
      </GoogleMap>
      </LoadScript>
    )
}

export default React.memo(GoogleMaps)
