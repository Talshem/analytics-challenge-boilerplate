///<reference path="types.ts" />

import express from "express";
import { Request, Response } from "express";

// some useful database functions in here:
import {
createEvent,
getAllEvents,
getAllUsers,
getAllEventsWeekly,
getAllEventsDaily,
getEventsFromDay,
getEventById
} from "./database";
import { Event, weeklyRetentionObject } from "../../client/src/models/event";
import { User } from "../../client/src/models/user";
import { ensureAuthenticated, validateMiddleware } from "./helpers";

import {
  shortIdValidation,
  searchValidation,
  userFieldsValidator,
  isUserValidator,
} from "./validators";
import { split } from "lodash";
import { OneHour } from "./timeFrames";


const router = express.Router();

// Routes

interface Filter {
  sorting: string;
  type: string;
  browser: string;
  search: string;
  offset: number;
}

interface RetentionWeek {
week: string,
from: string,
to: string,
signedUsers: string[],
activeUsers: string[],
retention: number[]
}

router.post('/', (req: Request, res: Response) => {
  const eventDetails: Event = req.body;
  createEvent(eventDetails)
  res.json({event: eventDetails})
});

router.get('/all', (req: Request, res: Response) => {
  let data = []
  let events = getAllEvents();
  let users = getAllUsers();
  for (let item of events) {
      let user = users.find((person) => person.id === item.distinct_user_id) as User
      let obj = {
      eventId: item._id,
      userId: user.id,
      userFullName: `${user.firstName} ${user.lastName}`,
      date: item.date,
      eventName: item.name,
      os: item.os,
      browser: item.browser,
      geolocation: item.geolocation,
      url: item.url.split('3000/')[1]
      }
      data.push(obj)
    }

  res.send(data)
});

router.get('/today', (req: Request, res: Response) => {
  let data = []
  let events = getAllEventsDaily();
  let users = getAllUsers();
  for (let item of events) {
      let user = users.find((person) => person.id === item.distinct_user_id) as User
      let obj = {
      eventId: item._id,
      userId: user.id,
      userFullName: `${user.firstName} ${user.lastName}`,
      date: item.date,
      eventName: item.name,
      os: item.os,
      browser: item.browser,
      geolocation: item.geolocation,
      url: item.url.split('3000/')[1]
      }
      data.push(obj)
    }
  res.send(data)
});

router.get('/week', (req: Request, res: Response) => {
  let data = []
  let events = getAllEventsWeekly();
  let users = getAllUsers();
  for (let item of events) {
      let user = users.find((person) => person.id === item.distinct_user_id) as User
      let obj = {
      eventId: item._id,
      userId: user.id,
      userFullName: `${user.firstName} ${user.lastName}`,
      date: item.date,
      eventName: item.name,
      os: item.os,
      browser: item.browser,
      geolocation: item.geolocation,
      url: item.url
      }
      data.push(obj)
    }
  res.send(data)
});

router.get('/all-filtered', (req: Request, res: Response) => {
  res.send('/all-filtered')
});

router.get('/by-days/:offset', (req: Request, res: Response) => {
let array : any = [];
let obj : any = {};
let events = getAllEvents();
for (let item of events){
!isNaN(obj[new Date(item.date.from).toISOString().split('T')[0]]) ? 
obj[new Date(item.date.from).toISOString().split('T')[0]] += 1 : 
obj[new Date(item.date.from).toISOString().split('T')[0]] = 0
}
for (const [key, value] of Object.entries(obj)) {
let newObj = {
date: key,
sessions: value
}
array.push(newObj)
}
res.send(array)
});


router.get('/by-hours/:offset', (req: Request, res: Response) => {
let array : any = [];
let obj : any = {};
let events = getAllEvents();
for (let item of events) {
!isNaN(obj[`${new Date(item.date.from).toISOString().split('T')[0]}, ${new Date(item.date.from).getHours()}:00`]) ? 
obj[`${new Date(item.date.from).toISOString().split('T')[0]}, ${new Date(item.date.from).getHours()}:00`] += 1 : 
obj[`${new Date(item.date.from).toISOString().split('T')[0]}, ${new Date(item.date.from).getHours()}:00`] = 0
}
for (const [key, value] of Object.entries(obj)) {
let newObj = {
date: key,
sessions: value
}
array.push(newObj)
}
res.send(array)
});



router.get('/retention', (req: Request, res: Response) => {
const { dayZero } = req.query
let array : any = [];
let obj : any = {};
let events = getEventsFromDay(Number(dayZero));
for (let item of events) {
if (!obj[new Date(item.date.from).toISOString().split('T')[0]]) obj[new Date(item.date.from).toISOString().split('T')[0]] = [];
item.name === 'signup' && obj[new Date(item.date.from).toISOString().split('T')[0]].push(item.distinct_user_id)
}

for (const [key, value] of Object.entries(obj)) {
let newObj = {
date: key,
users: value
}
array.push(newObj)
}

let eventsData: RetentionWeek[] = []
array.filter((event: any) => array.indexOf(event) % 7 === 0).map((e: any, index: number) => {

let signedUsers : string[] = [];
for (let item of array.slice(array.indexOf(e), array.indexOf(e) + 7)) {
signedUsers = signedUsers.concat(item.users)
}


let activeUsers : string[] = [];
for (let item of events.filter(event => event.date.from >= Date.parse(e.date) && event.date.from <= Date.parse(e.date) + 1000 * 60 * 60 * 24 * 7)) {
if (!activeUsers.includes(item.distinct_user_id)) activeUsers = activeUsers.concat(item.distinct_user_id);
}

let retentionWeek: RetentionWeek = {
week: `Week ${index + 1}`,
from: e.date,
to: array[array.indexOf(e)+6] ? array[array.indexOf(e)+6].date : array[array.length-1].date,
signedUsers: signedUsers,
activeUsers: activeUsers ,
retention: []
}
eventsData.push(retentionWeek)
});

for (let item of eventsData) {
for (let i=eventsData.indexOf(item)+1; i < eventsData.length; i++) {
let remaining = 0;
for (let user of item.signedUsers){
if (eventsData[i].activeUsers.includes(user)) remaining += 1;
}
item.retention.push(remaining / item.signedUsers.length * 100)
}
}
res.send({events: eventsData, users: events.filter(event => event.name === 'signup').length})
})


router.get('/:eventId',(req : Request, res : Response) => {
const { eventId } = req.params
const event = getEventById(eventId)
  res.send(event)
});

router.get('/chart/os/:time',(req: Request, res: Response) => {
  res.send('/chart/os/:time')
})

  
router.get('/chart/pageview/:time',(req: Request, res: Response) => {
const { time } = req.params
let events = getEventsFromDay(Number(time));
let users = getAllUsers();
let array : any = [];
let obj: any = {
home: 0,
login: 0,
admin: 0,
signup: 0
}
for ( let item of events) { 
obj[item.url.split('3000/')[1]] === 0 ?
obj[item.url.split('3000/')[1]] = Number(((item.date.to - item.date.from) / OneHour).toFixed(2)) :
obj[item.url.split('3000/')[1]] += Number(((item.date.to - item.date.from) / OneHour).toFixed(2))
}
for (const [key, value] of Object.entries(obj)) {
let newObj = {
page: key,
sessions: value
}
array.push(newObj)
}
res.send({events: array, users: users.length})
})

router.get('/chart/timeonurl/:time',(req: Request, res: Response) => {
const { time } = req.params
let events = getEventsFromDay(Number(time));
let users = getAllUsers();

let array: any[] = []
for ( let user of users) { 
let associatedEvents = events.filter((item) => item.distinct_user_id === user.id)
let obj: any = {
userId: user.id,
userFullName:`${user.firstName} ${user.lastName}`,
home: 0,
login: 0,
admin: 0,
signup: 0
}
for (let item of associatedEvents) {
obj[item.url.split('3000/')[1]] === 0 ?
obj[item.url.split('3000/')[1]] = Number(((item.date.to - item.date.from) / 1000).toFixed(0)) :
obj[item.url.split('3000/')[1]] += Number(((item.date.to - item.date.from) / 1000).toFixed(0))
}
array.push(obj)
}
res.send(array)
})

router.get('/chart/geolocation/:time',(req: Request, res: Response) => {
  res.send('/chart/geolocation/:time')
})


export default router;
