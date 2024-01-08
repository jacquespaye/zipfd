function createBarChart(data) {

  let topWords = data.slice(0, 20);
  let maxCount = topWords[0][1];

  let container = d3.select('#bar-chart-container');
  container.html(''); // Clear previous content

  // Create tooltip
  let tooltip = d3.select('#tooltip');

  // Create the bars using D3
  let bars = container.selectAll('.bar')
    .data(topWords)
    .enter()
    .append('div')
    .classed('bar', true)
    .style('height', d => `${(d[1] / maxCount) * 100}%`)
    .on('mouseover', function(event, d) {
      tooltip.style('visibility', 'visible')
        .text(`Count: ${d[1]}`)
        .style('top', (event.pageY - 10) + 'px')
        .style('left', (event.pageX + 10) + 'px');
    })
    .on('mouseout', function() {
      tooltip.style('visibility', 'hidden');
    });

  // Append labels to bars
  bars.append('div')
    .classed('bar-label', true)
    .text(d => d[0]);
}

// Assume response.words is an array of [word, count] pairs
function createLogChart(data) {
  data = data.filter(d => d[1] >= 5);
  // Calculate log rank and log frequency
  data = data.map((d, i) => [i + 1, d[1], d[0]]);

  // Set up SVG using D3
  const svg = d3.select('#log-chart-container');
  const margin = {top: 20, right: 20, bottom: 40, left: 40};
  const width = +svg.attr('width') - margin.left - margin.right;
  const height = +svg.attr('height') - margin.top - margin.bottom;
  const g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // Create scales
  const x = d3.scaleLog().rangeRound([0, width]);
  const y = d3.scaleLog().rangeRound([height, 0]);

  // Set domains
  x.domain(d3.extent(data, d => d[0]));
  y.domain(d3.extent(data, d => d[1]));

  // Draw axes
  g.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x));

  g.append('g')
    .call(d3.axisLeft(y));
  // Add X-Axis Label
  g.append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 5) // Adjust position as needed
    .style("text-anchor", "middle")
    .text("Log Rank");

  // Add Y-Axis Label
  g.append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left - 3)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em") // Adjust distance from axis
    .style("text-anchor", "middle")
    .text("Log Frequency");
  let tooltip = d3.select('#tooltip');

  // Draw points
  g.selectAll('.dot')
    .data(data)
    .enter().append('circle')
    .attr('class', 'dot')
    .attr('cx', d => x(d[0]))
    .attr('cy', d => y(d[1]))
    .attr('r', 5)
    .on('mouseover', function(event, d) {
      tooltip.style('visibility', 'visible')
        .html(`Word: ${d[2]}<br>Rank: ${d[0]}<br>Count: ${d[1]}`)
        .style('top', (event.pageY - 10) + 'px')
        .style('left', (event.pageX + 10) + 'px');
    })
    .on('mouseout', function() {
      tooltip.style('visibility', 'hidden');
    });

}

document.addEventListener('DOMContentLoaded', function() {    
  document.getElementById('zipf-button').addEventListener('click', function() {    
    // Send a message to the service worker
    // // In popup.js
chrome.runtime.sendMessage({command: "getWordsFromActiveTab"}, function(response) {
  if (response && response.words) {
    createBarChart(response.words);
    createLogChart(response.words);
  }
});

  });    
});

