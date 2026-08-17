import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, OnChanges, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material/material.module';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { StorageKeys, StorageManagementService } from '../../../services/storage-management/storage-management.service';
import { ServerConnectionService } from '../../../services/server-connection/server-connection.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { VerwaltungService } from '../../../services/verwaltung/verwaltung.service';

@Component({
    selector: 'app-nav-dashboard',
    standalone: true,
    imports: [CommonModule, MaterialModule, MatSidenavModule, MatToolbarModule, MatIconModule, RouterOutlet, RouterLink, MatListModule],
    templateUrl: './nav-dashboard.component.html',
    styleUrl: './nav-dashboard.component.scss'
})
export class NavDashboardComponent implements OnInit{
  
    opened = false;
    isUserAdmin: boolean | undefined;
    isServerAlive : boolean | undefined;
    isUserLoggedIn : boolean | undefined;
    pageName : string = ""

    router: Router = inject(Router);
    storageManagementService : StorageManagementService = inject(StorageManagementService);
    serverConnectionService: ServerConnectionService = inject(ServerConnectionService);
    authService : AuthenticationService = inject(AuthenticationService);
    verwaltungService: VerwaltungService = inject(VerwaltungService);


    localStorageObserver = {
      
        next: (items: { [key: string]: string | null }) => {
          
          this.isUserAdmin = items[StorageKeys.isAdmin] !== '1' ? items[StorageKeys.isAdmin] === null ? undefined : false : true;
          this.isServerAlive = items[StorageKeys.isServerAlive] !== '1' ? items[StorageKeys.isServerAlive] === null ? undefined : false : true;
          this.isUserLoggedIn = items[StorageKeys.isUserLoggedIn] !== '1' ? items[StorageKeys.isUserLoggedIn] === null ? undefined : false : true;
         /* 
          if(this.isServerAlive !== this.isUserLoggedIn){
            this.serverConnectionService.connectToDachServer(this.storageManagementService.getFromStorage('serverAddress')).subscribe({
              next: (response: boolean) => {
                this.isServerAlive = response;
                this.storageManagementService.saveInStorage('isServerAlive', response ? '1' : '0');
              }
            })
          }*/
        },
        error: (err: any) => {
          console.error('Error receiving local storage items:', err);
        }
    }
    
    ngOnInit(): void {

      this.storageManagementService.storageItems$
        .subscribe(this.localStorageObserver);

      this.verwaltungService.data$.subscribe(data => {
        this.pageName = data;
      });

      console.log("BLA BLA BLA");
    }
   
    logout() {

      if(this.storageManagementService.logoutCleanStorage())
        this.router.navigate(['/login']);
    }

    isLoginOrServerconfigurationPage(): boolean {
        return this.router.url === '/login' || this.router.url === '/server-connection';
    }    
}
