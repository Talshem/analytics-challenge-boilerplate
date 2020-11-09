import { mockData } from "./mock_data";
import request from "supertest";
import app from "../app";
import db from "../database";
import { Event as event,os } from "../../../client/src/models/event";

 const isEvent = (event : any ): event is event => {
   if(
    '_id' in event&&
    'session_id' in event&&
    'name' in event&&
    'url' in event&&
    'distinct_user_id' in event&&
    'date' in event&&
    'os' in event&&
    'browser' in event&&
    'geolocation' in event
    ){
      return true
    }else{
      return false
    }
}

const isEventArray = (events: any[]): events is event[] => {
  return events.every(eve=>isEvent(eve))
}

describe("main test", () => {

  beforeAll(async (done) => {
    db.setState(mockData).write()
    done()
  })

  it("can get all events", async () => {
    const { body: allEvents } = await request(app).get("/events/all").expect(200);
    expect(allEvents.length).toBe(250);
  });

  it("getting all events from the server must return array of event types", async () => {
    const { body: allEvents } = await request(app).get("/events/all").expect(200);
    expect(isEventArray(allEvents)).toBe(true);
  });

  it("can post new event", async () => {
    await request(app).post("/events").send(mockData.events[0]).expect(200);
    const { body: allEvents2 } = await request(app).get("/events/all").expect(200);
    expect(allEvents2.length).toBe(251);
    expect(allEvents2[250].date).toBe(mockData.events[0].date);
    expect(allEvents2[250].os).toBe(mockData.events[0].os);
  });

  it("can get unique sessions count by day", async () => {
    const { body: sessionsByDays } = await request(app).get("/events/by-days/0").expect(200)

    expect(sessionsByDays.length).toBe(7)
    expect(sessionsByDays.reduce((sum: number, day: {date: string; count: number}) => sum += day.count, 0)).toBe(47)
    expect(sessionsByDays[0].count).toBe(8);

    const { body: sessionsByDays2 } = await request(app).get("/events/by-days/7").expect(200)

    expect(sessionsByDays2.length).toBe(7)
    expect(sessionsByDays2.reduce((sum: number, day: {date: string; count: number}) => sum += day.count, 0)).toBe(56)
    expect(sessionsByDays2[0].count).toBe(8);
    expect(sessionsByDays2[1].count).toBe(8);
    expect(sessionsByDays2[6].count).toBe(8);
  });

  it("can get unique sessions count by hour", async () => {
    const { body: sessionsByHours } = await request(app).get("/events/by-hours/0").expect(200)

    expect(sessionsByHours.length).toBe(24)
    expect(sessionsByHours.reduce((sum: number, day: {date: string; count: number}) => sum += day.count, 0)).toBe(2)

    const { body: sessionsByHours2 } = await request(app).get("/events/by-hours/2").expect(200)

    expect(sessionsByHours2.length).toBe(24)
    expect(sessionsByHours2.reduce((sum: number, day: {date: string; count: number}) => sum += day.count, 0)).toBe(8)
  });

  it("can get data for os chart", async () => {
    const { body: eventsToday } = await request(app).get(`/events/chart/os/today`).expect(200);
    expect(eventsToday.length).toBe(4);
    expect(eventsToday[0].os).toBe(mockData.events[0].os)

    const { body: eventsWeek } = await request(app).get(`/events/chart/os/week`).expect(200);
    expect(eventsWeek.length).toBe(49);

    const { body: eventsAll } = await request(app).get(`/events/chart/os/all`).expect(200);
    expect(eventsAll.length).toBe(251);
    
  })

  it("can get data for pageview chart", async () => {
    const { body: eventsToday } = await request(app).get(`/events/chart/pageview/today`).expect(200);
    expect(eventsToday.length).toBe(4);
    expect(eventsToday[0].url).toBe(mockData.events[0].url)
    expect(eventsToday[2].url).toBe(mockData.events[2].url)

    const { body: eventsWeek } = await request(app).get(`/events/chart/pageview/week`).expect(200);
    expect(eventsWeek.length).toBe(49);

    const { body: eventsAll } = await request(app).get(`/events/chart/pageview/all`).expect(200);
    expect(eventsAll.length).toBe(251);
  })

  it("can get data for geolocation chart", async () => {
    const { body: eventsToday } = await request(app).get(`/events/chart/geolocation/today`).expect(200);
    expect(eventsToday.length).toBe(4);
    expect(eventsToday[0].geolocation).toStrictEqual(mockData.events[0].geolocation)

    const { body: eventsWeek } = await request(app).get(`/events/chart/geolocation/week`).expect(200);
    expect(eventsWeek.length).toBe(49);

    const { body: eventsAll } = await request(app).get(`/events/chart/geolocation/all`).expect(200);
    expect(eventsAll.length).toBe(251);
  })

  it("retention cohort", async () => {
  
    const { body: retentionData } = await request(app).get("/events/retention").expect(200);
    expect(retentionData.length).toBe(6);

    expect(retentionData[0].weeklyRetention.slice(0,4)).toEqual([100, 15, 23, 15]);
    expect(retentionData[1].weeklyRetention.slice(0,3)).toEqual([100, 54, 23]);
    expect(retentionData[2].weeklyRetention.slice(0,2)).toEqual([100, 62]);

    expect(retentionData[1].weeklyRetention[4]).toBe(0);

  });

  it("can filter events by browser", async () => {

    const { body: events}  = await request(app).get("/events/all-filtered")
    .query({
      browser: "chrome",
      offset: 20,
    })
    .expect(200);
    expect(events.events.length).toBe(20);
    expect(events.events[0].browser).toBe("chrome")
    expect(events.events[15].browser).toBe( "chrome")
  })

  it("can filter events by type", async () => {
    const { body: events}  = await request(app).get("/events/all-filtered")
    .query({
      type: "signup",
      offset: 5,
      search: "100"
    })
    .expect(200);
    expect(events.events.length).toBe(2);
    expect(events.events[0].session_id).toMatch(/100/i)
    expect(events.events[1].session_id).toMatch(/100/i)
  })

  it("can sort events by date", async () => {
    const { body: events}  = await request(app).get("/events/all-filtered")
    .query({
      offset: 5,
      sorting: "-date"
    })
    .expect(200);
    const { body: events2}  = await request(app).get("/events/all-filtered")
    .query({
      offset: 5,
      sorting: "+date"
    })
    .expect(200);
    expect(events.events[0].date).toBeGreaterThan(events2.events[0].date)
    expect(events.events[0].date).toBeGreaterThan(events.events[4].date)
    expect(events2.events[1].date).toBeGreaterThan(events2.events[0].date)
  })

})