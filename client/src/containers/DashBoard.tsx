import React, { useEffect } from "react";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import { Grid, Row, Column } from "../Styles/Styles"
import { DataContext, DataEvents } from "../machines/dataMachine";
import { useService } from "@xstate/react";

export interface Props {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
  eventService: Interpreter<DataContext, any, DataEvents, any>;
}

const DashBoard: React.FC<Props> = ({authService, eventService}) => {
const [authState, sendAuth] = useService(authService);
const [eventState, sendEvent] = useService(eventService);

  useEffect(() => {
  sendEvent("FETCH")
  }, [sendEvent]);


  return (
<Grid>
<Row>
<Column size={1}>Header</Column>
</Row>

<Row>
<Column size={1}>Google Maps</Column>
<Column size={2}>Time on URL</Column>
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
