import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';

import { LocalStorageService, MacsJsService, LanguageService } from '@comparenetworks/imsmart-web';
import { SharedConstants } from '../constants/shared-constants';

@Injectable()
export class UserConfigurationService {
  inited = false;
  constructor(private localStorageService: LocalStorageService, private languageService: LanguageService, private macsJsService: MacsJsService) {}

  init(): Observable<void> {
    return new Observable<void>((observer: Observer<void>) => {
      this.setUserRegionAndLocaleToLocalStorage().subscribe(() => {
        console.log('UserConfigurationService inited');

        // since language service depends on userLocale; initializing langauage service here
        this.languageService.init(['LanguageValue'], 'LanguageValue', this.getUserLocaleFromLocalStorage()).subscribe(() => {
          console.log('language service inited');
          this.inited = true;
          observer.next(null);
          observer.complete();
        });
      });
    });
  }

  setUserRegionAndLocaleToLocalStorage(): Observable<void> {
    return new Observable<void>((observer: Observer<void>) => {
      if (this.macsJsService.available) {
        macs.getUserRegionAndLanguage(
          res => {
            this.localStorageService.set(SharedConstants.storageKey.userLocaleStorageKey, res.Language);

            observer.next(null);
            observer.complete();
          },
          (error: any) => {
            console.log('userLocale error', error);
            observer.error(error);
            observer.complete();
          }
        );
      } else {
        observer.next(null);
        observer.complete();
      }
    });
  }

  getUserLocaleFromLocalStorage(): string {
    if (this.localStorageService.get(SharedConstants.storageKey.userLocaleStorageKey) !== null) {
      return this.localStorageService.get(SharedConstants.storageKey.userLocaleStorageKey);
    } else {
      return SharedConstants.defaultUserLocale;
    }
  }
}
