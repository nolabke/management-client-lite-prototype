import { AfterViewInit, Component, OnInit, ViewChild, inject, ChangeDetectorRef } from '@angular/core';
import { ApiImage } from '../../../../../shared/models/api-image';
import { MaterialModule } from '../../../../../material/material.module';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BilderVerwaltungService } from '../../../../../services/bilder-verwaltung/bilder-verwaltung.service';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { SearchFilterPipe } from '../../../../../search-filter.pipe';
import { MatSort } from '@angular/material/sort';
import { VerwaltungService } from '../../../../../services/verwaltung/verwaltung.service';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-bilder-verwaltung',
    standalone: true,
    imports: [MaterialModule, MatTableModule,  MatCheckboxModule, CommonModule, MatTableModule, MatPaginatorModule, SearchFilterPipe, RouterModule],
    templateUrl: './bilder-verwaltung.component.html',
    styleUrl: './bilder-verwaltung.component.scss'
})
export class BilderVerwaltungComponent implements OnInit, AfterViewInit{


  public hiddenImagesIds: number[] = [];
  

  public images : ApiImage[] = [];
  dataSource = new MatTableDataSource<any>(this.images);
  imagesToSyncronizationById : number[] = [];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort! : MatSort;
  @ViewChild('sortingDataAccessor') sortingDataAccessor = new MatSort();
  
  displayedColumns: string[] = ['select', 'FileName', 'UploadDate', 'UserName', 'Name',  'ProjectNo','IsSynced'];
  bilderVerwaltung: BilderVerwaltungService = inject(BilderVerwaltungService);

  searchTerm!: string;
  verwaltungService: VerwaltungService = inject(VerwaltungService);
  bilderVervaltungsService : BilderVerwaltungService = inject(BilderVerwaltungService);

  pageTitle: string = '';
  titleService : Title = inject(Title);
  

  constructor(private cdr: ChangeDetectorRef, private route : ActivatedRoute, private matScackBar: MatSnackBar){

    this.route.data.subscribe(data => {
      this.pageTitle = data['title'];
    });

    this.titleService.setTitle(this.pageTitle);
    this.verwaltungService.updateData(this.pageTitle);

  }
  
  toggleAllRows(checked: boolean) {
    if(checked){
       this.imagesToSyncronizationById = this.dataSource.data.map(image => image.Id);
    }else{
      this.imagesToSyncronizationById = [];
    }

    console.log('Selected IDs:', this.imagesToSyncronizationById);
   
  }

  isRowSelected(id: number): boolean {
    return this.imagesToSyncronizationById.includes(id);
  }

  isAllSelected(){
    return this.imagesToSyncronizationById.length === this.dataSource.data.length;
  }

  isIndeterminate(): boolean {

    return this.imagesToSyncronizationById.length > 0 && !this.isAllSelected();
  }

  selectionChanged(row: any) {
    const index = this.imagesToSyncronizationById.indexOf(row.id);
    if (index === -1) {
      this.imagesToSyncronizationById.push(row.id);
    } else {
      this.imagesToSyncronizationById.splice(index, 1);
    }
    console.log('Selected IDs selection changed: ', this.imagesToSyncronizationById);
  }

  ngOnInit(): void {

    this.getNotSyncedImages();
    
  }

  ngAfterViewInit(): void {

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    //this.dataSource.sort = this.sortingDataAccessor;
/*

    this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string) => {
      
      switch (sortHeaderId) {
        case 'ProjectNo':
          return data.Location.ProjectNo;
        case 'UserName':
          return data.User.UserName;
        case 'Name':
          return data.Location.Name;
        default:
          return data[sortHeaderId];
      }
    };
    */
  }

  public getNotSyncedImages() {
    
      this.bilderVerwaltung.getUnsyncedImages().subscribe(
        (response) =>{
          this.images = response;
          this.dataSource.data = response;
        }
      )
  }

  public syncImages(){

    this.bilderVervaltungsService.syncImages(this.imagesToSyncronizationById)
    .subscribe((notSyncedImagesResponse) => {

      if (notSyncedImagesResponse.length === 0) {

      this.hiddenImagesIds.push(...this.imagesToSyncronizationById);

      this.dataSource.data = this.images.filter(
        image => !this.hiddenImagesIds.includes(image.Id)
      );

      this.imagesToSyncronizationById = [];

      this.matScackBar.open(
        'Dateien wurden erfolgreich an WinDach übertragen.',
        '',
        {
          duration: 3000,
          panelClass: 'snackbar-notification-success'
        }
      );
    }
    });
  }

  onSearchTermChange(event: Event) {
    if(event.target !== null){
        console.log("Test " + event.target)
        this.searchTerm = (event.target as HTMLInputElement).value;
        this.cdr.detectChanges();
      
    }
  }
}
