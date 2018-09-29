import { Injectable } from "@angular/core";
import { AsyncJSONService } from "./Async-JSON-service";

export enum SystemStatus {
    NORMAL, ALERT, WARNING
}

export enum StatusTypes {
    LIVE, POST, COLD, CLOSED
}

export interface systemStatusEvents {
    eventid: number,
    timestamp: string,
    epoch_timestamp: number,
    cooldown: number,
    Event_str: string,
    tptal_flow: number,
    parent_eventID: number,
    initiator: string,
    eventStatus: StatusTypes, 
    event_type: number,
    rollingSubEvents: systemStatusEvents[]
}

export interface systemStatus {
    systemStatus: SystemStatus,
    statusEvents: systemStatusEvents
}


@Injectable()
export class StatusEventService {
    private statusURL: string = "https://yg8rvhiiq0.execute-api.eu-west-1.amazonaws.com/poc/status?";
    private eventsUrl: string = "https://yg8rvhiiq0.execute-api.eu-west-1.amazonaws.com/poc/event?EventID=";

    private statusEventList: systemStatusEvents[] = [];
    private lastEventID: number;

    public getEventList() { return this.statusEventList; }

    public getLastEventID () {return this.lastEventID;}
    public setLastEventID (newEventID: number) { this.lastEventID = newEventID;}

    constructor( private asyncJASONRequests: AsyncJSONService ) {
        
        this.lastEventID = -1;
        console.log("constructor Event-service");
    }
    
    private PollingStatusEvents () {
        let curEventsURL = this.eventsUrl;
        curEventsURL += 'SN=' + 'azarhome';
        curEventsURL += '&';
        curEventsURL += 'statusType=' + 'All';
        curEventsURL += '&';
        if (this.lastEventID == -1)
            // No events received yet
            curEventsURL += 'period=' + '7' + ' ' + 'DAY';
        else {
            // Fetching only new events
            curEventsURL += 'period=' + 'Latest';
            curEventsURL += '&';
            curEventsURL += 'lastEventID=' + this.lastEventID;
        }
        this.asyncJASONRequests.getJSONDataAsync(curEventsURL).then(
            data => {
                        // console.log(data);
                        let lastFlow: number = 0;
                        if (
                                data != undefined &&
                                data["statusCode"] != undefined &&
                                data["statusCode"] == 200
                            ) {
                                for (let index = 0; index < data.length; index++) {                                    
                                    this.pushNewStatusEvent(JSON.parse(data[index]));
                                }
                        }
                    }
        );      
    }

    private pushNewStatusEvent (JSONStatusEvent: any) {
        let newStatusEvent: systemStatusEvents = {
            eventid: JSONStatusEvent,
            timestamp: JSONStatusEvent,
            epoch_timestamp: JSONStatusEvent,
            cooldown: JSONStatusEvent,
            Event_str: JSONStatusEvent,
            tptal_flow: JSONStatusEvent,
            parent_eventID: JSONStatusEvent,
            initiator: JSONStatusEvent,
            eventStatus: JSONStatusEvent, 
            event_type: JSONStatusEvent,
            rollingSubEvents: []
        }
        this.statusEventList.push(newStatusEvent);
    }

    private PollingSubEvents(parenrEventID: number) {

    }

    

 /*    public addEventToList   ( ) {
        let event: systemEvent = {
            eventid: number,
            timestamp: string,
            epoch_timestamp: number,
            cooldown: number,
            Event_str: string,
            tptal_flow: number,
            parent_eventID: number,
            initiator: string,
            open: boolean,
            event_type: number,
        }

    }
 */
 



}