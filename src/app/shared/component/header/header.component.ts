import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  readonly navLinks = [
    { label: 'Patients', icon: 'groups', path: '/patients' },
    { label: 'Nouveau patient', icon: 'person_add', path: '/patients/new' },
    { label: 'Rendez-vous', icon: 'event', path: '/appointments' },
    { label: 'Nouveau RDV', icon: 'event_available', path: '/appointments/new' },
    { label: 'Paiements', icon: 'payments', path: '/payments' },
    { label: 'Nouveau paiement', icon: 'add_card', path: '/payments/new' }
  ];

  readonly isCompact = signal(false);

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe(['(max-width: 1180px)'])
      .pipe(takeUntilDestroyed())
      .subscribe(({ matches }) => this.isCompact.set(matches));
  }
}
