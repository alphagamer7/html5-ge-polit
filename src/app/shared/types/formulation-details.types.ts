import { ChemicalFormulationDetails } from './chemical-formulation.type';
import { QualityControlTest } from './quality-control-test.type';

export interface FormulationDetails {
  filteredFormulations: ChemicalFormulationDetails[];
  selectedFormulations: ChemicalFormulationDetails[];
  selectedQualityTests: QualityControlTest[];
  productName: string;
}
