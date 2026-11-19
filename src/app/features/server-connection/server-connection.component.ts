import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServerConnectionService } from '../../services/server-connection/server-connection.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StorageManagementService } from '../../services/storage-management/storage-management.service';
import { SafeHtmlPipe } from '../../safe-html.pipe';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { VerwaltungService } from '../../services/verwaltung/verwaltung.service';
import { MaterialModule } from '../../material/material.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-server-connection',
    imports: [FormsModule, CommonModule, MaterialModule, MatFormFieldModule, MatIconModule, MatProgressBarModule],
    templateUrl: './server-connection.component.html',
    styleUrl: './server-connection.component.scss',
    providers: [ServerConnectionService, SafeHtmlPipe]
})

export class ServerConnectionComponent implements OnInit, OnDestroy {

    serverConnectionService : ServerConnectionService = inject(ServerConnectionService);
    storageManagementService: StorageManagementService = inject(StorageManagementService);
    serverAddress : string = '??'
    router: Router = inject(Router);
    errorMessage : any = '';

    pageTitle: string = '';
    titleService : Title = inject(Title);
    verwaltungService: VerwaltungService = inject(VerwaltungService);

    // Tracks whichever check (the automatic one below, or a manual click on
    // "Überprüfen") is currently in flight.
    private connectionSubscription?: Subscription;

    // Drives a "Verbindung wird geprüft..." indicator - the check can now
    // take up to ~30s while it retries through a Render free-tier cold
    // start (see server-connection.service.ts), so the button needs to show
    // it's actually working instead of looking like it silently did nothing.
    public isConnecting: boolean = false;

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

    ngOnDestroy(): void {
      this.connectionSubscription?.unsubscribe();
    }

    public connectToDachServer(){

      // Cancel whatever check is already in flight before starting this one.
      // Without this, the automatic check ngOnInit() fires on page load
      // (using the *previously saved* address) could resolve AFTER the user
      // has typed a different address and clicked "Überprüfen" - whichever
      // request happened to finish last would win and decide whether the
      // app navigates to /login, regardless of what was actually being
      // tested. Unsubscribing an HttpClient request aborts it.
      this.connectionSubscription?.unsubscribe();

      this.isConnecting = true;

      this.connectionSubscription = this.serverConnectionService.connectToDachServer(this.serverAddress).subscribe({
       next: (response : boolean) => {

          this.isConnecting = false;

          if(response){
            // Was `this.snackbar.open('...'), '', {...};` - the comma operator
            // meant only the message argument was ever actually passed to
            // open(), so the success snackbar silently lost its duration and
            // styling. Also, this branch was the only one that ran on `next`
            // - a `false` response (bad address, wrong body) fell through
            // with no feedback at all, which is what looked like "always
            // succeeds" from the outside.
            this.snackbar.open('Die Verbindung zum Server ist korrekt', '', {
              duration:4000,
              panelClass:['snackbar-notification-success']
            });
            this.storageManagementService.saveInStorage('serverAddress', this.serverAddress);
            this.storageManagementService.saveInStorage('isServerAlive', '1');
            this.router.navigate(['/login'])

          } else {
            this.storageManagementService.saveInStorage('isServerAlive', '0');
            this.snackbar.open('Server ist momentan nicht erreichbar', '', {
              duration:3000,
              panelClass:['snackbar-notification-error']
            })
          }
        },
      error: (error : unknown) => {

        this.isConnecting = false;
        this.storageManagementService.saveInStorage('isServerAlive', '0');


        this.snackbar.open('Server ist momentan nicht erreichbar', '', {
          duration:3000,
          panelClass:['snackbar-notification-error']
        })
      }
    });
  }

}
