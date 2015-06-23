/**
 * @module Google Marker Model
 * - for creating the google.maps.Marker objects
 */
define( ["views/GoogleMapOptions"], function( mapOptions ) {
  "use strict";

  /**
   * calculates a position of a category highlight marker icon
   * @param category - the nameKey of the category
   * @returns {number} - the x-coordinate of the category icon
   */
  function highlightToPosition( category ) {
    var multiplicator = 0, position;

    switch ( category ) {
      case "ArchitectureAndHistory":
        multiplicator = 0;
        break;
      case "ArtsAndCulture":
        multiplicator = 1;
        break;
      case "LandscapesAndSceneries":
        multiplicator = 2;
        break;
      case "WildlifeAndNature":
        multiplicator = 3;
        break;
      case "OutdoorAndSports":
        multiplicator = 4;
        break;
      case "CityAndShopping":
        multiplicator = 5;
        break;
      case "Cuisine":
        multiplicator = 6;
        break;
      case "Wellness":
        multiplicator = 7;
        break;
      case "Beach":
        multiplicator = 8;
        break;
      default:
        multiplicator = 0;
        break;
    }
    position = multiplicator * 50;

    return position;
  }

  /**
   * creates marker icon according to input
   *
   * @param type -
   *          marker icon type
   * @param position - number or string representing the position of the icon
   * @param offset - defines the offset that should be used
   * @return {Object} markerIcon - object with all necessary information for the
   *         marker icon in googleMap - friendly form
   */
  function markerIconFactory( type, position, offset ) {
    var markerOptions, markerIcon, newMarkerAnchorX, newShadowAnchorX, zIndex;
    switch ( type ) {
      case "default":
        markerOptions = mapOptions.markerCenterAnchor;
        markerOptions.marker.posX = (position) * 30;
        zIndex = 1000;
        break;
      case "selected":
        markerOptions = mapOptions.markerSelected;
        markerOptions.marker.posX = (position) * 30;
        zIndex = 1000;
        break;
      case "offset":
        markerOptions = mapOptions.markerCenterAnchor;
        markerOptions.marker.posX = (position) * 30;
        newMarkerAnchorX = parseInt( markerOptions.marker.anchorX, 10 ) - offset * 30;
        newShadowAnchorX = parseInt( markerOptions.shadow.anchorX, 10 ) - offset * 30;
        zIndex = 1000;
        break;
      case "offset-selected":
        markerOptions = mapOptions.markerSelected;
        markerOptions.marker.posX = (position) * 30;
        newMarkerAnchorX = parseInt( markerOptions.marker.anchorX, 10 ) - offset * 30;
        newShadowAnchorX = parseInt( markerOptions.shadow.anchorX, 10 ) - offset * 30;
        zIndex = 1000;
        break;
      case "activity":
        markerOptions = mapOptions.activity;
        zIndex = 500;
        break;
      case "accommodation-current":
        markerOptions = mapOptions.accommodationCurrent;
        zIndex = 600;
        break;
      case "accommodation-offer":
        markerOptions = mapOptions.accommodationAlternative;
        zIndex = 600;
        break;
      case "accommodation":
        markerOptions = mapOptions.accommodation;
        zIndex = 600;
        break;
      case "highlight":
        markerOptions = mapOptions.highlight;
        markerOptions.marker.posX = highlightToPosition( position );
        markerOptions.marker.posY = 160;
        zIndex = 500;
        break;
      case "highlight-selected":
        markerOptions = mapOptions.highlight;
        markerOptions.marker.posX = highlightToPosition( position );
        markerOptions.marker.posY = 220;
        zIndex = google.maps.Marker.MAX_ZINDEX + 1;
        break;
      case "tourActivity":
        markerOptions = mapOptions.activity;
        //display activity marker with category icon if available, otherwise show the standard activity icon with "open eye"
        /*
         if (position) {
         markerOptions.marker.posX = 250 + highlightToPosition(position);
         markerOptions.marker.posY = 400;
         }*/
        zIndex = 500;
        break;
      case "tourAccommodation":
        markerOptions = mapOptions.accommodation;
        zIndex = 500;
        break;
      case "circle":
        zIndex = 100;
        break;
    }// end switch

    markerIcon = {
      image : null,
      shadow: null,
      shape : null,
      zIndex: zIndex || 1000
    };
    // end markerIcon
    if ( markerOptions ) {

      markerIcon.image = {
        url   : markerOptions.imgSource,
        size  : new google.maps.Size( markerOptions.marker.width, markerOptions.marker.height ),
        origin: new google.maps.Point( markerOptions.marker.posX, markerOptions.marker.posY ),
        anchor: new google.maps.Point( newMarkerAnchorX || markerOptions.marker.anchorX,
          markerOptions.marker.anchorY )
      };
      markerIcon.shadow = {
        url   : markerOptions.imgSource,
        size  : new google.maps.Size( markerOptions.shadow.width, markerOptions.shadow.height ),
        origin: new google.maps.Point( markerOptions.shadow.posX, markerOptions.shadow.posY ),
        anchor: new google.maps.Point( newShadowAnchorX || markerOptions.shadow.anchorX,
          markerOptions.shadow.anchorY )
      };
      markerIcon.shape = {
        coord: markerOptions.shape.coord,
        type : "poly"
      };

      newMarkerAnchorX = null;
      newShadowAnchorX = null;
      // end markerIcon.shape
    } else {
      markerIcon.image = mapOptions.symbols.dot;
    }

    return markerIcon;
  }// end markerIconFactory;

  function newMarkerLight( coordinate, title, type, position ) {
    var //
      icon = markerIconFactory( type, position ),
      markerLatLang, marker;

    // create marker
    markerLatLang = new google.maps.LatLng( coordinate.lat, coordinate.lng );
    marker = new google.maps.Marker( {
      draggable  : false,
      raiseOnDrag: false,
      position   : markerLatLang,
      title      : title,
      icon       : icon.image,
      shadow     : icon.shadow,
      shape      : icon.shape,
      zIndex     : icon.zIndex || 1000 - position
    } );

    // add additional marker info
    marker.info = {
      stopName  : title,
      legNumber : position,
      latitude  : coordinate.lat,
      longitude : coordinate.lng,
      isMultiple: false,
      type      : type
    };

    return marker;
  }

  /**
   * creates new google.maps.Marker from information pasted
   *
   * @param coordinate -
   *          coordinate of the marker in JSON
   * @param itineraryLeg -
   *          itinerary leg in JSON
   * @param position -
   *          the number of the itineraryLeg
   * @param type - type of the marker
   * @return {Object} marker - returns new google.maps.Marker
   */
  function newMarker( coordinate, itineraryLeg, position, type ) {
    var marker, markerLatLang, icon, title;

    switch ( type ) {
      case "accommodation":
        title = itineraryLeg.product.productName;
        break;
      case "activity":
        title = itineraryLeg.product.productName;
        break;
      case "highlight":
      case "highlight-selected":
        title = itineraryLeg.highlight.title;
        break;
      case "tourActivity":
        title = itineraryLeg.title || itineraryLeg.displayLocation.address.formattedAddress;
        break;
      case "tourAccommodation" :
        title = itineraryLeg.title || itineraryLeg.displayLocation.address.formattedAddress;
        break;
      case "accommodation-current":
      case "accommodation-offer":
        title = itineraryLeg.name;
        break;
      default:
        if ( itineraryLeg.stop ) {
          title = itineraryLeg.stop.area.shortName;
        } else {
          title = itineraryLeg;
        }

        break;
    }

    icon = markerIconFactory( type, position );

    // create marker
    markerLatLang = new google.maps.LatLng( coordinate.lat, coordinate.lng );
    marker = new google.maps.Marker( {
      draggable  : false,
      raiseOnDrag: false,
      position   : markerLatLang,
      title      : title,
      icon       : icon.image,
      shadow     : icon.shadow,
      shape      : icon.shape,
      zIndex     : icon.zIndex || 1000 - position
    } );

    // add additional marker info
    marker.info = {
      stopName  : title,
      legNumber : position,
      latitude  : coordinate.lat,
      longitude : coordinate.lng,
      leg       : itineraryLeg,
      isMultiple: false,
      type      : type
    };

    return marker;
  }// end newMarker

  /**
   * creates new google.maps.Marker for component modal.
   *
   * @param coordinate -
   *          coordinate of the marker in JSON
   * @param type -
   *          the component type such as "accommodation" or "activity"
   * @param title -
   *          the title for the marker
   */
  function newComponentModalMarker( coordinate, type, title, transferType, index ) {
    var marker, markerLatLang, icon;

    // get icon
    icon = markerIconFactory( type, index );

    // create marker
    markerLatLang = new google.maps.LatLng( coordinate.lat, coordinate.lng );
    marker = new google.maps.Marker( {
      draggable  : false,
      raiseOnDrag: false,
      position   : markerLatLang,
      title      : title,
      icon       : icon.image,
      shadow     : icon.shadow,
      shape      : icon.shape,
      zIndex     : icon.zIndex || 1000
    } );

    // add additional marker info
    marker.info = {
      latitude : coordinate.lat,
      longitude: coordinate.lng
    };
    if ( transferType ) {
      marker.info.leg = {
        representativeTransferType: transferType
      };
    }

    return marker;
  }// end newMarker

  /**
   * Creates new icon using markerIconFactory and updates the icon of current
   * marker
   *
   * @param marker -
   *          current marker to which the icon should be changed
   * @param position -
   *          number representing the order of the icon in the sprite. could be
   *          number of stops or leg number
   * @param type -
   *          defines the type of the new marker-icon. multiple | selected |
   *          center
   * @param offset - the offset that should be used, optional
   * @param changeZIndex - boolean, defines whether the z-index should be changed
   */
  function changeIcon( marker, position, type, offset, changeZIndex ) {
    var newIcon = markerIconFactory( type, position, offset );
    if(marker) {
      if ( !offset ) {
        newIcon.image.anchor = marker.getIcon().anchor;
        newIcon.shadow.anchor = marker.getShadow().anchor;
      }
      marker.setIcon( newIcon.image );
      marker.setShape( newIcon.shape );
      marker.setShadow( newIcon.shadow );
      if ( changeZIndex ) {
        marker.setZIndex( newIcon.zIndex );
      }
    }
  }

  return {
    newMarker              : newMarker,
    newMarkerLight         : newMarkerLight,
    newComponentModalMarker: newComponentModalMarker,
    changeIcon             : changeIcon
  };
} );
