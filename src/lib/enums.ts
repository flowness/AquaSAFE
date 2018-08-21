export enum ModuleType {
    MP100, FD100, VS100, BS100, R100
}

export enum EventStatus {
    LIVE, POST, COLD, CLOSED
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