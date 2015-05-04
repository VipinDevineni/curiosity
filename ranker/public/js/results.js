var results = {};
(function(publicScope) {

	var searchResultsContainer, preferencesResultsContainer, userChoiceContainer, userChoiceList, webSocket, myPreferences, globalPreferenceMap;

	publicScope.setSocket = function(socket) {
		webSocket = socket;
	}

	publicScope.setMyPreferences = function(preferences) {
		myPreferences = preferences;
	}

	publicScope.setGlobalPreferences = function(globalPrefMap) {
		globalPreferenceMap = globalPrefMap;
	}

	publicScope.initializeSearchResultsContainer = function(parentContainerId) {

		searchResultsContainer = $("<div>").addClass('list-messages-container');
		createWindow("You Searched", parentContainerId, searchResultsContainer);

		userChoiceList = [];
		userChoiceList[0] = undefined;
		userChoiceList[1] = undefined;
		userChoiceList[2] = undefined;
		userChoiceList[3] = undefined;
	}

	publicScope.initializePreferencesContainer = function(parentContainerId) {
//console.log('vipin- initializePreferencesContainer enter')
		preferencesResultsContainer = $("<div>").addClass('list-messages-container');
		createWindow("Today's Preferences", parentContainerId, preferencesResultsContainer);
//console.log('vipin- initializePreferencesContainer exit')
	}

	publicScope.initializeUserChoiceContainer = function(parentContainerId) {
		//userChoiceContainer = $("<div>").addClass('list-messages-container');
		//createWindow("Your Selection", parentContainerId, userChoiceContainer);
	}
	
	function createWindow(header, parentContainerId, resultsContainer){
		var myContainer = $("#"+parentContainerId);

		$("<div>").addClass("line-header").appendTo(myContainer);
		$("<div>").addClass("list-header").html(header).appendTo(myContainer);

		myContainer.append(resultsContainer)
	}

	publicScope.updateSearchResults = function(dataList) {
		searchResultsContainer.empty();
		var searchList = $('<ul>').addClass('search-results');
		for(var i=0, data; data = dataList[i]; i++) {
			var result = $(document.createElement("li"));
			$("<span class='search-result btn-link'>"+data.place.name+"</span>").data('index',data.index).appendTo(result);
			updateResult(result, data);
			result.append("<p>Google Rating:"+data.place.rating);
			result.append(data.place.formatted_address+"</p>");	
			
			$("<div>").appendTo(result);
			$("<div>").appendTo(result);

			searchList.append(result);
		}
		searchResultsContainer.append(searchList);
	}

	publicScope.updateGlobalPreferenceResults = function(dataList) {
		preferencesResultsContainer.empty();
		var prefList = $('<ul>').addClass('preference-results');
		for(var i=0, data; data = dataList[i]; i++) {
			var result = $(document.createElement("li"));
			$("<span class='preference-result btn-link'>"+data.place.name+"</span>").data('index',data.index).appendTo(result);
			//updateResult(result, data);
			result.append("<p>Google Rating:"+data.place.rating);
			result.append(data.place.formatted_address+"</p>");	
			
			$("<div>").appendTo(result);
			$("<div>").appendTo(result);

			prefList.append(result);
		}
		preferencesResultsContainer.append(prefList);
	}

	publicScope.updateMySelectionResults = function(dataList) {

		//userChoiceContainer.empty();
		//var choiceList = $('<ul>').addClass('choice-results');
		var tr = $('<tr id="myChoices">');
		for(var i=1; i<4; i++) {
			//var result1 = $(document.createElement("li"));
			if(dataList[i] != undefined) {
				span = $("<span class='choice-result btn-link'>"+dataList[i].place.name+"</span>").data('index',dataList[i].index);
				//result1.append(span);
				//result1.append("<p>Google Rating:"+dataList[i].place.rating);
				//result1.append(dataList[i].place.formatted_address+"</p>");
				//tr += "<td>"+result1+"</td>";
				td = $('<td>');
				td.append(span);
				td.append("<p>Google Rating:"+dataList[i].place.rating);
				td.append(dataList[i].place.formatted_address+"</p>");
				tr.append(td);
			} else {
				//$("<p>No Selection</p>").appendTo(result1);
				//tr += "<td>No selection made yet</td>";
				td = $('<td>');
				td.append('No selection made yet');
				tr.append(td);
			}

			//$("<div>").appendTo(result1);
			//$("<div>").appendTo(result1);

			//choiceList.append(result1);

		}
		//userChoiceContainer.append(choiceList);
		//tr += "</tr>"
		$('#myChoices').remove();
		add_new_row('#selectionTable',tr);
	}

	function add_new_row(table,rowcontent){
        if ($(table).length>0){
            if ($(table+' > tbody').length==0) $(table).append('<tbody />');
            ($(table+' > tr').length>0)?$(table).children('tbody:last').children('tr:last').append(rowcontent):$(table).children('tbody:last').append(rowcontent);
        }
    }

	function updateResult(result, data) {
			something = $('<input/>').attr({ type: 'button', name:'btn1', value:'1'});
			if(myPreferences[1] != undefined && myPreferences[1].id == data.place.id) {
				something.addClass("btn-dn");
			} else {
				something.addClass("btn-up");
			}
			something.data('place', data.place);
			something.click(function() {selectionMade(this)});
			something.appendTo(result);
			something= $('<input/>').attr({ type: 'button', name:'btn2', value:'2'});
			if(myPreferences[2] != undefined && myPreferences[2].id == data.place.id) {
				something.addClass("btn-dn");
			} else {
				something.addClass("btn-up");
			}
			something.data('place', data.place);
			something.click(function() {selectionMade(this)});
			something.appendTo(result);
			something= $('<input/>').attr({ type: 'button', name:'btn3', value:'3'});
			if(myPreferences[3] != undefined && myPreferences[3].id == data.place.id) {
				something.addClass("btn-dn");
			} else {
				something.addClass("btn-up");
			}
			something.data('place', data.place);
			something.click(function() {selectionMade(this)});
			something.appendTo(result);
	}

	function selectionMade (n) {
console.log("vipin");
		removedPreferences = [];
		selection = undefined;
		//rP = 0;
console.log("vipin");
		if($(n).hasClass("btn-up")) {
console.log("vipin");
			if(userChoiceList[n.value] != undefined){
console.log("vipin");
				//if there was a previous selection for this value, remove it
				toggleButton(userChoiceList[n.value]);
				userChoiceList[n.value] = undefined;
				removedPreferences.push(n.value);
			}
console.log("vipin");
			//check and remove if this place selected as another choice
			for (var sel = 1; sel < 4; sel++) {
console.log("vipin");
				selectionUpdated(n,sel, removedPreferences);
			}

console.log("vipin");
			//set this selection
			userChoiceList[n.value] = n;
			$(n).removeClass("btn-up");
			$(n).addClass("btn-dn");
			selection = {position: n.value, place: $(n).data("place")};
console.log("vipin");
		} else {
console.log("vipin");
			removedPreferences.push(n.value);
			toggleButton(n);
			userChoiceList[n.value] = undefined;
		}

		//send update message
		webSocket.emit('update my preference', removedPreferences, selection);
		//update local copy
console.log("vipin");
		util.updatePreference(removedPreferences, selection, myPreferences, globalPreferenceMap);
console.log("vipin");
		locator.loadGlobalPreferences(globalPreferenceMap);
		//display the preferences in the selection region
		locator.loadSelectionData(myPreferences);
	}


	function selectionMade_old (n) {
		removedPreferences = [];
		selection = undefined;
		rP = 0;
console.log("vipin");
		if($(n).hasClass("btn-up")) {
console.log("vipin");
			// button is selected for first time
			if(userChoiceList[n.value] != undefined){
console.log("vipin");
				//if there was a previous selection for this value, remove it
				toggleButton(userChoiceList[n.value]);
console.log("vipin");
				userChoiceList[n.value] = undefined;
console.log("vipin");
				removedPreferences[rP] = n.value;
console.log("vipin");
				rP++;
			}
console.log("vipin");
			//check if this place selected as another choice
			t = compareWithSelection(n, 1);
			if(t != undefined) {
console.log("vipin");
				removedPreferences[rP] = t.value;
				rP++;
			}
console.log("vipin");
			t = compareWithSelection(n, 2);
			if(t != undefined) {
console.log("vipin");
				removedPreferences[rP] = t.value;
				rP++;
			}
console.log("vipin");
			t = compareWithSelection(n, 3);
			if(t != undefined) {
console.log("vipin");
				removedPreferences[rP] = t.value;
				rP++;
			}
console.log("vipin");
			//set this selection
			userChoiceList[n.value] = n;
			$(n).removeClass("btn-up");
			$(n).addClass("btn-dn");
			selection = {position: n.value,
							place: $(n).data("place")};
		} else {
console.log("vipin");
			removedPreferences[rP] = n.value;
			rP++;
			toggleButton(n);
			userChoiceList[n.value] = undefined;
		}

		//send update message
		webSocket.emit('update my preference', removedPreferences, selection);
		//update local copy
		util.updatePreference(removedPreferences, selection, myPreferences, globalPreferenceMap);
		locator.loadGlobalPreferences(globalPreferenceMap);
		//display the preferences in the selection region
		locator.loadSelectionData(myPreferences);
	}

	function toggleButton(n) {
		if(n != undefined) {
			if($(n).hasClass("btn-up")) {
				$(n).removeClass("btn-up");
				$(n).addClass("btn-dn");
			} else {
				$(n).removeClass("btn-dn");
				$(n).addClass("btn-up");
			}
		}
	}

	function selectionUpdated(selectedButton, oldSelectionIndex, removedPreferences) {
		//if(userChoiceList[oldSelectionIndex] != undefined) {
			if(selectedButton.value == oldSelectionIndex) {
				//clear the old selection
				toggleButton(userChoiceList[oldSelectionIndex]);
				userChoiceList[oldSelectionIndex] = undefined;
				removedPreferences.push(oldSelectionIndex);
			}
			else if(myPreferences[oldSelectionIndex] != undefined) {
				if(myPreferences[oldSelectionIndex].id == $(selectedButton).data("place").id) {
					toggleButton(userChoiceList[oldSelectionIndex]);
					userChoiceList[oldSelectionIndex] = undefined;
					removedPreferences.push(oldSelectionIndex);
				}
			}
		//}
	}

	function compareWithSelection(n,idx) {
		if(userChoiceList[idx] != undefined && ($(userChoiceList[idx]).data("place").id == $(n).data("place").id)) {
			toggleButton(userChoiceList[idx]);
			temp = userChoiceList[idx];
			userChoiceList[idx] = undefined;
			return temp;
		}

		return undefined;
	}

})(results);