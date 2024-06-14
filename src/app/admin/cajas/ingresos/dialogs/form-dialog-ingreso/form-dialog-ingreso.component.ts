import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Ingreso } from 'app/models/ingreso/ingreso.model';
import { IngresoService } from 'app/services/ingreso/ingreso.service';

export interface DialogData {
  id_ingreso: number;
  action: string;
  ingresos: Ingreso;
}

@Component({
  selector: 'app-form-dialog-ingreso',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatDialogClose,
    MatSelectModule,
    MatOptionModule,

  ],
  templateUrl: './form-dialog-ingreso.component.html',
  styleUrl: './form-dialog-ingreso.component.scss'
})

export class FormDialogIngresoComponent {
  action: string;
  dialogTitle: string;
  ingresosForm: UntypedFormGroup;
  ingreso: Ingreso;
  constructor(
    public dialogRef: MatDialogRef<FormDialogIngresoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public ingresoService : IngresoService,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = "Editar Ingreso";
      this.ingreso = data.ingresos;
    } else {
      this.dialogTitle = 'Nuevo Ingreso';
      const blankObject = {} as Ingreso;
      this.ingreso = new Ingreso(blankObject);
    }
    this.ingresosForm = this.createContactForm();
  }
  formControl = new UntypedFormControl('', [
    Validators.required,
    // Validators.email,
  ]);
  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Este campo es requerido'
      : this.formControl.hasError('email')
        ? 'No es un correo valido'
        : '';
  }
  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.ingreso.id_ingreso],
      concepto: [this.ingreso.concepto],
      monto_ingreso: [this.ingreso.monto_ingreso],
      medio_de_pago: [this.ingreso.medio_de_pago],
      fecha_ingreso: [
        this.ingreso.fecha_ingreso,
        [Validators.required]],
      tipo_de_pago: [this.ingreso.tipo_de_pago]
    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    this.ingresoService.addIngreso(this.ingresosForm.getRawValue());
  }
}
