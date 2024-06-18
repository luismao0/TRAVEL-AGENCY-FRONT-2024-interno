import { CdkDrag, CdkDragHandle, CdkDragPlaceholder, CdkDropList } from '@angular/cdk/drag-drop';
import { DatePipe, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { NgScrollbar } from 'ngx-scrollbar';
import { MatTableModule } from '@angular/material/table';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import {
  UnsubscribeOnDestroyAdapter,
} from '@shared';

import { IngresoTablaComponent } from './ingreso-tabla/ingreso-tabla.component';
import { Ingreso } from 'app/models/ingreso/ingreso.model';
import { IngresoService } from 'app/services/ingreso/ingreso.service';

@Component({
  selector: 'app-ingresos',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    MatButtonModule,
    MatSidenavModule,
    MatTooltipModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    NgScrollbar,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    CdkDragPlaceholder,
    NgClass,
    DatePipe,

    MatTableModule,
    FeatherIconsComponent,
    MatRippleModule,
    MatProgressSpinnerModule,

    IngresoTablaComponent,
  ],
  templateUrl: './ingresos.component.html',
  styleUrls: ['./ingresos.component.scss']
})
export class IngresoComponent extends UnsubscribeOnDestroyAdapter {

  // Lista de ingresos
  ingresos: Ingreso[] = [];
  totalMontoIngreso: number = 0;

  constructor(private fb: UntypedFormBuilder, private httpClient: HttpClient, public ingresoService: IngresoService) {
    super();

    // Traemos los ingresos a una lista y recuperamos la suma total de los montos_ingreso para la caja
    this.fetchIngresos((data: Ingreso[]) => {
      this.ingresos = data;
      this.totalMontoIngreso = this.calcularTotalMontoIngreso();
    });
  }

  fetchIngresos(cb: (i: Ingreso[]) => void) {
    const req = new XMLHttpRequest();
    req.open('GET', 'assets/data/ingresos.json');
    req.onload = () => {
      const data = JSON.parse(req.response);
      cb(data);
    };
    req.send();
  }

  calcularTotalMontoIngreso(): number {
    let total = 0;
    for (const ingreso of this.ingresos) {
      total += ingreso.monto_ingreso;
    }
    return total;
  }
}
