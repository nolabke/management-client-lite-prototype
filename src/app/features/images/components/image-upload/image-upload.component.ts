import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { MaterialModule } from '../../../../material/material.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ProjectService } from '../../../../services/project/project.service';
import { Project } from '../../../../shared/models/project';
import { MatSelectModule } from '@angular/material/select';
import { ApiImage } from '../../../../shared/models/api-image';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ImageUploadService } from '../../../../services/image-upload/image-upload.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSortModule } from '@angular/material/sort';
import { SharedService } from 'src/app/services/sharedservice/shared-service.service';;
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { VerwaltungService } from 'src/app/services/verwaltung/verwaltung.service';
import { StorageManagementService } from 'src/app/services/storage-management/storage-management.service';
import { UserService } from 'src/app/services/user/user-service.service';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-image-upload',
    standalone: true,
    imports: [MaterialModule, CommonModule, MatSelectModule, MatIconModule, MatProgressBarModule, FormsModule,
        MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatSortModule, RouterModule],
    templateUrl: './image-upload.component.html',
    styleUrl: './image-upload.component.scss'
})
export class ImageUploadComponent implements OnInit, OnDestroy {
  
  http: HttpClient = inject(HttpClient);
  
  public isProgressbarActivated: boolean = false;
  public projectSearchByName: boolean = false;
  public isSelectModeEnabled: boolean = false;
  public uploadProgress: number = 0;

  router: Router = inject(Router);

  projectService : ProjectService = inject(ProjectService);
  imageUploadService: ImageUploadService = inject(ImageUploadService);
  sharedServices: any = inject(SharedService);
  storageManagementService: StorageManagementService = inject(StorageManagementService);
  verwaltungService: VerwaltungService = inject(VerwaltungService);
  userService: UserService = inject(UserService);

  titleService : Title = inject(Title);
  pageTitle: string = "";

  public projectFromQR: Project = new Project();
  
  imagesToUpload : ApiImage[] = [];
 
  route: ActivatedRoute = inject(ActivatedRoute);
  files : any[] = [];
  imagesAsDataUrl : string[] = [];
  projectNo: string = '';


// TODO: Displaying images in list before loading - probably required Base64?
  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef, private matSnackBar: MatSnackBar){
    this.route.data.subscribe(data => {
      this.pageTitle = data['title'];
    });

    this.titleService.setTitle(this.pageTitle);
    this.verwaltungService.updateData(this.pageTitle);

  }
  private qrCodeSubscription?: Subscription;

  ngOnDestroy(): void {
    // Without this, every visit to this page leaves behind another live
    // subscriber to the (app-wide, never-completing) shared QR value - it
    // adds up fast given this screen is meant to be revisited many times a
    // day (scan next site's QR -> upload -> scan next site's QR -> ...).
    this.qrCodeSubscription?.unsubscribe();
  }

  //TODO: It could be good that the employer has a contact telephone numer to the client
  ngOnInit(): void {

    this.qrCodeSubscription = this.sharedServices.currentQrCodeValue.subscribe((projectQR: Project) => {
      this.projectFromQR = projectQR;
      this.projectNo = projectQR.ProjectNo;
      this.cdr.detectChanges();
    });
  }
  
  onFileSelected(event: any) {

    for(let i = 0; i < event.target.files.length; i++){
      const file = event.target.files[i];
      this.files.push(file);
      this.convertFileToDataUrl(file);
      console.log("Index: " + event.target.files[i]);
    }
       
    

   /* if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageBlob: Blob = new Blob([reader.result as ArrayBuffer], { type: file.type });
        
        // Call a function to send the imageBlob to your endpoint
        this.imagesToUpload.push(imageBlob);
        console.log("Image: " +imageBlob.type);
      };
      
      
      reader.readAsArrayBuffer(file);
      */
  }

  public convertFileToDataUrl(file : File){

    if(file){
      const reader = new FileReader();
      reader.onload = () => {
        this.imagesAsDataUrl.push(reader.result as string);
        // FileReader's onload fires as a plain browser callback, outside
        // any Angular-tracked event - without this the new thumbnail is in
        // the array but never actually gets rendered.
        this.cdr.detectChanges();
      }
      reader.readAsDataURL(file);
    }
  }
  

  public getProjectByProjectNo(){

    this.projectService.getByProjectNo(this.projectNo).subscribe({
      next: (project: Project) => {

        if (project?.ProjectNo) {
          this.projectFromQR = project;
          this.performUpload(project);
        } else {
          this.matSnackBar.open("Baustellenummer nicht gefunden", '', {
            duration: 6000,
            panelClass: ['snackbar-notification-error']
          });
        }
      },
      error: (e: any) => {
        console.error('Error fetching project', e);
        this.matSnackBar.open("Baustelle nicht gefunden", '', {
          duration: 6000,
          panelClass: ['snackbar-notification-error']
        });
      }
    });
  }

  /** Two supported flows both land here, gated by the same checks:
   *  1) the user picks photos first, then types in the Baustellennummer;
   *  2) the user scans the QR code first (Baustellennummer + project are
   *     already known), then adds photos from the phone/tablet.
   *  Either way, nothing is sent until both a project number and at least
   *  one file are present. */
  public uploadImages(){

    if (this.files.length === 0) {
      this.matSnackBar.open("Keine Dateien ausgewählt", '', {
        duration: 6000,
        panelClass: ['snackbar-notification-error']
      });
      return;
    }

    if (!this.projectNo) {
      this.matSnackBar.open("Bitte Baustellennummer eingeben oder QR-Code scannen", '', {
        duration: 6000,
        panelClass: ['snackbar-notification-error']
      });
      return;
    }

    // Already resolved (typically via a QR scan) - upload straight away
    // instead of looking the project up again.
    if (this.projectFromQR?.ProjectNo === this.projectNo) {
      this.performUpload(this.projectFromQR);
      return;
    }

    // Manually typed number - resolve it first; performUpload() runs once
    // the lookup succeeds.
    this.getProjectByProjectNo();
  }

  private performUpload(project: Project){

    this.imagesToUpload = [];

    this.files.forEach((file: File, index: number) => {

      const dataUrl = this.imagesAsDataUrl[index] ?? '';
      const base64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : '';
      const format = file.type?.split('/')[1] || 'jpeg';

      const apiImage: ApiImage = ApiImage.createApiImage(base64, format);
      apiImage.Name = file.name;
      apiImage.FileName = file.name;
      apiImage.Blob = new Blob([file], { type: file.type });

      this.imagesToUpload.push(apiImage);
    });

    if (this.imagesToUpload.length === 0) {
      this.matSnackBar.open("Keine Dateien ausgewählt", '', {
        duration: 6000,
        panelClass: ['snackbar-notification-error']
      });
      return;
    }

    let formData = this.imageUploadService.formatRequest(this.imagesToUpload, project);

    this.imageUploadService.uploadImages(formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event: any) => {
        // Only drives the progress bar while the upload is in flight. The
        // actual "it worked" handling lives in complete() below, since that
        // fires reliably both for the real backend (observe:'events'
        // completes right after its final Response event) and for the mock
        // service (whose canned event doesn't carry a matching status/type
        // to check here).
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.isProgressbarActivated = true;
          this.uploadProgress = Math.round(100 * event.loaded / event.total);
        }
      },
      error: (error) => {
        this.isProgressbarActivated = false;
        this.matSnackBar.open("Dateien nicht kopiert.", '', {
          duration: 6000,
          panelClass: ['snackbar-notification-error']
        });
      },
      complete: () => {
        this.uploadProgress = 100;
        this.isProgressbarActivated = false;
        this.imagesToUpload.splice(0, this.imagesToUpload.length);
        this.imagesAsDataUrl.splice(0, this.imagesAsDataUrl.length);
        this.files.splice(0, this.files.length);
        this.projectFromQR = new Project();
        this.cdr.detectChanges();
        this.matSnackBar.open("Dateien erfolgreich gesendet.", '', {
          duration: 6000,
          panelClass: ['snackbar-notification-success']
        });
      }
    });
  }

  public get canUpload(): boolean {
    return this.files.length > 0 && !!this.projectNo;
  }

  public removeImageFileFromList(index : number){
    
    this.files.splice(index,1);
    this.imagesAsDataUrl.splice(index, 1);

  }

  public enableSearch(){
    this.projectSearchByName = !this.projectSearchByName;
    this.isSelectModeEnabled = !this.isSelectModeEnabled;
    
  }

  public onProjectSelected(project: Project | null){
    if(project !== null){
      this.projectFromQR = project;
      this.projectNo = project.ProjectNo
      console.log("ABC" +project.City);
    }
  }
    
}