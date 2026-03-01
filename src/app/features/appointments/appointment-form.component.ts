import { Component } from '@angular/core';
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

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      patient: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      reason: ['']
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

    this.appointmentService.create(this.form.value).subscribe({
      next: (res) => {
        console.log('Appointment created', res);
        this.snackBar.open('Rendez-vous planifié ✔️', 'Fermer', { duration: 4000 });
        this.form.reset();
        this.submitting = false;
      },
      error: (err) => {
        console.error('Failed to create appointment', err);
        this.snackBar.open('Erreur lors de la planification. Réessayez.', 'Fermer', {
          duration: 4000
        });
        this.submitting = false;
      }
    });
  }
}
