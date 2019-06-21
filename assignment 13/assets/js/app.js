var svgWidth = 660;
var svgHeight = 490;

var margin = {
  top: 20,
  right: 40,
  bottom: 130,
  left: 150
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv").then(function(data) {
  
  data.forEach( d => {
  	d.poverty = +d.poverty;
  	d.age = +d.age; 
  	d.income = +d.income;

  	d.healthcare = +d.healthcare;
  	d.obesity = +d.obesity;
  	d.smokes = +d.smokes;
  });

  var xAxis = "poverty";
  var yAxis = "healthcare";
  // start of graph

  graph = chartGroup
  			.append("g")
  			.attr("id", "graph")

  function createGraph(x, y) {
	  graph.html("")

	  var xLinearScale = d3.scaleLinear()
	    .domain([d3.min(data, d => d[x]) - 1, d3.max(data, d => d[x]) + 1])
	    .range([0, width]);	

	  var yLinearScale = d3.scaleLinear()
	    .domain([d3.min(data, d => d[y]) - 1, d3.max(data, d => d[y]) + 1])
	    .range([height, 0]);

	  var states = graph.selectAll("circle")
	  	.data(data)
	  	.enter()
	  	.append("circle")
	    .attr("cx", d => xLinearScale(d[x]))
	    .attr("cy", d => yLinearScale(d[y]))
	    .attr("class", "stateCircle")
	    .attr("r", 8);


	  graph.selectAll("text")
	  	.data(data)
	  	.enter()
	  	.append("text")
	  	.attr("class", "stateText")
	    .attr("x", d => xLinearScale(d[x]))
	    .attr("y", d => yLinearScale(d[y])+3)
	    .attr("font-size", 8)
	    .text(d => d.abbr);

	  var bottomAxis = d3.axisBottom(xLinearScale);
	  var leftAxis = d3.axisLeft(yLinearScale);

	  graph.append("g")
	      .attr("transform", `translate(0, ${height})`)
	      .call(bottomAxis);

	  graph.append("g")
	    .call(leftAxis);

	  var toolTip = d3.tip()
      	.attr("class", "d3-tip")
      	.offset([40, -63])
      	.html(function(d) {
      		var topText = ""

      		if (x == "poverty") {
      		   topText = `${x}: ${d[x]}%`;
      		}
      		else {
      	       topText = `${x}: ${d[x]}`;
      		}

        	return (`${d.state} <br> ${topText} <br> ${y}: ${d[y]}%`);
      	});

      graph.call(toolTip);

      states.on("mouseover", function(data, index) {
        toolTip.show(data, this);
        d3.select(this).attr("class", "");
        d3.select(this).attr("fill", "#89bdd3");
        d3.select(this).attr("stroke", "black");
      })

      .on("mouseout", function(data, index) {
        toolTip.hide(data);
        d3.select(this).attr("class", "stateCircle");
        d3.select(this).attr("stroke-width", 1);
      });

  }

	var poverty = chartGroup.append("text")
		.attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
		.attr("class", "active")
		.text("In Poverty (%)");

	var age = chartGroup.append("text")
		.attr("transform", `translate(${width / 2}, ${height + margin.top + 45})`)
		.attr("class", "inactive")
		.text("Age (medium)");

	var income = chartGroup.append("text")
		.attr("transform", `translate(${width / 2}, ${height + margin.top + 70})`)
		.attr("class", "inactive")
		.text("Household Income (medium)");

	var healthcare = chartGroup.append("text")
	    .attr("transform", "rotate(-90)")
	    .attr("y", 0 - margin.left + 100)
	    .attr("x", 0 - (height / 2))
	    .attr("dy", "1em")
	    .attr("class", "active")
	    .text("Lacks Healthcare (%)");

	var smokes = chartGroup.append("text")
	    .attr("transform", "rotate(-90)")
	    .attr("y", 0 - margin.left + 70)
	    .attr("x", 0 - (height / 2))
	    .attr("dy", "1em")
	    .attr("class", "inactive")
	    .text("Smokes (%)");

	var obese = chartGroup.append("text")
	    .attr("transform", "rotate(-90)")
	    .attr("y", 0 - margin.left + 45)
	    .attr("x", 0 - (height / 2))
	    .attr("dy", "1em")
	    .attr("class", "inactive")
	    .text("obese (%)");

	poverty.on("click", function(){
		xAxis = "poverty";
	  	createGraph(xAxis, yAxis);

		poverty.attr("class", "active");
	  	age.attr("class", "inactive");
	  	income.attr("class", "inactive")
	});

	age.on("click", function() {
		xAxis = "age";
	  	createGraph(xAxis, yAxis);

		poverty.attr("class", "inactive");
	  	age.attr("class", "active");
	  	income.attr("class", "inactive");
	});

	income.on("click", function(){
		xAxis = "income";
	  	createGraph(xAxis, yAxis);

		poverty.attr("class", "inactive");
	  	age.attr("class", "inactive");
	  	income.attr("class", "active")
	});

	healthcare.on("click", function(){
		yAxis = "healthcare";
	  	createGraph(xAxis, yAxis);

		healthcare.attr("class", "active");
	  	smokes.attr("class", "inactive");
	  	obese.attr("class", "inactive")
	});

	smokes.on("click", function(){
		yAxis = "smokes";
	  	createGraph(xAxis, yAxis);

		healthcare.attr("class", "inactive");
	  	smokes.attr("class", "active");
	  	obese.attr("class", "inactive")
	});

	obese.on("click", function(){
		yAxis = "obesity";
	  	createGraph(xAxis, yAxis);

		healthcare.attr("class", "inactive");
	  	smokes.attr("class", "inactive");
	  	obese.attr("class", "active")
	});
	

	createGraph(xAxis,yAxis);
});
