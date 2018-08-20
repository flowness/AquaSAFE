import { ModuleType, EventStatus } from "./enums";

export interface module {
    title: string,
    state: string,
    icon: string,
    type: ModuleType,
    valve: boolean,
    sn: string
}

export interface moduleData {
    sn: string,
    lastReading: Date,
    address: string,
    batteryStatus: number,
    tempC: number
}

export interface settings {
    leakageAlert: boolean;
    irregularityAlert: boolean;
}

export interface asEvent {
    title: string,
    timestamp: string,
    type: string,
    open: boolean,
    status: EventStatus,
    moments: eventMoment[]
}

export interface eventMoment {
    title: string,
    timestamp: string,
    initiator: string,
}