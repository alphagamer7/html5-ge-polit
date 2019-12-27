import { Store, select } from '@ngrx/store';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';

import { RegionService, PDFService, PDFParams, EmailParams } from '@comparenetworks/imsmart-web';

import * as fromGeneralInformation from 'src/app/shared/store/reducers/general-information.reducer';
import * as fromPackaging from 'src/app/shared/store/reducers/packaging.reducer';
import * as fromManufacturing from 'src/app/shared/store/reducers/manufacturing.reducer';
import * as fromDocumentation from 'src/app/shared/store/reducers/documentation.reducer';
import * as fromFormulation from 'src/app/shared/store/reducers/formulation-and-control.reducer';
import * as fromSummary from 'src/app/shared/store/reducers/summary.reducer';

import { WizardState } from 'src/app/shared/store/reducers/reducer';

import { AlertService } from 'src/app/shared/services/alert.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';

import { Route } from 'src/app/shared/store/actions/navigation.action';

import { Packaging } from 'src/app/shared/types/packaging.type';
import { Manufacturing } from 'src/app/shared/types/manufacturing.type';
import { Documentation } from 'src/app/shared/types/documentation.type';
import { GeneralInformation } from 'src/app/shared/types/general-information.type';
import { FormulationDetails } from 'src/app/shared/types/formulation-details.types';
import { SharedConstants } from 'src/app/shared/constants/shared-constants';

export class SummaryManager {
  generalInformation$: Observable<GeneralInformation>;
  packaging$: Observable<Packaging[]>;
  manufacturing$: Observable<Manufacturing>;
  documentation$: Observable<Documentation>;
  formualtion$: Observable<FormulationDetails>;
  errorPagesObj = {};

  private destroySelectorSubject$: Subject<void> = new Subject();
  private errorPages;

  constructor(
    private store: Store<WizardState>,
    private alertService: AlertService,
    private regionService: RegionService,
    private navigationService: NavigationService,
    private pdfService: PDFService
  ) {
    this.subscribeToStore();
  }

  private subscribeToStore() {
    this.packaging$ = this.store.pipe(select(fromPackaging.getPackagings)).pipe(takeUntil(this.destroySelectorSubject$));

    this.generalInformation$ = this.store.pipe(select(fromGeneralInformation.getGeneralInformationFormDetails)).pipe(takeUntil(this.destroySelectorSubject$));

    this.manufacturing$ = this.store.pipe(select(fromManufacturing.getManufacturingFormDetails)).pipe(takeUntil(this.destroySelectorSubject$));

    this.documentation$ = this.store.pipe(select(fromDocumentation.getDocumentFormDetails)).pipe(takeUntil(this.destroySelectorSubject$));

    this.formualtion$ = this.store.pipe(select(fromFormulation.getFormulationFormDetails)).pipe(takeUntil(this.destroySelectorSubject$));

    this.store
      .pipe(select(fromSummary.unsubscribeForSelectors))
      .pipe(takeUntil(this.destroySelectorSubject$))
      .subscribe(value => {
        if (value === true) {
          this.destroySelectorSubject$.next();
        }
      });
  }

  init(pageType: string) {
    if (!this.navigationService.checkVisitStatus(pageType)) {
      this.navigationService.initialNavigation(pageType);
    }
  }

  handleNavigation(pageType: string) {
    this.store.dispatch(new Route({ pageType }));
  }

  handleSaveLater() {
    this.alertService.presentAlert(
      this.regionService.language['saveLater'],
      this.regionService.language['comingSoon'],
      [this.regionService.language['confirmation']],
      'alert-info'
    );
  }

  handleSendMail(jsonObj: any): Observable<void> {
    return new Observable<void>(observer => {
      macs.emailWithMultipleAssets(
        jsonObj,
        function(result) {
          console.log('Success', result);
          observer.next();
          observer.complete();
        },
        function(result) {
          console.log('Error');
          observer.next();
          observer.complete();
        }
      );
    });
  }

  saveAndMailPdf(pdfParams: PDFParams, emailParams: EmailParams) {
    return new Observable<void>(observer => {
      this.pdfService.savePDF(pdfParams, false).subscribe(
        pdfAsset => {
          if (pdfAsset) {
            const jsonObj = {
              email: emailParams,
              assets: pdfAsset.itemId.toString()
            };
            this.handleSendMail(jsonObj).subscribe(
              result => {
                console.log('Done with handleSendMail');
                observer.next();
                observer.complete();
              },
              error => {
                console.log('Error');
                observer.error(error);
              }
            );
          } else {
            alert('Something went wrong. Please contact administrator');
          }
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  showPageError() {
    this.errorPages = this.navigationService.visitStatus.filter(status => status.hasError);
    this.errorPagesObj = _.keyBy(this.errorPages, SharedConstants.pageType);
  }

  handleValidation() {
    this.alertService.presentAlert(
      this.regionService.language['incompleteForm'],
      `${this.regionService.language['incompleteForms']}  ${this.errorPages.map(pages => `${this.regionService.language[pages.pageType]}`)}`,
      [this.regionService.language['confirmation']],
      'alert-danger'
    );
  }

  hasInvalidForms(): boolean {
    return this.errorPages && this.errorPages.length > 0;
  }
}
