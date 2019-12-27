import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Store } from '@ngrx/store';

import { RegionService } from '@comparenetworks/imsmart-web';

import { PageFooterService } from './page-footer.service';
import { AlertService } from 'src/app/shared/services/alert.service';

import { SharedConstants } from 'src/app/shared/constants/shared-constants';

@Component({
  selector: 'page-footer',
  templateUrl: './page-footer.component.html',
  styleUrls: ['./page-footer.component.scss']
})
export class PageFooterComponent {
  @Input() pageType: string;
  @Input() disableNextButton: boolean;
  @Input() disableBackButton: boolean;
  @Input() disableResetButton: boolean;
  @Input() displaySubmit: boolean;
  @Input() reset: boolean;

  @Input() showWarning: boolean;

  @Output() buttonClicked: EventEmitter<any> = new EventEmitter();
  @Output() saveLater: EventEmitter<any> = new EventEmitter();
  @Output() sendMail: EventEmitter<any> = new EventEmitter();
  @Output() sendError: EventEmitter<any> = new EventEmitter();

  constructor(private store: Store<any>, private alertService: AlertService, private regionService: RegionService, private footerService: PageFooterService) {}

  handleSaveLater() {
    this.saveLater.emit();
  }

  prevPage(): void {
    // using 'disableBackButton' boolean (=form is not ready) to avoid poping up in initial navigation [after going back]
    if (this.pageType === SharedConstants.pageDetails.general.path && !this.disableBackButton) {
      const alert = this.alertService.presentAlert(
        this.regionService.language['goingBack'],
        this.regionService.language['backButtonWarning'],
        [
          {
            text: this.regionService.language['no'],
            role: 'cancel',
            cssClass: 'primary',
            handler: () => {
              alert.then(() => {
                console.log('No clicked');
              });
            }
          },
          {
            text: this.regionService.language['yes'],
            role: 'confirm',
            handler: () => {
              alert.then(() => {
                this.footerService.navigateBack(this.pageType);
                this.footerService.resetContent('all');

                console.log('Yes clicked');
              });
            }
          }
        ],
        'alert-danger'
      );
    } else {
      this.footerService.navigateBack(this.pageType);
    }
  }

  nextPage(): void {
    // used a timer because showWarning variable is updating with a delay in formulation page
    setTimeout(() => {
      if (!this.showWarning) {
        this.footerService.navigateForward(this.pageType);
      } else {
        this.buttonClicked.emit(true);
        this.alertService.presentAlert(
          this.regionService.language['incompleteForm'],
          this.regionService.language['incompleteFormWarning'],
          [this.regionService.language['confirmation']],
          'alert-danger'
        );
      }
    }, 100);
  }

  /**
   * reset children pages action
   */
  resetContent() {
    this.footerService.resetContent(this.pageType);
  }

  /**
   * navigate to email send success page
   */
  onSubmit(): void {
    this.disableNextButton ? this.sendError.emit() : this.sendMail.emit();
  }
}
