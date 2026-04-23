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
import { RefreshService } from '../../services/refresh.service';

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

  constructor(private breakpointObserver: BreakpointObserver, private refresh: RefreshService) {
    this.breakpointObserver
      .observe(['(max-width: 1180px)'])
      .pipe(takeUntilDestroyed())
      .subscribe(({ matches }) => this.isCompact.set(matches));
  }

  onNav(path: string) {
    // notify listeners that a navigation/refresh was requested for this path
    this.refresh.refresh(path || '');
  }
}
