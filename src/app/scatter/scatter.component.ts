import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
// MatSort, MatTableDataSource
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HttpClient} from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { Subject } from 'rxjs';
import {merge, Observable, of as observableOf} from 'rxjs';
import * as d3 from 'd3';
import * as d3mouse from 'd3';
import * as d3Scale from 'd3';
import * as d3Shape from 'd3';
import * as d3Array from 'd3';
import * as d3Axis from 'd3';


declare var particlesJS: any;
@Component({
  selector: 'app-scatter',
  templateUrl: './scatter.component.html',
  styleUrls: ['./scatter.component.css']
})
export class ScatterComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private http: HttpClient, private SpinnerService: NgxSpinnerService) { }
  displayedColumns = ['event_id', 'event_uuid', 'pattern', 'log_text', 'time'];
  dataSource: MatTableDataSource<any>;

  private svg;
  private margin = 50;
  private width = 700 - (this.margin * 2);
  private height = 400 - (this.margin * 2);
  
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  public table_data = [];

private createSvg(): void {
    this.svg = d3.select("figure#scatter")
    .append("svg")
    .attr("width", this.width + (this.margin * 2))
    .attr("height", this.height + (this.margin * 2))
    .append("g")
    .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
}

private drawPlot(response_data): void {
  let resp_data = response_data['response_data']


  // const unixTime = this.final_data.minimum_time;
  // const newunix = this.final_data.maximum_time;
  const unixTime = resp_data['time_range'][0];
  const newunix = resp_data['time_range'][1];
  const color_codes = ["#4cf886","#123123","#667966","#ccff00","#bada55",
                      "#00c2c7","#b7e4ea,#acb1d9","#c5b0ad","#060644","#bada55",
                      "#fffaf0","#000080","#00c2c7,#123123","#7a1c86","#3632ff",
                      "#ff8dc7","#667966","#666679","#bada55,#696969","#b00b1e",
                      "#e62272","#098dba","#000000","#7fbf7f","#7f0000,#ffe5ea",
                      "#00e5e5","#774177","#ffc2cd","#ff4040","#872447","#f2d9f3",
                      "#7af684","#f20b34","#4cf886","#ccff00","#ff4040","#ff00ff",
                      "#ff7f50"]
  const tooltip = d3.select("figure#scatter")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color",'cornsilk')

  let mouseover  = (event:any, data:any, element:any): void => {
      console.log("####", data)
      tooltip
        .html('<b>Event ID </b>: ' + data.event_id + '<br> <b>Time:</b> '+data.readable_timestamp)
        .style("opacity", 1);
  }

  let mouseleave  = (d:any): void => {
      tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
  }

  let formatMinutes = (d:any): string => {
      let fm = d3.timeFormat("%H:%M")
      return fm(d)
  }


  let color = d3.scaleOrdinal()
  .domain(resp_data['event_groups'])
  .range(color_codes);
  
  // Add X axis
  const x = d3.scaleTime()
  .domain([unixTime, newunix])
  .range([ 0, this.width ]);
  this.svg.append("g")
  .attr("transform", "translate(0," + this.height + ")")
  .call(d3.axisBottom(x).tickFormat(formatMinutes));

  // Add Y axis
  const y = d3.scaleLinear()
  .domain([resp_data['uid_range'][0], resp_data['uid_range'][1]])
  .range([ this.height, 0]);
  this.svg.append("g")
  .call(d3.axisLeft(y));
  
  // Add dots
  const dots = this.svg.append('g');
  dots.selectAll("dot")
  .data(resp_data['data'])
  .enter()
  .append("g")
  .append("circle")
  .attr("cx", d => x(d.timestamp))
  .attr("cy", d => y(d.event_id_int))
  .attr("r", 7)
  .style("opacity", .5)
  .style("fill", d => color(d.event_id))
  .style("stroke", "black")
  // .style("border", "1px solid")
  // .style("fill", 'cornsilk')
  .on("mouseover", mouseover)
  .on("mouseleave", mouseleave);
  // Add labels
  // dots.selectAll("text")
  // .data(this.data)
  // .enter()
  // .append("text")
  // .text(d => d.Pattern)
  // .attr("x", d => x(d.Released))
  // .attr("y", d => y(d.Count));
  // const date = new Date(unixTime*1000)//.toLocaleString();
  // console.log("^^^^^", date)
  // const date2 = new Date(newunix*1000)//.toLocaleString();
  // console.log("^^^^^", date2)

}


public getLocations(): void {
  this.SpinnerService.show();
  this.http.get('http://127.0.0.1:8000/get_data/').toPromise().then((data) => {
  console.log(data);
  this.SpinnerService.hide();
  this.drawPlot(data);
  this.dataSource = new MatTableDataSource(data['response_data']['events']);
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
  this.table_data = data['response_data']['events'];
  console.log(this.table_data);
  this.dtOptions = {
    pagingType: 'full_numbers',
    pageLength: 5,
    serverSide: true,
    processing: true,
  };
  this.dtTrigger.next();
  });
  }

  ngOnInit(): void {
    
    this.createSvg();
    // this.drawPlot();
    this.getLocations();
    particlesJS.load('particles-js', '../../../assets/data/particlesjs-config.json', function() { console.log('callback - particles.js config loaded'); });
    // d3.json('http://localhost:8080/get_data/').then(data => this.drawPlot(data));
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}
