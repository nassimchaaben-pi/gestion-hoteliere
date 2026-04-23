import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PatientService, Patient } from './patient.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { RefreshService } from '../../shared/services/refresh.service';

@Component({
  selector: 'app-patients-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatButtonModule],
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.scss']
})
export class PatientsListComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['firstName', 'lastName', 'dob', 'email', 'actions'];
  dataSource = new MatTableDataSource<Patient>([]);
  loading = false;
  error: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private routerSub?: Subscription;
  private refreshSub?: Subscription;

  constructor(private patientService: PatientService, private router: Router, private refresh: RefreshService) {}

  ngOnInit(): void {
    this.fetch();
    // Refresh when navigation ends so tables update when user clicks tabs/links
    this.routerSub = this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(() => {
      this.fetch();
    });
    // also listen to programmatic refresh events (from header clicks)
    this.refreshSub = this.refresh.refresh$.subscribe((path) => {
      if (!path || path.startsWith('/patients')) {
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
    this.patientService.list().subscribe({
      next: (res) => {
        this.dataSource.data = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load patients', err);
        this.error = 'Impossible de charger la liste des patients.';
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
