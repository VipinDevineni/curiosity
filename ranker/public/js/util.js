//var util = {};
(function(publicScope) {

	var searchResultsContainer, preferencesResultsContainer;

	publicScope.geolocation = function(successHandler, errorHandler) {
		errorHandler = errorHandler || geolocationErrorHandler;

		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
		} else {
			alert("Geolocation is not supported by this browser.");
		}
	}

	function geolocationErrorHandler(error) {
		alert(getGeolocationErrorMessage(error));
	}

	function getGeolocationErrorMessage(error) {
		switch(error.code) {
		case error.PERMISSION_DENIED:
			return "Your location will not be shared with other users."
		case error.POSITION_UNAVAILABLE:
			return "Location information is unavailable."
		case error.TIMEOUT:
			return "The request to get your location timed out."
		case error.UNKNOWN_ERROR:
			return "An unknown error occurred."
		}
	}

	publicScope.getHoursAndMinutes = function(){
		var date = new Date();
		var hours =	date.getHours().toString();
		var minutes = date.getMinutes().toString();
		if(hours.length < 2)
			hours = "0" + hours;
		if(minutes.length < 2)
			minutes = "0" + minutes;
		return hours+":"+minutes;
	}

	publicScope.initializeSearchResultsContainer = function(parentContainerId) {
		searchResultsContainer = $("<div>").addClass('list-messages-container');
		createWindow("You Searched", parentContainerId, searchResultsContainer);
	}

	publicScope.initializePreferencesContainer = function(parentContainerId) {
		preferencesResultsContainer = $("<div>").addClass('list-messages-container');
		createWindow("Preferences", parentContainerId, preferencesResultsContainer);
	}
	
	function createWindow(header, parentContainerId, resultsContainer){
		var myContainer = $("#"+parentContainerId);

		$("<div>").addClass("line-header").appendTo(myContainer);

		$("<div>").addClass("list-header").html(header).appendTo(myContainer);

		//listMessagesContainer = $("<div>").addClass('list-messages-container');
		//messagesList = $('<ul>').addClass('list-messages');

		//listMessagesContainer.append(messagesList);
		//myContainer.append(listMessagesContainer);

		myContainer.append(resultsContainer)
	}

	publicScope.updatePreference = function(removedPreferences, selectedPreference, userPreferenceList, globalPreferenceMap) {
      //console.log('updatePreference -- enter');

      //check if the selected preference is in the userPreferenceList,
      // if so it should be in the removed preferences, 
      // if not add the position to the removed list
  console.log("vipin");
      if(selectedPreference) {
  console.log("vipin");
      	var selectionFoundInRemovedList = false;
      	var selectedPosInPreferenceList = -1;
      	for(var j=0; j < 4; j++) {
  console.log("vipin");
      		if(userPreferenceList[j] != undefined && 
      			userPreferenceList[j].id == selectedPreference.place.id) {
  console.log("vipin");
      			selectedPosInPreferenceList = j;
      			for(var k = 0, rp; rp = removedPreferences[k]; k++) {
  console.log("vipin");
      				if(rp == j) {
  console.log("vipin");
      					selectionFoundInRemovedList = true;
      					break;
      				}
      			}
      		}
      		if(selectedPosInPreferenceList != -1) {
  console.log("vipin");
      			break;
      		}
      	}

      	if(selectedPosInPreferenceList != -1 && selectionFoundInRemovedList == false) {
console.log("vipin");
      		if(removedPreferences == undefined) {
console.log("vipin");
      			removedPreferences = [];
      		}
console.log("vipin");
      		removedPreferences.push(selectedPosInPreferenceList);
      	}
      }

      //remove the de-selected preferences
      if(removedPreferences) {
console.log("vipin");
        for(var i = 0, pos; pos = removedPreferences[i]; i++) {
          //remove the value of the place from the global preference list
console.log("vipin");
          if(userPreferenceList[pos]) {
console.log("vipin");
            gPref = globalPreferenceMap[userPreferenceList[pos].id];
console.log("vipin");
            if(gPref) {
console.log("vipin");
              gPref.value = gPref.value - (4-pos);
console.log("vipin");
              if(gPref.value == 0) {
console.log("vipin");
                delete globalPreferenceMap[userPreferenceList[pos].id];
              }
            }
          }
console.log("vipin");
          userPreferenceList[pos] = undefined;
        }
      }

      //add the new preference
      if(selectedPreference) {
console.log("vipin");
        userPreferenceList[selectedPreference.position] = selectedPreference.place;
console.log("vipin");
        //increase the value of the selection by the selected position in global list.
        gPref = globalPreferenceMap[userPreferenceList[selectedPreference.position].id];        
console.log("vipin");
        if(gPref) {
console.log("vipin");
          gPref.value = gPref.value + (4-selectedPreference.position);
        } else {
console.log("vipin");
          gData = {value: (4-selectedPreference.position),
                    place: selectedPreference.place };
          globalPreferenceMap[userPreferenceList[selectedPreference.position].id] = gData;
        }
      }

      //console.log('updatePreference -- exit');

	}

})(typeof module === 'undefined' ? this['util']={} : module.exports); //util);

//module.exports.updatePreference = util.updatePreference;