import { Component, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Content } from 'ionic-angular';

import { Store } from '@ngrx/store';

import { RegionService } from '@comparenetworks/imsmart-web';
import { PackagingManager } from './packaging.manager';
import { NavigationService } from 'src/app/shared/services/navigation.service';

import * as fromPackaging from 'src/app/shared/store/reducers/packaging.reducer';
import * as fromFormulatuon from 'src/app/shared/store/reducers/formulation-and-control.reducer';

@Component({
  selector: 'packaging',
  templateUrl: './packaging.page.html',
  styleUrls: ['./packaging.page.scss']
})
export class PackagingPage {
  @ViewChild('content') content: Content;
  pageType: string;
  isFormValid: boolean;
  isPageInited: boolean;
  showWarnings: boolean;

  showAppendix: boolean;
  private packagingManger: PackagingManager;

  constructor(
    private activatedRoute: ActivatedRoute,
    private regionService: RegionService,
    private store: Store<fromPackaging.PackagingState>,
    private formualtionStore: Store<fromFormulatuon.FormulationState>,
    private navigationService: NavigationService,
    private ngZone: NgZone
  ) {
    this.packagingManger = new PackagingManager(store, formualtionStore, navigationService, regionService);

    this.packagingManger.initializedFieldsCount = 0;
    this.isFormValid = false;
    this.isPageInited = false;
    this.pageType = this.activatedRoute.snapshot.routeConfig.path;

    this.packagingManger.init(this.pageType).subscribe(() => {
      this.isPageInited = true;
    });

    this.showAppendix = this.packagingManger.showAppendix;
  }

  handleNewPackage() {
    this.isFormValid = false;
    this.packagingManger.addNewPackage(true);
    this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 750);
  }

  handleButtonClicked(event) {
    this.showWarnings = true;
  }

  handleShowWarningsOnBreadcrumbNavigation(event) {
    if (event.pageType === this.pageType) {
      this.showWarnings = true;
    }
  }

  //#region  child component functions
  handleChildFormStatus(event) {
    this.ngZone.run(() => {
      this.isFormValid = event;
      this.packagingManger.setPageValidStatus(this.pageType, !this.isFormValid);
    });
  }

  handleUpdateStore(event) {
    this.packagingManger.updateStore(event.value, event.fieldName, event.packagingIndex);
  }

  handleGetPackagingTypeDependentOptionsEvent(event) {
    this.packagingManger.getPackagingTypeDependentOptions(event.packagingTypeId, event.packagingIndex);
  }

  handleGetPackagingOptioneDependentOptionsEvent(event) {
    this.packagingManger.getPackagingOptioneDependentOptions(event.packagingOptionId, event.packagingIndex);
  }

  handleGetFillVolumeValidRangeEvent(event) {
    this.packagingManger.getFillVolumeValidRange(event.outerPackagingId, event.packagingIndex);
  }
  //#endregion
}
