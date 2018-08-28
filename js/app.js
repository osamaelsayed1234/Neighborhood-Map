/*MODEL*/
//some restaurants in Cairo using foursquare API but this API 
//is paid so it only load once per day to enable loading data using AJAX request
var initialRestaurants = [{
  "name": "Estoril",
  "location": {"lat": 30.04699030503939, "lng": 31.23748654337582},
  "fs_id": "4bebd8b56295c9b676208808"
},{
  "name": "Felfela ",
  "location": {"lat": 30.04650722728482, "lng": 31.23806508239997},
  "fs_id": "4be850e6c5220f47e096a9ca"
},{
  "name": "CaiRoma",
  "location": {"lat": 30.045853, "lng": 31.239154},
  "fs_id": "5845b7acf63c54143e6a3fa7"
},{
  "name": "Le Bistro",
  "location": {"lat": 30.04576384431274, "lng": 31.2405503900447},
  "fs_id": "4ca768eff47ea143444f6a21"
},{
  "name": "Cook Door",
  "location": {"lat": 30.0459380666545, "lng": 31.240087591601046},
  "fs_id": "4d1f3ca45c4ca1cdd4d6973d"
},{
  "name": "Pomodoro",
  "location": {"lat": 30.043974937353155, "lng": 31.24189853668213},
  "fs_id": "4e87668f6c256685203ddadf"
},{
  "name": "McDonald's",
  "location": {"lat": 30.043604864679143, "lng": 31.236923047681152},
  "fs_id": "4d7f7f172ff9b60c40efbe47"
},{
  "name": "Hardee's",
  "location": {"lat": 30.04393941901806, "lng": 31.236173770139178},
  "fs_id": "4ca4199dd695199c671f4ae7"
},{
  "name": "Oldish",
  "location": {"lat": 30.04328962378612, "lng": 31.238548815787226},
  "fs_id": "568e42db498eea0e9af4bc24"
},{
  "name": "Bagah",
  "location": {"lat": 30.040928946500255, "lng": 31.2438996260669},
  "fs_id": "5175b470e4b06f73766d31dc"
},{
  "name": "Bab Al Sharq",
  "location": {"lat": 30.046303955891542, "lng": 31.232971091161655},
  "fs_id": "56c4a33fcd10ff1b7c97970e"
},{
  "name": "Birdcage",
  "location": {"lat": 30.042932876438794, "lng": 31.231741017178017},
  "fs_id": "4bf98802b182c9b6261b795a"
}];
// Create global variables to use in google maps.
var map,
  infowindow,
  bounds;
// Foursquare API url parameters, this will load to ajax 
var BaseUrl = "https://api.foursquare.com/v2/venues/",
    fsClient_id = "client_id=WGGEKCLYWHZHKSZN2E30P252EWKRMDX0R3SFTHSLMDZWVAFY",
    fsClient_secret = "&client_secret=025A4QE3UQOX5EU30PSHJ2AV30AFL3CAXTO3SWBUIDEBNCDW",
    fsVersion = "&v=20180814";

//this function is called when page is loaded with the map,the main map viewer.
function googleSuccess() {
  "use strict";
  //set custom map marker with image and with size 32x32.
  var image = {
    "url": "img/32x32.png",
    "size": new google.maps.Size(32, 32),
    "origin": new google.maps.Point(0, 0),// The origin for this image is (0, 0).
    "anchor": new google.maps.Point(0, 32)// The anchor is the base of the flagpole at (0, 32).
  };

  //set map style
  var mapOptions = {
    "center": {
      "lat": 30.046438,
      "lng": 31.238428
    },
    zoom: 15,
    styles: [
    {
      "featureType": "landscape",
      "stylers": [
        { "hue": "#FFBB00"},
        {"saturation": 43.400000000000006},
        {"lightness": 37.599999999999994},
        {"gamma": 1}
      ]
    },{
      "featureType": "road.highway",
      "stylers": [
        {"hue": "#FFC200"},
        {"saturation": -61.8},
        {"lightness": 45.599999999999994},
        {"gamma": 1}
      ]
    },{
      "featureType": "road.arterial",
      "stylers": [
        {"hue": "#FF0300"},
        {"saturation": -100},
        {"lightness": 51.19999999999999},
        {"gamma": 1}
      ]
    },{
      "featureType": "road.local",
      "stylers": [
        {"hue": "#FF0300"},
        {"saturation": -100},
        {"lightness": 52},
        {"gamma": 1}
      ]
    },{
      "featureType": "water",
      "stylers": [
        {"hue": "#0078FF"},
        {"saturation": -13.200000000000003},
        {"lightness": 2.4000000000000057},
        {"gamma": 1}
      ]
    },{
      "featureType": "poi",
      "stylers": [
        {"visibility": "off"}
      ]
    }],
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    mapTypeControlOptions: {
    style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
    }
  };
  map = new google.maps.Map(document.getElementById("map"), mapOptions);
  infowindow = new google.maps.InfoWindow({
    maxWidth: 150,
    content: ""
  });

  //Creating Space object for data and markers on the map
  var Space = function (data, id, map) {
    var self = this;
    this.name = ko.observable(data.name);
    this.location = data.location;
    this.marker = "";
    this.markerId = id;
    this.fs_id = data.fs_id;
    this.shortUrl = "";
    this.photoUrl = "";
  };
  // Exit infowindow when clicked elsewhere on the map
  map.addListener("click", function(){
    infowindow.close(infowindow);
  });

  bounds = new google.maps.LatLngBounds();

  // return content of infowindows
  function getContent(space) {
    var contentString = "<h3>" + space.name +
      "</h3><br><div style='width:200px;min-height:120px'><img src=" +
       '"' +
      space.photoUrl +
      '"></div><div><a href="' +
      space.shortUrl +
      '" target="_blank">More info in Foursquare</a><img src="img/Foursquare_150.png">';
    var errorString = "Oops, Foursquare content not available."
    if (space.name.length > 0) {
      return contentString;
      } else {
      return errorString;
      }
  }
  // Bounce effect on marker for 4 seconds when clicking on it
  function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function() {
        marker.setAnimation(null);
      }, 4000);
    }
  };
  // Recenter map upon window resize,for responsiveness of the map element
  window.onresize = function () {
    map.fitBounds(bounds);
  };

  /******************************/
  /*VM --View Model for knockout*/
  /******************************/
 function ViewModel() {
    var self = this;
    // <Nav> button control
    this.isNavClosed = ko.observable(false);
    this.navClick = function () {
      this.isNavClosed(!this.isNavClosed());
    };
    // Creating list from initialRestaurants
    this.spaceList = ko.observableArray();
    initialRestaurants.forEach(function(item){
      self.spaceList.push(new Space(item));
    });
    // Create a marker for each restaurant
    this.spaceList().forEach(function(space) {
      var marker = new google.maps.Marker({
        map: map,
        position: space.location,
        icon: image,
        animation: google.maps.Animation.DROP
      });
      space.marker = marker;
      // Extend the boundaries of the map for each marker
      bounds.extend(marker.position);
      // Create onclick event to open infowindow and bounce this marker at each marker
      marker.addListener("click", function(e) {
        map.panTo(this.position);
        //pan down infowindow by 200px to keep whole infowindow on screen for responsiveness
        map.panBy(0, -200)
        infowindow.setContent(getContent(space));
        infowindow.open(map, marker);
        toggleBounce(marker);
    });
  });

    // Foursquare-API
    self.getFoursquareData = ko.computed(function(){
      var i=0;
      self.spaceList().forEach(function(space) {
        // Set initail variables to correct URL for each restaurant
        var  venueId = space.fs_id + "/?";
        var foursquareUrl = BaseUrl + venueId + fsClient_id + fsClient_secret + fsVersion;
        // AJAX call to Foursquare
        $.ajax({
          type: "GET",
          url: foursquareUrl,
          dataType: "json",
          cache: false,
          success: function(data) {
            var response = data.response ? data.response : "";
                space.name = response.venue["name"];
                space.shortUrl = response.venue["shortUrl"];
                space.photoUrl = response.venue.bestPhoto["prefix"] + "height150" + response.venue.bestPhoto["suffix"];
          },
          error: function(){
            if(i===0){
        alert("Foursquare doesn't load successfully");
        i=1;
        }
          }  
        });
      });
    });

    // Creating click for the list
    this.itemClick = function (space) {
      google.maps.event.trigger(space.marker, "click");
    }
    // Filtering the restaurant list
    self.filter = ko.observable("");

    this.filteredSpaceList = ko.dependentObservable(function() {
      var q = this.filter().toLowerCase();
      if (!q) {
      // Return `self.spaceList()` the original array;
      return ko.utils.arrayFilter(self.spaceList(), function(item) {
        item.marker.setVisible(true);
        return true;
      });
      } else {
        return ko.utils.arrayFilter(this.spaceList(), function(item) {
          if (item.name.toLowerCase().indexOf(q) >= 0) {
          return true;
          } else {
            item.marker.setVisible(false);
            infowindow.close(item.marker);
          return false;
          }
        });
      }
    }, this);
  };
 // Activates knockout
 ko.applyBindings(new ViewModel());
}