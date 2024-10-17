import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppTypicalComponent } from './typical.component';

const routes: Routes = [
  {
    path: ':id',
    component: AppTypicalComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppTypicalRoutingModule {}
