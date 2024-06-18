import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Egreso } from 'app/models/egreso/egreso.model';
import { EgresoService } from 'app/services/egreso/egreso.service';

export interface DialogData {
  id_egreso: number;
  action: string;
  egresos: Egreso;
}

@Component({
  selector: 'app-form-dialog',
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
  ],
  templateUrl: './form-dialog.component.html',
  styleUrl: './form-dialog.component.scss'
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  egresosForm: UntypedFormGroup;
  egreso: Egreso;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public egresoService : EgresoService,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = "Editar Registro";
      this.egreso = data.egresos;
    } else {
      this.dialogTitle = 'Nuevo Registro';
      const blankObject = {} as Egreso;
      this.egreso = new Egreso(blankObject);
    }
    this.egresosForm = this.createContactForm();
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
      id: [this.egreso.id_egreso],
      concepto: [this.egreso.concepto],
      monto_egreso: [this.egreso.monto_egreso],
      medio_de_egreso: [this.egreso.medio_de_egreso],
      fecha_egreso: [
        // formatDate(this.egreso.fecha_egreso, 'dd-MM-yyyy', 'en'),
        this.egreso.fecha_egreso,
        [Validators.required]],
    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    this.egresoService.addEgreso(this.egresosForm.getRawValue());
  }
}
