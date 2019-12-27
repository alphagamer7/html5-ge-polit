import { Component, ViewContainerRef, ViewChildren, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

import { RegionService, PDFParams, PDFService } from '@comparenetworks/imsmart-web';

import { FormControlObject, CRMFormService } from 'src/app//shared/services/crm-form.service';
import { UtilityService } from 'src/app/shared/services/utility.service';

import * as fromDocumentation from '../../../shared/store/reducers/documentation.reducer';

import { CrmDataTableHeader } from 'src/app/shared/types/crm-datatable.type';
import { Confirmation } from 'src/app/shared/constants/shared-enum';
import { SharedConstants } from 'src/app/shared/constants/shared-constants';
import { Store } from '@ngrx/store';
import { NavigationService } from 'src/app//shared/services/navigation.service';
import { NavigationState } from 'src/app/shared/store/reducers/navigation.reducer';
import { DocumentationManager } from './documentation.manager';

@Component({
  selector: 'documentation',
  templateUrl: './documentation.page.html',
  styleUrls: ['./documentation.page.scss']
})
export class DocumentationPage implements AfterViewInit {
  @ViewChildren('pdfBody', { read: ViewContainerRef })
  pdfBody: ViewContainerRef;
  fields: {};
  fieldKeys: any;
  pdfParams: PDFParams;
  documentationForm: FormGroup;
  formIsReady: boolean;
  isFormValid: boolean;
  pageType: string;
  isPdfCreated: boolean;
  srcPath: string;

  showWarnings: boolean;

  objectKeys = Object.keys;
  confirmations = Confirmation;

  pdfAssetTitle = SharedConstants.certificateOfAnalysisPdf;

  certificateAnalysisHeaders: CrmDataTableHeader[];
  private documentationFormControlObject: FormControlObject;
  private documentationManager: DocumentationManager;
  certificateDetails = {
    productDetail: {}
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private crmFormService: CRMFormService,
    private pdfService: PDFService,
    private utilityService: UtilityService,
    private store: Store<fromDocumentation.DocumentationState>,
    private navigationService: NavigationService,
    private navigationStore: Store<NavigationState>,
    private regionService: RegionService
  ) {
    this.documentationManager = new DocumentationManager(store, navigationService, navigationStore);
    this.isFormValid = false;
    this.certificateAnalysisHeaders = utilityService.getTableHeaderElements(SharedConstants.certificateofAnalysisHeaders);
    this.pageType = this.activatedRoute.snapshot.routeConfig.path;

    this.documentationManager.init(this.pageType).subscribe(() => {
      this.fields = this.documentationManager.fields;
      this.fieldKeys = this.documentationManager.fieldKeys;
      this.buildForm();
    });
    // this.documentationManager.setPageValidStatus(this.pageType, false);
  }

  ngAfterViewInit() {
    this.handleGeneratePdf();
  }

  //#region pdf

  /**
   * Convert the html to pdf -- Hardcoded for now since no data given
   **/
  handleGeneratePdf() {
    // this.pdfParams = {
    //   title: this.pdfAssetTitle,
    //   html: this.pdfBody['_results'][0].element.nativeElement.innerHTML,
    //   styleUrl: SharedConstants.certificatePdfStylePath,
    //   saveType: 2,
    //   fileName: this.pdfAssetTitle,
    //   pageFooter: '<html></html>',
    //   pageFooterHeight: '20'
    // };

    // // Apply styles for html
    // this.pdfService.createPDFHTML(this.pdfParams).subscribe(res => {
    //   console.log(res);
    //   const jsonObj = {
    //     pageContent: encodeURI(res),
    //     width: '',
    //     height: '',
    //     topAndBottomMarginSize: '10',
    //     leftAndRightMarginSize: '10',
    //     generatedPDFName: this.pdfAssetTitle
    //   };
    //   this.documentationManager.getPathForConvertedPDFFileFromHTML(jsonObj).subscribe(
    //     result => {
    //       this.srcPath = result;
    //       this.isPdfCreated = true;
    //     },
    //     err => {
    //       console.log(err);
    //     }
    //   );
    // });

    this.srcPath = this.documentationManager.convertPdfPathForPreview('');
    this.isPdfCreated = true;
  }

  /**
   * Pdf viewer onError
   **/
  onError(error: any) {
    console.log(JSON.stringify(error.message));
  }

  handlePreview() {
    macs.viewAsset(SharedConstants.defaultDocumentationPath);
  }

  //#endregion

  //#region form

  private buildForm(): void {
    this.documentationFormControlObject = this.generateFormControlObj();
    this.documentationForm = this.formBuilder.group(this.documentationFormControlObject);

    setTimeout(() => {
      this.formIsReady = true;
      this.updateForm();
    }, 600);
  }

  private generateFormControlObj(): FormControlObject {
    const pageFormControlObject: FormControlObject = {};

    _.keys(this.fields).forEach((fieldKey: string) => {
      pageFormControlObject[this.fields[fieldKey].name] = this.crmFormService.buildFormControl(this.fields[fieldKey]);

      pageFormControlObject[this.fields[fieldKey].name] = this.initializeValues(pageFormControlObject, this.fields[fieldKey]);

      this.subscribeFormChanges(pageFormControlObject, this.fields[fieldKey]);
    });

    return pageFormControlObject;
  }

  private initializeValues(pageFormControlObject: FormControlObject, field: any): any {
    switch (field.type) {
      case SharedConstants.inputFieldTypes.radio:
        pageFormControlObject[field.name] = this.crmFormService.initializeRadioValues(field, pageFormControlObject, this.documentationManager.formDetails);
        break;
      case SharedConstants.inputFieldTypes.text:
        pageFormControlObject[field.name] = this.crmFormService.initializeTextFieldValues(field, pageFormControlObject, this.documentationManager.formDetails);
        break;
      case SharedConstants.inputFieldTypes.number:
        pageFormControlObject[field.name] = this.crmFormService.initializeTextFieldValues(field, pageFormControlObject, this.documentationManager.formDetails);

        break;
    }

    return pageFormControlObject[field.name];
  }

  private subscribeFormChanges(pageFormControlObject: FormControlObject, field: any) {
    pageFormControlObject[field.name].valueChanges.subscribe((value: any) => {
      if (value != null) {
        switch (field.type) {
          case SharedConstants.inputFieldTypes.text:
            this.documentationManager.updateStore(value.trim(), field.name);
            break;
          case SharedConstants.inputFieldTypes.number:
            if (!this.documentationForm.get('daysUntilExpiration').errors) {
              this.documentationManager.updateStore(value, field.name);
            }
            break;
          case SharedConstants.inputFieldTypes.radio:
            this.documentationManager.updateStore(value, field.name);
            break;
        }
      }
      this.updateForm();
    });
  }

  handleButtonClicked(event) {
    this.showWarnings = event;
  }

  private updateForm(): void {
    this.isFormValid = !this.documentationForm.get('daysUntilExpiration').errors;
    this.documentationManager.setPageValidStatus(this.pageType, !this.isFormValid);
  }

  //#endregion
}
