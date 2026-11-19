import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ServerConnectionService } from '../../../../services/server-connection/server-connection.service';
import { StorageManagementService } from '../../../../services/storage-management/storage-management.service';
import { MaterialModule } from '../../../../material/material.module';
import { SafeHtmlPipe } from '../../../../safe-html.pipe';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { VerwaltungService } from '../../../../services/verwaltung/verwaltung.service';
import { Title } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';



@Component({
    selector: 'app-login',
    imports: [FormsModule, MaterialModule, CommonModule, MatFormFieldModule, MatIconModule, MatDividerModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    providers: [AuthenticationService, SafeHtmlPipe]
})

export class LoginComponent implements OnInit {

  public loginDTO: Login;
  errorMessage : any = '';
  isServerConnected: string | undefined;
 

  serverConnectionService : ServerConnectionService = inject(ServerConnectionService);
  storageManagementService: StorageManagementService = inject(StorageManagementService);

  verwaltungService: VerwaltungService = inject(VerwaltungService);

  pageTitle: string = '';
  titleService : Title = inject(Title);
  router: Router = inject(Router);
  

  constructor(private authService: AuthenticationService,
    public safeHtml: SafeHtmlPipe,
    private matScackBar: MatSnackBar,
    private route : ActivatedRoute,
  ) {
    this.loginDTO = new Login();

    this.route.data.subscribe(data => {
      this.pageTitle = data['title'];
    });

    this.titleService.setTitle(this.pageTitle);
    this.verwaltungService.updateData(this.pageTitle);
  }

  ngOnInit(): void {
  
    let token = this.storageManagementService.getFromStorage('token');
    const serverAddress = this.storageManagementService.getFromStorage('serverAddress');
    let isUserAdmin = this.storageManagementService.getFromStorage('isAdmin');
    const isServerAlive = this.storageManagementService.getFromStorage('isServerAlive');

    if(!!isServerAlive){
      
      if(token !== null) {
        
          this.authService.getCurrentUser().subscribe({

            next: (user) => {
              if(user !== null){
                this.matScackBar.open('Benutzer angemeldet', '', {
                  duration:3000,
                  panelClass:['snackbar-notification-success']
                })
                
                user.IsAdmin  ? this.router.navigate(['/benutzerverwaltung']) : this.router.navigate(['/image-upload']);

                this.matScackBar.open('Benutzer angemeldet', '', {
                  duration:3000,
                  panelClass: ['snackbar-notification-success']
                })
              }
            },
            error : (error) => {
              if(error.status === 0){
                this.storageManagementService.saveInStorage('isServerAlive', '0');
                let errorMessage = 'Server antwortet nicht. <br> <a style="color: black;" href="/server-connection">Zur Serverkonfigurationänderungen</a>';
                this.errorMessage = this.safeHtml.transform(errorMessage);
                this.router.navigate(['/server-connection']);
              }
                    
              if(error.status === 401 ){
                this.errorMessage = 'Melde sich an'
              }

              if(error.status === 400 ){
                this.errorMessage = 'Ungültige Anmeldedaten'
              }

              this.matScackBar.open(this.errorMessage, '', {
                duration:3000,
                panelClass:['snackbar-notification-error']
              })
            }
          })    
      }
    }else{
    
      this.router.navigate(['/server-connection']);
    }
  } 

  public login() {  

    let sanitizedUsername = this.sanitizeHtml(this.loginDTO.username);
    let sanitizedPassword = this.sanitizeHtml(this.loginDTO.password);

    this.authService.login(sanitizedUsername, sanitizedPassword)
    .subscribe( {
      next: (response: any) => {

        if(response !== null || response !== "") {
          this.authService.getCurrentUser().subscribe({

            next: (user) => {
              if(user.UserName !== null || user.UserName !== ''){
                this.matScackBar.open('Benutzer angemeldet', '', {
                  duration:3000,
                  panelClass:['snackbar-notification-success']
                })
                
                this.storageManagementService.saveInStorage("isUserLoggedIn", "1");
                this.storageManagementService.saveInStorage("isAdmin", user.IsAdmin.toString());

                user.IsAdmin  ? this.router.navigate(['/benutzerverwaltung']) : this.router.navigate(['/image-upload']);

              }
            },
          })
        }
      },
      error : (error) => {
        if(error.status === 0){
          this.storageManagementService.saveInStorage('isServerAlive', '0');
          let errorMessage = 'Server antwortet nicht. <br> <a style="color: black;" href="/server-connection">Zur Serverkonfigurationänderungen</a>';
          this.errorMessage = this.safeHtml.transform(errorMessage);
        }
              
        if(error.status === 401 ){
          this.errorMessage = 'Nicht authorisiert'
        }

        if(error.status === 400 ){
          this.errorMessage = 'Ungültige Anmeldedaten'
        }

        this.matScackBar.open(this.errorMessage, '', {
          duration:3000,
          panelClass:['snackbar-notification-error']
        })
      }
    }) 
  }


  sanitizeHtml(input: string) {
    const sanitizedInput = input.replace(/<\/?[^>]+(>|$)/g, "");
    console.log(input + " " + sanitizedInput);
    return sanitizedInput;
  }

}

export class Login {
  
  public username: string;
  public password: string;
  
  constructor() {
      this.username = '';
      this.password = '';
    }
 
}

