import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';

/**
 * Simple service to broadcast navigation/refresh events across components.
 * Emit the route path (e.g. '/patients') or an empty string to broadcast to all.
 */
@Injectable({ providedIn: 'root' })
export class RefreshService {
  // Use a ReplaySubject so components that subscribe after an emission
  // still receive the last refresh value (avoids race between header click
  // and list component initialization).
  private refreshSubject = new ReplaySubject<string>(1);

  get refresh$(): Observable<string> {
    return this.refreshSubject.asObservable();
  }

  refresh(path: string = ''): void {
    this.refreshSubject.next(path);
  }
}
