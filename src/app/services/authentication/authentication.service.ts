import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  private currentUser = {
    UserName: 'stub',
    IsAdmin: 1
  };

  login(username: string, password: string): Observable<any> {
    this.currentUser = {
      UserName: username,
      IsAdmin: 1
    };

    return of({ token: 'mock-token' });
  }

  getCurrentUser(): Observable<any> {
    return of(this.currentUser);
  }
}
