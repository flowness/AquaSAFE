import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { eventsPage } from './events';

@NgModule({
  declarations: [
    eventsPage,
  ],
  imports: [
    IonicPageModule.forChild(eventsPage),
  ],
})
export class eventsPageModule {}
