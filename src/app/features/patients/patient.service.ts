import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, map, of } from 'rxjs';
import { PATIENTS_MOCK } from '../../shared/mock/patients.mock';

export interface Patient {
  id?: string;
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  phone?: string;
}

const STORAGE_KEY = 'mock:patients';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private subject = new BehaviorSubject<Patient[]>([]);
  private initialized = false;

  constructor() {
    // Seed from build-time mock data; prefer localStorage if available in browser
    let seeded = PATIENTS_MOCK;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          seeded = JSON.parse(stored);
        } else {
          // persist initial mock into localStorage for browser sessions
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
        }
      }
    } catch {}
    this.subject.next(seeded || []);
    this.initialized = true;
  }

  list(): Observable<Patient[]> {
    return this.subject.asObservable();
  }

  get(id: string): Observable<Patient | null> {
    return this.subject.pipe(map((arr) => arr.find((p) => p.id === id) ?? null));
  }

  create(patient: Patient): Observable<Patient> {
  const item: Patient = { ...patient, id: this.generateId() };
    const arr = [...this.subject.value, item];
    this.subject.next(arr);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
      }
    } catch {}
    return of(item);
  }

  update(id: string, patient: Partial<Patient>): Observable<Patient | undefined> {
    const arr = this.subject.value.map((p) => (p.id === id ? { ...p, ...patient } : p));
    this.subject.next(arr);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
      }
    } catch {}
    return of(arr.find((p) => p.id === id));
  }

  delete(id: string): Observable<void> {
    const arr = this.subject.value.filter((p) => p.id !== id);
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
