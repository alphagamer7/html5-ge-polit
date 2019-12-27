import { Injectable } from '@angular/core';

import { Observable, Observer, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';

import { NavigationService } from 'src/app/shared/services/navigation.service';

import { InitialRoute } from 'src/app/shared/store/actions/navigation.action';
import { UpdateModel } from '../../../shared/store/actions/documentation.action';

import * as fromDocumentation from '../../../shared/store/reducers/documentation.reducer';
import { NavigationState } from 'src/app/shared/store/reducers/navigation.reducer';

import { Documentation } from 'src/app/shared/types/documentation.type';

import { SharedConstants } from 'src/app/shared/constants/shared-constants';

export class DocumentationManager {
  fields: {};
  isInitialized: boolean;
  formDetails: Documentation;

  private destroySelectorSubject$: Subject<void> = new Subject();

  // Dev dummy data
  produtDetails = {
    productName: 'productName',
    partNo: 'XXXX',
    lotNo: 'XXXX',
    catlogueNo: 'XXXX',
    mfgDate: 'MMM/YYYY',
    expiryDate: 'MMM/YYYY'
  };
  qualityTestResults = [
    {
      inspection: 'QA TEST',
      specification: 'Requirement',
      units: 'Description',
      testResults: 'Test Results'
    }
  ];

  fieldKeys = SharedConstants.pageDetails.documentation.fieldKeys;

  constructor(
    private store: Store<fromDocumentation.DocumentationState>,
    private navigationService: NavigationService,
    private navigationStore: Store<NavigationState>
  ) {
    this.fields = {
      labelCustomization: {
        name: this.fieldKeys.labelCustomization,
        type: SharedConstants.inputFieldTypes.text,
        label: this.fieldKeys.labelCustomization,
        placeholder: 'labelCustomizationPlaceholder',
        trimNotRequired: true
      },
      daysUntilExpiration: {
        name: this.fieldKeys.daysUntilExpiration,
        type: SharedConstants.inputFieldTypes.number,
        label: this.fieldKeys.daysUntilExpiration,
        placeholder: 'daysUntilExpirationlaceholder',
        number: true
      },
      needQuoteForStabilityStudies: {
        name: this.fieldKeys.needQuoteForStabilityStudies,
        type: SharedConstants.inputFieldTypes.radio,
        label: this.fieldKeys.needQuoteForStabilityStudies
      }
    };

    this.subscribeToStore();
  }

  init(pageType: string): Observable<void> {
    return new Observable<void>((observer: Observer<void>) => {
      if (!this.navigationService.checkVisitStatus(pageType)) {
        this.navigationStore.dispatch(new InitialRoute({ pageType }));
      }

      observer.next(null);
      observer.complete();
    });
  }

  private subscribeToStore() {
    this.store
      .pipe(select(fromDocumentation.getDocumentFormDetails))
      .pipe(takeUntil(this.destroySelectorSubject$))
      .subscribe(value => {
        this.formDetails = value;
      });

    this.store
      .pipe(select(fromDocumentation.unsubscribeForSelectors))
      .pipe(takeUntil(this.destroySelectorSubject$))
      .subscribe(value => {
        if (value === true) {
          this.destroySelectorSubject$.next();
        }
      });
  }

  updateStore(value: any, fieldName: string): void {
    this.store.dispatch(
      new UpdateModel({
        value: value,
        name: fieldName
      })
    );
  }

  //#region  pdf
  getPathForConvertedPDFFileFromHTML(jsonObj: any): Observable<string> {
    return new Observable<string>((observer: Observer<string>) => {
      macs.getPathForConvertedPDFFileFromHTML(
        jsonObj,
        result => {
          observer.next(this.convertPdfPathForPreview(result['filePath']));
          observer.complete();
        },
        result => {
          console.log('fail', result);
          observer.error(result);
        }
      );
    });
  }

  /**
   * Since ng2-pdf-viewer doesn't allow accessing path directly
   * make a request to get file and convert it to type blob & return src url
   **/
  convertPdfPathForPreview(fileName: string): string {
    const xhr = new XMLHttpRequest();
    let urlBlob;
    xhr.open('GET', SharedConstants.defaultDocumentationPath, false);
    xhr.responseType = 'blob';

    xhr.onload = (e: any) => {
      if (xhr) {
        const blob = new Blob([xhr.response], {
          type: 'application/pdf'
        });
        urlBlob = URL.createObjectURL(blob);
      }
    };
    xhr.send();
    return urlBlob;
  }
  //#endregion

  setPageValidStatus(pageType: string, hasErrors: boolean) {
    if (this.navigationService.hasVisitedNextPage(pageType)) {
      this.navigationService.setPageValidStatus(pageType, hasErrors);
    }
  }
}
