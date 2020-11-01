import React from "react";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import { Grid, Row, Column } from "../Styles/Styles"

export interface Props {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}

const DashBoard: React.FC = () => {
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
