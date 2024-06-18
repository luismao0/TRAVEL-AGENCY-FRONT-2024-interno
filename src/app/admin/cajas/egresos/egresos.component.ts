import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { EgresoTablaComponent } from './egreso-tabla/egreso-tabla.component';
import { Egreso } from 'app/models/egreso/egreso.model';

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
export class EgresosComponent {
  egresos: Egreso[] = [];

}
