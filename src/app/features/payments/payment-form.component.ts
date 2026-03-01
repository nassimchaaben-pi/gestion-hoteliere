import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PaymentService } from './payment.service';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss']
})
export class PaymentFormComponent {
  form: FormGroup;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      patient: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      method: ['cash', Validators.required],
      date: ['', Validators.required],
      notes: ['']
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snackBar.open('Vérifiez les montants et dates avant de valider.', 'Fermer', {
        duration: 3500
      });
      return;
    }

    this.submitting = true;

    this.paymentService.create(this.form.value).subscribe({
      next: (res) => {
        console.log('Payment created', res);
        this.snackBar.open('Paiement enregistré 💶', 'Fermer', { duration: 4000 });
        this.form.reset({ method: 'cash' });
        this.submitting = false;
      },
      error: (err) => {
        console.error('Failed to create payment', err);
        this.snackBar.open('Impossible d’enregistrer le paiement.', 'Fermer', { duration: 4000 });
        this.submitting = false;
      }
    });
  }
}
