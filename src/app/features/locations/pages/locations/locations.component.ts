import { AfterViewInit, ChangeDetectorRef, Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MaterialModule } from '../../../../material/material.module';
import { ProjectService } from '../../../../services/project/project.service';
import { Project } from '../../../../shared/models/project';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
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
        CommonModule, RouterModule],
    templateUrl: './locations.component.html',
    styleUrl: './locations.component.scss'
})
export class LocationsComponent implements OnInit, AfterViewInit{
  
  // Desktop keeps Kunde/Adresse/Stadt/PLZ as separate columns. On
  // tablet/smartphone they are merged into a single "Location" column
  // (see the Location matColumnDef in the template) so the table stays
  // readable at narrow widths.
  desktopColumns: string[] = [/*'Id',*/ 'ProjectNo', 'Name', 'Street', 'City', 'Zip', 'IsDisabled', 'editBtn'];
  compactColumns: string[] = [/*'Id',*/ 'ProjectNo', 'Location', 'IsDisabled', 'editBtn'];

  displayedColumns: string[] = this.desktopColumns;
  projectService : ProjectService = inject(ProjectService);
  private verwaltungService: VerwaltungService = inject(VerwaltungService);
  titleService : Title = inject(Title);
  pageTitle: string = "";
  breakpointObserver: BreakpointObserver = inject(BreakpointObserver);
  destroyRef: DestroyRef = inject(DestroyRef);

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

    // Same 1024px breakpoint used by the table's responsive CSS - switches
    // between the full desktop column set and the merged compact one.
    this.breakpointObserver.observe(['(max-width: 1024px)'])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        this.displayedColumns = result.matches ? this.compactColumns : this.desktopColumns;
      });

  }
  

  ngOnInit(): void {
    // Matches the old searchFilter pipe's behaviour exactly (match against
    // the whole stringified row, case-insensitive) - but going through
    // MatTableDataSource's own filter instead of piping a plain array into
    // [dataSource] means sorting (matSort) keeps working together with the
    // search box, instead of the table losing its live connection to the
    // sorted/paginated data source.
    this.dataSource.filterPredicate = (data: any, filter: string) =>
      JSON.stringify(data).toLowerCase().includes(filter);
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
        this.dataSource.filter = this.searchTerm.toLowerCase();
        this.cdr.detectChanges();
    }

  }

}
