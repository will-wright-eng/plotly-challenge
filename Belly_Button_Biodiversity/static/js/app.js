function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  var url = `/metadata/${sample}`;
  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    d3.json(url).then(function(data) {
      // clearing any existing metadata
      d3.select("#sample-metadata").html("");
      // Use `Object.entries` to add each key and value pair to the panel
      Object.entries(data).forEach(([k, v]) => {
        // Use d3 to select the panel with id of `#sample-metadata`
        d3.select("#sample-metadata").append("p").text(`${k}: ${v}`);
      });
    });
    

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  var url = `/samples/${sample}`;
  // Use `d3.json` to fetch the sample data for the plots
  d3.json(url).then(function(data) {
    // use slice() to grab the top 10 sample_values, otu_ids, and labels (10 each).
    var otu_ids = data["otu_ids"]; 
    var sample_otu_ids = otu_ids.slice(0, 10);
    var sample_values = data["sample_values"];
    var values = sample_values.slice(0, 10);
    var sample_text = data["otu_labels"]; 
    var text = sample_text.slice(0, 10); 
    console.log(otu_ids);

    var trace1 = {
      labels: otu_ids,
      values: values, 
      hovertext: sample_text,
      type: 'pie'
    }; 
    var data1 = [trace1];
    var layout1 = {
      title: "Belly Button Diversity Pie Chart"
    };

    var trace2 = {
      x: otu_ids, 
      y: values, 
      mode: 'markers',
      marker: {
        size: sample_values, 
        color: otu_ids, 
      },
      text: sample_text, 
      type: 'scatter'
    };
    var data2 = [trace2];
    var layout2 = {
      title: 'Belly Button Diversity Bubble Chart',
      showlegend: false,
      height: 750,
      width: 750
    };

    // Build a Pie Chart
    Plotly.newPlot("pie", data1, layout1);
    // Build a Bubble Chart using the sample data
    Plotly.newPlot("bubble", data2, layout2);
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
