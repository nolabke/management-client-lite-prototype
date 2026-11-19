import { CommonModule, Location } from '@angular/common';
import { HttpResponse, HttpStatusCode } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ConfirmDeleteProjectDialogComponent } from '../confirm-delete-project-dialog/confirm-delete-project-dialog.component';
import { MatSnackBar, MatSnackBarModule,  } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Route, Router, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';
import { ProjectService } from 'src/app/services/project/project.service';
import { VerwaltungService } from 'src/app/services/verwaltung/verwaltung.service';
import { Project } from 'src/app/shared/models/project';

@Component({
  selector: 'app-add-project',
  imports: [MaterialModule, FormsModule, CommonModule, MatFormFieldModule, MatInputModule, MatFormField, MatSnackBarModule,
          RouterModule],
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.scss'
})
export class AddProjectComponent implements OnInit{

  projectService : ProjectService = inject(ProjectService);
  project : Project = new Project();

  titleService: Title = inject(Title);
  pageTitle : string = '';
  verwaltungService: VerwaltungService = inject(VerwaltungService);
  router = inject(Router);

  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef, private location: Location, private dialog: MatDialog, private snackbar: MatSnackBar){
    this.route.data.subscribe(data => {
      this.pageTitle = data['title'];
    });

    this.titleService.setTitle(this.pageTitle);
    this.verwaltungService.updateData(this.pageTitle)
  }


  ngOnInit(): void {

  }

  // Mirrors AddUserComponent/EditUserComponent's validation pattern so the
  // Save button is consistently disabled until the required fields are filled.
  get isProjectInvalid(): boolean {

    return !this.project.ProjectNo ||
           !this.project.Name ||
           !this.project.Street ||
           !this.project.Zip ||
           !this.project.City;

  }


  addProject(){


    this.projectService.addProject(this.project).subscribe(
          {
            next: (response: HttpResponse<any>) => {

              console.log(response.status);
              console.log(response);
              if(response.status === HttpStatusCode.Created){

                this.snackbar.open('Projekt erstellt', '', {
                  duration:3000,
                  panelClass:['snackbar-notification-success']
                })
                this.router.navigate(['/baustellenverwaltung']);
              }
            },

            error: (error) => {

              if(error.status === 409){
                this.snackbar.open('Projektnummer schon existiert', '', {
                duration:3000,
                panelClass:['snackbar-notification-error']
              })

              }

            }
        }
  );

  }

}
