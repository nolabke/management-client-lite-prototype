import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { NavDashboardComponent } from './features/dashboard/nav-dashboard/nav-dashboard.component';
import { UsersManagementComponent } from './features/users/pages/users-management/users-management.component';
import { LocationsComponent } from './features/locations/pages/locations/locations.component';
import { BilderVerwaltungComponent } from './features/images/pages/bilder-verwaltung/bilder-verwaltung/bilder-verwaltung.component';
import { AppLogsComponent } from './features/logs/pages/app-logs/app-logs.component';
import { ImageUploadComponent } from './features/images/components/image-upload/image-upload.component';
import { EditProjectComponent } from './features/locations/pages/locations/dialogs/edit-project/edit-project.component';
import { QrscannerHtml5Component } from './features/qrscanner/components/qrscanner-html5/qrscanner-html5.component';
import { AddProjectComponent } from './features/locations/pages/locations/dialogs/add-project/add-project.component';
import { EditUserComponent } from './features/users/dialogs/edit-user/edit-user.component';
import { ServerConnectionComponent } from './features/server-connection/server-connection.component';
export const routes: Routes = [
   
    {
        path:'', 
        redirectTo:'server-connection',
        pathMatch:'full'
    },
    {
                path:'login',
                component:LoginComponent,
                data:{
                    title: 'Login'
                }
    },   
    {           
        path:'',
        component:NavDashboardComponent,
        children: [
          
            {
                path:'image-upload',
                component:ImageUploadComponent,
                //canActivate: [authGuard],
                data:{
                    title: 'Bilder hochladen'
                }
            },
            {
                path:'server-connection',
                component: ServerConnectionComponent,
                data:{
                    title: 'Serververbindung'
                }
            },
            {
                path:'benutzerverwaltung',
                component:UsersManagementComponent,
                //canActivate: [authGuard],
                data:{
                    title: 'Benutzerverwaltung'
                }
            },
            {
                path:'baustellenverwaltung',
                component:LocationsComponent,
                //canActivate: [authGuard],
                data:{
                    title: 'Baustellenverwaltung'
                }
            },
            {
                path:'bilderverwaltung',
                component:BilderVerwaltungComponent,
                //canActivate: [authGuard],
                data:{
                    title: 'Bilderverwaltung'
                }
                
            },
            {
                path:'ereignisse',
                component:AppLogsComponent,
                //canActivate: [authGuard],
                data:{
                    title: 'Ereignisse'
                }
            },
            {
                path: 'edit-project',
                component : EditProjectComponent,
                //canActivate: [authGuard],
                data:{
                    title: 'Baustellebearbeitung'
                }
            },
            {
                path: 'qrscanner',
                component : QrscannerHtml5Component,
                //canActivate: [authGuard],
                data:{
                    title: 'QR Code Scanner'
                }
            },
            {
                path: 'add-project',
                component : AddProjectComponent,
                //canActivate: [authGuard],
                data:{
                    title: 'Neue Baustelle'
                }
            },
            {
                path: 'edit-user',
                component : EditUserComponent,
                //canActivate: [authGuard],
                data:{
                    title: 'Benutzerbearbeitung'
                }
            },
        ]
    }/*,
    { 
        path: '**',
        component: PageNotFoundComponent
    }*/
];
