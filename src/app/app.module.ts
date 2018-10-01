import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { IonicStorageModule } from "@ionic/storage";

import { MyApp } from "./app.component";
import { HomePage2 } from "../pages/home.2/home2";
import { StatisticsPage } from "../pages/menu/statistics/statistics";
import { SettingsPage } from "../pages/menu/settings/settings";
import { EventsPage } from "../pages/menu/events/events";

import { MP100Page } from "../pages/modules/mp100/mp100";
import { Fd100Page } from "../pages/modules/fd100/fd100";
import { Vs100Page } from "../pages/modules/vs100/vs100";
import { Bs100Page } from "../pages/modules/bs100/bs100";
import { R100Page } from "../pages/modules/r100/r100";
import { ModulePage } from "../pages/module/module";

import { CantseeLeakPage } from "../pages/events/cantseeleak/cantseeleak";
import { IsALeakPage } from "../pages/events/isaleak/isaleak";
import { NotALeakPage } from "../pages/events/notaleak/notaleak";
import { NotathomePage } from "../pages/events/notathome/notathome";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
// import { BrowserModule } from "@angular/platform-browser";

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Camera } from "@ionic-native/camera";
import { Geolocation } from "@ionic-native/geolocation";
import { ModelService } from "../providers/model-service";
import { PlumbersPage } from "../pages/plumbers/plumbers";
import { CallNumber } from "@ionic-native/call-number";
import { EventPage } from "../pages/event/event";
import { HttpModule } from "@angular/http";
import { DataFinder } from "../providers/data-finder";
import { DateParsePipe } from "../providers/date-parse-pipe";
import { HandleLeakPage } from "../pages/handle-leak/handle-leak";
import { EditEventPage } from "../pages/edit-event/edit-event";
import { ScreenOrientation } from "@ionic-native/screen-orientation";

import { Firebase } from "@ionic-native/firebase";
import { FcmProvider } from '../providers/fcm/fcm';
import { FlowService } from "../providers/Flow-service";
import { StatusEventService } from "../providers/StatusEvent-service"; 
import { AsyncJSONService } from "../providers/Async-JSON-service";

// const firebase = {
//   // your firebase web config
// };

@NgModule({
  declarations: [
    MyApp,
    HomePage2,
    StatisticsPage,
    SettingsPage,
    EventsPage,
    MP100Page,
    Fd100Page,
    Vs100Page,
    Bs100Page,
    R100Page,
    ModulePage,
    NotALeakPage,
    IsALeakPage,
    NotathomePage,
    CantseeLeakPage,
    PlumbersPage,
    EventPage,
    HandleLeakPage,
    EditEventPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    BrowserAnimationsModule,
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage2,
    StatisticsPage,
    SettingsPage,
    EventsPage,
    MP100Page,
    Fd100Page,
    Vs100Page,
    Bs100Page,
    R100Page,
    ModulePage,
    NotALeakPage,
    IsALeakPage,
    NotathomePage,
    CantseeLeakPage,
    PlumbersPage,
    EventPage,
    HandleLeakPage,
    EditEventPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    CallNumber,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    DataFinder,
    ModelService,
    Geolocation,
    DateParsePipe,
    ScreenOrientation,
    Firebase,
    FcmProvider,
    AsyncJSONService,
    FlowService,
    StatusEventService
  ]
})
export class AppModule {}
