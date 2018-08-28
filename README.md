# Restaurants-search-MAP :fishing_pole_and_fish::coffee:
this is a simple web app:eyeglasses: for finding a restaurants :meat_on_bone: in a near-by place according to a database ,these data is collected using foursquare:beers: API endpoint also showing an image of each restaurant on map.
to run this app simply open **index.html**

## Technology used :tropical_drink:
* **Google Maps API**:doughnut:
* **Foursquare API**:cake:
* **JQuery**:ice_cream:
* **AJAX**:birthday:
* **BOOTSTRAB**:icecream:

## Files included :basketball:
* **index.html**:football:
this file has the base template for the app which call the map API to show within, also this file include links for **AJAX**, **JQUERY**, **BOOTSTRAB** and **GOOGLE-MAPs** with all libraries included.
* **img**:8ball:
this folder include all images used for markers and infowindow.
* **css**:baseball:
this folder include **styles.css** which have some styles for fonts and sizes for the side bar
* **js**:rugby_football:
this foler include many files written with JavaScript
  * **maperror.hs** :snowboarder:
  this file has a function for displaying an error message when any failure occure to the map
  * **app.js** :surfer:
  this file has a javascript code that handles all features in our app which is:gem:
    * show the map with a specific styling:microphone:.
    * show marker for each element with a specific position on the map ,retrieved from the model with using knockout framework:headphones:.
    * show info-Window for each marker with an image for that restaurant:saxophone:.
    * show a side-bar for listing all restaurants, each with name:guitar:.
    * show a search field for filtering the listed restaurants by name:trumpet:.
    * show an animation for the selected marker:art:.
