import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServerConnectionService } from '../../services/server-connection/server-connection.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StorageManagementService } from '../../services/storage-management/storage-management.service';
import { SafeHtmlPipe } from '../../safe-html.pipe';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { VerwaltungService } from '../../services/verwaltung/verwaltung.service';

@Component({
    selector: 'app-server-connection',
    imports: [FormsModule, CommonModule],
    templateUrl: './server-connection.component.html',
    styleUrl: './server-connection.component.scss',
    providers: [ServerConnectionService, SafeHtmlPipe]
})

export class ServerConnectionComponent{

    serverConnectionService : ServerConnectionService = inject(ServerConnectionService);
    storageManagementService: StorageManagementService = inject(StorageManagementService);
    serverAddress : string = '??'
    router: Router = inject(Router);
    errorMessage : any = '';

    pageTitle: string = '';
    titleService : Title = inject(Title);
    verwaltungService: VerwaltungService = inject(VerwaltungService);


    constructor(public safeHtmlPipe : SafeHtmlPipe, private snackbar : MatSnackBar, private route : ActivatedRoute){
      this.route.data.subscribe(data => {
        this.pageTitle = data['title'];
      });
  
      this.titleService.setTitle(this.pageTitle);
      this.verwaltungService.updateData(this.pageTitle);
  
    }

      
    ngOnInit(): void {

      this.serverAddress = this.storageManagementService.getFromStorage('serverAddress');
      var isloggedIn = this.storageManagementService.getFromStorage('isUserLoggedIn');
      
      if(this.serverAddress !== null && isloggedIn !== '1'){
        console.log("HERE");
        this.connectToDachServer();
      }
    }

    public connectToDachServer(){

      this.serverConnectionService.connectToDachServer(this.serverAddress).subscribe({
       next: (response : boolean) => {
          
          if(response){
            this.snackbar.open('Die Verbindung zum Server ist korrekt'), '', {
              duration:4000,
              panelClass:['snackbar-notification-success'] 
            };
            this.storageManagementService.saveInStorage('serverAddress', this.serverAddress);
            this.storageManagementService.saveInStorage('isServerAlive', '1');
            this.router.navigate(['/login'])

          }          
        },
      error: (error : unknown) => {

        this.storageManagementService.saveInStorage('isServerAlive', '0');
      
            
        this.snackbar.open('Server ist momentan nicht erreichbar', '', {
          duration:3000,
          panelClass:['snackbar-notification-error']
        })
      }
    });
  }

}
