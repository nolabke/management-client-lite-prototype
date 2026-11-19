import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { LOGS_MOCK } from 'src/app/mocks/logs.mock';
import { USERS_MOCK } from 'src/app/mocks/users.mock';
import { StorageManagementService } from '../storage-management/storage-management.service';
import { LogEntry } from 'src/app/shared/models/log-entry';
import { User } from 'src/app/shared/models/user';


@Injectable({ providedIn: 'root' })
export class VerwaltungService {
    private title = '';
    http: HttpClient = inject(HttpClient);
    storageManagementService : StorageManagementService = inject(StorageManagementService);
    private readonly useMock = false;

    private dataSubject  = new BehaviorSubject<string>('');
    data$ = this.dataSubject.asObservable();

    constructor() { }

    public getUsers(): Observable<User[]> {
    let serverAddress =  this.storageManagementService.getFromStorage('serverAddress');

         if (this.useMock) {
            return of(USERS_MOCK);
        }
  
        return this.http.get<User[]>(
            serverAddress + '/api/User/GetUsers',
            {responseType: 'json'});

    }

    getTitle(): string {
        return this.title;
    }

    updateData(data: string){
    this.dataSubject.next(data);
  }

    getLogEntries(): Observable<LogEntry[]> {

        let serverAddress =  this.storageManagementService.getFromStorage('serverAddress');

        if (this.useMock) {
            return of(LOGS_MOCK);
        }

        return this.http.get<LogEntry[]>(
            serverAddress + '/api/Service/Logs',
            {responseType: 'json'});
    }
}
