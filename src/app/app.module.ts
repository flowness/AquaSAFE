import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { StatisticsPage } from '../pages/menu/statistics/statistics';
import { SettingsPage } from '../pages/menu/settings/settings';
import { EventsPage } from '../pages/menu/events/events';

import { MP100Page } from '../pages/modules/mp100/mp100';
import { Fd100Page } from '../pages/modules/fd100/fd100';
import { Vs100Page } from '../pages/modules/vs100/vs100';
import { Bs100Page } from '../pages/modules/bs100/bs100';
import { R100Page } from '../pages/modules/r100/r100';
import { ModulePage } from '../pages/module/module';

import { CantseeLeakPage } from '../pages/events/cantseeleak/cantseeleak';
import { IsALeakPage } from '../pages/events/isaleak/isaleak';
import { NotALeakPage } from '../pages/events/notaleak/notaleak';
import { NotathomePage } from '../pages/events/notathome/notathome';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { BrowserModule } from '@angular/platform-browser';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { ModelService } from '../providers/model-service';
import { PlumbersPage } from '../pages/plumbers/plumbers';
import { CallNumber } from '@ionic-native/call-number';
import { EventPage } from '../pages/event/event';
import { HttpModule } from '@angular/http';
import { DataFinder } from '../providers/data-finder';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
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
    EventPage
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
    HomePage,
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
    EventPage
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
    Geolocation
  ]
})
export class AppModule { }
