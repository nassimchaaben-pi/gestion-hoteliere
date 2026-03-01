import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Patient {
  id?: string;
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  phone?: string;
}

@Injectable({ providedIn: 'root' })
export class PatientService {
  private base = '/api/patients';

  constructor(private http: HttpClient) {}

  create(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(this.base, patient);
  }

  list(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.base);
  }
}
