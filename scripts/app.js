const mapStyle = [
  {
    "featureType": "administrative",
    "elementType": "all",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "lightness": 33
      }
    ]
  },
  {
    "featureType": "poi",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.medical",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "poi.attraction",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "poi.place_of_worship",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "landscape",
    "elementType": "all",
    "stylers": [
      {
        "color": "#F4F1E5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c5dac6"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "lightness": 20
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "all",
    "stylers": [
      {
        "lightness": 20
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c5c6c6"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e4d7c6"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#fbfaf7"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "all",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "color": "#acbcc9"
      }
    ]
  }
];


/* Note: This example requires that you consent to location sharing when
 * prompted by your browser. If you see the error "Geolocation permission
 * denied.", it means you probably did not give permission for the browser * to locate you. */
let pos;
let map;
let bounds;
let infoWindow;
let currentInfoWindow;
let service;
let infoPane;
function initMap() {
  // Initialize variables
  bounds = new google.maps.LatLngBounds();
  infoWindow = new google.maps.InfoWindow;
  currentInfoWindow = infoWindow;
  /* TODO: Step 4A3: Add a generic sidebar */
  infoPane = document.getElementById('mySidebar');
  // Try HTML5 geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map = new google.maps.Map(document.getElementById('map'), {
        center: pos,
        zoom: 13,
        styles: mapStyle
      });
      bounds.extend(pos);
      infoWindow.setPosition(pos);
      infoWindow.setContent('User location found.');
      infoWindow.open(map);
      map.setCenter(pos);
      // Call Places Nearby Search on user's location
      getNearbyPlaces(pos);
    }, () => {
      // Browser supports geolocation, but user has denied permission
      handleLocationError(true, infoWindow);
    });
  } else {
    // Browser doesn't support geolocation
    handleLocationError(false, infoWindow);
  }
}
// Handle a geolocation error
function handleLocationError(browserHasGeolocation, infoWindow) {
  // Set default location to Sydney, Australia
  pos = { lat: -33.856, lng: 151.215 };
  map = new google.maps.Map(document.getElementById('map'), {
    center: pos,
    zoom: 13,
    styles: mapStyle
  });
  // Display an InfoWindow at the map center
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Geolocation permissions denied. Using default location.' :
    'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
  currentInfoWindow = infoWindow;
  // Call Places Nearby Search on the default location
  getNearbyPlaces(pos);
}
// Perform a Places Nearby Search Request
function getNearbyPlaces(position) {
  let request = {
    location: position,
    rankBy: google.maps.places.RankBy.DISTANCE,
    keyword: 'pharmacy'
  };
  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, nearbyCallback);
}
// Handle the results (up to 20) of the Nearby Search
function nearbyCallback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    createMarkers(results);
  }
}
// Set markers at the location of each place result
function createMarkers(places) {
  places.forEach(place => {
    let rxIcon = 'Icons/pharmacyIcon-40.png';
    let marker = new google.maps.Marker({
      position: place.geometry.location,
      map: map,
      title: place.name,
      icon: rxIcon
    });
    /* TODO: Step 4B: Add click listeners to the markers */
    // Add click listener to each marker
    google.maps.event.addListener(marker, 'click', () => {
      let request = {
        placeId: place.place_id,
        fields: ['name', 'formatted_address', 'geometry', 'rating',
          'website', 'photos', 'formatted_phone_number', 'price_level', 'opening_hours']
      };
      /* Only fetch the details of a place when the user clicks on a marker.
       * If we fetch the details for all place results as soon as we get
       * the search response, we will hit API rate limits. */
      service.getDetails(request, (placeResult, status) => {
        showDetails(placeResult, marker, status)
      });
    });
    // Adjust the map bounds to include the location of this marker
    bounds.extend(place.geometry.location);
  });
  /* Once all the markers have been placed, adjust the bounds of the map to
   * show all the markers within the visible area. */
  map.fitBounds(bounds);
}

/* TODO: Step 4C: Show place details in an info window */
// Builds an InfoWindow to display details above the marker
function showDetails(placeResult, marker, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    let placeInfowindow = new google.maps.InfoWindow();
    let rating = "None";
    if (placeResult.rating) rating = placeResult.rating;
    placeInfowindow.setContent('<div><strong>' + placeResult.name +
      '</strong><br>' + 'Rating: ' + rating + '</div>');
    placeInfowindow.open(marker.map, marker);
    currentInfoWindow.close();
    currentInfoWindow = placeInfowindow;
    showSidebar(placeResult);
  } else {
    console.log('showDetails failed: ' + status);
  }
}

//   if (placeResult.website) {
//     let websitePara = document.createElement('p');
//     let websiteLink = document.createElement('a');
//     let websiteUrl = document.createTextNode(placeResult.website);
//     websiteLink.appendChild(websiteUrl);
//     websiteLink.title = placeResult.website;
//     websiteLink.href = placeResult.website;
//     websitePara.appendChild(websiteLink);
//     infoPane.appendChild(websitePara);



function showSidebar(placeResult) {
  document.getElementById("mySidebar").style.width = "350px";


  document.getElementById("pharmacyName").textContent = placeResult.name;

  // document.getElementById("pharmacyPrice").textContent = `Price: ${placeResult.price_level} \u272e`;

  // document.getElementById("pharmacyDistance").textContent = `Price: ${placeResult.DISTANCE} km`;

  // Add the primary photo, if there is one
  if (placeResult.photos) {
    let firstPhoto = placeResult.photos[0];
    let photo = document.getElementById('photo1');
    photo.classList.add('hero');
    photo.src = firstPhoto.getUrl();
  } else {
    infoPane.removeChild(infoPane.getElementById("photo"));
  }

  // add opening hours
  document.getElementById("monday").textContent = placeResult.opening_hours.weekday_text[0];
  document.getElementById("tuesday").textContent = placeResult.opening_hours.weekday_text[1];
  document.getElementById("wednesday").textContent = placeResult.opening_hours.weekday_text[2];
  document.getElementById("thursday").textContent = placeResult.opening_hours.weekday_text[3];
  document.getElementById("friday").textContent = placeResult.opening_hours.weekday_text[4];
  document.getElementById("saturday").textContent = placeResult.opening_hours.weekday_text[5];
  document.getElementById("sunday").textContent = placeResult.opening_hours.weekday_text[6];

  // add main aggregate ratings
  // document.getElementById("agg-RxRate-rating").style.marginLeft = "15px";
  //
  // document.getElementById("agg-Customer-rating").style.marginLeft = "15px";

  // Add disaggregated stars with text formatting

  // document.getElementById("dis-RxRate-Rating").style.marginLeft = "15px";
  // document.getElementById("dis-Customer-Rating").style.marginLeft = "15px";

  // add learn more button

  // add contact section

  // add address
  document.getElementById("address").textContent = placeResult.formatted_address;
  // add phone number
  if (placeResult.formatted_phone_number) {
    document.getElementById("phoneNumber").textContent = placeResult.formatted_phone_number;
  } else {
    document.getElementById("phoneNumber").textContent = "Not available";
  }
}


function doNothing() {}
