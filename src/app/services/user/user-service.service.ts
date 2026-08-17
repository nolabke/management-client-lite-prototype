import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../../shared/models/user';
import { USERS_MOCK } from '../../mocks/users.mock';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor() { }

  getUsers(): Observable<User[]> {
    return of(USERS_MOCK);
  }
}
