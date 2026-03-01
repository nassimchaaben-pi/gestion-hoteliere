import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [SharedModule, RouterOutlet],
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.scss']
})
export class UserLayoutComponent {}
