import { NgModule } from '@angular/core';
import { AppTypicalRoutingModule } from './typical-routing.module';
import { CommonModule } from '@angular/common';
import { AppTypicalComponent } from './typical.component';

@NgModule({
  declarations: [AppTypicalComponent],
  imports: [CommonModule, AppTypicalRoutingModule],
  exports: [],
})
export class AppTypicalModule {}
