# html5-ge-pilot - GE Cell Culture Tool

1.  Based on ionic (ionic-4.0.0 - css 4) and angular (angular - 7).
2.   [ngrx](https://ngrx.io/)
 is used for state management.

# Deployment instructions

1. Upload 'ge-pilot' database to cms.
2. Change 'id' property value in '/assets/configs/default.json' based on 'ge-pilot' db asset id in cms.
3. Build the app with 'ionic build --target production --environment production' and upload the built files to cms.

# ngrx

## State
App consist of one store. Reducers are created page wise for code maintainability and single responsibility. 


In `Packaging`, state is updated in a mutable way since whole page will be refreshed when multiple packagings are supported. 
In `Formulation`, state is updated in a immutable way with `trackBy` attribute in ionic to avoid DOM refresh and focus loss. 
All other fields are updated immutable way.

## State Update
State is updated by dispatching actions based on user action triggers or through effects.



<img width="732" alt="Screen Shot 2019-04-05 at 11 02 06 PM" src="https://user-images.githubusercontent.com/20789116/55645738-f5dd4080-57f6-11e9-9453-24be699e563f.png">




