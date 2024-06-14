import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { IngresoService } from 'app/services/ingreso/ingreso.service';

export interface DialogData {
  id: number;
  concepto: string;
  monto_ingreso: number;
  medio_de_pago: string;
  fecha_ingreso: string;
  tipo_de_pago : string;
}

@Component({
  selector: 'app-delete-dialog-ingreso',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatDialogClose,
  ],
  templateUrl: './delete-dialog-ingreso.component.html',
  styleUrl: './delete-dialog-ingreso.component.scss'
})
export class DeleteDialogIngresoComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogIngresoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    // public doctorsService: DoctorsService,
    public ingresosService: IngresoService
  ) { }
  onNoClick(): void {
    this.dialogRef.close();
  }
  confirmDelete(): void {
    this.ingresosService.deleteIngresos(this.data.id);
  }
}

