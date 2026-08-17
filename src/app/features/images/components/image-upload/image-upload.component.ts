import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
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
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { VerwaltungService } from 'src/app/services/verwaltung/verwaltung.service';
import { StorageManagementService } from 'src/app/services/storage-management/storage-management.service';
import { UserService } from 'src/app/services/user/user-service.service';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-image-upload',
    standalone: true,
    imports: [MaterialModule, CommonModule, MatSelectModule,  MatCardModule, MatIconModule, MatProgressBarModule, FormsModule,
        MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatSortModule, RouterModule],
    templateUrl: './image-upload.component.html',
    styleUrl: './image-upload.component.scss'
})
export class ImageUploadComponent implements OnInit {
  
  http: HttpClient = inject(HttpClient);
  
  public isProgressbarActivated: boolean = false;
  public projectSearchByName: boolean = false;
  public isSelectModeEnabled: boolean = false;
  public uploadProgress: number = 0;

  router: Router = inject(Router);
  
  @ViewChild('uploadButton') uploadButton!: ElementRef;

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
  currentProject: Project | null = new Project();
  lastProject: Project | null = null;


// TODO: Displaying images in list before loading - probably required Base64?
  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef, private matSnackBar: MatSnackBar){
    this.route.data.subscribe(data => {
      this.pageTitle = data['title'];
    });

    this.titleService.setTitle(this.pageTitle);
    this.verwaltungService.updateData(this.pageTitle);

  }
 /*
  ngOnDestroy(): void {
    this.sharedServices.currentQrCodeValue.unsubscribe();
  }
    */


  //TODO: It could be good that the employer has a contact telephone numer to the client
  ngOnInit(): void {
   
    this.sharedServices.currentQrCodeValue.subscribe((projectQR: Project) => {
      this.projectFromQR = projectQR;
      this.projectNo = projectQR.ProjectNo;
      this.currentProject = projectQR;
      this.cdr.detectChanges();
    }); 

    this.projectService.getLastLocation().subscribe({
          next: (project: Project) => {
            console.log("ööö "+project.ProjectNo  );
            this.lastProject = project;
            this.cdr.detectChanges();
          }
    })   
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
      }
      reader.readAsDataURL(file);
    }
  }
  

  public getProjectByProjectNo(/*project: Project*/){
   // this.imagesToUpload.forEach(b => console.log(b.type));
    // Create APIImage
    // Sollution with selection
    /*
    let pj = this.getSelectedOption() === null ? this.lastProjects[0] : this.getSelectedOption();
    console.log("Project: "+ pj);
    */

    this.projectService.getByProjectNo(this.projectNo).subscribe({
      next: (project: Project) => {
        
        this.uploadButton.nativeElement.IsDisabled = true;
        
        console.log("Test333");
  
       if(project?.ProjectNo !== null){
        this.currentProject = project;
        this.uploadImages();
       }else{
          this.matSnackBar.open("Baustellenummer nicht gefunden", '', {
            duration: 6000,
            panelClass: ['snackbar-notification-error']
          });
        }
      },
      error: (e : any) => {

        //TODO: Why is it so slow?
        console.error('Error fetching project', e);
        this.matSnackBar.open("Baustelle nicht gefunden", '', {
          duration: 6000,
          panelClass: ['snackbar-notification-error']
        });
      }
    }) 

  }

  public uploadImages(){

    this.getProjectByProjectNo();

    if(this.currentProject !== null){
      //console.log("Project found: " + this.currentProject.ProjectNo, "decodedTextReceived: " + this.projectFromQR.ProjectNo);

      this.files.forEach( (file: File) =>
      { 
        let apiImage : ApiImage = ApiImage.createApiImage(file.text.toString(), 'jpeg');
        
        console.log("APIImage " + apiImage.Format);
        console.log("ApIImage File Name " + apiImage.Name);
        
        const blob = new Blob([file], { type: file.type });
        console.log("Blob " + blob.size);

        apiImage.Blob = blob;

        this.imagesToUpload.push(apiImage);
        
      })

      if(this.imagesToUpload.length > 0){
      
        let formData = this.imageUploadService.formatRequest(this.imagesToUpload, this.currentProject);
        console.log("Image upload");
        console.log(this.currentProject);
      
        this.imageUploadService.uploadImages(formData, {
          reportProgress: true,
          observe: 'events'
        }).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.isProgressbarActivated = true;
              this.uploadProgress = 0;
              const percentDone = Math.round(100 * event.loaded / event.total);
              console.log(`Upload progress: ${percentDone}%`);
              this.uploadProgress = percentDone;
            } else if (event.status === 201 || (event.type === HttpEventType.Response)) {
            
                this.uploadProgress = 100;
                this.isProgressbarActivated = false;
                this.imagesToUpload.splice(0, this.imagesToUpload.length);
                this.imagesAsDataUrl.splice(0, this.imagesAsDataUrl.length);
                this.files.splice(0, this.files.length);
                this.projectFromQR = new Project();
                this.cdr.detectChanges();
                this.matSnackBar.open("Dateien erfolgreich gesendet.", '', {
                  duration:6000,
                  panelClass:['snackbar-notification-success']
                })  
            }
          },
          error: (error) => {
            this.matSnackBar.open("Dateien nicht kopiert.", '', {
              duration:6000,
              panelClass:['snackbar-notification-err']
            })
            
          },
          complete: () => {
            this.matSnackBar.open("Dateien erfolgreich kopiert.", '', {
              duration:3000,
              panelClass:['snackbar-notification-success']
            })            
          }
        });
      }else{
        this.matSnackBar.open("Keine Dateien ausgewählt", '', {
          duration: 6000,
          panelClass: ['snackbar-notification-error']
        });
      }
  }
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