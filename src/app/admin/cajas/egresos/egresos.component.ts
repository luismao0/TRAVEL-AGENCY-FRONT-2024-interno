import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { EgresoTablaComponent } from './egreso-tabla/egreso-tabla.component';
import { Egreso } from 'app/models/egreso/egreso.model';
import { UntypedFormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { EgresoService } from 'app/services/egreso/egreso.service';
import { UnsubscribeOnDestroyAdapter } from '@shared';

@Component({
  selector: 'app-egresos',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    MatFormFieldModule,
    MatSelectModule,
    EgresoTablaComponent,
  ],
  templateUrl: './egresos.component.html',
  styleUrl: './egresos.component.scss'
})
export class EgresosComponent extends UnsubscribeOnDestroyAdapter {
  egresos: Egreso[] = [];
  totalMontoEgreso: number = 0;

  constructor(private fb: UntypedFormBuilder, private httpClient: HttpClient, public egresoService: EgresoService) {
    super();

    // Traemos los egresos a una lista y recuperamos la suma total de los montos_egreso para la caja
    this.fetchEgresos((data: Egreso[]) => {
      this.egresos = data;
      this.totalMontoEgreso = this.calcularTotalMontoEgreso();
    });
  }

  fetchEgresos(cb: (i: Egreso[]) => void) {
    const req = new XMLHttpRequest();
    req.open('GET', 'assets/data/egresos.json');
    req.onload = () => {
      const data = JSON.parse(req.response);
      cb(data);
    };
    req.send();
  }

  calcularTotalMontoEgreso(): number {
    let total = 0;
    for (const egreso of this.egresos) {
      total += egreso.monto_egreso;
    }
    return total;
  }
}
