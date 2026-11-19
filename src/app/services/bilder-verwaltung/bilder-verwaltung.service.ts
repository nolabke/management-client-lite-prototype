import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiImage } from '../../shared/models/api-image';
import { Project } from '../../shared/models/project';
import { HttpClient } from '@angular/common/http';
import { IMAGES_MOCK } from '../../mocks/images.mock';
import { StorageManagementService } from '../storage-management/storage-management.service';

@Injectable({ providedIn: 'root' })
export class BilderVerwaltungService {

    http: HttpClient = inject(HttpClient);
    storageManagementService : StorageManagementService = inject(StorageManagementService);
    private readonly useMock = false;

    constructor() { }


    public getUnsyncedImages(): Observable<ApiImage[]> {

        if (this.useMock) {
            return of(IMAGES_MOCK);
        }

        // Was missing the serverAddress prefix - a relative '/api/images/unsynced'
        // would have hit the Angular app's own origin instead of the backend
        // once useMock flipped to false, same pattern as syncImages() below.
        let serverAddress = this.storageManagementService.getFromStorage('serverAddress');

        return this.http.get<ApiImage[]>(serverAddress + '/api/images/unsynced');
    }

     public syncImages(imagesToSyncById : number[]): Observable<number[]> {
     
        let serverAddress = this.storageManagementService.getFromStorage('serverAddress');
        
        return this.http.post<number[]>(
            serverAddress + '/api/Image/SyncAllImages', imagesToSyncById, {responseType: 'json'});

  }

}
