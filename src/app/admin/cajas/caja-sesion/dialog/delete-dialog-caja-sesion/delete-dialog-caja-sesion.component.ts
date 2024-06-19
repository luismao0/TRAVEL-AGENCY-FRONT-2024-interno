import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CajaSesionService } from '../../../../../services/caja-sesion/caja-sesion.service';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  id: number;
  name: string;
  designation: string;
  mobile: string;
}

@Component({
  selector: 'app-delete-dialog-caja-sesion',
  standalone: true,
  imports: [
      MatDialogTitle,
      MatDialogContent,
      MatDialogActions,
      MatButtonModule,
      MatDialogClose,
  ],
  templateUrl: './delete-dialog-caja-sesion.component.html',
  styleUrl: './delete-dialog-caja-sesion.component.scss'
})

export class DeleteDialogCajaSesionComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogCajaSesionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public cajaSesionService: CajaSesionService
  ) { }
  onNoClick(): void {
    this.dialogRef.close();
  }
  confirmDelete(): void {
    this.cajaSesionService.deleteCajaSesion(this.data.id);
  }
}
