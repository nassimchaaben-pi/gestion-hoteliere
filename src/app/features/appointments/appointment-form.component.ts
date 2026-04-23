import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppointmentService } from './appointment.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss']
})
export class AppointmentFormComponent {
  form: FormGroup;
  submitting = false;
  loading = false;
  isEdit = false;
  appointmentId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private snackBar: MatSnackBar
    ,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      patient: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      reason: ['']
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.appointmentId = id;
      this.load(id);
    }
  }

  private load(id: string): void {
    this.loading = true;
    this.appointmentService.get(id).subscribe({
      next: (a) => {
        if (a) {
          this.form.patchValue(a);
        } else {
          this.snackBar.open('Rendez-vous introuvable.', 'Fermer', { duration: 3000 });
          this.router.navigate(['/appointments']);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load appointment', err);
        this.snackBar.open('Impossible de charger le rendez-vous.', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snackBar.open('Complétez les champs requis avant de valider.', 'Fermer', {
        duration: 3500
      });
      return;
    }

    this.submitting = true;
    if (this.isEdit && this.appointmentId) {
      this.appointmentService.update(this.appointmentId, this.form.value).subscribe({
        next: (res) => {
          this.snackBar.open('Rendez-vous mis à jour ✔️', 'Fermer', { duration: 3000 });
          this.submitting = false;
          this.router.navigate(['/appointments', this.appointmentId]);
        },
        error: (err) => {
          console.error('Failed to update appointment', err);
          this.snackBar.open('Impossible de mettre à jour. Réessayez.', 'Fermer', { duration: 4000 });
          this.submitting = false;
        }
      });
    } else {
      this.appointmentService.create(this.form.value).subscribe({
        next: (res) => {
          console.log('Appointment created', res);
          this.snackBar.open('Rendez-vous planifié ✔️', 'Fermer', { duration: 4000 });
          this.form.reset();
          this.submitting = false;
          this.router.navigate(['/appointments']);
        },
        error: (err) => {
          console.error('Failed to create appointment', err);
          this.snackBar.open('Erreur lors de la planification. Réessayez.', 'Fermer', { duration: 4000 });
          this.submitting = false;
        }
      });
    }
  }
}
