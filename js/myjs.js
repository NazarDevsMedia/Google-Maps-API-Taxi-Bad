//Start
$(window).on('beforeunload', function(){
  $(window).scrollTop(0);
});

let map;
function initMap() {
const wien = new google.maps.LatLng(48.214827, 16.382295);
map = new google.maps.Map(document.getElementById('map'), {
          zoom: 13,
          center: wien,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });


        let marker = new google.maps.Marker({
          map: map
        });

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            let pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            marker.setPosition(pos);
            marker.setTitle('You are here.');
            map.setCenter(pos);
          }, function() {
            handleLocationError(true, marker, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, marker, map.getCenter());
        }



        //Bad JSON Request
        let badloccord = new XMLHttpRequest();
        badloccord.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let badjson = JSON.parse(this.responseText);
                for (var i = 0; i < badjson.features.length; i++) {
                  let badcoords = badjson.features[i].geometry.coordinates;
                  let latLng = new google.maps.LatLng(badcoords[1],badcoords[0]);
                  let badtitle = badjson.features[i].properties.BEZEICHNUNG;

                  // Creating a marker and putting it on the map
                  let badmarker = new google.maps.Marker({
                      position: latLng,
                      title: badtitle,
                      icon: 'img/diving.png',
                      map: map
                  });
                  //Bad toggle
                  function removebad(){
                    badmarker.setMap(null);
                  }

                  function addbad(){
                    badmarker.setMap(map);
                  }
                  $('#badestellenoff').on('click', removebad);
                  $('#badestellenon').on('click', addbad);


                }
            }
        };
        badloccord.open("GET", "js/BADESTELLENOGD.json", true);
        badloccord.send();


        let taxiInfoWindow = new google.maps.InfoWindow();


        //TAXI JSON Request
        let taxiloccord = new XMLHttpRequest();
        taxiloccord.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let taxijson = JSON.parse(this.responseText);
                for (var i = 0; i < taxijson.features.length; i++) {
                  let coords = taxijson.features[i].geometry.coordinates;
                  let poly = [];
                  for (var j = 0; j<coords.length; j++) {
                      var morecoords = taxijson.features[i].geometry.coordinates[j];
                      var pos = new google.maps.LatLng(morecoords[1],morecoords[0]);
                      poly.push(pos);
                  }

                  // Creating a polyline and putting it on the map
                  let taximarker = new google.maps.Polyline({
                    path: poly,
                    geodesic: true,
                    strokeColor: '#FF0000',
                    strokeOpacity: 1.0,
                    strokeWeight: 4,
                    map: map
                  });


                  //TAXI InfoWindow
                  let taxiTitle = taxijson.features[i].properties.ADRESSE;

                  google.maps.event.addListener(taximarker, 'mouseover', function(event) {
                  taxiInfoWindow.setContent(taxiTitle);
                  taxiInfoWindow.setPosition(event.latLng);
                  taxiInfoWindow.open(map);
                  });
                  google.maps.event.addListener(taximarker, 'mouseout', function() {
                  taxiInfoWindow.close();
                  });

                  //TAXI toggle
                  function removetaxi(){
                    taximarker.setMap(null);
                  }

                  function addtaxi(){
                    taximarker.setMap(map);
                  }
                  $('#taxistellenoff').on('click', removetaxi);
                  $('#taxistellenon').on('click', addtaxi);
                }
            }
        };
        taxiloccord.open("GET", "js/TAXIOGD.json", true);
        taxiloccord.send();



}

      function handleLocationError(browserHasGeolocation, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
      }
