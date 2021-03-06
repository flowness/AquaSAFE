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
import { LeakGuidance } from "../pages/events/leakGuidance/leakGuidance";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
// import { BrowserModule } from "@angular/platform-browser";

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Device } from '@ionic-native/device';
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
import { FCM } from '@ionic-native/fcm';

// Multi language support
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/language/', '.json');
}


//import { FcmProvider } from '../providers/fcm/fcm';
import { FlowService } from "../providers/Flow-service";
import { StatusEventService } from "../providers/StatusEvent-service"; 
import { AsyncJSONService } from "../providers/Async-JSON-service";
import { GlobalsService } from "../providers/Globals-service";
import { FirebaseService } from "../providers/Firebase-service";

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
    LeakGuidance,
    EventPage,
    HandleLeakPage,
    EditEventPage
  ],
  imports: [
    IonicStorageModule.forRoot(),
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      scrollPadding: false,
      scrollAssist: true,
      autoFocusAssist: false
    }),
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
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
    LeakGuidance,
    EventPage,
    HandleLeakPage,
    EditEventPage
  ],
  providers: [
    FCM,
    Device,
    GlobalsService,
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
    //FcmProvider,
    AsyncJSONService,
    FlowService,
    StatusEventService,
    FirebaseService
  ]
})
export class AppModule {}
