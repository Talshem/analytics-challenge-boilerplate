import React, { useEffect, useState } from "react";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import { Grid, Row, Column } from "../Styles/Styles"
import GoogleMaps from '../analytics/googleMaps'
import { useService, useMachine } from "@xstate/react";
import { eventMachine } from "../machines/eventMachine";
import { httpClient } from "../utils/asyncUtils";

export interface Props {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}

const DashBoard: React.FC<Props> = ({authService}) => {
const [authState, sendAuth] = useService(authService);
const [eventState, sendEvent] = useMachine(eventMachine);

const [events, setEvents] = useState(null)

  useEffect(() => {
  const fetchData = async () => {
      const { data } = await httpClient.get(`http://localhost:3001/events/all`)
      setEvents(data)
    }; fetchData()
  }, [sendEvent]);

  
  return (
<Grid>
<Row>
<Column size={1}>
Analytics
</Column>
</Row>

<Row>
<Column size={1}>
   Time on URL
</Column>

<Column size={2}>
<GoogleMaps events={events}/>
 </Column>
</Row>

<Row>
<Column size={1}>Time All Users Average</Column>
<Column size={1}>Session Days</Column>
<Column size={1}>Session Hours</Column>
</Row>

<Row>
<Column size={1}>Retention</Column>
<Column size={1}>Event log</Column>
</Row>

</Grid>
  );
};

export default DashBoard;
