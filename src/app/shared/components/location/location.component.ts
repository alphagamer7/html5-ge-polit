import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges, NgZone, ViewChild } from '@angular/core';
import { AgmMap, MapsAPILoader } from '@agm/core';

import { FormBuilder, FormGroup } from '@angular/forms';

import { fromEvent, merge, of } from 'rxjs';
import { mapTo } from 'rxjs/operators';

import {} from 'google-maps';

import { RegionService } from '@comparenetworks/imsmart-web';

import { GeocodeService } from 'src/app/shared/services/geocode.service';
import { ValidatorService } from 'src/app/shared/services/validator.service';

import { SharedConstants } from 'src/app/shared/constants/shared-constants';

@Component({
  selector: 'location',
  templateUrl: 'location.component.html',
  styleUrls: ['location.component.scss']
})
export class LocationComponent implements OnInit, OnChanges {
  @ViewChild(AgmMap)
  public agmMap: AgmMap;
  @Input() selectedLocation: string;
  @Input() locationFiledDetails: any;
  @Input() locationId: string;

  @Output() handleLocationSelect: EventEmitter<any> = new EventEmitter();

  showMarker: boolean;
  isFetching: boolean;
  showWarning: boolean;

  private zoom: number;
  private lat: number;
  private lng: number;
  private autocompleteInputVal: string;
  private autocompleteItems: any[];
  private online$: any;
  private onlineMap: boolean;
  private address: string;
  private genFormGroup: FormGroup;
  isDefaultLocation = false;

  GoogleAutocomplete: any;

  constructor(
    private geocodeService: GeocodeService,
    private regionService: RegionService, // used to get texts in html
    private formBuilder: FormBuilder,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private validator: ValidatorService
  ) {
    this.isFetching = false;
    this.autocompleteInputVal = '';
    this.autocompleteItems = [];
  }

  ngOnInit() {
    this.zoom = SharedConstants.defaultZoom; // to show world map

    this.mapsAPILoader.load().then(() => {
      this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    });

    this.online$ = merge(
      of(navigator.onLine),
      fromEvent(window, 'online').pipe(mapTo(true)),
      fromEvent(window, 'offline').pipe(mapTo(false))
    );

    this.online$.subscribe(isOnline => {
      this.onlineMap = isOnline;

      if (this.onlineMap) {
        // for general information page
        if (this.selectedLocation && this.genFormGroup && this.selectedLocation !== SharedConstants.locationDefault) {
          this.genFormGroup.get(SharedConstants.pageDetails.general.fieldKeys.manufacturingLocation).setValue(this.selectedLocation);
          this.setMapMarkers(this.selectedLocation);
        } else if (this.locationId && this.locationId === SharedConstants.locationDefault) {
          // for summary page
          this.isDefaultLocation = true;
          this.zoom = SharedConstants.defaultZoom;
        } else {
          this.setMapMarkers(this.locationId);
        }
      } else {
        if (this.genFormGroup) {
          this.genFormGroup.get(SharedConstants.pageDetails.general.fieldKeys.manufacturingLocation).reset();
          this.autocompleteItems = [];
          this.showWarning = false;
          this.showMarker = false;
        }
      }
    });

    this.genFormGroup = this.formBuilder.group({
      manufacturingLocation: ['', this.validator.trimFileldsNotRequired]
    });
  }

  resizeMap(): void {
    setTimeout(() => {
      this.agmMap.triggerResize();
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.selectedLocation &&
      changes.selectedLocation.currentValue &&
      this.genFormGroup &&
      this.selectedLocation !== SharedConstants.locationDefault
    ) {
      this.genFormGroup
        .get(SharedConstants.pageDetails.general.fieldKeys.manufacturingLocation)
        .setValue(changes.selectedLocation.currentValue);
      this.setMapMarkers(changes.selectedLocation.currentValue);
    }
    if (changes.locationId && changes.locationId.currentValue && this.locationId !== SharedConstants.locationDefault) {
      this.genFormGroup.get(SharedConstants.pageDetails.general.fieldKeys.manufacturingLocation).setValue(changes.locationId.currentValue);
      this.setMapMarkers(changes.locationId.currentValue);
    }
  }

  updateSearchResults(event: any) {
    if (this.onlineMap) {
      this.autocompleteInputVal = event.target.value;
    } else {
      this.showMarker = false;
      this.genFormGroup.get(SharedConstants.pageDetails.general.fieldKeys.manufacturingLocation).reset();
    }

    if (!this.autocompleteInputVal.length) {
      this.showMarker = false;
      this.autocompleteItems = [];
      this.handleLocationSelect.emit('');
      this.zoom = SharedConstants.defaultZoom;
      this.resizeMap();

      return;
    }

    this.isFetching = true;

    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocompleteInputVal }, (predictions, status) => {
      this.autocompleteItems = [];
      this.ngZone.run(() => {
        if (this.onlineMap) {
          if (predictions !== null) {
            this.autocompleteItems = [...predictions];
            this.showWarning = false;
          } else {
            this.showWarning = true;
          }
        }

        this.isFetching = false;
      });
    });
  }

  selectSearchResult(item) {
    this.autocompleteItems = [];
    this.address = item.description;
    this.genFormGroup.get(SharedConstants.pageDetails.general.fieldKeys.manufacturingLocation).setValue(item.description);

    this.autocompleteInputVal = this.address;
    this.handleLocationSelect.emit(item.description);
    this.setMapMarkers(item.description);
  }

  setMapMarkers(locAdd: string) {
    if (this.autocompleteInputVal === this.address || (this.locationId && this.locationId.length)) {
      this.geocodeService.geocodeAddress(locAdd).subscribe(
        location => {
          this.ngZone.run(() => {
            this.lat = location.lat;
            this.lng = location.lng;
            this.zoom = SharedConstants.selectedZoom;
            this.showMarker = true;

            this.resizeMap();
          });
        },
        error => {
          this.showMarker = false;
        }
      );
    } else {
      this.zoom = SharedConstants.defaultZoom;
      this.resizeMap();
      return this.clearSearch();
    }
  }

  clearSearch() {
    this.handleLocationSelect.emit(SharedConstants.locationDefault);
    this.showMarker = false;
    this.showWarning = false;
  }
}
