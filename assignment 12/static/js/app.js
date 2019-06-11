function buildMetadata(sample) {
    d3.json(`/metadata/${sample}`).then((sampleData) => {
      metadata = d3.select("#sample-metadata").html("");

      metadata.append("p").text(`AGE: ${sampleData.AGE}`);
      metadata.append("p").text(`BBTYPE: ${sampleData.BBTYPE}`);
      metadata.append("p").text(`ETHNICITY: ${sampleData.ETHNICITY}`);
      metadata.append("p").text(`LOCATION: ${sampleData.LOCATION}`);
      metadata.append("p").text(`WFREQ: ${sampleData.WFREQ}`);
      metadata.append("p").text(`SAMPLE: ${sample}`);
    });
}

function buildCharts(sample) {
    d3.json(`/samples/${sample}`).then((sampleData) => {
      sortedValues = sampleData.sample_values.slice(0);
      sortedValues.sort(function(a, b) {
        return b - a;
      });  

      var topValues = sortedValues.slice(0, 10);
      var topID = [];
      var topLabels = [];

      var index = sampleData.sample_values.indexOf(topValues[0]);
      topID.push(sampleData.otu_ids[index]);
      topLabels.push(sampleData.otu_labels[index]);

      for(var i = 1; i < 10; i++) {
        if (topValues[i - 1] == topValues[i]) {
          var prevIndex = index;
          var tempData = sampleData.sample_values.slice(prevIndex + 1);
          index = tempData.indexOf(topValues[i]) + prevIndex + 1;
          topID.push(sampleData.otu_ids[index]);
          topLabels.push(sampleData.otu_labels[index]);
          
        }
        else {
          index = sampleData.sample_values.indexOf(topValues[i]);
          topID.push(sampleData.otu_ids[index]);
          topLabels.push(sampleData.otu_labels[index]);
        }

      } 
      
      var data1 = [{
        values: topValues,
        labels: topID,
        hovertext: topLabels,
        type: 'pie'
      }];

      var layout1 = {
        height: 500,
        width: 625
      };

      Plotly.newPlot('pie', data1, layout1);

      var data2 = [{
        x: sampleData.otu_ids,
        y: sampleData.sample_values,
        mode: "markers",
        text: sampleData.otu_labels,

        marker: {
          color: sampleData.otu_ids,
          size: sampleData.sample_values
        }
      }];

      var layout2 = {
        height: 600,
        width: 1300,

        xaxis: {
          title: "OTU ID"
        }
      };

      Plotly.newPlot('bubble', data2, layout2);

      console.log(topValues);
      console.log(topID);
      console.log(topLabels);
    });
  
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

