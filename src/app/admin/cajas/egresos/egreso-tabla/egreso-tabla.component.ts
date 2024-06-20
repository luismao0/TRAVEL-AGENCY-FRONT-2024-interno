import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDragPlaceholder, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { DatePipe, NgClass } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TableElement, TableExportUtil, UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { NgScrollbar } from 'ngx-scrollbar';
import { Egreso } from 'app/models/egreso/egreso.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { Direction } from '@angular/cdk/bidi';
import { BehaviorSubject, Observable, fromEvent, map, merge } from 'rxjs';
import { EgresoService } from 'app/services/egreso/egreso.service';
import { DeleteDialogEgresoComponent } from '../dialogs/delete-dialog-egreso/delete-dialog-egreso.component';
import { FormDialogEgresoComponent } from '../dialogs/form-dialog-egreso/form-dialog-egreso.component';

@Component({
  selector: 'app-egreso-tabla',
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
    MatSortModule,
    FeatherIconsComponent,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
  ],
  templateUrl: './egreso-tabla.component.html',
  styleUrl: './egreso-tabla.component.scss'
})
export class EgresoTablaComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {

  columnasMostradas = [
    // 'id',
    'select',
    'concepto',
    'monto',
    'medio',
    'fecha',
    'actions',
  ]

  idEgreso?: number;
  seleccion = new SelectionModel<Egreso>(true, []);
  fuenteData!: FuenteDatos;
  database?: EgresoService;
  egresos: Egreso[] = [];

  modoEgreso = new UntypedFormControl('side');
  egresoForm!: UntypedFormGroup;

  showFiller = false;
  esNuevoEvento = false;
  dialogTitulo?: string;
  mediosPago?: string[];

  constructor(private fb: UntypedFormBuilder, private httpClient: HttpClient,
    public dialog: MatDialog,
    public egresoService: EgresoService,
    private snackBar: MatSnackBar
  ) {
    super();
    const blank = {} as Egreso;
    this.egresoForm = this.crearFormGroupEgreso(blank);
    this.fetchEgresos((data: Egreso[]) => {
      this.egresos = data;
    });
  }

  // Actualiza los egresos existentes
  fetchEgresos(cb: (i: Egreso[]) => void) {
    const req = new XMLHttpRequest();
    req.open('GET', 'assets/data/egresos.json');
    req.onload = () => {
      const data = JSON.parse(req.response);
      cb(data);
    };
    req.send();
  }

  // Función para eliminar ingreso
  eliminarEgreso(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.egresos, event.previousIndex, event.currentIndex);
  }

  toggle(task: { done: boolean }, nav: MatSidenav) {
    nav.close();
    task.done = !task.done;
  }

  // addNewEgreso(nav: MatSidenav) {
  //   this.resetFormFieldEgreso();
  //   this.esNuevoEvento = true;
  //   this.dialogTitulo = 'Nuevo Egreso';
  //   nav.open();
  // }

  // Muestra sidebar cuando sucede evento click sobre un Egreso
  egresoClick(egreso: Egreso, nav: MatSidenav): void {
    this.esNuevoEvento = false;
    this.dialogTitulo = 'Editar Egreso';
    nav.open();
    this.egresoForm = this.crearFormGroupEgreso(egreso);
  }

  // Cierra slider
  cerrarSlider(nav: MatSidenav) {
    nav.close();
  }

  crearFormGroupEgreso(data: Egreso) { // Se debe verificar si se envian datos nulos
    return this.fb.group({
      id: [data ? data.id_egreso : null],
      concepto: [data ? data.concepto : null],
      monto_egreso: [data ? data.monto_egreso : null],
      medio_de_egreso: [data ? data.medio_de_egreso : null],
      fecha_egreso: [data ? data.fecha_egreso : null],
    });
  }

  guardarEgreso() {
    this.database?.dataChange.value.unshift(
      this.egresoForm.value
    );
    console.log(this.database);
    console.log(this.egresoForm.value);
    this.actualizarTabla();
    this.mostrarNotificacion(
      'snackbar-success',
      '¡¡Registro agregado correctamente!!',
      'bottom',
      'center'
    );
  }

  editarEgreso() {
    const targetIdx = this.egresos
      .map((item) => item.id_egreso)
      .indexOf(this.egresoForm.value.id);
    if (targetIdx != null && this.database) {
      this.database.dataChange.value[targetIdx] =
        this.egresoForm.value;
      // Actualizar la tabla
      this.actualizarTabla();
      this.mostrarNotificacion(
        'black',
        '¡¡Se editó el registro correctamente!!',
        'bottom',
        'center'
      );
    }
  }
  // editarLlamadaEgreso(row: Egreso) {
  //   this.idEgreso = row.id_egreso;
  //   let tempDirection: Direction;
  //   if (localStorage.getItem('isRtl') === 'true') {
  //     tempDirection = 'rtl';
  //   } else {
  //     tempDirection = 'ltr';
  //   }
  //   const dialogRef = this.dialog.open(FormDialogEgresoComponent, {
  //     data: {
  //       egresos: row,
  //       action: 'edit',
  //     },
  //     direction: tempDirection,
  //   });
  //   this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
  //     if (result === 1) {
  //       // En primer lugar encontramos el registro dentro de DataService por id
  //       const foundIndex = this.database?.dataChange.value.findIndex(
  //         (x) => x.id_egreso === this.idEgreso
  //       );
  //       // Actualizar el registro utilizando los datos de dialogData (valores que ha introducido)
  //       if (foundIndex != null && this.database) {
  //         this.database.dataChange.value[foundIndex] =
  //           this.egresoService.getDialogData();
  //         // Actualizar la tabla
  //         this.actualizarTabla();
  //         this.mostrarNotificacion(
  //           'black',
  //           'Edit Record Successfully...!!!',
  //           'bottom',
  //           'center'
  //         );
  //       }
  //     }
  //   });
  // }

  deleteEgreso(nav: MatSidenav) {
    const targetIdx = this.egresos
      .map((item) => item.id_egreso)
      .indexOf(this.egresoForm.value.id);
    this.egresos.splice(targetIdx, 1);
    nav.close();
  }

  resetFormFieldEgreso() {
    this.egresoForm.controls['id'].reset();
    this.egresoForm.controls['concepto'].reset();
    this.egresoForm.controls['monto_egreso'].reset();
    this.egresoForm.controls['fecha_egreso'].reset();
    this.egresoForm.controls['medio_de_egreso'].reset();
  }


  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  @ViewChild('filter', { static: true }) filter?: ElementRef;

  ngOnInit() {
    // this.loadData();
    // this.mediosPago = Object.keys(MedioPagoEnum).map(key => MedioPagoEnum[(+key)]);
    this.cargarInformacionEgresos();
  }


  actualizar() {
    // this.loadData();
    this.cargarInformacionEgresos();
  }

  agregarNuevoEgreso() {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogEgresoComponent, {
      data: {
        egresos: this.egresos,
        action: 'add',
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataServicex
        this.database?.dataChange.value.unshift(
          this.egresoService.getDialogData()
        );
        this.actualizarTabla();
        this.mostrarNotificacion(
          'snackbar-success',
          'Add Record Successfully...!!!',
          'bottom',
          'center'
        );
      }
    });
  }

  editarLlamadaEgreso(row: Egreso) {
    console.log("row");
    console.log(row);
    this.idEgreso = row.id_egreso;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogEgresoComponent, {
      data: {
        egresos: row,
        action: 'edit',
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        const foundIndex = this.database?.dataChange.value.findIndex(
          (x) => x.id_egreso === this.idEgreso
        );
        // Then you update that record using data from dialogData (values you enetered)
        if (foundIndex != null && this.database) {
          this.database.dataChange.value[foundIndex] =
            this.egresoService.getDialogData();
          // And lastly actualizar table
          this.actualizarTabla();
          this.mostrarNotificacion(
            'black',
            '¡¡Registro editado correctamente!!',
            'bottom',
            'center'
          );
        }
      }
    });
  }

  eliminarItemEgreso(row: Egreso) {
    this.idEgreso = row.id_egreso;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(DeleteDialogEgresoComponent, {
      data: row,
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        const foundIndex = this.database?.dataChange.value.findIndex(
          (x) => x.id_egreso === this.idEgreso
        );
        // for delete we use splice in order to remove single object from DataService
        if (foundIndex != null && this.database) {
          this.database.dataChange.value.splice(foundIndex, 1);
          this.actualizarTabla();
          this.mostrarNotificacion(
            'snackbar-danger',
            'Se eliminó el item correctamente...!!!',
            'bottom',
            'center'
          );
        }
      }
    });
  }


  private actualizarTabla() {
    this.paginator?._changePageSize(this.paginator?.pageSize);
  }

  estanTodosEgresosSeleccionados() {
    const numSelected = this.seleccion.selected.length;
    const numRows = this.fuenteData.renderedData.length;
    return numSelected === numRows;
  }

  palancaMaestraEgresos() {
    this.estanTodosEgresosSeleccionados()
      ? this.seleccion.clear()
      : this.fuenteData.renderedData.forEach((row) =>
        this.seleccion.select(row)
      );
  }

  eliminarFilasEgresoSeleccionadas() {
    const totalSelect = this.seleccion.selected.length;
    this.seleccion.selected.forEach((item) => {
      const index: number = this.fuenteData.renderedData.findIndex(
        (d) => d === item
      );
      // console.log(this.dataSource.renderedData.findIndex((d) => d === item));
      this.database?.dataChange.value.splice(index, 1);

      this.actualizarTabla();
      this.seleccion = new SelectionModel<Egreso>(true, []);
    });
    this.mostrarNotificacion(
      'snackbar-danger',
      totalSelect + ' Registros eliminados satisfactoriamente...!!!',
      'bottom',
      'center'
    );
  }

  public cargarInformacionEgresos() {
    this.database = new EgresoService(this.httpClient);
    this.fuenteData = new FuenteDatos(
      this.database,
      this.paginator,
      this.sort
    );
    this.subs.sink = fromEvent(this.filter?.nativeElement, 'keyup').subscribe(
      () => {
        if (!this.fuenteData) {
          return;
        }
        this.fuenteData.filter = this.filter?.nativeElement.value;
      }
    );
  }

  exportarEgresosExcel() {
    // key name with space add in brackets
    const exportData: Partial<TableElement>[] =
      this.fuenteData.filteredData.map((x) => ({
        Id: x.id_egreso,
        Concepto: x.concepto,
        // FechaEgreso: x.fecha_egreso,
        MedioPago: x.medio_de_egreso,
        MontoEgreso: x.monto_egreso,
        // 'Joining Date': formatDate(new Date(x.date), 'yyyy-MM-dd', 'en') || '',
      }));
    TableExportUtil.exportToExcel(exportData, 'excel');
  }

  mostrarNotificacion(
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


export class FuenteDatos extends DataSource<Egreso> {
  filterChange = new BehaviorSubject('');
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: Egreso[] = [];
  renderedData: Egreso[] = [];
  constructor(
    public exampleDatabase: EgresoService,
    public paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    // Volver a la primera página cuando el usuario selecciona un filtro
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Egreso[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    this.exampleDatabase.getAllDoctorss();
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((egresos: Egreso) => {
            const searchStr = (
              egresos.id_egreso +
              egresos.concepto +
              egresos.fecha_egreso +
              egresos.medio_de_egreso +
              egresos.monto_egreso
            ).toLowerCase();
            return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
          });
        // Ordenar datos filtrados
        const sortedData = this.sortData(this.filteredData.slice());
        // Toma la porción de la página de los datos filtrados y ordenados.
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        this.renderedData = sortedData.splice(
          startIndex,
          this.paginator.pageSize
        );
        return this.renderedData;
      })
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnect() { }
  /** Devuelve una copia ordenada de los datos de database. */
  sortData(data: Egreso[]): Egreso[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';
      switch (this._sort.active) {
        case 'id':
          [propertyA, propertyB] = [a.id_egreso, b.id_egreso];
          break;
        case 'concepto':
          [propertyA, propertyB] = [a.concepto, b.concepto];
          break;
        case 'medio':
          [propertyA, propertyB] = [a.medio_de_egreso, b.medio_de_egreso];
          break;
      }
      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
      return (
        (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1)
      );
    });
  }
}
