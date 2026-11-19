import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../material/material.module';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { VerwaltungService } from '../../../../services/verwaltung/verwaltung.service';
import { User } from '../../../../shared/models/user';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-users-management',
    standalone: true,
    imports: [
              FormsModule,
              CommonModule,
              MaterialModule,
              MatIconModule,
              MatPaginatorModule,
              MatSortModule,
              MatTableModule,
              RouterModule
            ],
    templateUrl: './users-management.component.html',
    styleUrls: ['./users-management.component.scss'],
    providers: [AuthenticationService]
})
export class UsersManagementComponent implements OnInit, AfterViewInit{
  
  public users: User[] = [];
  dataSource = new MatTableDataSource<any>(this.users);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Desktop keeps Vorname/Nachname/Benutzername as separate columns.
  // On tablet/smartphone they are merged into a single "Contact" column
  // (see the Contact matColumnDef in the template) so the table stays
  // readable at narrow widths.
  desktopColumns: string[] = ['Id', 'FirstName', 'LastName', 'UserName', 'IsAdmin', 'IsDisabled', 'LastLogin', 'Actions'];
  compactColumns: string[] = ['Id', 'Contact', 'IsAdmin', 'IsDisabled', 'LastLogin', 'Actions'];

  displayedColumns: string[] = this.desktopColumns;

  searchTerm!: string;

  verwaltungService: VerwaltungService = inject(VerwaltungService);
  breakpointObserver: BreakpointObserver = inject(BreakpointObserver);
  destroyRef: DestroyRef = inject(DestroyRef);

  pageTitle: string = '';
  titleService : Title = inject(Title);


  constructor(private cdr: ChangeDetectorRef,  private route : ActivatedRoute) {
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
    this.getUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  onSearchTermChange(event: Event) {
    if(event.target !== null){

        this.searchTerm = (event.target as HTMLInputElement).value;
        this.dataSource.filter = this.searchTerm.toLowerCase();
        this.cdr.detectChanges();
    }
  }

  public getUsers() {

      this.verwaltungService.getUsers().subscribe(
        (res: any) =>{
          this.users = res;
         this.dataSource.data = res;
        }
      )
      console.log(this.users);
  }
}
