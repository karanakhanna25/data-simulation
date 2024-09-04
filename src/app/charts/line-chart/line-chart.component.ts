import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import * as d3 from 'd3';

export interface ILineData {
  x: string;
  y: number;
}

@Component({
  selector: 'line-chart',
  template: '<div class="chart-container" id="chartContainer"><svg id="lineChart"></svg></div>',
  styleUrls: ['line-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineChartComponent implements AfterViewInit {

  @Input()
  width: number = 500;

  @Input()
  height: number = 500;

  lineData: ILineData[] = [];

  @Input()
  set data(data: ILineData[]) {
    this.lineData = data;
    this.drawChart(data);
  }

  @Output()
  onInit: EventEmitter<void> = new EventEmitter<void>()

  ngAfterViewInit(): void {
    this.onInit.emit();
    setTimeout(() => { this.drawChart(this.lineData) }, 200)
  }

  drawChart(data: ILineData[]) {
    d3.select("#lineChart").selectAll("*").remove();
    let container = document.getElementById('chartContainer');
    let containerWidth = (container as HTMLElement).clientWidth;
    let containerHeight = (container as HTMLElement).clientHeight;

    if (data.length) {
      d3.select("#lineChart")
        .attr("width", containerWidth)
        .attr("height", containerHeight);

      // Set the dimensions of the canvas / graph
      const margin = { top: 10, right: 30, bottom: 50, left: 60 };
      const width = containerWidth - margin.left - margin.right;
      const height = containerHeight - margin.top - margin.bottom;

      // Append the svg object to the body of the page
      const svg = d3.select("#lineChart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // X scale and Axis
      const x = d3.scaleBand()
        .domain(data.map(d => d.x))
        .range([0, width])
        .padding(0.1);

      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'rotate(-45)') // Rotates the labels 45 degrees
        .style('text-anchor', 'end'); // Aligns the text at the end of the label;

      // Y scale and Axis
      const y = d3.scaleLinear()
        .domain([d3.min(data, d => d.y)! - 5, d3.max(data, d => d.y)! + 5])  // Adding a buffer to the domain
        .range([height, 0]);

      svg.append("g")
        .call(d3.axisLeft(y));

      // Define the line
      const lineGenerator = d3.line<ILineData>()
        .x(d => x(d.x)! + x.bandwidth() / 2)  // Center the line in the middle of the band
        .y(d => y(d.y))
        .curve(d3.curveMonotoneX);  // Optional: smooth the line

      // Add the line
      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", lineGenerator);
    }
  }
}
