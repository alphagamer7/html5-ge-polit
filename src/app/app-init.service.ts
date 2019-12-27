import { Injectable } from '@angular/core';

import { ConfigurationService } from 'ionic-configuration-service';

import { SQLService, MacsJsService, SettingOption, LanguageService } from '@comparenetworks/imsmart-web';

import { Observable } from 'rxjs/Rx';
import { concat } from 'rxjs/observable/concat';
import { UserConfigurationService } from './shared/services/user-configuration.service';
import { SharedConstants } from './shared/constants/shared-constants';

interface GetAssetPathResponse {
  assetPath: string;
}

@Injectable()
export class AppInitService {
  defaultRegion: SettingOption;

  constructor(
    private macsJsService: MacsJsService,
    private sqlService: SQLService,
    private configurationService: ConfigurationService,
    private userConfigurationService: UserConfigurationService,
    private region: LanguageService
  ) {}

  private loadDefaultConfigs(): Observable<void> {
    return new Observable<void>(observer => {
      const getParam = (name: string): string => {
        const decodedUrl = decodeURIComponent(location.search);
        const paramObjStr = decodedUrl.split('?')[1] || '';
        const paramObj: any = paramObjStr !== '' ? JSON.parse(paramObjStr) : null; // could create a typed shape for the params

        let assetParams: string[];
        const assets: any = {};
        if (paramObj) {
          assetParams = paramObj.assetParams.split('&');
          assetParams.forEach((param: string) => {
            const parts = param.split('=');
            assets[parts[0]] = parts[1];
          });
        }

        return assets[name] || null;
      };

      const loadConfig = (path: string) => {
        this.configurationService.load(path).then(() => {
          this.defaultRegion = this.configurationService.getValue(SharedConstants.configurationKeys.region);
          observer.next();
          observer.complete();
        });
      };

      if (this.macsJsService.available) {
        const configAssetId: string = getParam(SharedConstants.configurationKeys.configAssetId);

        if (configAssetId) {
          macs.getAssetPath(configAssetId, (response: GetAssetPathResponse) => loadConfig(response.assetPath), (e: any) => observer.error(e));

          // No shortcut param
        } else {
          loadConfig(SharedConstants.defaultPath);
        }

        // Desktop
      } else {
        loadConfig(SharedConstants.defaultPath);
      }
    });
  }

  init(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.showSpinner();
      concat(this.macsJsService.init(4), this.loadDefaultConfigs()).subscribe(
        () => {},
        (error: any) => reject(error),
        () => {
          concat(
            this.sqlService.initDB(`${this.defaultRegion.name}.${this.defaultRegion.type}`, false, this.defaultRegion.name, this.defaultRegion.id),
            this.userConfigurationService.init()
          ).subscribe(
            () => {},
            (err: any) => reject(new Error(JSON.stringify(err))),
            () => {
              console.log('inited app');
              resolve();
            }
          );
        }
      );
    });
  }

  showSpinner() {
    if (document.getElementById('spinner')) {
      document.getElementById('spinner').style.opacity = '1';
    }
  }
}
