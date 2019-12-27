export enum ProductType {
  liquid = 'Liquid',
  powder = 'Powder'
}

export enum ProductionType {
  rrp = 'RRP',
  gmp = 'GMP'
}

export enum Confirmation {
  yes = 'Yes',
  no = 'No'
}

export enum PoreSize {
  poreSize1 = '.1 μm',
  poreSize2 = '.2 μm'
}

export enum CommonActionTypes {
  CLEAR_STATE = 'CLEAR_STATE',
  SET_PRODUCT_TYPE = 'SET_PRODUCT_TYPE'
}

export enum FilterCategory {
  allCategories = 'allCategories',
  chemicalName = 'chemicalName',
  commonName = 'commonName',
  chemicalFormulation = 'chemicalFormulation',
  cas = 'cas',
  part = 'part'
}

export enum PowderConcentrationUnit {
  m = 'm',
  g = 'g'
}

export enum LiquidConcentrationUnit {
  M = 'M',
  l = 'l'
}

export enum TypeOfData {
  historical = 'Historical',
  theoritical = 'Theoretical'
}
