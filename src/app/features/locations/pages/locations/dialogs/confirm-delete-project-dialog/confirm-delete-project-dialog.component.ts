import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-delete-project-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirm-delete-project-dialog.component.html',
  styleUrl: './confirm-delete-project-dialog.component.scss'
})
export class ConfirmDeleteProjectDialogComponent {

 constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  deleteProject() {
    this.dialogRef.close(true);
  }

  close() {
    this.dialogRef.close(false);
  }
}
