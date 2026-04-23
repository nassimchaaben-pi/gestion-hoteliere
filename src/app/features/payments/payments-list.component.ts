import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PaymentService, Payment } from './payment.service';
import { PatientService, Patient } from '../patients/patient.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { RefreshService } from '../../shared/services/refresh.service';

@Component({
  selector: 'app-payments-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatButtonModule],
  templateUrl: './payments-list.component.html',
  styleUrls: ['./payments-list.component.scss']
})
export class PaymentsListComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['patient', 'amount', 'method', 'date', 'actions'];
  dataSource = new MatTableDataSource<Payment>([]);
  loading = false;
  error: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private routerSub?: Subscription;
  private refreshSub?: Subscription;
  private patientMap: Record<string, string> = {};

  constructor(private service: PaymentService, private router: Router, private refresh: RefreshService, private patientService: PatientService) {}

  ngOnInit(): void {
    this.patientService.list().subscribe((patients: Patient[]) => {
      this.patientMap = {};
      for (const p of patients) {
        if (p.id) this.patientMap[p.id] = `${p.firstName} ${p.lastName}`;
      }
      this.fetch();
    });

    this.routerSub = this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(() => this.fetch());
    this.refreshSub = this.refresh.refresh$.subscribe((path) => {
      if (!path || path.startsWith('/payments')) {
        this.fetch();
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  fetch(): void {
    this.loading = true;
    this.error = null;
    this.service.list().subscribe({
      next: (res) => {
        const mapped = res.map((p) => ({ ...(p as any), patientName: this.patientMap[p.patient] ?? p.patient }));
        this.dataSource.data = mapped as any;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load payments', err);
        this.error = 'Impossible de charger les paiements.';
        this.loading = false;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
    this.refreshSub?.unsubscribe();
  }
}
