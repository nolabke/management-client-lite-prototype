import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ServerConnectionService {
  constructor() { }

  // stub method
  connectToDachServer(serverAddress: string): Observable<boolean> {
    return of(true);
  }
}
