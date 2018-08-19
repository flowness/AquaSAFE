export enum ModuleType {
    MP100 = "MP100",
    FD100 = "FD100",
    VS100 = "VS100",
    BS100 = "BS100",
    R100 = "R100"
}

export enum EventStatus {
    LIVE, OPEN, COLD, CLOSED
}

export namespace EventStatus {
    export function isOpenStatus(day: EventStatus) {
        switch (day) {
            case EventStatus.CLOSED:
                return false;
            default:
                return true;
        }
    }
}