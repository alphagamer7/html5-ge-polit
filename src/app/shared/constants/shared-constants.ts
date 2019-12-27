import { Injectable } from '@angular/core';

@Injectable()
export class SharedConstants {
  public static defaultUserLocale = 'en';
  public static certificateOfAnalysisPdf = 'Certificare of Analysis';

  public static defaultZoom = 1.6;
  public static selectedZoom = 10;

  public static storageKey = {
    userLocaleStorageKey: 'userLocale'
  };

  public static bottomDrain = 'Bottom Drain';

  public static defaultPath = 'src/assets/configs/default.json';
  public static defaultDocumentationPath = `src/assets/pdf/Certificate of Analysis.pdf`;

  public static emailMessage = 'New Custom Product available for your review' + ' <br/><br/>';

  public static emailSubject = 'New Custom Product Request ';
  public static summaryPdfStylePath = 'src/assets/pdf/summary-style.css';
  public static certificatePdfStylePath = 'src/assets/pdf/certificate-style.css';

  public static concentrationDetails = 'concentrationDetails';

  public static concentrationUnitDetails = 'concentrationUnitDetails';

  public static pageType = 'pageType';
  public static configurationKeys = {
    region: 'region',
    configAssetId: 'configAssetId'
  };

  public static inputFieldTypes = {
    radio: 'radio',
    text: 'text',
    number: 'number',
    select: 'select',
    interfaceType: 'popover',
    list: 'list'
  };

  public static pageDetails = {
    landing: {
      path: 'landing',
      title: 'LANDING PAGE'
    },
    general: {
      path: 'general',
      title: 'generalInformationPageTitle',
      fieldKeys: {
        companyName: 'companyName',
        productType: 'productType',
        productionType: 'productionType',
        productApplication: 'productApplication',
        manufacturingLocation: 'manufacturingLocation'
      }
    },
    formulation: {
      path: 'formulation',
      title: 'formulationAndControlPageTitle',
      fieldKeys: {
        chemicalFormulationSearchInput: 'chemicalFormulationSearchInput',
        chemicalFormulation: 'chemicalFormulation',
        filterCategories: 'filterCategories',
        qualityControlTest: 'qualityControlTest',
        productName: 'productName',
        controlTest: 'controlTest'
      }
    },
    packaging: {
      path: 'packaging',
      title: 'packagingPageTitle',
      fieldKeys: {
        packagingType: 'packagingType',
        packagingOption: 'packagingOption',
        outerPackaging: 'outerPackaging',
        fillVolume: 'fillVolume',
        batchSize: 'batchSize',
        showManufacturingDate: 'showManufacturingDate'
      }
    },
    manufacturing: {
      path: 'manufacturing',
      title: 'manufacturingPageTitle',
      fieldKeys: {
        manufacturingType: 'manufacturingType',
        sampleRequirements: 'sampleRequirements',
        poreSize: 'poreSize',
        storageTemperature: 'storageTemperature',
        shippingConditions: 'shippingConditions',
        isTemperatureMonitoringRequired: 'isTemperatureMonitoringRequired'
      }
    },
    documentation: {
      path: 'documentation',
      title: 'documentationPageTitle',
      fieldKeys: {
        labelCustomization: 'labelCustomization',
        daysUntilExpiration: 'daysUntilExpiration',
        needQuoteForStabilityStudies: 'needQuoteForStabilityStudies'
      }
    },
    summary: {
      path: 'summary',
      title: 'summaryPageTitle'
    },
    confirmation: {
      path: 'confirmation',
      title: 'confirmationPageTitle'
    }
  };

  public static formulationTableHeaders = ['chemicalName', 'commonName', 'chemicalFormulation', 'cas', 'part', 'concentration', ''];

  public static qualityControlTestHeaders = ['qualityControlTest', 'specification', 'typeOfData', ''];

  public static certificateofAnalysisHeaders = ['inspection', 'specification', 'units', 'testResults'];

  public static qualityControlTestSummaryHeaders = ['qualityControlTest', 'specification'];
  public static lookupLimit = 10;

  public static maxFormulations = 8;

  public static packageContent = {
    productName: 'productName',
    formulation: 'formulation',
    catlogueNo: 'catlogueNo',
    bottleNo: 'bottleNo',
    volume: 'volume',
    storeAt: 'storeAt',
    mfgDate: 'mfgDate',
    expiryDate: 'expiryDate',
    lotNo: 'lotNo',
    customerName: 'customerName',
    sterlityStatement: 'sterlityStatement',
    intendedUseStatement: 'intendedUseStatement'
  };

  public static tableType = {
    productApplication: 'productApplication',
    chemical: 'chemical',
    qualityControlTest: 'qualityControlTest',
    manufacturingType: 'manufacturingType',
    storageTemperature: 'storageTemperature',
    shippingCondition: 'shippingCondition',
    packagingOption: 'packagingOption',
    packagingType: 'packagingType',
    productType: 'productType',
    outerPackaging: 'outerPackaging'
  };

  public static tableRelatedColumnNames = {
    isLiquidFormAvailable: 'isLiquidFormAvailable',
    isPowderFormAvailable: 'isPowderFormAvailable',
    isAllowed: 'isAllowed',
    concentration: 'concentration',
    unit: 'unit',
    productType: 'productType',
    packagingOptionId: 'packagingOptionId',
    packagingTypeId: 'packagingTypeId',
    id: 'id'
  };

  public static options = {
    index: 'index',
    value: 'value'
  };

  public static validationStatus = {
    quality: 'quality',
    formulation: 'formulation'
  };

  public static filterConditions = {
    notNullCheck: 'notNullCheck'
  };

  public static fieldNames = {
    qualityControlTestOptions: 'qualityControlTestOptions',
    formulations: 'formulations',
    manufacturingTypes: 'manufacturingTypes',
    shippingConditions: 'shippingConditions',
    storageTemperatures: 'storageTemperatures',
    packagingTypes: 'packagingTypes',
    packagingOptions: 'packagingOptions',
    outerPackagings: 'outerPackagings'
  };

  public static formualtionFieldNames = {
    commonName: 'commonName',
    chemicalName: 'chemicalName'
  };

  public static reducer = {
    formulation: 'product_wizard_formulation',
    documentation: 'product_wizard_documentation',
    generalInformation: 'product_wizard_generalInformation',
    manufacturing: 'product_wizard_manufacturing',
    packaging: 'product_wizard_packaging',
    summary: 'product_wizard_summary',
    navigation: 'product_wizard_navigation'
  };

  public static locationDefault = 'Location address is not provided';

  public static NaOH = 'NaOH';

  public static cssClass = {
    col2: 'col-2-width-select',
    col25: 'col-25-width-select',
    col35: 'col-35-width-select',
    col50: 'col-50-width-select',
    col100: 'col-100-width-select'
  };

  public static maxBatchSize = 9999999;

  public static finishProductFormulation = 'Finish Product Formulation';

  public static contentCollapseTypes = {
    collapseQualityControl: 'collapseQualityControl',
    collapseChemical: 'collapseChemical'
  };

  public static googleMapAipKey = 'AIzaSyCAzgFg-vFXpmDTyiNiqRphPVKlRWEgq8M';
}
