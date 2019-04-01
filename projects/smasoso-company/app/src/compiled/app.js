"use strict";

// owlCarousel
$('.owl-carousel').owlCarousel({
  loop: true,
  autoplay: true,
  dots: false,
  autoWidth: true,
  responsive: {
    0: {
      items: 1
    },
    600: {
      items: 3
    },
    1000: {
      items: 5
    }
  }
}); // map

var mymap = L.map('mapid', {
  fullscreenControl: {
    pseudoFullscreen: false // if true, fullscreen to page width and height

  },
  scrollWheelZoom: false
}).setView([36.195344, 37.1294875], 16),
    token = "pk.eyJ1IjoiYWJhc2hpcmIiLCJhIjoiY2p0cmlmZWd4MG80MTN5cGNlNDNwZ28xMiJ9.WEot3hnZsFCFJ8cowf3hlA";
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=".concat(token), {
  attribution: 'Smasoso Company',
  id: 'mapbox.streets',
  accessToken: token
}).addTo(mymap);
var marker = L.marker([36.195344, 37.1294875]).addTo(mymap);
var department = $('#department-section');
department.find('.item').hover(function () {
  department.find('.item.active').removeClass('active');
  $(this).addClass('active');
});
