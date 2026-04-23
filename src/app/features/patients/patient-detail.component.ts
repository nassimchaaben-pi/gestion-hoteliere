import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PatientService, Patient } from './patient.service';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule],
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.scss']
})
export class PatientDetailComponent implements OnInit {
  patient: Patient | null = null;
  loading = false;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private service: PatientService, private router: Router) {}

  delete(): void {
    if (!this.patient?.id) return;
    const confirmed = window.confirm('Voulez-vous supprimer ce patient ? Cette action est irréversible.');
    if (!confirmed) return;
    this.service.delete(this.patient.id).subscribe({
      next: () => {
        this.router.navigate(['/patients']);
      },
      error: (err) => {
        console.error('Failed to delete patient', err);
        this.error = 'Impossible de supprimer le patient.';
      }
    });
  }

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
        next: (p) => {
          this.patient = p;
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load patient', err);
          this.error = 'Impossible de charger le patient.';
          this.loading = false;
        }
      });
  }
}
