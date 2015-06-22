/*
 * Copyright 2012-2015 Nezasa AG
 */

package controllers.platform

import com.nezasa.comms.Logging
import com.nezasa.documentation.TravelDocumentationService
import com.nezasa.iam.{SecureSocialController, SecuredTravelPackageAction}
import controllers.TravelPackageLocale
import com.nezasa.model.documentation.Contact
import com.nezasa.model.geo.Country
import com.nezasa.model.itinerary.{CustomPackage, Itinerary}
import controllers.platform.api.Itineraries._

/**
 * This controller serves travel documentation related pages and fragments
 */

object TravelDocumentationController extends SecureSocialController with SecuredTravelPackageAction with TravelPackageLocale with Logging {

  def getTravelDocumentationPage(refId: String) = (SecuredAction andThen TravelPackageAction(refId)) { implicit request =>
    request.travelPackage match {
      case itinerary: Itinerary =>
        implicit val newCtx = localizationCtxWithTravelPackage(request, itinerary)
        val vendorContact = Contact.findVendorContact(itinerary.vendor, itinerary.template.countryCodes.map(Country(_)))
        val travelDocService = new TravelDocumentationService(itinerary, vendorContact)
        val travelDocumentation = travelDocService.generateView()(newCtx)
        Ok(views.html.platform.documentation.travelDocumentation(Some(request.user), travelDocumentation)(newCtx.lang, newCtx, request))
      case customPackage: CustomPackage =>
        logger.debug("Attempt to access the travel documentation of a custom package. We return a 404 in that case.")
        NotFound(views.html.errors.onHandlerNotFound())
      case _ =>
        logger.error("Itineray refId='%s' is not of type Itinerary.".format(refId))
        InternalServerError
    }
  }
}
