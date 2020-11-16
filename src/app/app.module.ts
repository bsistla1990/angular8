import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PieComponent } from './pie/pie.component';
import { ScatterComponent } from './scatter/scatter.component';
import { BarComponent } from './bar/bar.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from "ngx-spinner"; 
import { DataTablesModule} from 'angular-datatables';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    PieComponent,
    ScatterComponent,
    BarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxSpinnerModule,
    DataTablesModule,
    BrowserAnimationsModule,
    // MatPaginator,
    // MatTableDataSource,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule
    // MatSort
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
