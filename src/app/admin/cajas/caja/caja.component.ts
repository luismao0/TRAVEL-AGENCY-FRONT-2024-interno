import { Component, /*OnInit*/ } from '@angular/core';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
//import { CajasCreadas } from './cajas-creadas.model';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
// import { FormDialogCajaComponent } from './dialog-caja/form-dialog-caja/form-dialog-caja.component';
// import { MatDialog } from '@angular/material/dialog';
//import { IngresoTablaComponent } from '../ingresos/ingreso-tabla/ingreso-tabla.component';
import { MatExpansionModule } from '@angular/material/expansion';
//import { EgresoTablaComponent } from '../egresos/egreso-tabla/egreso-tabla.component';
// import { IConfig } from 'ngx-mask';

// import { FormBuilder, FormGroup } from '@angular/forms';
//import { IngresosComponent } from '../ingresos/ingresos.component';
import { MatRadioModule } from '@angular/material/radio';
//import { CajaSesionService } from '../caja-sesion/cajaSesion.service';


@Component({
  selector: 'app-caja',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    MatListModule,
    MatFormFieldModule,
    MatSelectModule,
    FlexLayoutModule,
    MatButtonModule,
    //NgxSkeletonLoaderModule,
    MatTabsModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    // para el radio button
    MatRadioModule,

    // Componentes adicionales necesarios
    //IngresoTablaComponent,
    //EgresoTablaComponent,

    // Módulos para panel expansion
    MatExpansionModule,

    // Para formulario en caja cierre,
  ],
  templateUrl: './caja.component.html',
  styleUrl: './caja.component.scss'
})
export class CajaComponent /*implements OnInit*/ {
  botonesHabilitados = false;
  //myForm: FormGroup;
  editable = false;
  labelPosition: 'before' | 'after' = 'after';


  // cajasCreadas: CajasCreadas[] = [
  //   // Se deben traer todas las CAJAS que tiene asignado el usuario
  //   { value: 'caja-1', viewValue: 'Caja Ventas' },
  //   { value: 'caja-2', viewValue: 'Caja de Operaciones' },
  // ];

  // constructor(public dialog: MatDialog, private fb: FormBuilder, private cajaSesionService: CajaSesionService
  // ) {
  //   this.myForm = this.fb.group({
  //     //nombre_caja_sesion: [{ value: '', disabled: true }],
  //     monto_apertura: [{ value: '' }],
  //     fecha_apertura: [{ value: '' }],
  //     tipo_moneda: [{ value: '' }],
  //     descripcion: [{ value: '' }]
  //   });
  // }

  items = ['', '', ''];

  // ngOnInit(): void {
  //   // Suscribirse a los datos del servicio y prellenar el formulario
  //   // this.cajaSesionService.dataChange.subscribe(data => {
  //   //   console.log('Received data in component:', data); // Esto te permitirá ver qué datos se están recibiendo.
  //   //   if (data.length > 0) {
  //   //     const cajaSesion = data[0]; // Supongamos que sólo trabajamos con el primer elemento
  //   //     this.myForm.patchValue({
  //   //       //nombre_caja_sesion: cajaSesion.nombre_caja_sesion,
  //   //       monto_apertura: cajaSesion.monto_apertura,
  //   //       fecha_apertura: cajaSesion.fecha_apertura,
  //   //       tipo_moneda: cajaSesion.moneda,
  //   //       descripcion: cajaSesion.descripcion
  //   //     });
  //   //   }
  //   // });
  // }

  // // add() {
  // //   this.items = this.items.concat('');
  // // }

  CrearTablaSesion() {

    // const dialogRef = this.dialog.open(FormDialogComponent, {
    //   data: {

    //   } // Puedes pasar datos al diálogo aquí
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed. Result:', result);
    //   // Aquí puedes manejar los datos resultantes si es necesario
    //   this.botonesHabilitados = false;
    // });

  }

  // editarCaja() {
  //   this.editable = !this.editable;
  //   this.botonesHabilitados = true;
  //   Object.keys(this.myForm.controls).forEach(key => {
  //     this.myForm.get(key)?.enable();
  //   });
  // }

  // Guardar(): void {
  //   console.log('Guardar');
  //   this.botonesHabilitados = false;
  //   Object.keys(this.myForm.controls).forEach(key => {
  //     this.myForm.get(key)?.disable();
  //   });
  // }
  // Cancelar(): void {
  //   console.log('Cancelar');
  //   this.botonesHabilitados = false;
  //   // Deshabilitar campos y restaurar valores originales
  //   Object.keys(this.myForm.controls).forEach(key => {
  //     this.myForm.get(key)?.disable();
  //   });
  //   this.ngOnInit(); // Revertir los valores a los datos originales
  // }
}
