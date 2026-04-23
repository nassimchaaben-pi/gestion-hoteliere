import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { PaymentService, Payment } from './payment.service';
import { switchMap } from 'rxjs/operators';
import { PatientService } from '../patients/patient.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-payment-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule],
  templateUrl: './payment-detail.component.html',
  styleUrls: ['./payment-detail.component.scss']
})
export class PaymentDetailComponent implements OnInit {
  payment: Payment | null = null;
  loading = false;
  error: string | null = null;
  patientName: string | null = null;

  constructor(private route: ActivatedRoute, private service: PaymentService, private router: Router, private patientService: PatientService) {}

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
            this.payment = p;
            this.patientName = null;
            if (p && p.patient) {
              this.patientService.get(p.patient).subscribe((pt) => {
                this.patientName = pt ? `${pt.firstName} ${pt.lastName}` : p.patient;
              });
            }
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load payment', err);
          this.error = 'Impossible de charger le paiement.';
          this.loading = false;
        }
      });
  }

  delete(): void {
    if (!this.payment?.id) return;
    if (!window.confirm('Voulez-vous supprimer ce paiement ?')) return;
    this.service.delete(this.payment.id).subscribe({
      next: () => this.router.navigate(['/payments']),
      error: (err) => {
        console.error('Failed to delete payment', err);
        this.error = 'Impossible de supprimer le paiement.';
      }
    });
  }
}
