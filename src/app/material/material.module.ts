import { NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  exports: [
    MatSnackBarModule,
    MatButtonModule,
    MatInputModule
  ]
})
export class MaterialModule {}
