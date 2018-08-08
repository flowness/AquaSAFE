interface module {
    title: string,
    state: string,
    icon: string,
    type: number,
    valve: boolean,
    sn: string
}

interface settings {
    leakageAlert: boolean;
    irregularityAlert: boolean;
}

interface asEvent {
    title: string,
    timestamp: string,
    type: string,
    open: boolean,
    moments: eventMoment[]
}

interface eventMoment {
    title: string,
    timestamp: string,
    initiator: string,
}