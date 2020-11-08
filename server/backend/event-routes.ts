///<reference path="types.ts" />

import express from "express";
import { Request, Response } from "express";

// some useful database functions in here:
import {
createEvent,
getAllEvents,
getAllUsers,
getAllEventsWeekly,
getEventsToday,
getEventsFromDay,
getEventById,
getEventsInDay
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
import { OneDay, OneHour, OneWeek } from "./timeFrames";


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
newUsers: string[],
activeUsers: string[],
weeklyRetention: number[]
}


// offset => slice (0, offset)

router.post('/', (req: Request, res: Response) => {
  const eventDetails: Event = req.body;
  createEvent(eventDetails)
  res.send(eventDetails)
});

router.get('/all', (req: Request, res: Response) => {
  let events = getAllEvents();
  res.send(events)
});

router.get('/today', (req: Request, res: Response) => {
  let events = getEventsToday();
  res.send(events)
});

router.get('/week', (req: Request, res: Response) => {
  let events = getAllEventsWeekly();
  res.send(events)
});

router.get('/all-filtered', (req: Request, res: Response) => {
  res.send('/all-filtered')
});

router.get('/by-days/:offset', (req: Request, res: Response) => {
const { offset } = req.params
let array : any = [];
let obj : any = {};
let events = getAllEvents().slice(0, Number(offset));;
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
const { offset } = req.params
let array : any = [];
let obj : any = {};
let events = getAllEvents().slice(0, Number(offset));
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
let obj : any = {};
let signUpEvents : any = [];
let events = getEventsFromDay(Number(dayZero));

for (let i=Number(dayZero); i <= Number(dayZero) + OneWeek * 6; i += OneDay){
obj[new Date(i).toISOString().split('T')[0]] = []
}

for (let item of events) {
item.name === 'signup' && obj[new Date(item.date.from).toISOString().split('T')[0]].push(item.distinct_user_id)
}

for (const [key, value] of Object.entries(obj)) {
let newObj = {
date: key,
users: value
}
signUpEvents.push(newObj)
}

let eventsData: RetentionWeek[] = []
signUpEvents.filter((event: any) => signUpEvents.indexOf(event) % 8 === 0).map((e: any, index: number) => {

let weeklyActiveUsers = events.filter((item : any) => item.date.from >= Date.parse(e.date) && item.date.from <= Date.parse(e.date) + OneWeek && item.name === 'login')
let weeklyNewUsers = signUpEvents.filter((item : any) => Date.parse(item.date) >= Date.parse(e.date) && Date.parse(item.date) <= Date.parse(e.date) + OneWeek)

let newUsers : string[] = [];
for (let item of weeklyNewUsers) {
newUsers = newUsers.concat(item.users)
}

let activeUsers : string[] = [];
for (let item of weeklyActiveUsers) {
if (!activeUsers.includes(item.distinct_user_id)) activeUsers = activeUsers.concat(item.distinct_user_id);
}

let retentionWeek: RetentionWeek = {
week: `Week ${index + 1}`,
from: e.date,
to: weeklyNewUsers[weeklyNewUsers.length-1].date,
newUsers: newUsers,
activeUsers: activeUsers ,
weeklyRetention: []
}
eventsData.push(retentionWeek)
});

for (let item of eventsData) {
for (let i=eventsData.indexOf(item)+1; i < eventsData.length; i++) {
let remaining = 0;
for (let user of item.newUsers){
if (eventsData[i].activeUsers.includes(user)) remaining += 1;
}
item.weeklyRetention.push(item.newUsers.length > 0 ? remaining / item.newUsers.length * 100 : 0)
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
const { time } = req.params
let events = getEventsFromDay(Number(time));
let users = getAllUsers();
let array: any[] = []

for ( let user of users) { 
let associatedEvents = events.filter((item) => item.distinct_user_id === user.id);
let obj: any = {}

for (let item of associatedEvents) {
if (obj[new Date(item.date.from).toISOString().split('T')[0]]) {
obj[new Date(item.date.from).toISOString().split('T')[0]][item.url.split('3000/')[1]] += 1;
} else {
obj[new Date(item.date.from).toISOString().split('T')[0]] = {
signup: 0,
login: 0,
home: 0,
admin: 0
}
obj[new Date(item.date.from).toISOString().split('T')[0]][item.url.split('3000/')[1]] = 1;
}
}
let datesArray: any[] = []
for (const [key, value] of Object.entries(obj)) {
datesArray.push({date: key, visits: value})
}
array.push({userId: user.id, userFullName:`${user.firstName} ${user.lastName}`, views: datesArray })
}
res.send(array)
})
  
router.get('/chart/pageview/:time',(req: Request, res: Response) => {
const { time } = req.params
let events = getEventsFromDay(Number(time));
let array : any = [];
let obj: any = {
home: 0,
login: 0,
admin: 0,
signup: 0
}
for ( let item of events) { 
obj[item.url.split('3000/')[1]] === 0 ?
obj[item.url.split('3000/')[1]] = 1 :
obj[item.url.split('3000/')[1]] += 1
}
for (const [key, value] of Object.entries(obj)) {
let newObj = {
page: key,
views: value
}
array.push(newObj)
}
res.send(array)
})

router.get('/chart/timeaverage/:time',(req: Request, res: Response) => {
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
obj[item.url.split('3000/')[1]] = ((item.date.to - item.date.from) / OneHour / users.length) :
obj[item.url.split('3000/')[1]] += ((item.date.to - item.date.from) / OneHour / users.length)
}
for (const [key, value] of Object.entries(obj)) {
let newObj = {
page: key,
sessions: Number(Number(value).toFixed(2))
}
array.push(newObj)
}
res.send(array)
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
const { time } = req.params
let array : any = [];
let events = getEventsInDay(Number(time));
  for (let item of events) {
      let obj = {
      eventId: item._id,
      geolocation: item.geolocation,
      }
      array.push(obj)
    }
  res.send(array)
})


export default router;
