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
getEventsFiltered,
getEventsInDay,
getEventByType,
getEventByTypeTEST,
getWeeklySessionsTEST,
getDailySessionsTEST,
saveEvent,
getWeeklySessions,
getDailySessions,
getAllEventsTEST,
getAllEventsWeeklyTEST,
getEventsTodayTEST,
resetDay
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
import { date } from "faker";


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
newUsers: any,
activeUsers: any,
weeklyRetention: number[]
}

router.post('/', (req: Request, res: Response) => {
  const eventDetails: Event = req.body;
  // createEvent(eventDetails) doesnt pass test in this method
  saveEvent(req.body)
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
const { type, offset, browser, sorting, search } = req.query
  let events = getEventsFiltered(
  type ? type : '',
  browser ? browser : '',
  offset ? Number(offset) : 100,
  search ? search : '',
  sorting)
  res.json({events: events})
});

// router.get('/by-days/:offset', (req: Request, res: Response) => {
// const offset = req.params.offset || 0;
// let array : any = [];
// let obj : any = {};
// let events = getWeeklySessions(new Date().getTime() + OneDay - OneDay * Number(offset));

// for (let i=new Date().getTime()+OneDay-OneDay*Number(offset)-OneWeek;i<new Date().getTime()+OneDay-OneDay*Number(offset); i+= OneDay){
//   obj[`${new Date(i).toISOString().split('T')[0]}`] = 0
//   }

// for (let item of events){
// obj[new Date(item.date.from).toISOString().split('T')[0]] += 1
// }
// for (const [key, value] of Object.entries(obj)) {
// let newObj = {
// date: key,
// count: value
// }
// array.push(newObj)
// }
// res.send(array)
// });

router.get('/by-days/:offset', (req: Request, res: Response) => {
  const offset = req.params.offset || 0;
  let array : any = [];
  let obj : any = {};

  let timeNow = Date.now()
  let end = timeNow + OneDay - OneDay*Number(offset);
  end = new Date(`${new Date(timeNow).getFullYear()}/${new Date(timeNow).getMonth() +1}/${new Date(timeNow).getDate()}`).getTime();
  let start = end - OneWeek

  let events = getWeeklySessionsTEST(start, end);
  
  for (let i=start; i<end; i+= OneDay){
    obj[`${new Date(i).toISOString().split('T')[0]}`] = 0
    }

  for (let item of events as any){
 if(!isNaN(obj[new Date(item.date).toISOString().split('T')[0]])) obj[new Date(item.date).toISOString().split('T')[0]] += 1
  }

  for (const [key, value] of Object.entries(obj)) {
  let newObj = {
  date: key,
  count: value
  }
  array.push(newObj)
  }
  res.send(array)
  });


// router.get('/by-hours/:offset', (req: Request, res: Response) => {
// const offset = req.params.offset || 0;
// let array : any = [];
// let obj : any = {};
// let events = getDailySessions(new Date().getTime() + OneDay - OneDay * Number(offset));

// for (let i=new Date().getTime()-OneDay*Number(offset);i<new Date().getTime()-OneDay*Number(offset)+OneDay; i+= OneHour){
// obj[`${new Date(i).toISOString().split('T')[0]}, ${new Date(i).getHours()}:00`] = 0
// }

// for (let item of events) {
// obj[`${new Date(item.date.from).toISOString().split('T')[0]}, ${new Date(item.date.from).getHours()}:00`] += 1 
// }

// for (const [key, value] of Object.entries(obj)) {
// let newObj = {
// date: key,
// count: value
// }
// array.push(newObj)
// }
// res.send(array)
// });

router.get('/by-hours/:offset', (req: Request, res: Response) => {
  const offset = req.params.offset || 0;
  let array : any = [];
  let obj : any = {};

  let time  = new Date().getTime() + OneDay;
  time = new Date(`${new Date(time).getFullYear()}/${new Date(time).getMonth() +1}/${new Date(time).getDate()}`).getTime();

  let end = time - OneDay * Number(offset)
  let start = end - OneDay

  let events = getDailySessionsTEST(start, end);

  for (let i=start;i<=end; i+= OneHour){
  obj[`${new Date(i).toISOString().split('T')[0]}, ${new Date(i).getHours()}:00`] = 0
  }

  for (let item of events as any) {
  if(obj[`${new Date(item.date).toISOString().split('T')[0]}, ${new Date(item.date).getHours()}:00`]){
  obj[`${new Date(item.date).toISOString().split('T')[0]}, ${new Date(item.date).getHours()}:00`] += 1
  } 
  }

  for (const [key, value] of Object.entries(obj)) {
  let newObj = {
  date: key,
  count: value
  }
  array.push(newObj)
  }
  res.send(array)
  });


// router.get('/retention', (req: Request, res: Response) => {
// const { dayZero } = req.query
// let obj : any = {};
// let signUpEvents : any = [];

// for (let i=Number(dayZero); i <= Number(dayZero) + OneWeek * 6; i += OneDay){
// obj[new Date(i).toISOString().split('T')[0]] = []
// }

// for (let item of getEventByType('signup', Number(dayZero))) {
// obj[new Date(item.date.from).toISOString().split('T')[0]].push(item.distinct_user_id)
// }

// for (const [key, value] of Object.entries(obj)) {
// let newObj = {
// date: key,
// users: value
// }
// signUpEvents.push(newObj)
// }

// let eventsData: RetentionWeek[] = []
// signUpEvents.filter((event: any) => signUpEvents.indexOf(event) % 8 === 0).map((e: any, index: number) => {

// let weeklyEvents = getEventByType('login', Number(dayZero)).filter((item : any) => item.date.from >= Date.parse(e.date) && item.date.from <= Date.parse(e.date) + OneWeek)
// let weeklyNewUsers = signUpEvents.filter((item : any) => Date.parse(item.date) >= Date.parse(e.date) && Date.parse(item.date) <= Date.parse(e.date) + OneWeek)

// let newUsers : string[] = [];
// for (let item of weeklyNewUsers) {
// newUsers = newUsers.concat(item.users)
// }

// let activeUsers : string[] = [];
// for (let item of weeklyEvents) {
// if (!activeUsers.includes(item.distinct_user_id)) activeUsers = activeUsers.concat(item.distinct_user_id);
// }

// let retentionWeek: RetentionWeek = {
// week: `Week ${index + 1}`,
// from: e.date,
// to: weeklyNewUsers[weeklyNewUsers.length-1].date,
// signedUsers: newUsers,
// newUsers: newUsers.length,
// activeUsers: activeUsers,
// weeklyRetention: []
// }
// eventsData.push(retentionWeek)
// });

// for (let item of eventsData) {
// for (let i=eventsData.indexOf(item)+1; i < eventsData.length; i++) {
// let remaining = 0;
// for (let user of item.signedUsers){
// if (eventsData[i].activeUsers.includes(user)) remaining += 1;
// }
// item.weeklyRetention.push(item.newUsers > 0 ? remaining / item.newUsers * 100 : 0)
// }
// }
// res.send({events: eventsData, users: getEventByType('signup', Number(dayZero)).length})
// })

// for the test
router.get('/retention', (req: Request, res: Response) => {
  let dayZero = Number(req.query.dayZero) || Date.now() - OneWeek * 6
  let obj : any = {};
  let signUpEvents : any = [];
  
  dayZero = resetDay(dayZero)

  for (let i=dayZero; i < dayZero + OneWeek * 6 ; i += OneDay){
  obj[`${new Date(i).getFullYear()}/${new Date(i).getMonth() +1}/${new Date(i).getDate()}`] = []
  }
  


  for (let item of getEventByTypeTEST('signup') as any) {
  if(obj[`${new Date(item.date).getFullYear()}/${new Date(item.date).getMonth() +1}/${new Date(item.date).getDate()}`]){
  obj[`${new Date(item.date).getFullYear()}/${new Date(item.date).getMonth() +1}/${new Date(item.date).getDate()}`].push(item.distinct_user_id)
  }
  }

  for (const [key, value] of Object.entries(obj)) {
  let newObj = {
  date: key,
  users: value
  }
  signUpEvents.push(newObj)
  }


  let eventsData: RetentionWeek[] = []
  signUpEvents.filter((event: any) => signUpEvents.indexOf(event) % 7 === 0).map((e: any, index: number) => {
  
  let weeklyEvents = getAllEvents().filter((item : any) => item.date >= Date.parse(e.date) && item.date < Date.parse(e.date) + OneWeek && item.name !== 'signup')
  let weeklyNewUsers = signUpEvents.filter((item : any) => Date.parse(item.date) >= Date.parse(e.date) && Date.parse(item.date) < Date.parse(e.date) + OneWeek)


  let newUsers : string[] = [];
  for (let item of weeklyNewUsers) {
  newUsers = newUsers.concat(item.users)
  }
  
  let activeUsers : string[] = [];
  for (let item of weeklyEvents) {
  if (!activeUsers.includes(item.distinct_user_id)) activeUsers = activeUsers.concat(item.distinct_user_id);
  }
  
  let retentionWeek: RetentionWeek = {
  week: `Week ${index + 1}`,
  from: e.date,
  to: weeklyNewUsers[weeklyNewUsers.length-1].date,
  newUsers: newUsers,
  activeUsers: activeUsers,
  weeklyRetention: [100]
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
  item.activeUsers = item.activeUsers.length
  item.newUsers = item.newUsers.length
  }
  console.log(eventsData)
  res.send(eventsData)
  })

router.get('/:eventId',(req : Request, res : Response) => {
const { eventId } = req.params
const event = getEventById(eventId)
  res.send(event)
});

// router.get('/chart/os/:time',(req: Request, res: Response) => {
// const { time } = req.params
// let events = getEventsFromDay(Number(time));
// let users = getAllUsers();
// let array: any[] = []

// for ( let user of users) { 
// let associatedEvents = events.filter((item) => item.distinct_user_id === user.id);
// let obj: any = {}

// for (let item of associatedEvents) {
// if (obj[new Date(item.date.from).toISOString().split('T')[0]]) {
// obj[new Date(item.date.from).toISOString().split('T')[0]][item.url.split('3000/')[1]] += 1;
// } else {
// obj[new Date(item.date.from).toISOString().split('T')[0]] = {
// signup: 0,
// login: 0,
// home: 0,
// admin: 0
// }
// obj[new Date(item.date.from).toISOString().split('T')[0]][item.url.split('3000/')[1]] = 1;
// }
// }
// let datesArray: any[] = []
// for (const [key, value] of Object.entries(obj)) {
// datesArray.push({date: key, visits: value})
// }
// array.push({userId: user.id, userFullName:`${user.firstName} ${user.lastName}`, views: datesArray })
// }
// res.send(array)
// })
 
router.get('/chart/os/:time',(req: Request, res: Response) => {
  const { time } = req.params
  let events: any[] = [];
  switch(time){
  case 'all': events = getAllEventsTEST();
  break;
  case 'week': events =  getAllEventsWeeklyTEST();
  break;
  case 'today': events = getEventsTodayTEST();
  }

  let users = getAllUsers();
  let array: any[] = []
  
  // for ( let user of users) { 
  // let associatedEvents = events.filter((item) => item.distinct_user_id === user.id);
  // let obj: any = {}
  
  // for (let item of associatedEvents) {
  // if (obj[new Date(item.date.from).toISOString().split('T')[0]]) {
  // obj[new Date(item.date.from).toISOString().split('T')[0]][item.url.split('3000/')[1]] += 1;
  // } else {
  // obj[new Date(item.date.from).toISOString().split('T')[0]] = {
  // signup: 0,
  // login: 0,
  // home: 0,
  // admin: 0
  // }
  // obj[new Date(item.date.from).toISOString().split('T')[0]][item.url.split('3000/')[1]] = 1;
  // }
  // }
  // let datesArray: any[] = []
  // for (const [key, value] of Object.entries(obj)) {
  // datesArray.push({date: key, visits: value})
  // }
  // array.push({userId: user.id, userFullName:`${user.firstName} ${user.lastName}`, views: datesArray })
  // }
  res.send(events)
  })

// router.get('/chart/pageview/:time',(req: Request, res: Response) => {
// const { time } = req.params
// let events = getEventsFromDay(Number(time));
// let array : any = [];
// let obj: any = {
// home: 0,
// login: 0,
// admin: 0,
// signup: 0
// }
// for ( let item of events) { 
// obj[item.url.split('3000/')[1]] === 0 ?
// obj[item.url.split('3000/')[1]] = 1 :
// obj[item.url.split('3000/')[1]] += 1
// }
// for (const [key, value] of Object.entries(obj)) {
// let newObj = {
// page: key,
// views: value
// }
// array.push(newObj)
// }
// res.send(array)
// })

router.get('/chart/pageview/:time',(req: Request, res: Response) => {
  const { time } = req.params
  let events: any[] = [];
  switch(time){
  case 'all': events = getAllEventsTEST();
  break;
  case 'week': events =  getAllEventsWeeklyTEST();
  break;
  case 'today': events = getEventsTodayTEST();
  }
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
  res.send(events)
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

// router.get('/chart/geolocation/:time',(req: Request, res: Response) => {
// const { time } = req.params
// let array : any = [];
// let events = getEventsInDay(Number(time));
//   for (let item of events) {
//       let obj = {
//       eventId: item._id,
//       geolocation: item.geolocation,
//       }
//       array.push(obj)
//     }
//   res.send(array)
// })

router.get('/chart/geolocation/:time',(req: Request, res: Response) => {
  const { time } = req.params
  let events: any[] = [];
  switch(time){
  case 'all': events = getAllEventsTEST();
  break;
  case 'week': events =  getAllEventsWeeklyTEST();
  break;
  case 'today': events = getEventsTodayTEST();
  }
  let array : any = [];
    for (let item of events) {
        let obj = {
        eventId: item._id,
        geolocation: item.geolocation,
        }
        array.push(obj)
      }
    res.send(events)
  })
  

export default router;
