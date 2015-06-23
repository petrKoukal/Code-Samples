/**
 * @module Activity Page Controller - for the activity landing page
 */
define( ["models/GoogleMarkerModel",
         "views/GoogleMapOptions", "views/GoogleMapView",
         "underscore", "views/ActivityMapView"],
  function( googleMarkerModel, mapOptions, googleMapView, _ , mapView) {
    "use strict";

    var currentHighlightMarkers = [];

    function addHoverListener( marker ) {
      google.maps.event.addListener( marker, "mouseover", function() {
        var index = findMarkerIndex( marker );
        if (index > -1 ) {
          highlightMarker( index );
          highlightHighlight( index );
        }
      } );
      google.maps.event.addListener( marker, "mouseout", function() {
        var index = findMarkerIndex( marker );
        if(index > -1) {
          downplayMarker( index );
          downplayHighlight( index );
        }
      } );
    }

    function findMarkerIndex( marker ) {
      var i;
      for ( i = 0; i < currentHighlightMarkers.length; i++ ) {
        if ( currentHighlightMarkers[i].info.latitude === marker.info.latitude && currentHighlightMarkers[i].info.longitude === marker.info.longitude ) {
          return i;
        }
      }
      return -1;
    }

    /**
     * renders a google map for the current activity / transit activity
     */
    function renderMap( $map ) {
      var mapData = {}, map, i, minZoom;
      minZoom = 9;

      // compose google marker object for each "marker"
      if ( $map.length ) {
        // get the markers
        mapData = mapView.parseHtmlToMarkers($map);
        currentHighlightMarkers = mapData.highlightMarkers;

        for ( i = 0; i < mapData.highlightMarkers.length; i++ ) {
          addHoverListener(mapData.highlightMarkers[i]);
        }

        // draw the map with markers
        map = new google.maps.Map( $map[0], mapOptions.zoomableMap );
        for ( i = 0; i < mapData.markers.length; i++ ) {
          mapData.markers[i].setMap( map );
        }
        for ( i = 0; i < mapData.highlightMarkers.length; i++ ) {
          mapData.highlightMarkers[i].setMap( map );
        }

        if ( mapData.route.length > 1 ) {
          googleMapView.renderSegmentTransfers( mapData.route, map );
        }

        // adjust zoom and pan
        googleMapView.calculateZoomAndCenter( _.union(mapData.markers, mapData.highlightMarkers, mapData.route), map, minZoom );
      } else {
        console.info( "no map for rendering provided" );
      }
    }

    function highlightMarker( index ) {
      googleMarkerModel.changeIcon( currentHighlightMarkers[index], currentHighlightMarkers[index].info.legNumber, "highlight-selected" );
    }

    function highlightHighlight( index ) {
      $( ".stop-highlights" ).find( ".row" ).eq( index ).find( ".nz-icon" ).addClass( "selected" );
    }

    function downplayMarker( index ) {
      googleMarkerModel.changeIcon( currentHighlightMarkers[index], currentHighlightMarkers[index].info.legNumber, "highlight" );
    }

    function downplayHighlight( index ) {
      $( ".stop-highlights" ).find( ".row" ).eq( index ).find( ".nz-icon" ).removeClass( "selected" );
    }

    return {
      renderMap      : renderMap,
      highlightMarker: highlightMarker,
      downplayMarker : downplayMarker
    };

  } );