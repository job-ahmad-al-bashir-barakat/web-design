"use strict";

// header fixed
$(window).scroll(function () {
  if ($(window).scrollTop() >= 100) {
    $('nav').addClass('fixed-top bg-dark-transparent');
  } else {
    $('nav').removeClass('fixed-top bg-dark-transparent');
  }
}); // offcanvas

$('[data-toggle="offcanvas"],.offcanvas-close').on('click', function () {
  $('.offcanvas-collapse').toggleClass('open');
}); // hash href

$("a").on('click', function (event) {
  var $this = $(this);

  if (this.hash !== "") {
    event.preventDefault(); // close offcanvas

    $('.offcanvas-collapse').removeClass('open'); // animate scroll

    var hash = this.hash;
    $('html, body').animate({
      scrollTop: $(hash).offset().top
    }, 800, function () {
      $('nav .active').removeClass('active');
      $this.parent().addClass('active');
      window.location.hash = hash;
    });
  }
}); // owlCarousel

$('.owl-carousel').owlCarousel({
  loop: true,
  autoplay: true,
  dots: false,
  autoWidth: true,
  responsive: {
    // xs
    0: {},
    // sm
    576: {
      items: 2
    },
    // md
    768: {
      items: 4
    },
    // lg
    992: {
      items: 6
    },
    // xl
    1200: {
      items: 8
    }
  }
}); // map

var token = 'pk.eyJ1IjoiYWJhc2hpcmIiLCJhIjoiY2p0cmlmZWd4MG80MTN5cGNlNDNwZ28xMiJ9.WEot3hnZsFCFJ8cowf3hlA',
    mymap = L.map('map', {
  fullscreenControl: {
    pseudoFullscreen: false // if true, fullscreen to page width and height

  },
  scrollWheelZoom: false
}).on('load', function () {
  $(this.getContainer()).addClass('overlay');
}).setView([36.195344, 37.1294875], 16);
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=".concat(token), {
  attribution: 'Smasoso Company',
  id: 'mapbox.streets',
  accessToken: token
}).addTo(mymap);
var myIcon = L.icon({
  iconUrl: 'vendor/leaflet/images/marker-icon.png',
  shadowUrl: 'vendor/leaflet/images/marker-shadow.png'
});
var marker = L.marker([36.195344, 37.1294875], {
  icon: myIcon
}).addTo(mymap);
