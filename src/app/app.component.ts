import { Component } from '@angular/core';

import { Platform, ToastController } from '@ionic/angular';

import { RegionService } from '@comparenetworks/imsmart-web';
import { AlertService } from './shared/services/alert.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  closeAppCalled = false;
  constructor(
    private platform: Platform,
    private alertCtrl: AlertService,
    private toastCtrl: ToastController,
    private regionService: RegionService
  ) {
    this.initializeApp();
    this.addMacsCloseModuleListener();

    let toast;

    window.addEventListener('offline', () => {
      this.toastCtrl
        .create({
          message: this.regionService.language['networkError'],
          position: 'top'
        })
        .then((toastRes: any) => {
          toast = toastRes;
          toast.present();
        });
    });

    window.addEventListener('online', () => {
      if (toast) {
        toast.dismiss();
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {});
  }

  addMacsCloseModuleListener() {
    document.addEventListener('closeModule', e => {
      e.stopPropagation();
      if (!this.closeAppCalled) {
        this.closeAppCalled = true;
        const alert = this.alertCtrl.presentAlert(
          this.regionService.language['close'],
          this.regionService.language['closeConfirmation'],
          [
            {
              text: this.regionService.language['cancel'],
              cssClass: 'primary',
              role: 'cancel',
              handler: () => {
                this.closeAppCalled = false;
              }
            },
            {
              text: this.regionService.language['yes'],
              cssClass: 'exit-btn',
              handler: () => {
                macs.closeModule();
              }
            }
          ],
          'alert-info'
        );
      }
    });
  }
}
