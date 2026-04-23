import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { AppointmentService, Appointment } from './appointment.service';
import { switchMap } from 'rxjs/operators';
import { PatientService } from '../patients/patient.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-appointment-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule],
  templateUrl: './appointment-detail.component.html',
  styleUrls: ['./appointment-detail.component.scss']
})
export class AppointmentDetailComponent implements OnInit {
  appointment: Appointment | null = null;
  loading = false;
  error: string | null = null;
  patientName: string | null = null;

  constructor(private route: ActivatedRoute, private service: AppointmentService, private router: Router, private patientService: PatientService) {}

  ngOnInit(): void {
    this.loading = true;
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          if (!id) throw new Error('No id');
          return this.service.get(id);
        })
      )
      .subscribe({
        next: (a) => {
          this.appointment = a;
          this.patientName = null;
          if (a && a.patient) {
            this.patientService.get(a.patient).subscribe((p) => {
              this.patientName = p ? `${p.firstName} ${p.lastName}` : a.patient;
            });
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load appointment', err);
          this.error = 'Impossible de charger le rendez-vous.';
          this.loading = false;
        }
      });
  }

  delete(): void {
    if (!this.appointment?.id) return;
    if (!window.confirm('Voulez-vous supprimer ce rendez-vous ?')) return;
    this.service.delete(this.appointment.id).subscribe({
      next: () => this.router.navigate(['/appointments']),
      error: (err) => {
        console.error('Failed to delete appointment', err);
        this.error = 'Impossible de supprimer le rendez-vous.';
      }
    });
  }
}
