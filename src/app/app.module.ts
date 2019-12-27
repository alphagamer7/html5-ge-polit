import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { RegionService, SQLService, LocalStorageService, MacsJsService, LanguageService, PDFService } from '@comparenetworks/imsmart-web';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AgmCoreModule } from '@agm/core';

import { PdfViewerModule } from 'ng2-pdf-viewer';

// import { reducers, metaReducers } from './store/reducer';
import { reducers, metaReducers } from './shared/store/reducers/reducer';

// effects
import { EffectsModule } from '@ngrx/effects';
import { RouterEffects } from './shared/store/effects/navigation.effects';
import { GeneralInformationEffects } from './shared/store/effects/general-information.effects';
import { PackagingEffects } from './shared/store/effects/packaging.effects';
import { ManufacturingEffects } from './shared/store/effects/manufacturing.effects';
import { FormulationEffects } from './shared/store/effects/formulation-and-control.effects';

// pages
import { DocumentationPage } from './pages/documentation/screens/documentation.page';
import { FormulationAndControlPage } from './pages/formulation-and-control/screens/formulation-and-control.page';
import { GeneralInformationPage } from './pages/general-information/screens/general-information.page';
import { LandingPage } from './pages/landing/screens/landing.page';
import { ManufacturingPage } from './pages/manufacturing/screens/manufacturing.page';
import { PackagingPage } from './pages/packaging/screens/packaging.page';
import { SummaryPage } from './pages/summary/screens/summary.page';
import { ConfirmationPage } from './pages/confirmation/confirmation.page';

// pages components
import { ManufacturingInfoComponent } from './pages/manufacturing/components/manufacturing-info.component';
import { PackageContentComponent } from './pages/packaging/components/package-content/package-content.component';
import { PackagingSummaryComponent } from './pages/summary/components/packaging-summary/packaging-summary.component';
import { CertificatePdfComponent } from './pages/documentation/components/certificate-pdf/certificate-pdf.component';
import { GenericSummaryComponent } from './pages/summary/components/generic-summary/generic-summary.component';
import { PackagingDetailsComponent } from './pages/packaging/components/package-details/packaging-details.component';
import { FormulationLookupComponent } from './pages/formulation-and-control/components/formulation-lookup/formulation-lookup.component';
import { FormulationSummaryComponent } from './pages/summary/components/formulation-summary/formulation-summary.component';
import { CommonSummaryComponent } from './pages/summary/components/common-summary/common-summary.component';
import { SummaryPdfComponent } from './pages/summary/components/summary-pdf/summary-pdf.component';

// common components
import { BreadcrumbComponent } from './shared/components/breadcrumb/breadcrumb.component';
import { PageFooterComponent } from './shared/components/page-footer/page-footer.component';
import { HeaderSectionComponent } from './shared/components/header-section/header-section.component';
import { LocationComponent } from './shared/components/location/location.component';
import { CNButtonComponent } from './shared/components/cn-button/cn-button.component';
import { DataTableComponent } from './shared/components/data-table/data-table.component';
import { QualityControlComponent } from './shared/components/quality-control/quality-control.component';

// Services
import { ValidatorService } from './shared/services/validator.service';
import { NavigationService } from './shared/services/navigation.service';
import { AppInitService } from './app-init.service';
import { UserConfigurationService } from './shared/services/user-configuration.service';
import { CrmDatabaseService } from './shared/services/crm-database.service';
import { GeneralInformationService } from '../app/shared/services/component-services/general-information.service';
import { CRMFormService } from './shared/services/crm-form.service';
import { PackagingService } from '../app/shared/services/component-services/packaging.service';
import { ManufacturingService } from '../app/shared/services/component-services/manufacturing.service';
import { AlertService } from './shared/services/alert.service';
import { FormulationService } from '../app/shared/services/component-services/formulation-and-control.service';
import { BreadcrumbService } from './shared/components/breadcrumb/breadcrumb.service';
import { PageFooterService } from './shared/components/page-footer/page-footer.service';
import { ConfigurationService } from 'ionic-configuration-service';
import { GeocodeService } from './shared/services/geocode.service';
import { UtilityService } from './shared/services/utility.service';

import { SharedConstants } from 'src/app/shared/constants/shared-constants';

export function initApplication(appInitService: AppInitService): () => Promise<void> {
  return () => appInitService.init();
}

@NgModule({
  declarations: [
    AppComponent,
    DocumentationPage,
    FormulationAndControlPage,
    GeneralInformationPage,
    LandingPage,
    ManufacturingPage,
    PackagingPage,
    SummaryPage,
    ConfirmationPage,
    BreadcrumbComponent,
    CNButtonComponent,
    PageFooterComponent,
    HeaderSectionComponent,
    GenericSummaryComponent,
    PackagingSummaryComponent,
    PackagingDetailsComponent,
    LocationComponent,
    ManufacturingInfoComponent,
    PackageContentComponent,
    CertificatePdfComponent,
    DataTableComponent,
    FormulationLookupComponent,
    QualityControlComponent,
    FormulationSummaryComponent,
    CommonSummaryComponent,
    SummaryPdfComponent
  ],
  entryComponents: [
    LandingPage,
    FormulationAndControlPage,
    DocumentationPage,
    GeneralInformationPage,
    LandingPage,
    ManufacturingPage,
    PackagingPage,
    SummaryPage,
    ConfirmationPage,
    FormulationLookupComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      mode: 'ios',
      scrollPadding: false,
      scrollAssist: false
    }),
    AppRoutingModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    ReactiveFormsModule,
    PdfViewerModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([RouterEffects, GeneralInformationEffects, PackagingEffects, ManufacturingEffects, FormulationEffects]),
    StoreDevtoolsModule.instrument({}),
    AgmCoreModule.forRoot({
      apiKey: SharedConstants.googleMapAipKey,
      libraries: ['places']
    })
  ],
  providers: [
    RegionService,
    SQLService,
    LocalStorageService,
    MacsJsService,
    LanguageService,
    PDFService,
    UserConfigurationService,
    CrmDatabaseService,
    NavigationService,
    GeneralInformationService,
    CRMFormService,
    PackagingService,
    ManufacturingService,
    ValidatorService,
    AlertService,
    FormulationService,
    BreadcrumbService,
    PageFooterService,
    PDFService,
    UtilityService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ConfigurationService,
    AppInitService,
    {
      provide: APP_INITIALIZER,
      useFactory: initApplication,
      deps: [AppInitService],
      multi: true
    },
    GeocodeService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
