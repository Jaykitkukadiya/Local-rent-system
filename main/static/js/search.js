console.log("this is search")


function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      console.log(place)
      createMarker(results[i]);
    }
  }
}


function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function() {
    console.log('User signed out.');
    window.localStorage.removeItem("jtoken")
    window.location.href = "/";
  });
}

function redtodash()
{
  location.href = `/user/dashboard/${localStorage.getItem('jtoken')}/`;
}

function initMap() {
  

  var myLatlng = {
    lat: 22.2587,
    lng: 71.1924
  };

  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: myLatlng,
    disableDefaultUI: true,
    mapTypeControl: true,
    streetViewControl: true,
  });
  map.setOptions({ minZoom: 5, maxZoom: 25 });
  setplace(location_data, map)


  var pyrmont = new google.maps.LatLng(-33.8665433,151.1956316);
  // var marker = "";
  var markerx = "";

 
  // click only
  // map.addListener("click", (mapsMouseEvent) => {
  //   var userMarker = mapsMouseEvent.latLng;
  //   myLatlng = userMarker.toJSON();
  //   if (marker) {
  //     marker.setPosition(userMarker);
  //   } else {
  //     marker = new google.maps.Marker({
  //       position: userMarker,
  //       animation: google.maps.Animation.DROP,
  //       icon: pin_icon,
  //     });
  //     marker.setMap(map);
  //   }
  //   if (markerx) {
  //     markerx.setMap(null)
  //     markerx = ""
  //   }
  //   console.log(myLatlng);

  // });

  const locationButton = document.createElement("img");

  locationButton.src = "/static/icon/location1.png";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(locationButton);


  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          // let infowndow = new google.maps.InfoWindow();
          if (!markerx) {
            markerx = new google.maps.Marker({
              animation: google.maps.Animation.DROP,
              icon: location_icon,
            });
          }
          markerx.setPosition(pos)
          markerx.setMap(map)
          map.setCenter(pos);
          map.setZoom(13)
        },
        () => {
          console.log("Error: The Geolocation service failed.");
        }
      );
    } else {
      // Browser doesn't support Geolocation
      console.log("Error: Your browser doesn't support geolocation.");
    }
  });
  // var directionsr = new google.maps.DirectionsService()
  // var directiondis = new google.maps.DirectionsRenderer()
  // directiondis.setMap(map)

  // document.getElementById("login_btn").onclick = () => {
  //   // var request = {
  //   //   origin: "surat",
  //   //   destnation: "bhavnagar",
  //   //   travelMode: google.maps.travelMode.DRIVING,
  //   // }

  //   var start_lat = "41.8781136";
  //   var start_lon = "-87.6297982";
  //   var end_lat = "40.7127753";
  //   var end_lon = "-74.0059728";
  //   var request = {
  //     origin: new google.maps.LatLng(start_lat, start_lon),
  //     destination: new google.maps.LatLng(end_lat, end_lon),
  //     optimizeWaypoints: true,
  //     avoidHighways: false,
  //     avoidTolls: false,
  //     travelMode: google.maps.TravelMode.DRIVING
  //   };
  //   directionsr.route(request , (result, status) => {
  //     if (status == google.maps.DirectionsStatus.OK) {
  //       var route = response.routes[0];
  //       var leg = response.routes[0].legs[0];
  //       var polyline = route.overview_polyline;
  //       var distance = route.legs[0].distance.value;
  //       var duration = route.legs[0].duration.value;

  //       console.log(route); // Complete route
  //       console.log(distance); // Only distance 
  //       console.log(duration); // Only duration
  //       console.log(leg); // Route options/list
  //       console.log(polyline); // Polyline data
  //     }
  //   })
  // }

}



// const request = {
//   placeId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
//   fields: ["name", "formatted_address", "place_id", "geometry"],
// };
// const infowndow = new google.maps.infowndow();
// const service = new google.maps.places.PlacesService(map);

// service.getDetails(request, (place, status) => {
//   if (
//     status === google.maps.places.PlacesServiceStatus.OK &&
//     place &&
//     place.geometry &&
//     place.geometry.location
//   ) {
//     const marker = new google.maps.Marker({
//       map,
//       position: place.geometry.location,
//     });

//     google.maps.event.addListener(marker, "click", () => {
//       const content = document.createElement("div");
//       const nameElement = document.createElement("h2");

//       nameElement.textContent = place.name;
//       content.appendChild(nameElement);

//       const placeIdElement = document.createElement("p");

//       placeIdElement.textContent = place.place_id;
//       content.appendChild(placeIdElement);

//       const placeAddressElement = document.createElement("p");

//       placeAddressElement.textContent = place.formatted_address;
//       content.appendChild(placeAddressElement);
//       infowndow.setContent(content);
//       infowndow.open(map, marker);
//     });
//   }
// });
// }


window.onload = () => {


  if (!window.localStorage.getItem("jtoken")) {
    window.location.href = "/"
  }
  // get gapi.auth2 instance before signout
  gapi.load('auth2', function() {
    gapi.auth2.init();
  });

  console.log(location_data)
  document.getElementById("map").children[1].remove()

  document.getElementById("search_nav").classList.add("nav-loader")


  document.getElementById("info-window-closed").onclick = () => {
    document.getElementById("info-window").classList.remove("info-window-opened")
  }

  // this function's implimentation is not done
  document.getElementById("search_btn").onclick = () => {
    document.getElementById("search_inp").value = "This service is temporarily unavailable.";
    document.getElementById("search_inp").disabled = true;
  }


}


function setplace(location_data, map) {
  let places = new Array()
  // let placeLatlng = {
  //   lat: 22.2587,
  //   lng: 71.1924
  // };
  // let placemarker = new google.maps.Marker({
  //   animation: google.maps.Animation.DROP,
  //   icon: hotel_icon
  // });
  // location_data.forEach((lanlet, index) => {
  //   places[index] = new google.maps.Marker({
  //     animation: google.maps.Animation.DROP,
  //     icon: hotel_icon
  //   });
  //   places[index].setPosition(lanlet)
  //   console.log(lanlet)
  //   places[index].setMap(map)
  //   google.maps.event.addListener(places[index], 'click', function() {
  //     document.getElementById("info-window").classList.add("info-window-opened")
  //       // map.setZoom(map.getZoom() + 2);
  //     map.setCenter(places[index].getPosition());
  //   });
  // });
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const curentpos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        room_data.forEach((room, index) => {

          placeLatlng = {
            lat: parseFloat(room.location.split(",")[0]),
            lng: parseFloat(room.location.split(",")[1])
          };
          places[index] = new google.maps.Marker({
            animation: google.maps.Animation.DROP,
            icon: hotel_icon
          });
          places[index].setPosition(placeLatlng)
          places[index].setMap(map)
      
      
          google.maps.event.addListener(places[index], 'click', function() {
            if (map.getZoom() < 13) {
              map.setZoom(map.getZoom() + 2);
              map.setCenter(places[index].getPosition());
            }
            document.getElementById("info_window_owner_name").innerText = room.username
            document.getElementById("info_window_address").innerText = room.address
            document.getElementById("info_window_contact").innerText = room.mobile
            let facilities = ""
            let images = ""
            document.getElementById("info_window_room_container").innerHTML = "";
            room.rooms.forEach((eachroom, index) => {
      
              facilities = ""
              images = ""
              eachroom.facility.split(",").forEach((eachfacility) => {
                facilities += ` <span class="room-info-facility">${eachfacility}</span>`
              })
              eachroom.photos.forEach((eachphoto) => {
                images += `<span class="room-info-photos"><a href="/media/${eachphoto}" target="_blank"><img src="/media/${eachphoto}" alt=""></a></span>`
              })
              document.getElementById("info_window_room_container").innerHTML += `
                      <div class="info-room-details-container">
                      <div class="info-room-title-container">
                        <div class="info-room-title">${eachroom.name}</div>
                        <img class="info-room-drop-btn" src="/static/icon/arrow1.png" id="info_room_drop_btn_${eachroom.id}" alt="">
                      </div>
                      <div class="info-room-drop-detail-container hidden" id="info_room_drop_btn_block_${eachroom.id}">
                        <div class="info-field room-info-field ">
                          <p class="info-field-heading">
                            price
                          </p>
                          <p class="info-field-details">
                            ${eachroom.price} INR
                          </p>
      
                        </div>
                        <div class="info-field room-info-field ">
                          <p class="info-field-heading">
                            rating
                          </p>
                          <p class="info-field-details">
                            ${eachroom.rating} stars
                          </p>
      
                        </div>
                        <div class="info-field room-info-field ">
                          <p class="info-field-heading">
                            Facility
                          </p>
                          <p class="info-field-details">
                            ${facilities}
                          </p>
      
                        </div>
                        <div class="info-field room-info-field ">
                          <p class="info-field-heading">
                            Images
                          </p>
                          <p class="info-field-details">
                          ${images}
                          </p>
      
                        </div>
                        <div class="info-field room-info-field">
                          <div class="room-info-inquiry-btn" id="place_book_${eachroom.id}">Book In Advance</div>
                          <p class="room-info-inquery-notice">* you have to pay ${Number(eachroom.price) / 2} RS now</p>
                          <a id="place_direction_${eachroom.id}" target="_blank" href=''><div class="room-info-inquiry-btn">Direction</div></a>
                        </div>
      
                      </div>
                    </div>
                    `;
              console.log(document.getElementById(`info_room_drop_btn_${eachroom.id}`));
              setTimeout(() => {
                document.getElementById(`info_room_drop_btn_${eachroom.id}`).addEventListener("click", function(e) {
                  if (e.target && e.target.id == `info_room_drop_btn_${eachroom.id}`) {
                    //do something
                    placeLatlng = {
                      lat: parseFloat(room.location.split(",")[0]),
                      lng: parseFloat(room.location.split(",")[1])
                    };
                    document.getElementById(`place_direction_${eachroom.id}`).href = `https://www.google.com/maps/dir/?api=1&origin=${curentpos.lat},${curentpos.lng}&destination=${placeLatlng.lat},${placeLatlng.lng}`

                    document.getElementById(`info_room_drop_btn_${eachroom.id}`).classList.toggle("info-room-drop-btn-opened")
                    document.getElementById(`info_room_drop_btn_block_${eachroom.id}`).classList.toggle("hidden")
                  }
                  console.log(e.target.id);
                });
                document.getElementById(`place_book_${eachroom.id}`).addEventListener("click", function(e) {
                  console.log(e.target.id)

                  fetch("/api/payment/create/session/",{
                    method : "POST",
                    headers : {
                      'X-CSRFToken' : document.querySelector('[name=csrfmiddlewaretoken]').value
                    },
                    body : JSON.stringify({
                      room_id : eachroom.id,
                      jwttoken : window.localStorage.getItem("jtoken"),
                    })
                  })
                    .then((result) => { return result.json(); })
                    .then((data) => {
                      console.log(data);
                      // Redirect to Stripe Checkout
                      return stripe.redirectToCheckout({sessionId: data.sessionId})
                    })
                    .then((res) => {
                      console.log(res);
                    });
                });
              }, 100)
      
            });
      
            document.getElementById("info-window").classList.add("info-window-opened")
          });
        });
     },
      () => {
        alert("Error: The Geolocation service failed. site will not work properly");
      }
    );
  } else {
    // Browser doesn't support Geolocation
    alert("Error: Your browser doesn't support geolocation.");
  }



  
}