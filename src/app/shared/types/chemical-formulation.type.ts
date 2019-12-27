export interface ChemicalFormulationDetails {
  id: number;
  chemicalName: string;
  commonName: string;
  chemicalFormulation: string;
  cas: string;
  part: string;
  concentration: string;
  maxConcentration: string;
  concentrationUnit: string;
  isSelected?: boolean;
  supplier?: string;
  isAllowed?: string;
  showConcentrationError?: boolean;
  showError?: boolean;
  hasRequiredError?: boolean;
  hasValidationError?: boolean;
}
