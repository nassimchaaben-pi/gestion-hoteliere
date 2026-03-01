import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Payment {
  id?: string;
  patient: string;
  amount: number;
  method: string;
  date: string;
  notes?: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private base = '/api/payments';

  constructor(private http: HttpClient) {}

  create(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(this.base, payment);
  }

  list(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.base);
  }
}
