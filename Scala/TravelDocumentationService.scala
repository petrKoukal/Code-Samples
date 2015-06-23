/*
 * Copyright 2012-2015 Nezasa AG
 */

package com.nezasa.documentation

import com.nezasa.comms.Logging
import com.nezasa.model.`override`.AccommodationOverride
import com.nezasa.model.auxiliary.LocalizationCtx
import com.nezasa.model.comp.{ComponentProvider, StopActivityComponent, TransferComponent, TransferType, TransitActivityComponent, TravelComponent}
import com.nezasa.model.documentation.Contact
import com.nezasa.model.itinerary.{Itinerary, Leg}
import com.nezasa.model.product.{AccommodationProduct, StopActivityProduct, TransitActivityProduct}
import com.nezasa.view.documentation.{AccommodationDocumentation, DocComponent, DocGroup, FillUpDayDocumentation, LeisureDayDocumentation, StopActivityDocumentation, TransferDocumentation, TransitActivityDocumentation, TravelDocumentView}
import org.joda.time.{DateTime, LocalDate, Period}

import scala.collection.mutable.{HashMap, LinkedHashMap}

/**
 * Service that generates the travel documentation
 *
 * Note: The generation of the travel documentation is in a separate service. Reasons:
 * - This can be seen as separate service that generates the travel documentation (which could also be a PDF)
 * - Separate controller logic from the logic used to generate the travel doc
 * - Follow the same pattern as it was used for destinationbook for consistency reasons (sep service that does the
 * generation and integration of the doc with destinatonbook.com)
 * - easier testability (all dependencies are injected in the constructor)
 *

 * @param itinerary the Itinerary for which to create the travel documentation
 * @param vendorContact the contact details of the vendor
 */
class TravelDocumentationService(itinerary: Itinerary, vendorContact: Option[Contact]) extends Logging {

  def generateView()(implicit localizationCtx: LocalizationCtx): TravelDocumentView = {
    val allAccommodationProducts = accommodationProducts(itinerary)
    val accommodations = accommodationMap(itinerary, allAccommodationProducts)
    val groupedAccommodations = groupedAccommodationMap(itinerary, allAccommodationProducts)
    val flightSeq = flights(itinerary)
    val docGroups = groups(itinerary)
    val countryCodes = itinerary.template.countryCodes
    val travelAgency = itinerary.travelAgency
    TravelDocumentView(itinerary.toCO, vendorContact,
      docGroups, accommodations, flightSeq, groupedAccommodations, countryCodes, travelAgency)
  }

  /**
   * Gets a map of accommodations grouped by day. We only add the hotel at the day of the component start. However,
   * in case of multiday stop activities multiple hotels can be within a stop (one before the activity, one after the
   * activity).
   */
  private def accommodationMap(itinerary: Itinerary, allAccommodationProducts: HashMap[Leg, Map[String, com.nezasa.model.product.Accommodation]]): Map[LocalDate, AccommodationDocumentation] = {
    val accommodations = HashMap[LocalDate, AccommodationDocumentation]()
    val accommodationComponents = itinerary.allAccommodationComponentsSortedByDate
      .filterNot(c => c.provider == ComponentProvider.User || c.provider == ComponentProvider.System)
    val accommodationProductRefIds = accommodationComponents.filterNot(_.provider == ComponentProvider.Override).map(_.product.productRefId)
    val accommodationOverrideRefIds = accommodationComponents.filter(_.provider == ComponentProvider.Override).map(_.product.productRefId)
    val accommodationProducts = (
      AccommodationProduct.findAllPublishedByRefId(accommodationProductRefIds.toSeq, None).map(a => a.refId -> a) ++
        AccommodationOverride.findAllPublishedByRefId(accommodationOverrideRefIds.toSeq, None).map(a => a.refId -> a)).toMap

    accommodationComponents.foreach { c =>
      // show the hotel for all days (except the last day of a stop)
      val range = dateRange(c.localizedStartDateTime.toLocalDate, c.localizedEndDateTime.minusDays(1).toLocalDate, Period.days(1))
      range.foreach { date =>
        accommodations(date) = AccommodationDocumentation(c, accommodationProducts(c.product.productRefId))
      }
    }
    accommodations.toMap
  }
}