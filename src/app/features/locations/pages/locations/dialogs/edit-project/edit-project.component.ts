import { ChangeDetectorRef, Component, OnInit, inject, numberAttribute } from '@angular/core';
import { MaterialModule } from '../../../../../../material/material.module';
import { Project } from '../../../../../../shared/models/project';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { Observable } from 'rxjs';
import { ProjectService } from '../../../../../../services/project/project.service';
import { MatFormField, MatFormFieldModule, MatLabel,  } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ApiImage } from '../../../../../../shared/models/api-image';
import { BilderVerwaltungService } from '../../../../../../services/bilder-verwaltung/bilder-verwaltung.service';
import { Title } from '@angular/platform-browser';
import { VerwaltungService } from '../../../../../../services/verwaltung/verwaltung.service';
import { HttpStatusCode } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteProjectDialogComponent } from '../confirm-delete-project-dialog/confirm-delete-project-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';

@Component({
    selector: 'app-edit-project',
    standalone: true,
    imports: [MaterialModule, FormsModule, MatIconModule, MatListModule, CommonModule, MatFormFieldModule, MatInputModule, MatFormField, MatSnackBarModule,
        RouterModule
    ],
    templateUrl: './edit-project.component.html',
    styleUrl: './edit-project.component.scss'
})
export class EditProjectComponent implements OnInit{

  public project: Project = {
    Id: 0,
    Name: '',
    ProjectNo: '',
    Street: '',
    Zip: '',
    City: '',
    Images: [],
    Latitude: 0,
    Longitude: 0,
    IsDisabled: null
  };

  images: ApiImage[] =[];
  
  router = inject(Router);
  projectService : ProjectService = inject(ProjectService);
  bilderVerwaltung : BilderVerwaltungService = inject(BilderVerwaltungService);
  verwaltungService : VerwaltungService = inject(VerwaltungService);

  titleService: Title = inject(Title);
  pageTitle : string = '';
  
  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef, private location: Location, private dialog: MatDialog, public snackbar: MatSnackBar){
    this.route.data.subscribe(data => {
      this.pageTitle = data['title'];
    });

    this.titleService.setTitle(this.pageTitle);
    this.verwaltungService.updateData(this.pageTitle);

  }
 
  ngOnInit(): void {
    
    this.route.queryParams.subscribe(params => {

      if (params['project']) {
        const projectString = params['project'];
        this.project = JSON.parse(projectString);
        console.log(this.project.Id);
      }   
  })

  /*

    this.bilderVerwaltung.getUnsyncedImages().subscribe(
      (response) =>{
        this.pics = response;
         

       // this.dataSource.data = response;
      })
      this.pics = this.pics.filter((i : ApiImage) => {
          
          i.LocationId.toString() === this.projectNo; console.log(i.LocationId +" - "+ this.projectNo)
        
        });  
    this.pics.forEach((i : ApiImage) => console.log("Edit Component: " +i.Id))
    */
  }

  getProject() : Observable<Project>{
   
    return this.projectService.getByProjectIdWithImages(this.project.Id);
  }
  
  updateProject(){
    
    this.projectService.updateProject(this.project).subscribe({
      next : (response) => {
        
        if(response.status === HttpStatusCode.NoContent){
       
          this.router.navigate(['/baustellenverwaltung']);
        }
      },
      error : (error) => {
        this.snackbar.open('Projektnummer schon existiert', '', {
          duration:3000,
        panelClass:['snackbar-notification-error']
        }
      )}
    });  
  }

  public removeImageFileFromList(imageId : number){

    this.images.splice(imageId, 1);
    this.cdr.detectChanges();

  }

  public deleteProject(){

    console.log("Project id: " + this.project.Id);

    const dialogRef = this.dialog.open(ConfirmDeleteProjectDialogComponent, {
      width: '250px',
      data: { message: 'Bist du sicher, dass du das Projekt {{this.project.ProjectNo}} entfernen möchtest?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      
      if (result) {
        this.projectService.deleteProject(this.project.Id).subscribe({

          next : (response) => {
           
            if (response === null) {

              this.snackbar.open('Das Projekt wurde erfolgreich gelöscht', '', {  
                duration:6000,
              });
              
              this.router.navigate(['/baustellenverwaltung']);
            }
          },
          error: (error) => {
            console.log("Error");
            console.log(error);
            this.snackbar.open('Das Projekt kann nicht gefünden werden', '', {
              duration:6000,
            })
          }
        })
      }
    });
  }
}
