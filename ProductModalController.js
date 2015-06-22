/**
 * @module Product Modal Controller Utils
 * - for the product read only modal
 *
 */
define( ["jquery", "views/ComponentPageView"],
  function( $, componentPageView ) {
    "use strict";

    function bindClickToOpenComponentModal($selector, $componentModal) {
      $componentModal.off( "hidden.bs.modal" ).on( "hidden.bs.modal", function() {
        $(this).removeData('bs.modal');
        $componentModal.find( ".modal-body" ).addClass( "invisible" );
      } );
      $componentModal.off( "shown.bs.modal" ).on( "shown.bs.modal", function() {
        $componentModal.scrollTop( 0 );
        componentPageView.renderMap( $componentModal.find( "#google-map" ) );
        $componentModal.find( ".modal-body" ).removeClass( "invisible" );

      } );
      $selector.each( function() {
        $( this ).off( "click" ).on( "click", function( e ) {
          e.stopPropagation();
          e.preventDefault();
          $( "#component-modal" ).modal( {
            remote: $( this ).attr( "data-remote" )
          } );
        } );
      } );
    }

    return {
      bindClickToOpenComponentModal: bindClickToOpenComponentModal
    };
  } );
