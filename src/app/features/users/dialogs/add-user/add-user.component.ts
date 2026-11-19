import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpResponse, HttpStatusCode } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';
import { User } from 'src/app/shared/models/user';
import { UserService } from 'src/app/services/user/user-service.service';
import { VerwaltungService } from 'src/app/services/verwaltung/verwaltung.service';

@Component({
  selector: 'app-add-user',
  imports: [MaterialModule, FormsModule, CommonModule, MatFormFieldModule, MatCheckboxModule, MatSnackBarModule, RouterModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent {

  userService: UserService = inject(UserService);
  user: User = new User();

  titleService: Title = inject(Title);
  pageTitle: string = '';
  verwaltungService: VerwaltungService = inject(VerwaltungService);
  router = inject(Router);

  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef, private dialog: MatDialog, private snackbar: MatSnackBar) {
    this.route.data.subscribe(data => {
      this.pageTitle = data['title'];
    });

    this.titleService.setTitle(this.pageTitle);
    this.verwaltungService.updateData(this.pageTitle);
  }

  get isUserInvalid(): boolean {

    return !this.user.UserName ||
           !this.user.FirstName ||
           !this.user.LastName;

  }

  addUser() {

    this.userService.addUser(this.user).subscribe(
      {
        next: (response: HttpResponse<any>) => {

          console.log(response.status);
          console.log(response);
          if (response.status === HttpStatusCode.Created) {

            this.snackbar.open('Benutzer erstellt', '', {
              duration: 3000,
              panelClass: ['snackbar-notification-success']
            })
            this.router.navigate(['/benutzerverwaltung']);
          }
        },

        error: (error) => {

          if (error.status === 409) {
            this.snackbar.open('Benutzername existiert bereits', '', {
              duration: 3000,
              panelClass: ['snackbar-notification-error']
            })
          }

        }
      }
    );

  }

}
