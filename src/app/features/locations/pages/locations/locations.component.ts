import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MaterialModule } from '../../../../material/material.module';
import { ProjectService } from '../../../../services/project/project.service';
import { Project } from '../../../../shared/models/project';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { SearchFilterPipe} from '../../../../search-filter.pipe';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { VerwaltungService } from '../../../../services/verwaltung/verwaltung.service';
import { Title } from '@angular/platform-browser';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-locations',
    standalone: true,
    imports: [MaterialModule, MatTableModule,  MatPaginatorModule, MatSortModule, MatIconModule,
        SearchFilterPipe, CommonModule, RouterModule],
    templateUrl: './locations.component.html',
    styleUrl: './locations.component.scss'
})
export class LocationsComponent implements OnInit, AfterViewInit{
  
  displayedColumns: string[] = [/*'Id',*/ 'ProjectNo', 'Name', 'Street', 'City', 'Zip', 'IsDisabled', 'editBtn'];
  projectService : ProjectService = inject(ProjectService);
  private verwaltungService: VerwaltungService = inject(VerwaltungService); 
  titleService : Title = inject(Title);
  pageTitle: string = "";

  public projects : Project[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  
  dataSource = new MatTableDataSource<any>(this.projects);

  searchTerm! : string;


  constructor(private cdr : ChangeDetectorRef, private route: ActivatedRoute ){
    this.route.data.subscribe(data => {
      this.pageTitle = data['title'];
    });

    this.titleService.setTitle(this.pageTitle);
    this.verwaltungService.updateData(this.pageTitle);

  }
  

  ngOnInit(): void {
    this.getProjects();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  getProjects(){
    this.projectService.getProjects().subscribe(
      ((response : Project[]) => {
        console.log("Res: " +response)
        this.projects = response;
        this.dataSource.data = response;
      })
    )
  }

  public onSearchTermChange(event: Event) {
    if(event.target !== null){
        console.log("Test " + event.target)
        this.searchTerm = (event.target as HTMLInputElement).value;
        this.cdr.detectChanges();
    }
  
  }

}
