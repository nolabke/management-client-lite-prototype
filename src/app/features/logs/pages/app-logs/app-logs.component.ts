import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { LogEntry } from '../../../../shared/models/log-entry';
import { VerwaltungService } from '../../../../services/verwaltung/verwaltung.service';
import { MaterialModule } from '../../../../material/material.module';
import { MatCell } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatHeaderCell } from '@angular/material/table';
import { MatHeaderRow } from '@angular/material/table';
import {MatRow} from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { LOGS_MOCK } from 'src/app/mocks/logs.mock';

@Component({
    selector: 'app-app-logs',
    standalone: true,
    imports: [MaterialModule, CommonModule, MatPaginatorModule, MatTableModule, MatCell, MatHeaderCell, MatHeaderRow, MatRow],
    templateUrl: './app-logs.component.html',
    styleUrl: './app-logs.component.scss'
})
export class AppLogsComponent implements AfterViewInit{


  public logEntries: LogEntry[] = []
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort! : MatSort;
  
  dataSource = new MatTableDataSource<any>(this.logEntries);
  

  displayedColumns: string[] = ['Date','Type', 'Message', 'Controller', 'User'];
  images: any;

  verwaltungService: VerwaltungService = inject(VerwaltungService);

  pageTitle: string = '';
  titleService : Title = inject(Title);

  constructor(private verwaltung: VerwaltungService, private route : ActivatedRoute) { 

    this.route.data.subscribe(data => {
      this.pageTitle = data['title'];
    });

    this.titleService.setTitle(this.pageTitle);
    this.verwaltungService.updateData(this.pageTitle);
  }
  
  ngOnInit(): void {
    this.getLogEntries();
    
  }

  ngAfterViewInit(): void {

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  public async getLogEntries() {
    
      this.verwaltung.getLogEntries().subscribe(
        response =>{
          this.logEntries = response;
          this.dataSource.data = response;
        }
      )
  }

}

