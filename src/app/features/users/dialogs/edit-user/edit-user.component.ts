import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { HttpResponse, HttpStatusCode } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';
import { User } from 'src/app/shared/models/user';
import { UserService } from 'src/app/services/user/user-service.service';
import { VerwaltungService } from 'src/app/services/verwaltung/verwaltung.service';

@Component({
  selector: 'app-edit-user',
  imports: [MaterialModule, FormsModule, MatFormFieldModule, MatCheckboxModule, MatIconModule, MatSnackBarModule, RouterModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent {

  user: User = new User();
  router = inject(Router);
  titleService: Title = inject(Title);
  pageTitle : string = '';
  userService: UserService = inject(UserService);
  verwaltungService: VerwaltungService = inject(VerwaltungService);

constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef, private dialog: MatDialog, public snackbar: MatSnackBar){
    this.route.data.subscribe(data => {
      this.pageTitle = data['title'];
    });

    this.titleService.setTitle(this.pageTitle);
    this.verwaltungService.updateData(this.pageTitle);

  }


  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {

      if(params['user']) {

        this.user = JSON.parse(params['user']);

        console.log('Loaded user:', this.user);

      }

    });

  }

 get isUserInvalid(): boolean {

    return !this.user.UserName ||
           !this.user.FirstName ||
           !this.user.LastName;

  }


  updateUser() {

    this.userService.updateUser(this.user).subscribe({
      next: (response: HttpResponse<any>) => {

        if (response.status === HttpStatusCode.Ok) {

          this.snackbar.open('Benutzer aktualisiert', '', {
            duration: 3000,
            panelClass: ['snackbar-notification-success']
          });
          this.router.navigate(['/benutzerverwaltung']);
        }
      },

      error: (error) => {

        this.snackbar.open('Benutzer konnte nicht gespeichert werden', '', {
          duration: 3000,
          panelClass: ['snackbar-notification-error']
        });

      }
    });

  }


  deleteUser() {

    this.userService.deleteUser(this.user.Id).subscribe({
      next: () => {

        this.snackbar.open('Benutzer gelöscht', '', {
          duration: 3000,
          panelClass: ['snackbar-notification-success']
        });
        this.router.navigate(['/benutzerverwaltung']);
      },

      error: () => {

        this.snackbar.open('Benutzer konnte nicht gelöscht werden', '', {
          duration: 3000,
          panelClass: ['snackbar-notification-error']
        });

      }
    });

  }

}
