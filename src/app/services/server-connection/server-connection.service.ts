import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ServerConnectionService {

  private http: HttpClient = inject(HttpClient);

  constructor() { }

  // Pings the backend's /health route (see server.js in the API repo) to
  // confirm the entered address actually points at a live server before
  // saving it - was a stub that always returned true, which meant a typo'd
  // or unreachable address would silently pass the "Überprüfen" check.
  connectToDachServer(serverAddress: string): Observable<boolean> {

    // A value with no http(s):// scheme (e.g. someone typing "zruezurzuw"
    // instead of a real URL) is a *relative* path as far as HttpClient is
    // concerned, so it would resolve against the Angular app's own origin
    // instead of failing outright - and since this app's own dev/static
    // server answers unknown paths with index.html (200 OK) as an SPA
    // fallback, that "connection check" would silently succeed against
    // itself. Reject anything that isn't an absolute http(s) URL up front.
    if (!serverAddress || !/^https?:\/\//i.test(serverAddress)) {
      return of(false);
    }

    const baseUrl = serverAddress.replace(/\/+$/, '');

    return this.http.get<{ status?: string }>(`${baseUrl}/health`).pipe(
      // Free hosting plans (e.g. Render's free web service) spin the server
      // down after ~15 minutes idle, and the request that wakes it back up
      // can take 30-50s and fail (network error / 502) while it's booting -
      // that failure has nothing to do with the address being wrong. Retry
      // a few times with a delay instead of giving up on the first attempt,
      // so a genuinely correct address survives a cold start. This only
      // wraps the HTTP call itself, so it does NOT retry the invalid-URL
      // guard above, nor a real "wrong server" response (handled below by
      // map(), which resolves - it doesn't error, so retry() never sees it).
      retry({ count: 6, delay: 5000 }),
      // A 200 response alone isn't proof this is *our* backend - any server
      // (or an SPA fallback page) can return 200. Require the exact body
      // shape our own /health route sends (see server.js: { status: 'ok', ... }).
      map((response) => response?.status === 'ok'),
      catchError(() => of(false))
    );
  }
}
