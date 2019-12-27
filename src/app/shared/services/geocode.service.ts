import { Injectable } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { tap, map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { from } from 'rxjs';

declare var google: any;

export interface Location {
  lat: number;
  lng: number;
}

@Injectable()
export class GeocodeService {
  makerSettings: any;

  private geocoder: any;

  constructor(private mapLoader: MapsAPILoader) {
    this.makerSettings = {
      url: 'src/assets/img/marker/map_pointer.svg',
      scaledSize: {
        width: 40,
        height: 50
      }
    };
  }

  private initGeocoder() {
    this.geocoder = new google.maps.Geocoder();
  }

  private waitForMapsToLoad(): Observable<boolean> {
    if (!this.geocoder) {
      return from(this.mapLoader.load()).pipe(
        tap(() => this.initGeocoder()),
        map(() => true)
      );
    }
    return of(true);
  }

  geocodeAddress(locAdd: string): Observable<any> {
    return this.waitForMapsToLoad().pipe(
      switchMap(() => {
        return new Observable(observer => {
          this.geocoder.geocode({ address: locAdd }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
              console.log('Location Geocoded!');
              observer.next({
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng()
              });
            } else {
              observer.next({ lat: 0, lng: 0 });
            }
            observer.complete();
          });
        });
      })
    );
  }
}
