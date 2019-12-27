import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { RegionService } from '@comparenetworks/imsmart-web';

import { RouterForward } from 'src/app/shared/store/actions/navigation.action';

@Component({
  selector: 'landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss']
})
export class LandingPage {
  pageType: string;

  constructor(private store: Store<any>, private activatedRoute: ActivatedRoute, private regionService: RegionService) {
    this.pageType = this.activatedRoute.snapshot.routeConfig.path;
  }

  nextPage(): void {
    this.store.dispatch(new RouterForward({ pageType: this.pageType }));
  }
}
