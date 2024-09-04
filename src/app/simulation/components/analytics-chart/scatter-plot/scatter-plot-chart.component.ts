
import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as d3 from 'd3';

export interface IScatterPlotData {
  x: number;
  y: number;
  tooltip: string;
}

@Component({
  selector: 'scatter-plot-chart',
  templateUrl: 'scatter-plot-chart.component.html',
  styleUrls: ['scatter-plot-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScatterPlotComponent implements AfterViewInit {

  @Input()
  width!: 500;

  @Input()
  height!: 500;

  scatterplotData: IScatterPlotData[] = [];

  @Input()
  set data(data: IScatterPlotData[]) {
    this.scatterplotData = data as IScatterPlotData[];
    this.drawChart(data as IScatterPlotData[]);
  }

  @Output()
  onInit: EventEmitter<void> = new EventEmitter<void>()

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.drawChart(this.scatterplotData);
    }, 200)

  }

  drawChart(data: IScatterPlotData[]) {
    d3.select("#scatterplotChart").selectAll("*").remove();
    let container = document.getElementById('chartContainer');
    let containerWidth = (container as HTMLElement).clientWidth;
    let containerHeight = (container as HTMLElement).clientHeight;
    if (data.length) {

      d3.select("#scatterplotChart")
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
        .domain([d3.min(data.map(d => d.x) as any[]), d3.max(data.map(d => d.x) as any[])])
        .range([0, width]);
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      // Y scale and Axis
      var y = d3.scaleLinear()
        .domain([d3.min(data.map(d => d.y) as any[]), d3.max(data.map(d => d.y) as any[])])
        .range([height, 0]);

    svg.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y)
          .tickSize(-width)  // Make the gridlines span the entire width of the chart
          .tickFormat('' as any));  // Remove the labels, just keep the lines

      svg.append("g")
        .call(d3.axisLeft(y));
        const tooltip = d3.select("#tooltip");
        svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
          .attr("cx", function (d) { return x(d.x); } )
          .attr("cy", function (d) { return y(d.y); } )
          .attr("r", 2.5)
          .style("fill", "#69b3a2")
          .on("mouseover", (event, d) => {
            tooltip.transition().duration(200).style("opacity", .9);
            tooltip.html(d.tooltip)
              .style("left", (event.pageX + 5) + "px")
              .style("top", (event.pageY - 28) + "px");
          })
          .on("mouseout", () => {
            tooltip.transition().duration(500).style("opacity", 0);
          });
    }

  }
}
