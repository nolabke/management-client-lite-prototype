import { AfterViewInit, Component, OnInit, ViewChild, inject, ChangeDetectorRef } from '@angular/core';
import { ApiImage } from '../../../../../shared/models/api-image';
import { MaterialModule } from '../../../../../material/material.module';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BilderVerwaltungService } from '../../../../../services/bilder-verwaltung/bilder-verwaltung.service';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { VerwaltungService } from '../../../../../services/verwaltung/verwaltung.service';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-bilder-verwaltung',
    standalone: true,
    imports: [MaterialModule, MatTableModule,  MatCheckboxModule, CommonModule, MatTableModule, MatPaginatorModule, MatSortModule, RouterModule],
    templateUrl: './bilder-verwaltung.component.html',
    styleUrl: './bilder-verwaltung.component.scss'
})
export class BilderVerwaltungComponent implements OnInit, AfterViewInit{


  public images : ApiImage[] = [];
  dataSource = new MatTableDataSource<any>(this.images);
  imagesToSyncronizationById : number[] = [];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort! : MatSort;

  // 'IsSynced' dropped - getUnsyncedImages() (see below) only ever returns
  // images that aren't synced yet, so every row's value was always "Nein";
  // showing the column added nothing. 'Name' and 'ProjectNo' merged into
  // a single 'Baustelle' column (Baustellennummer on top, Baustelle name
  // below - see the matColumnDef="Baustelle" template), and 'UserName'
  // (Mitarbeiter_in) moved to be the last column.
  displayedColumns: string[] = ['select', 'FileName', 'UploadDate', 'Baustelle', 'UserName'];
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
    // Matches the old searchFilter pipe's behaviour exactly (match against
    // the whole stringified row, case-insensitive) - but going through
    // MatTableDataSource's own filter instead of piping a plain array into
    // [dataSource] means sorting (matSort) keeps working together with the
    // search box, instead of the table losing its live connection to the
    // sorted/paginated data source.
    this.dataSource.filterPredicate = (data: any, filter: string) =>
      JSON.stringify(data).toLowerCase().includes(filter);

    this.getNotSyncedImages();

  }

  ngAfterViewInit(): void {

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // ProjectNo, UserName and Name aren't top-level fields on the image
    // row - they live nested under Location/User (see IMAGES_MOCK), so
    // MatSort's default accessor (data[sortHeaderId]) would always read
    // undefined for these three columns and sorting would silently do
    // nothing. This was written before but left commented out.
    this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string) => {
      switch (sortHeaderId) {
        // 'Baustelle' now covers both former 'ProjectNo' and 'Name'
        // columns (merged into one, see displayedColumns above) - sorts by
        // the Baustellennummer, since that's the value shown on top.
        case 'Baustelle':
          return data.Location?.ProjectNo;
        case 'UserName':
          return data.User?.UserName;
        default:
          return data[sortHeaderId];
      }
    };
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

    // The API echoes back the *same* ids it was asked to sync (see
    // BilderVerwaltungService.syncImages() / POST /api/Image/SyncAllImages
    // on the backend, which does `res.json(ids)`) - it does NOT return
    // "still unsynced" ids despite the old `notSyncedImagesResponse` name.
    // The old `if (notSyncedImagesResponse.length === 0)` check was
    // therefore backwards: for any real, non-empty selection the response
    // is non-empty, so that branch never ran - no snackbar, no refresh, no
    // reset of the selection - even though the sync itself succeeded on the
    // server. Since errors already go to the `error` callback below, `next`
    // firing at all *is* the success signal.
    this.bilderVervaltungsService.syncImages(this.imagesToSyncronizationById)
    .subscribe({
      next: () => {

        this.imagesToSyncronizationById = [];

        this.matScackBar.open(
          'Dateien wurden erfolgreich an WinDach übertragen.',
          '',
          {
            duration: 3000,
            panelClass: 'snackbar-notification-success'
          }
        );

        // Re-fetch the unsynced list from the server instead of manually
        // filtering the stale local `images` snapshot against a hand-kept
        // "hiddenImagesIds" exclusion list - the server is the actual
        // source of truth for "which images are still unsynced", and this
        // also correctly reflects images synced from another device/tab in
        // the meantime, which the old client-side list never could.
        this.getNotSyncedImages();
      },
      error: (error) => {
        console.error('Error syncing images', error);
        this.matScackBar.open(
          'Dateien konnten nicht an WinDach übertragen werden.',
          '',
          {
            duration: 6000,
            panelClass: 'snackbar-notification-error'
          }
        );
      }
    });
  }

  onSearchTermChange(event: Event) {
    if(event.target !== null){
        console.log("Test " + event.target)
        this.searchTerm = (event.target as HTMLInputElement).value;
        this.dataSource.filter = this.searchTerm.toLowerCase();
        this.cdr.detectChanges();

    }
  }
}
