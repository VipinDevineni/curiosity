var locator = {};
(function(publicScope) {
	var map, myPreferenceDataList, searchDataList, preferenceDataList, infoWindow, currentMarkersOnMap, socket, myKey, selectionDataList;

	publicScope.loadGlobalPreferences = function(globalPreferenceMap) {
console.log("vipin");
		for (var i = 0, data1; data1 = preferenceDataList[i]; i++) {
			data1.marker.setMap(null);
		}

		preferenceDataList = [];

		//sort the preferences based on value
		var tempList = [];
		for(var key in globalPreferenceMap) {
			tempList.push(globalPreferenceMap[key]);
		}

		tempList.sort(function(a, b) {
			return b.value - a.value;
		});

		for(var k=0, pData; pData = tempList[k]; k++) {
			var prefMarker = new google.maps.Marker({
				map: map,
				title: pData.place.name,
				position: new google.maps.LatLng(pData.place.geometry.location.ob, pData.place.geometry.location.pb)
			});
			var prefData = {
      				marker: prefMarker,
      				index: k,
      				place: pData.place,
      				value: pData.value				
			};
			preferenceDataList.push(prefData);
			setInfoWindow(prefMarker);
		}
		results.updateGlobalPreferenceResults(preferenceDataList);
	}

	publicScope.loadSelectionData = function(myPreferences) {
console.log("vipin");
		for(var i = 1; i<4; i++) {
			if(selectionDataList[i] != undefined) {
				selectionDataList[i].marker.setMap(null);
			}
		}

		selectionDataList = [];

		for(var i = 1; i<4; i++) {

			if(myPreferences[i] != undefined) {

				var selMarker = new google.maps.Marker({
					map: map,
					title: myPreferences[i].name,
					position: new google.maps.LatLng(myPreferences[i].geometry.location.ob, myPreferences[i].geometry.location.pb)
				});

				var selData = {
					marker: selMarker,
					index: i,
					place: myPreferences[i]
				};

				selectionDataList[i] = selData;
				setInfoWindow(selMarker);
			}

		}

		results.updateMySelectionResults(selectionDataList);
	}

	publicScope.initialize = function(mapId) {
		preferenceDataList = [];
		myPreferenceDataList = [];
		searchDataList = [];
		selectionDataList = [];

		infoWindow = new google.maps.InfoWindow({});

		var defaultPosition = new google.maps.LatLng(-34.397, 150.644);
		
		var mapOptions = {
			zoom: 13,
			center: defaultPosition,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		map = new google.maps.Map(document.getElementById(mapId), mapOptions);

		//util.geolocation(showPosition);

		setPosition();
		//initialize Places
		initializePlaces();

		$(document).on('click', ".search-result", showSearchResult);
		$(document).on('click', ".preference-result", showPreferenceResult);
		$(document).on('click', ".choice-result", showChoiceResult);

		socket = io.connect(window.location.hostname);
		results.setSocket(socket);
		socket.emit('initialize me', initializeMe);
		socket.emit('request global preferences', setGlobalPreferences);
		//socket.on('updated global preferences', publicScope.loadPreferences);
		socket.on('updated global preferences', setGlobalPreferences);
		socket.on('your preferences', setMyPreferences);
	}

	function initializeMe(data) {
		myKey = data.key;
		results.setMyPreferences(data.preferences);
		publicScope.loadSelectionData(data.preferences);
	}

	function setMyPreferences(data) {
		if(myKey == data.key) {
			results.setMyPreferences(data.preferences);
			publicScope.loadSelectionData(data.preferences);
		}
		//myPreferenceDataList = preferences;
	}

	function setGlobalPreferences(globalPreferenceMap) {
		results.setGlobalPreferences(globalPreferenceMap);
		publicScope.loadGlobalPreferences(globalPreferenceMap);
	}

	function showSearchResult(event) {
		event.preventDefault();
		var idx = $(event.currentTarget).data("index");
		google.maps.event.trigger(searchDataList[idx].marker, 'click');
	}

	function showPreferenceResult(event) {
		event.preventDefault();
		var idx = $(event.currentTarget).data("index");
		google.maps.event.trigger(preferenceDataList[idx].marker, 'click');
	}

	function showChoiceResult(event) {
		event.preventDefault();
		var idx = $(event.currentTarget).data("index");
		google.maps.event.trigger(selectionDataList[idx].marker, 'click');
	}

	function setPosition() {
		//home location
		//var defaultPosition = new google.maps.LatLng(33.2714837, -111.78604109999999);
		//office location
		var defaultPosition = new google.maps.LatLng(33.5769342, -111.88514339999999);
//console.dir("defaultPosition:" + defaultPosition);
//console.dir("lat:" + defaultPosition.lat);
//console.dir("lng:" + defaultPosition.lng);
		map.setCenter(new google.maps.LatLng(defaultPosition.ob, defaultPosition.pb));
	}

	function showPosition(position) {
		var data = {
			lat : position.coords.latitude,
			lng : position.coords.longitude,
		}
console.dir("Data.lat:"+data.lat);
console.dir("Data.lng:"+data.lng);
		// myMarker = getMarker(data.lat, data.lng, 'Me');
		// map.setCenter(myMarker.getPosition());
		//map.setCenter(new google.maps.LatLng(data.lat, data.lng));

		//home location
		//var defaultPosition = new google.maps.LatLng(33.2714837, -111.78604109999999);
		//office location
		var defaultPosition = new google.maps.LatLng(33.5769342, -111.88514339999999);
console.dir("defaultPosition:" + defaultPosition);
console.dir("lat:" + defaultPosition.lat);
console.dir("lng:" + defaultPosition.lng);
		map.setCenter(new google.maps.LatLng(defaultPosition.ob, defaultPosition.pb));

		//initialize Places
		initializePlaces();
	}

	function initializePlaces() {
		var input = (document.getElementById('target'));
		var searchBox = new google.maps.places.SearchBox(input, {bounds: map.getBounds()});

		google.maps.event.addListener(searchBox, 'places_changed', function() {
			var places = searchBox.getPlaces();

			for (var i = 0, data1; data1 = searchDataList[i]; i++) {
				data1.marker.setMap(null);
			}

			searchDataList = [];
    		for (var i = 0, place; place = places[i]; i++) {
    			//console.dir(place.geometry.location);
      			var gMarker = new google.maps.Marker({
        			map: map,
        			//icon: image,
        			title: place.name,
        			position: place.geometry.location
      			});
console.log('vipin-search result for:' + place.name + ' location'); //.lb:' + place.geometry.location.lb + ' location.mb:' + place.geometry.location.mb);
console.dir(place.geometry.location);
      			var data = {
      				marker: gMarker,
      				index: i,
      				place: place
      			};

      			searchDataList.push(data);
      			setInfoWindow(gMarker);
    		}

    		results.updateSearchResults(searchDataList);

  		});

  		google.maps.event.addListener(map, 'bounds_changed', function() {
  		//	var bounds = map.getBounds();
  		//	searchBox.setBounds(bounds);
  			var searched = document.getElementById('target').value;
  			document.getElementById('target').value = '';
  			document.getElementById('target').value = searched;
  			searchBox.bindTo('bounds', map);
  		});
	}

	function setInfoWindow(marker) {
		google.maps.event.addListener(marker, 'click', function() {
			infoWindow.setContent(marker.title);
			infoWindow.open(map,marker);
		});
	}

	function reactToBoundsChanged() {
		alert(map.getBounds());
	}

	function getMarker(lat, lng, title) {
		return new google.maps.Marker({
			title: title,
			map: map,
			position: new google.maps.LatLng(lat,lng)
		});
	}

})(locator);