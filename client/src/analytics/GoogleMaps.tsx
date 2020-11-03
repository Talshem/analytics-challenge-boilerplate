import React, { useState, useCallback } from 'react'
import { GoogleMap, LoadScript, Marker  } from '@react-google-maps/api';
import { Event } from '../models/event'

interface Props {
events: any
}

const containerStyle = {
  width: '100%',
  height: '100%'
};
 
const center = {
  lat: 	31.771959,
  lng: 35.217018
};

const GoogleMaps: React.FC<Props> = ({ events }) => {
const [map, setMap] = useState(null)

    return (
      <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_KEY as string}>
     <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={1}
      >
    {events && events.slice(0,100).map((e: Event ) => {
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
