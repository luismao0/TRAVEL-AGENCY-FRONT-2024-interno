import { CdkDrag, CdkDragHandle, CdkDragPlaceholder, CdkDropList } from '@angular/cdk/drag-drop';
import { DatePipe, NgClass } from '@angular/common';
// import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, viewChild} from '@angular/core';
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
import { MatSortModule } from '@angular/material/sort';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { UnsubscribeOnDestroyAdapter,} from '@shared';

import { CajaSesion  } from '../../../models/caja-sesion/caja-sesion.model';
///import { MedioPagoEnum } from './ingreso.enums';

import { MatRadioModule } from '@angular/material/radio';
import { CajaComponent } from "../caja/caja.component";
import { CajaSesionTablaComponent } from "./caja-sesion-tabla/caja-sesion-tabla.component";

import { MatExpansionModule } from '@angular/material/expansion';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialog } from '@angular/material/dialog';
import { Direction } from '@angular/cdk/bidi';
import { FormDialogCajaSesionComponent } from './dialog/form-dialog-caja-sesion/form-dialog-caja-sesion.component';
import { CajaSesionService } from '../../../services/caja-sesion/caja-sesion.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

import { DataSource, SelectionModel } from '@angular/cdk/collections';

@Component({
    selector: 'app-caja-sesion',
    standalone: true,
    templateUrl: './caja-sesion.component.html',
    styleUrl: './caja-sesion.component.scss',
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
        FlexLayoutModule,
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
        CajaSesionTablaComponent,

        MatPaginatorModule,

        MatExpansionModule
    ]
})

export class CajaSesionComponent extends UnsubscribeOnDestroyAdapter{
  
  // Lista de Caja Sesion   
  database?: CajaSesionService;                               // Falta refactorizar
  cajaSesion: CajaSesion[] = [];

  constructor(private fb: UntypedFormBuilder, private httpClient: HttpClient, public dialog: MatDialog, public cajaSesionService: CajaSesionService, private snackBar: MatSnackBar
  ) {
    super();

  // Traemos los registros a una lista 
    this.fetchCajaSesion((data: CajaSesion[]) => {
      this.cajaSesion = data;
    });
  }
  

  // trae los registros de caja sesion de la carpeta data 
  fetchCajaSesion(cb: (i: CajaSesion[]) => void) {
    const req = new XMLHttpRequest();
    req.open('GET', 'assets/data/cajaSesion.json');
    req.onload = () => {
      const data = JSON.parse(req.response);
      cb(data);
    };
    req.send();
  }

  CrearTablaSesion() {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogCajaSesionComponent, {
      data: {
        cajaSesion: this.cajaSesion,
        action: 'ADD',
      },
      direction: tempDirection,
    });
    
    
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataServicex
        this.database?.dataChange.value.unshift(
          this.cajaSesionService.getDialogData()
        );
        this.refreshTable();
        this.mostrarNotification(
          'snackbar-success',
          'Add Record Successfully...!!!',
          'bottom',
          'center'
        );
      }
    });
  }


  mostrarNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
}



// export class FuenteDatos extends DataSource<CajaSesion> {
//   filterChange = new BehaviorSubject('');
//   get filter(): string {
//     return this.filterChange.value;
//   }
//   set filter(filter: string) {
//     this.filterChange.next(filter);
//   }
//   filteredData: CajaSesion[] = [];
//   renderedData: CajaSesion[] = [];
//   constructor(
//     public exampleDatabase: CajaSesionService,
//     public paginator: MatPaginator,
//     public _sort: MatSort
//   ) {
//     super();
//     // Volver a la primera página cuando el usuario selecciona un filtro
//     this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
//   }
//   /** Connect function called by the table to retrieve one stream containing the data to render. */
//   connect(): Observable<CajaSesion[]> {
//     // Listen for any changes in the base data, sorting, filtering, or pagination
//     const displayDataChanges = [
//       this.exampleDatabase.dataChange,
//       this._sort.sortChange,
//       this.filterChange,
//       this.paginator.page,
//     ];
//     this.exampleDatabase.getAllDoctorss();
//     return merge(...displayDataChanges).pipe(
//       map(() => {
//         // Filter data
//         this.filteredData = this.exampleDatabase.data
//           .slice()
//           .filter((cajaSesion: CajaSesion) => {
//             const searchStr = (
//               cajaSesion.id_caja_sesion +
//               cajaSesion.nombre_caja_sesion +
//               cajaSesion.fecha_apertura +
//               cajaSesion.fecha_cierre +
//               cajaSesion.descripcion +
//               cajaSesion.moneda
//             ).toLowerCase();
//             return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
//           });
//         // Ordenar datos filtrados
//         const sortedData = this.sortData(this.filteredData.slice());
//         // Toma la porción de la página de los datos filtrados y ordenados.
//         const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
//         this.renderedData = sortedData.splice(
//           startIndex,
//           this.paginator.pageSize
//         );
//         return this.renderedData;
//       })
//     );
//   }
//   // eslint-disable-next-line @typescript-eslint/no-empty-function
//   disconnect() { }
//   /** Devuelve una copia ordenada de los datos de database. */
//   sortData(data: CajaSesion[]): CajaSesion[] {
//     if (!this._sort.active || this._sort.direction === '') {
//       return data;
//     }
//     return data.sort((a, b) => {
//       let propertyA: number | string = '';
//       let propertyB: number | string = '';
//       switch (this._sort.active) {
//         case 'id_caja_sesion':
//           [propertyA, propertyB] = [a.id_caja_sesion, b.id_caja_sesion];
//           break;
//         case 'nombre_caja_sesion':
//           [propertyA, propertyB] = [a.nombre_caja_sesion, b.nombre_caja_sesion];
//           break;
//         case 'monto_apertura':
//           [propertyA, propertyB] = [a.monto_apertura, b.monto_apertura];
//           break;
//         // case 'time':
//         //   [propertyA, propertyB] = [a.monto_ingreso, b.monto_ingreso];
//         //   break;
//         // case 'mobile':
//         //   [propertyA, propertyB] = [a.mobile, b.mobile];
//         //   break;
//       }
//       const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
//       const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
//       return (
//         (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1)
//       );
//     });
//   }
// }

