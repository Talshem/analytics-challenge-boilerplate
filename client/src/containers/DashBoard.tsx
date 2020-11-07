import React, { useEffect, useState } from "react";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import { Grid, Row, Column } from "../Styles/Styles"
import GoogleMaps from '../analytics/GoogleMaps'
import SessionHours from '../analytics/SessionHours'
import SessionDays from '../analytics/SessionDays'
import TimeAverage from '../analytics/TimeAverage'
import { useService, useMachine } from "@xstate/react";
import { eventMachine } from "../machines/eventMachine";
import { Event } from '../models/event'
import { User } from '../models/user'
import RetentionCohort from "analytics/RetentionCohort";
import TimeOnUrl from "analytics/TimeOnUrl";
import EventLog from "analytics/EventLog";
import ErrorBoundary from 'analytics/ErrorBoundaries'


export interface Props {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}

const DashBoard: React.FC<Props> = ({authService}) => {
const [authState, sendAuth] = useService(authService);
const [eventState, sendEvent] = useMachine(eventMachine);

  return (
<Grid>
<Row style={{height:'20px'}}>
<Column size={1}>
Analytics
</Column>
</Row>

<Row>
<Column size={1}>
  <ErrorBoundary>
<GoogleMaps/>
</ErrorBoundary>
 </Column>
</Row>

<Row>
<Column size={1}>
     <ErrorBoundary>
  <TimeOnUrl/>
  </ErrorBoundary>
</Column>
</Row>

<Row>
<Column size={1}>
  <ErrorBoundary>
<SessionDays/>
</ErrorBoundary>
</Column>
<Column size={1}>
  <ErrorBoundary>
<SessionHours/>
</ErrorBoundary>
</Column>
</Row>

<Row>
<Column size={1}>
  <ErrorBoundary>
<RetentionCohort/>
</ErrorBoundary>
</Column>
</Row>

<Row>
<Column size={1}>
  <ErrorBoundary>
 <TimeAverage/> 
</ErrorBoundary>
</Column>
<Column size={1}>
  <ErrorBoundary>
  <EventLog/>
</ErrorBoundary>
</Column>
</Row>
</Grid>

  );
};

export default DashBoard;
