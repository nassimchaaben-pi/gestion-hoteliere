import { Routes } from '@angular/router';
import { UserLayoutComponent } from './core/layout/user-layout/user-layout.component';
import { AdminLayoutComponent } from './core/layout/admin-layout/admin-layout.component';

import { PatientsListComponent } from './features/patients/patients-list.component';
import { PatientDetailComponent } from './features/patients/patient-detail.component';
import { PatientFormComponent } from './features/patients/patient-form.component';

import { AppointmentsListComponent } from './features/appointments/appointments-list.component';
import { AppointmentDetailComponent } from './features/appointments/appointment-detail.component';
import { AppointmentFormComponent } from './features/appointments/appointment-form.component';

import { PaymentsListComponent } from './features/payments/payments-list.component';
import { PaymentDetailComponent } from './features/payments/payment-detail.component';
import { PaymentFormComponent } from './features/payments/payment-form.component';

export const routes: Routes = [
	{
		path: '',
		component: UserLayoutComponent,
		children: [
			{ path: '', redirectTo: 'patients', pathMatch: 'full' },
			{ path: 'patients', component: PatientsListComponent },
			{ path: 'patients/new', component: PatientFormComponent },
			{ path: 'patients/:id', component: PatientDetailComponent },
			{ path: 'patients/:id/edit', component: PatientFormComponent, data: { prerender: false } },

			{ path: 'appointments', component: AppointmentsListComponent },
			{ path: 'appointments/new', component: AppointmentFormComponent },
			{ path: 'appointments/:id', component: AppointmentDetailComponent, data: { prerender: false } },
			{ path: 'appointments/:id/edit', component: AppointmentFormComponent, data: { prerender: false } },

			{ path: 'payments', component: PaymentsListComponent },
			{ path: 'payments/new', component: PaymentFormComponent },
			{ path: 'payments/:id', component: PaymentDetailComponent, data: { prerender: false } },
			{ path: 'payments/:id/edit', component: PaymentFormComponent, data: { prerender: false } }
		]
	},
	{
		path: 'admin',
		component: AdminLayoutComponent,
		children: [
			{ path: '', redirectTo: 'patients', pathMatch: 'full' },
			{ path: 'patients', component: PatientsListComponent },
			{ path: 'appointments', component: AppointmentsListComponent },
			{ path: 'payments', component: PaymentsListComponent }
		]
	},
	{ path: '**', redirectTo: '' }
];
