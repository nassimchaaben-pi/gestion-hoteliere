import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Appointment {
  id?: string;
  patient: string;
  date: string; // ISO date
  time: string; // HH:mm
  reason?: string;
}

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private base = '/api/appointments';

  constructor(private http: HttpClient) {}

  create(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(this.base, appointment);
  }

  list(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.base);
  }
}
