import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, map, of } from 'rxjs';
import { APPOINTMENTS_MOCK } from '../../shared/mock/appointments.mock';

export interface Appointment {
  id?: string;
  patient: string;
  date: string; // ISO date
  time: string; // HH:mm
  reason?: string;
}

const STORAGE_KEY = 'mock:appointments';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private subject = new BehaviorSubject<Appointment[]>([]);

  constructor() {
    let seeded = APPOINTMENTS_MOCK;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          seeded = JSON.parse(stored);
        } else {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
        }
      }
    } catch {}
    this.subject.next(seeded || []);
  }

  list(): Observable<Appointment[]> {
    return this.subject.asObservable();
  }

  get(id: string): Observable<Appointment | null> {
    return this.subject.pipe(map((arr) => arr.find((a) => a.id === id) ?? null));
  }

  create(appointment: Appointment): Observable<Appointment> {
    const item = { ...appointment, id: this.generateId() };
    const arr = [...this.subject.value, item];
    this.subject.next(arr);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
      }
    } catch {}
    return of(item);
  }

  update(id: string, appointment: Partial<Appointment>): Observable<Appointment | undefined> {
    const arr = this.subject.value.map((a) => (a.id === id ? { ...a, ...appointment } : a));
    this.subject.next(arr);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
      }
    } catch {}
    return of(arr.find((a) => a.id === id));
  }

  delete(id: string): Observable<void> {
    const arr = this.subject.value.filter((a) => a.id !== id);
    this.subject.next(arr);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
      }
    } catch {}
    return of(void 0);
  }

  private generateId() {
    return Math.random().toString(36).slice(2, 9);
  }
}
