
(function($, undefined){
	function getJson() {
		var data = {};
		$.ajax({
			url: "pmen_clones.json",
			datatype: "json",
			async: false,
			success: function(json) {
				data = json;
			}
		});
		return data;
	}


	var fetchSubset = function(json, column, searchdata){
		var min = max = 0;
		var datamap = {};
		datamap['data'] = new Array;
		for(var i=0;i<json.length;i++){
			if(json[i].pmen_designation == searchdata) {
				datamap['data'].push(json[i]);
			}
		}

		datamap['range'] = getMinMax(json);
		return datamap;
	}

	var getMinMax = function(json) {
		var min = max = fl = 0;
		
		for(var i=0;i<json.length;i++){
			if(json[i].date_first_isolated != undefined && json[i].date_first_isolated != "" && fl == 0) {
				min = json[i].date_first_isolated;
				fl = 1;
			}
			json[i].date_first_isolated = parseInt(json[i].date_first_isolated);
			if(json[i].date_first_isolated < min) min = json[i].date_first_isolated;
			if(json[i].date_first_isolated > max) max = json[i].date_first_isolated;

		}
		return {'min': min, 'max': max};
	}

	var createMap = function() {
		var map;
		var geocoder;
		var latlng = new google.maps.LatLng(9.554772, 7.908414);
		var mapOptions = {
		  zoom: 2,
		  center: latlng,
		  scrollwheel: true
		}
		map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		// console.log(map)
		return map;
	}

	function createSlider(options){
		var simple_slider = $("<div id='slider' />");
		$('#slider_container').html(simple_slider)

		simple_slider.sliderDemo(options);
		// date.dateSliderDemo();
		// modifiable.editSliderDemo();
	}

	var resizeMap = function() {
		$('#map-canvas').css('height',$( window ).height())
	}
	$( window ).resize(function() {
		resizeMap();
	});

	google.maps.event.addDomListener(window, 'load', function () {

		$( ".draggable" ).draggable({containment:"#container"});
		var map = createMap();
		resizeMap();

		var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
		var json = getJson();
		createDesignationSelection(json);
		var types = getAllTypes();
		colormap = createAllColorMapByType(json,[types[0]]);

		var datamap = fetchSubset(json, 'pmen_designation', $('#designation_selection :selected').val());
		
		datamap['map'] = map;
		datamap['iconBase'] = iconBase;
		datamap['selected_type'] = $('input[name="type"]:checked').val();

		datamap['markers'] = getMarkers(map, datamap['data'], $('input[name="type"]:checked').val());;
		// Storing all markers to clear the markers according to dropdown selection
		all_markers = datamap['markers'];

		var options = {
			json: datamap,
			title: "Year Slider",
			min: datamap.range.min,
			max: datamap.range.max,
			defaultMin: datamap.range.min + 30,
			defaultMax: datamap.range.max - 10
		}
		createSlider(options);
		// Creating color map for rest of the types after loading
		colormap = createAllColorMapByType(json,types);
		// initTheme();

		$('#designation_selection, input[name="type"]').on('change', function() {
			clearMarkers(all_markers);
			var datamap = fetchSubset(json, 'pmen_designation', $('#designation_selection :selected').val());
			datamap['map'] = map;
			datamap['iconBase'] = iconBase;
			datamap['selected_type'] = $('input[name="type"]:checked').val();
			// Clear all previous markers
			
			datamap['markers'] = getMarkers(map, datamap['data'], $('input[name="type"]:checked').val());
			// Storing all markers to clear the markers according to dropdown selection
			all_markers = datamap['markers'];

			var options = {
				json: datamap,
				title: "Year Slider",
				min: datamap.range.min,
				max: datamap.range.max,
				defaultMin: datamap.range.min + 30,
				defaultMax: datamap.range.max - 10
			}
			createSlider(options);
		});
	});

})(jQuery);

var getColorArray = function(colorSet) {
	var color_arr = new Array;
	for(var i=0; i<colorSet.length;i++) {
		for(var j=0; j<colorSet[i].length;j++) {
			color_arr.push(colorSet[i][j]);
		}
	}
	return color_arr;
}


var colorSet = [chroma.brewer.Set3,chroma.brewer.Set2,chroma.brewer.Pastel2,chroma.brewer.Paired,chroma.brewer.Accent,chroma.brewer.Pastel1,chroma.brewer.Pastel2];
var colorArray = getColorArray(colorSet);
var datamap
var all_markers = {};
var colormap = {};

var getAllTypes = function() {
	var types_arr = new Array;
	var types = document.getElementsByName( 'type' );
	for(var i=0; i<types.length; i++){
		types_arr.push(types[i].value);
	}
	return types_arr;
}

var createDesignationSelection = function(json) {
	var select_element = $('#designation_selection')
	var pmen_desig_map = {};
	for(var i=0; i<json.length; i++){
		pmen_desig_map[json[i].pmen_designation] = 1;
	}
	for(var desig in pmen_desig_map) {
	    $('<option />', {value: desig, text: desig}).appendTo(select_element);
	}
 
}

var createAllColorMapByType = function(data,_types) {
	var colormap = {};

	for(var t=0; t<_types.length;t++) {
		colormap[_types[t]] = {};
		var color_index = 0;
		for(var i=0; i<data.length;i++) {
			if(colormap[_types[t]][data[i][_types[t]]] == undefined) {
				colormap[_types[t]][data[i][_types[t]]] = colorArray[color_index];
				color_index++;
			}
		}
	}
	return colormap;
}
var getMarkers = function(map, data, _type) {

	var all_markers = new Array;
	var color_index = 0;
	for(var i=0; i<data.length;i++) {
		var loc = data[i].coordinates.split(','); 
		var latlng = new google.maps.LatLng(loc[0], loc[1]);
		// console.log(latlng)

		// var marker = new google.maps.Marker({
		//     position: latlng,
		//     map: map,
		//     icon: 'http://maps.google.com/mapfiles/kml/pal4/icon23.png',
		//     title: 'test'
		// });
		// // Create icon 
		// var icon = new google.maps.MarkerImage(
		//     "http://maps.google.com/mapfiles/kml/pal4/icon49.png",
		//     null, /* size is determined at runtime */
		//     null, /* origin is 0,0 */
		//     null, /* anchor is bottom center of the scaled image */
		//     new google.maps.Size(25,25)
		// );
		// // set icon to marker
		// marker.setIcon(icon);

		var marker = new StyledMarker({
			styleIcon: new StyledIcon(StyledIconTypes.BUBBLE,{
				color: colormap[_type][data[i][_type]],
				text: (data[i][_type] != "")?data[i][_type]:"N/A"
			}),
			position: latlng,
			map: map
		});

		// var html = "<div style='width: 120px; text-align: left; color: grey;'><b>"+ data[i].country + " : <span style='color:brown;'>" + count + "</span></b></div>";

		var html = "<div style='overflow:auto;max-width:400px;white-space:nowrap;font-weight:bold;'>";
		html += "<h3>" + data[i].country + "</h3><table>";
		if(data[i].parent_clone != "")
			html += "<tr><td><span style='color: #666;'>Parent Clone: </span></td><td><span style='color:brown;'>" + data[i].parent_clone + "</span></td></tr>";
		if(data[i].serotype != "")
			html += "<tr><td><span style='color: #666;'>Serotype: </span></td><td><span style='color:brown;'>" + data[i].serotype + "</span></td></tr>";
		if(data[i].seq_type != "")
			html += "<tr><td><span style='color: #666;'>Sequence Type: </span></td><td><span style='color:brown;'>" + data[i].seq_type + "</span></td></tr>";
		if(data[i].date_first_isolated != "" && !isNaN(data[i].date_first_isolated))
			html += "<tr><td><span style='color: #666;'>Date first isolated: </span></td><td><span style='color:brown;'>" + data[i].date_first_isolated + "</span></td></tr>";
		if(data[i].continent != "")
			html += "<tr><td><span style='color: #666;'>Continent: </span></td><td><span style='color:brown;'>" + data[i].continent + "</span></td></tr>";
		if(data[i].reference != "")
			html += "<tr><td><span style='color: #666;'>Reference: </span></td><td><span style='color:brown;'>" + data[i].reference + "</span></td></tr>";
		if(data[i].atcc_number != "")
			html += "<tr><td><span style='color: #666;'>ATCC Number: </span></td><td><span style='color:brown;'>" + data[i].atcc_number + "</span></td></tr>";

		html += "</table></div>";

		// var infowindow = new google.maps.InfoWindow(
		//           { content: html,
		//             // size: new google.maps.Size(50,50)
		//           });
		var infowindow = new google.maps.InfoWindow();

		google.maps.event.addListener(marker, 'click', (function(marker, html) {
            return function() {
                infowindow.setContent(html);
                infowindow.open(map, marker);
            }
        })(marker, html));
        marker['date'] = data[i].date_first_isolated;
		// google.maps.event.addListener(marker, 'mouseout', function() { infowindow.close(map, marker);});
		all_markers.push(marker);
	}
	return all_markers;
}

// Sets the map on all markers in the array.
function setMarkers(markers, date_min, date_max) {
	for (var i = 0,c=0,d=0; i < markers.length; i++) {
		if(date_min <= markers[i].date && markers[i].date <= date_max) {
   			markers[i].setVisible(true);c++;
    	}
    	else {
   			markers[i].setVisible(false);d++;
    	}
  	}
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers(markers) {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
}

