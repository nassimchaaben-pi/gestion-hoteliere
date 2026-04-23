import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PatientService } from './patient.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss']
})
export class PatientFormComponent {
  form: FormGroup;
  submitting = false;
  loading = false;
  isEdit = false;
  patientId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private snackBar: MatSnackBar
    ,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['']
    });
    // detect edit mode from route params
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.patientId = id;
      this.loadPatient(id);
    }
  }

  private loadPatient(id: string): void {
    this.loading = true;
    this.patientService.get(id).subscribe({
      next: (p) => {
        if (p) {
          this.form.patchValue(p);
        } else {
          this.snackBar.open('Patient introuvable.', 'Fermer', { duration: 3000 });
          this.router.navigate(['/patients']);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load patient for edit', err);
        this.snackBar.open('Impossible de charger le patient pour modification.', 'Fermer', {
          duration: 3500
        });
        this.loading = false;
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snackBar.open('Veuillez corriger les champs en surbrillance.', 'Fermer', {
        duration: 3500
      });
      return;
    }

    this.submitting = true;
    if (this.isEdit && this.patientId) {
      this.patientService.update(this.patientId, this.form.value).subscribe({
        next: (res) => {
          console.log('Patient updated', res);
          this.snackBar.open('Patient mis à jour avec succès ✅', 'Fermer', { duration: 4000 });
          this.submitting = false;
          this.router.navigate(['/patients', this.patientId]);
        },
        error: (err) => {
          console.error('Failed to update patient', err);
          this.snackBar.open('Impossible de mettre à jour le patient. Réessayez.', 'Fermer', { duration: 4000 });
          this.submitting = false;
        }
      });
    } else {
      this.patientService.create(this.form.value).subscribe({
        next: (res) => {
          console.log('Patient created', res);
          this.snackBar.open('Patient créé avec succès ✅', 'Fermer', { duration: 4000 });
          this.form.reset();
          this.submitting = false;
          this.router.navigate(['/patients']);
        },
        error: (err) => {
          console.error('Failed to create patient', err);
          this.snackBar.open('Impossible de créer le patient. Réessayez.', 'Fermer', { duration: 4000 });
          this.submitting = false;
        }
      });
    }
  }
}
