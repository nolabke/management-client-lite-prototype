import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../material/material.module';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { VerwaltungService } from '../../../../services/verwaltung/verwaltung.service';
import { User } from '../../../../shared/models/user';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { SearchFilterPipe } from '../../../../search-filter.pipe';
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
              SearchFilterPipe,
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

  displayedColumns: string[] = ['Id', 'FirstName', 'LastName', 'UserName','IsAdmin', 'IsDisabled', 'LastLogin', 'Actions'];

  searchTerm!: string;

  verwaltungService: VerwaltungService = inject(VerwaltungService);

  pageTitle: string = '';
  titleService : Title = inject(Title);


  constructor(private cdr: ChangeDetectorRef,  private route : ActivatedRoute) {
    this.route.data.subscribe(data => {
      this.pageTitle = data['title'];
    });

    this.titleService.setTitle(this.pageTitle);
    this.verwaltungService.updateData(this.pageTitle);
  }
  
  
  ngOnInit(): void {
    this.getUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort; 
  }

  
  onSearchTermChange(event: Event) {
    if(event.target !== null){
    
        this.searchTerm = (event.target as HTMLInputElement).value;
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
