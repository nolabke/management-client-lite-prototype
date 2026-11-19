import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../../shared/models/user';
import { USERS_MOCK } from '../../mocks/users.mock';
import { StorageManagementService } from '../storage-management/storage-management.service';

@Injectable({ providedIn: 'root' })
export class UserService {

  // Was permanently mock - addUser()/updateUser()/deleteUser() only ever
  // mutated the in-memory USERS_MOCK array and never touched the network,
  // so a new user typed into the "Neuer Benutzer" dialog looked like it
  // saved (the mock response even claimed 201 Created) but never reached
  // MongoDB. Wired up the same way as ProjectService.
  private readonly useMock = false;

  private http = inject(HttpClient);
  private storageManagementService = inject(StorageManagementService);

  constructor() { }

  getUsers(): Observable<User[]> {

    if (this.useMock) {
      return of(USERS_MOCK);
    }

    const serverAddress =
      this.storageManagementService.getFromStorage('serverAddress');

    return this.http.get<User[]>(serverAddress + '/api/User/GetUsers');
  }

  addUser(user: User): Observable<any> {

    if (this.useMock) {
      USERS_MOCK.push(user);

      return of({
        status: 201,
        message: 'User added (mock)'
      });
    }

    const serverAddress =
      this.storageManagementService.getFromStorage('serverAddress');

    // The response body itself carries a `status` field matching the real
    // HTTP status code (see src/routes/users.js on the API server), so
    // add-user.component.ts's `response.status === HttpStatusCode.Created`
    // check keeps working without needing `observe: 'response'` here.
    return this.http.post(serverAddress + '/api/User', user);
  }

  updateUser(user: User): Observable<any> {

    if (this.useMock) {
      const index = USERS_MOCK.findIndex(u => u.Id === user.Id);

      if (index >= 0) {
        USERS_MOCK[index] = user;
      }

      return of({
        status: 200,
        message: 'User updated (mock)'
      });
    }

    const serverAddress =
      this.storageManagementService.getFromStorage('serverAddress');

    return this.http.put(serverAddress + '/api/User', user);
  }

  deleteUser(userId: number): Observable<any> {

    if (this.useMock) {
      const index = USERS_MOCK.findIndex(u => u.Id === userId);

      if (index >= 0) {
        USERS_MOCK.splice(index, 1);
      }

      return of({
        status: 200,
        message: 'User deleted (mock)'
      });
    }

    const serverAddress =
      this.storageManagementService.getFromStorage('serverAddress');

    return this.http.delete(`${serverAddress}/api/User/${userId}`);
  }
}
