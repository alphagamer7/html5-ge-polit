import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { RegionService } from '@comparenetworks/imsmart-web';

@Injectable()
export class AlertService {
  constructor(public alertController: AlertController, private regionService: RegionService) {}

  /**
   *
   * @param title general alert
   * @param message
   * @param buttons
   * @param alertCss
   */
  async presentAlert(title: string, message: string, buttons: any, alertCss: string) {
    const alert = await this.alertController.create({
      cssClass: alertCss,
      header: title,
      message: message,
      buttons: buttons,
      backdropDismiss: false
    });
    return await alert.present();
  }

  /**
   * alert for delete functions
   * @param callback
   */
  presentCancellationAlert(callback?: any) {
    this.presentAlert(
      this.regionService.language['warning'],
      this.regionService.language['cancelConfirmation'],
      [
        {
          text: this.regionService.language['cancel'],
          cssClass: 'primary',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: this.regionService.language['ok'],
          cssClass: 'exit-btn',
          handler: () => {
            if (callback) {
              callback();
            }
          }
        }
      ],
      'alert-danger'
    );
  }
}
