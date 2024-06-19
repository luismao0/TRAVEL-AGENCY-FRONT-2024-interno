import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CajaSesionService } from '../../../../../services/caja-sesion/caja-sesion.service';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CajaSesion } from '../../../../../models/caja-sesion/caja-sesion.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';

export interface DialogData {
  id_caja: number;
  action: string;
  caja: CajaSesion;
}

@Component({
  selector: 'app-form-dialog-caja-sesion',
  standalone: true,
  imports: [MatButtonModule,
    MatIconModule,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatDialogClose,
    MatOptionModule],
  templateUrl: './form-dialog-caja-sesion.component.html',
  styleUrl: './form-dialog-caja-sesion.component.scss'
})
export class FormDialogCajaSesionComponent {
  action: string;
  dialogTitle: string;
  cajaSesionForm: UntypedFormGroup;
  cajaSesion: CajaSesion;
  constructor(
    public dialogRef: MatDialogRef<FormDialogCajaSesionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public cajaSesionService: CajaSesionService,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = data.caja.nombre_caja_sesion;
      this.cajaSesion = data.caja;
    } else {
      this.dialogTitle = 'New Caja';
      const blankObject = {} as CajaSesion;
      this.cajaSesion = new CajaSesion(blankObject);
    }
    this.cajaSesionForm = this.createContactForm();
  }
  formControl = new UntypedFormControl('', [
    Validators.required,
    // Validators.email,
  ]);
  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
        ? 'Not a valid email'
        : '';
  }
  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.cajaSesion.id_caja_sesion],
      nombre_caja_sesion: [this.cajaSesion.nombre_caja_sesion],
      monto_apertura: [this.cajaSesion.monto_apertura],
      fecha_apertura: [
        //formatDate(this.caja.date, 'yyyy-MM-dd', 'en'),
        this.cajaSesion.fecha_apertura,
        [Validators.required],
      ],
      tipo_moneda: [this.cajaSesion.moneda],
      descripcion: [this.cajaSesion.descripcion]
    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    this.cajaSesionService.addCajaSesion(this.cajaSesionForm.getRawValue());
  }
}


