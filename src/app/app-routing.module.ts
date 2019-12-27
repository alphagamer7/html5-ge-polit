import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingPage } from './pages/landing/screens/landing.page';
import { GeneralInformationPage } from './pages/general-information/screens/general-information.page';
import { FormulationAndControlPage } from './pages/formulation-and-control/screens/formulation-and-control.page';
import { PackagingPage } from './pages/packaging/screens/packaging.page';
import { ManufacturingPage } from './pages/manufacturing/screens/manufacturing.page';
import { DocumentationPage } from './pages/documentation/screens/documentation.page';
import { SummaryPage } from './pages/summary/screens/summary.page';
import { ConfirmationPage } from './pages/confirmation/confirmation.page';

const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  {
    path: 'landing',
    component: LandingPage
  },
  {
    path: 'general',
    component: GeneralInformationPage
  },
  {
    path: 'formulation',
    component: FormulationAndControlPage
  },
  {
    path: 'packaging',
    component: PackagingPage
  },
  {
    path: 'manufacturing',
    component: ManufacturingPage
  },
  {
    path: 'documentation',
    component: DocumentationPage
  },
  {
    path: 'summary',
    component: SummaryPage
  },
  {
    path: 'confirmation',
    component: ConfirmationPage
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { initialNavigation: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
