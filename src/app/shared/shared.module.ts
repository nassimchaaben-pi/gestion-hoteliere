import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';

@NgModule({
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  exports: [HeaderComponent, FooterComponent, RouterModule]
})
export class SharedModule {}
