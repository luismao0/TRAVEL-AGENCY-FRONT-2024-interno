import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { EgresoService } from 'app/services/egreso/egreso.service';

export interface DialogData {
  id_egreso: number ;
  concepto: string;
  monto_egreso: number;
  medio_de_egreso: string;
  fecha_egreso: string;
}

@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatDialogClose,
  ],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.scss'
})
export class DeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    // public doctorsService: DoctorsService,
    public egresosService: EgresoService
  ) { }
  onNoClick(): void {
    this.dialogRef.close();
  }
  confirmDelete(): void {
    this.egresosService.deleteEgresos(this.data.id_egreso);
  }
}
