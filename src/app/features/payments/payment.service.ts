import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, map, of } from 'rxjs';
import { PAYMENTS_MOCK } from '../../shared/mock/payments.mock';

export interface Payment {
  id?: string;
  patient: string;
  amount: number;
  method: string;
  date: string;
  notes?: string;
}

const STORAGE_KEY = 'mock:payments';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private subject = new BehaviorSubject<Payment[]>([]);

  constructor() {
    let seeded = PAYMENTS_MOCK;
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

  list(): Observable<Payment[]> {
    return this.subject.asObservable();
  }

  get(id: string): Observable<Payment | null> {
    return this.subject.pipe(map((arr) => arr.find((p) => p.id === id) ?? null));
  }

  create(payment: Payment): Observable<Payment> {
    const item = { ...payment, id: this.generateId() };
    const arr = [...this.subject.value, item];
    this.subject.next(arr);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
      }
    } catch {}
    return of(item);
  }

  update(id: string, payment: Partial<Payment>): Observable<Payment | undefined> {
    const arr = this.subject.value.map((p) => (p.id === id ? { ...p, ...payment } : p));
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
