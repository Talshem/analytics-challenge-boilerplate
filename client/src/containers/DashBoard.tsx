import React, { useEffect, useState } from "react";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import { Grid, Row, Column } from "../Styles/Styles"
import GoogleMaps from '../analytics/GoogleMaps'
import TimeOnUrl from '../analytics/TimeOnUrl'
import SessionHours from '../analytics/SessionHours'
import SessionDays from '../analytics/SessionDays'
import TimeAverage from '../analytics/TimeAverage'
import { useService, useMachine } from "@xstate/react";
import { eventMachine } from "../machines/eventMachine";
import { httpClient } from "../utils/asyncUtils";
import { Event } from '../models/event'
import { User } from '../models/user'

export interface Props {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}

const DashBoard: React.FC<Props> = ({authService}) => {
const [authState, sendAuth] = useService(authService);
const [eventState, sendEvent] = useMachine(eventMachine);

const [events, setEvents] = useState<any>(null)

  useEffect(() => {
  const fetchData = async () => {
      const events = await httpClient.get(`http://localhost:3001/events/all`)
      let array = [];
      const { data } = await httpClient.get(`http://localhost:3001/users/`)
      for (let item of events.data as Event[]) {
      let user: User = data.filter((person: User) => person.id === item.distinct_user_id)
      let obj = {
      userFullName: user.firstName + user.lastName,
      date: item.date,
      eventName: item.name,
      os: item.os,
      browser: item.browser,
      geolocation: item.geolocation,
      url: item.url
      }
      array.push(obj)
      }
      setEvents(array) 
      
    }; fetchData()
  }, []);

  
  useEffect(() => {
    const fetchData = async () => {

      }; fetchData()
    }, [events]);
  

  return (
<Grid>
<Row>
<Column size={1}>
Analytics
</Column>
</Row>

<Row>
<Column size={1}>
   <TimeOnUrl events={events}/>
</Column>

<Column size={2}>
<GoogleMaps events={events}/>
 </Column>
</Row>

<Row>
<Column size={1}>
<TimeAverage events={events}/>
</Column>

<Column size={1}>
<SessionDays events={events}/>
</Column>
<Column size={1}>
<SessionHours events={events}/>
</Column>
</Row>

<Row>
<Column size={1}>Retention</Column>
<Column size={1}>Event log</Column>
</Row>

</Grid>
  );
};

export default DashBoard;
