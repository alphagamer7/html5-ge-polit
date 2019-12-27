import { CNSelectOption } from '@comparenetworks/imsmart-web/components/cn-select/cn-select.type';

export interface Packaging {
  packagingIndex: number;
  packagingType: string;
  packagingOption: string;
  outerPackaging: string;
  fillVolume: string;
  batchSize: string;
  showManufacturingDate: boolean;
  packagingOptions: CNSelectOption[];
  outerPackagings: CNSelectOption[];
  packagingTypes: CNSelectOption[];
  fillVolumeRanges: string[];
}
