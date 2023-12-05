// Import D3
import { Component, Input } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'line-chart',
  template: '<div class="chart-container" id="chartContainer"><svg id="lineChart"></svg></div>',
  styleUrls: ['line-chart.component.scss']
})
export class LineChartComponent {

  @Input()
  width!: 500;

  @Input()
  height!: 500;

  lineData: number[] = [];

  @Input()
  set data(data: number[] | undefined[]) {
    console.log(data);
    this.lineData = data as number[];
    this.drawChart(data as number[]);
  }

  drawChart(data: number[]) {
    d3.select("#lineChart").selectAll("*").remove();
    let container = document.getElementById('chartContainer');
    let containerWidth = (container as HTMLElement).clientWidth;
    let containerHeight = (container as HTMLElement).clientHeight;
    if (data.length) {

      d3.select("#lineChart")
      .attr("width", containerWidth)
      .attr("height", containerHeight);

      // Set the dimensions of the canvas / graph
      var margin = {top: 10, right: 30, bottom: 30, left: 60},
      width = containerWidth - margin.left - margin.right,
      height = containerHeight - margin.top - margin.bottom;

      // Append the svg object to the body of the page
      var svg = d3.select("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // X scale and Axis
      var x = d3.scaleLinear()
        .domain([0, data.length - 1])
        .range([0, width]);
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      // Y scale and Axis
      var y = d3.scaleLinear()
        .domain([d3.min(data as any[]), d3.max(data as any[])])
        .range([height, 0]);
      svg.append("g")
        .call(d3.axisLeft(y));

    const lineGenerator = d3.line()
        .x((d, i) => x(i))
        .y(d => y(d[1]));

    const linePathString = lineGenerator(data.map((d, i) => [i, d]));

      // Add the line
      svg.append("path")
      .datum(this.data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", linePathString
      );
    }

  }
}
