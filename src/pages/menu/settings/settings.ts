import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { ModelService } from '../../../app/model-service';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  items: Array<{ title: string, input: string, icon: string, value: any }>;
  statuses = ['Low Battery', 'Tamper', 'Communication', 'All Good'];

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, private modelService: ModelService) {
    let settings = this.modelService.getSettings();
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
      value: settings.irregularityAlert
    });
    this.items.push({
      title: 'Leakage Alert',
      input: 'toggle',
      icon: 'warning',
      value: settings.leakageAlert
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

    console.log('settings');
    console.dir(this.modelService.getModel());
  }

  handleToggleChange(evt, item) {
    if (item.title === 'Leakage Alert' || item.title === 'Irregularity Alert') {
      console.log("setting leakage alert to " + item.value);
      this.updateModel(item)
    }
  }

  updateModel(item) {
    console.log('read model from storage');
    console.dir(item);
    let model = this.modelService.getModel();
    let settings = this.modelService.getSettings();
    if (model != null) {
      console.log('model.status before = ' + model.status);
      console.log('item.title = ' + item.title);
      model.status = item.value ? (item.title === 'Leakage Alert' ? 'bad' : 'warn') : 'good';
      console.log('model.status after = ' + model.status);
      if (item.title === 'Leakage Alert') {
        settings.leakageAlert = item.value;
        for (let index = 0; index < model.modules.length; index++) {
          if (model.modules[index].type === 0) {
            model.modules[index].state = item.value ? 'Leak Detected' : 'All Good';
          } else {
            model.modules[index].state = 'All Good';
          }
        }
      }
      if (item.title === 'Irregularity Alert') {
        settings.irregularityAlert = item.value;
        for (let index = 0; index < model.modules.length; index++) {
          model.modules[index].state = item.value ? this.statuses[Math.floor(Math.random() * this.statuses.length)] : 'All Good';
        }
      }

      let alert = {};
      alert['indicator'] = 'MP100';
      alert['detectionTime'] = new Date().toISOString();
      model.alert = alert;

      console.log('set model in storage');
      console.dir(model);
      console.dir(settings);
      this.modelService.setModel(model);
      this.modelService.setSettings(settings);
    }
  }
}
