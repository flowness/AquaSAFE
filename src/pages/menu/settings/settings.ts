import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { ModelService } from '../../../lib/model-service';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  items: Array<{ title: string, input: string, icon: string, value: any }>;
  statuses = ['Low Battery', 'Tamper', 'Communication', 'All Good'];

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, private modelService: ModelService) {
    this.items = [];

    this.items.push({
      title: 'E-Mail',
      input: 'text',
      icon: 'mail',
      value: ''
    });
    this.items.push({
      title: 'SMS',
      input: 'text',
      icon: 'call',
      value: ''
    });
    this.items.push({
      title: 'Freeze Alert',
      input: 'toggle',
      icon: 'warning',
      value: false
    });
    this.items.push({
      title: 'Irregularity Alert',
      input: 'toggle',
      icon: 'warning',
      value: this.modelService.getSettings().irregularityAlert
    });
    this.items.push({
      title: 'Leakage Alert',
      input: 'toggle',
      icon: 'warning',
      value: this.modelService.getSettings().leakageAlert
    });
    this.items.push({
      title: 'Zero-Flow Hours Alert:',
      input: 'toggle',
      icon: 'warning',
      value: false
    });

    this.items.push({
      title: 'Liters/Gallons',
      input: 'toggle',
      icon: 'water',
      value: false
    });
  }

  handleToggleChange(evt, item) {
    if (item.title === 'Leakage Alert' || item.title === 'Irregularity Alert') {
      console.log("setting leakage alert to " + item.value);
      this.modelService.updateSettings(item.title, item.value);
    }
  }
}
