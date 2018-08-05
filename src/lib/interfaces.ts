interface module {
    title: string,
    state: string,
    icon: string,
    type: number,
    valve: boolean,
    sn: string
}

interface alert {
    indicator: string,
    detectionTime: string
}

interface settings {
    leakageAlert: boolean;
    irregularityAlert: boolean;
}

interface event {
    title: string,
    timestamp: string,
    event: string,
    status: string
}