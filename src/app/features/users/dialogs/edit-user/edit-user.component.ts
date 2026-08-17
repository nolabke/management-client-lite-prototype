import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-edit-user',
  imports: [MaterialModule, FormsModule, RouterModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent {

  user: User = new User();
  router = inject(Router);
  titleService: Title = inject(Title);
  pageTitle : string = '';

constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef, private dialog: MatDialog, public snackbar: MatSnackBar){
    this.route.data.subscribe(data => {
      this.pageTitle = data['title'];
    });

    this.titleService.setTitle(this.pageTitle);

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

    console.log('Save user', this.user);

   this.router.navigate(['/benutzerverwaltung']);

  }


  deleteUser() {

    console.log('Delete user', this.user.Id);
     this.router.navigate(['/benutzerverwaltung']);

  }

}