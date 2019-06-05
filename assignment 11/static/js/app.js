// from data.js
var tableData = data;

// YOUR CODE HERE!
function createTable(filteredData) {
	tableBody = d3.select("tbody");

	tableBody.html("");

	for(var i = 0; i < filteredData.length; i++) {
		tableRow = tableBody.append("tr");
		
		tableRow.append("td").text(filteredData[i].datetime)
		tableRow.append("td").text(filteredData[i].city)
		tableRow.append("td").text(filteredData[i].state)
		tableRow.append("td").text(filteredData[i].country)
		tableRow.append("td").text(filteredData[i].shape)
		tableRow.append("td").text(filteredData[i].durationMinutes)
		tableRow.append("td").text(filteredData[i].comments)
	}
}

createTable(tableData)

function filterClicked() {
	event.preventDefault();

	let dateInput = d3.select("#datetime").property("value");
	let cityInput = d3.select("#city").property("value");
	let stateInput = d3.select("#state").property("value");
	let countryInput = d3.select("#country").property("value");
	let shapeInput = d3.select("#shape").property("value");
	let dataFiltered = tableData;

	if(dateInput != "") {
		dataFiltered = dataFiltered.filter((siting) => {
			return siting.datetime == dateInput
		});	
	}

	if(cityInput != "") {
		dataFiltered = dataFiltered.filter((siting) => {
			return siting.city == cityInput
		});	
	}

	if(stateInput != "") {
		dataFiltered = dataFiltered.filter((siting) => {
			return siting.state == stateInput
		});	
	}

	if(countryInput != "") {
		dataFiltered = dataFiltered.filter((siting) => {
			return siting.country == countryInput
		});	
	}

	if(shapeInput != "") {
		dataFiltered = dataFiltered.filter((siting) => {
			return siting.shape == shapeInput
		});	
	}


	createTable(dataFiltered)
}


var FilterButton = d3.select("#filter-btn");
FilterButton.on("click", filterClicked);
