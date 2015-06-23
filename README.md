# Code-Samples

This Repository serves as a showcase for code style reviews of Petr Koukal, a freelance frontend developer and UX designer.

## HTML

To review my use of HTML 5 along with Twitter Bootstrap 3 styles please have a look on "one-page-web.html" It was a small one page website I created for an investor group in the Czech Republic. 
Apart from mentioned HTML5 and Bootstrap3 there is also styled and animated SVG, responsive layout and few bits of javascript to make the page a bit more alive.
I didn't the ```javascript``` and some ```css``` from the ```html``` to keep all the show cases within one file. 

## LESS 

In our Play! application we get a free LESS to CSS compilation. Thus we stuck with .less and I myself am quite happy about it. Bootstrap 3 also comes in LESS which we leverage. 
In the file I present here, ```LESS stylesheet.less```, I demonstrate my usage of cascading styles along with custom LESS helpers to save me writing repetitive code. 

## Javascript

In the following files I demonstrate my usage of Javascript [require.js AMD modules with jQuery]
- ```ProductModalController.js```
- ```ComponentPageView.js```
- ```GoogleMarkerModel.js```
- 
### Controller
A simple controller that binds some Bootstrap Modal events and triggers rendering of a Google Map. Google Maps are a little bit tricky in rendering, because they can be properly displayed only once the DOM is final and their parent tags are already displayed.

### View 
The view enable the Google Markers on the map to be "highlighted" and "downplayed" - visual feedback to ```hover``` event. Furthermore it displays the Google Map with Markers and Routes [Polylines] on it. The map is properly zoomed in and centered.

### Model
Not a true Model implementation from a MVC perspective, however in our code it made sense that some logic related to creating objects, in this case Google Markers, is stored within one place. Thus the core functionality of this model is Google Marker Icon Factory, which gives the Marker correct settings to display various types of objects on a Google Map (place of interest, town/city and different icon set on ```hover```.

## Scala

We use Play! framework with Scala setup. As a frontend dev I often adjust or create new routes along with controllers. A basic controller I wrote is available for review in ```TravelDocumentationController.scala```.
I also prepare CO / views because I know the specification the best and can prepare it really according to my needs. Our server devs can then invest their time in more pressing matters. It actually often happens that the design changes a bit and sometimes causes and adjustment on the CO side. A part of implementation of such a view can be seen in ```TravelDocumentationService.scala```
