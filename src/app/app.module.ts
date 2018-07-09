import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { settingsPage } from '../pages/menu/settings/settings';
import { eventsPage } from '../pages/menu/events/events';

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



import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    settingsPage,
    eventsPage,
    MP100Page,
    Fd100Page,
    Vs100Page,
    Bs100Page,
    R100Page,
    ModulePage,
    NotALeakPage,
    IsALeakPage,
    NotathomePage,
    CantseeLeakPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    settingsPage,
    eventsPage,
    MP100Page,
    Fd100Page,
    Vs100Page,
    Bs100Page,
    R100Page,
    ModulePage,
    NotALeakPage,
    IsALeakPage,
    NotathomePage,
    CantseeLeakPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
