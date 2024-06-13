import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-verify-form',
  templateUrl: './verify-form.component.html',
  styleUrl: './verify-form.component.css'
})
export class VerifyFormComponent {
  constructor(public dialogRef: MatDialogRef<VerifyFormComponent>) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

}
