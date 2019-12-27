import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

export abstract class BaseComponent implements OnDestroy {
  public destroySubject$: Subject<void> = new Subject();

  public ngOnDestroy(): void {
    console.log('destroyed');
    this.destroySubject$.next();
  }
}
