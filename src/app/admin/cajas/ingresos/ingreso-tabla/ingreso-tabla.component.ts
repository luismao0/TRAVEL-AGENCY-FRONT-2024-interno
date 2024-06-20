import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, fromEvent, map, merge } from 'rxjs';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { DatePipe, NgClass } from '@angular/common';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { TableElement, TableExportUtil, UnsubscribeOnDestroyAdapter } from '@shared';
import { NgScrollbar } from 'ngx-scrollbar';
import { Direction } from '@angular/cdk/bidi';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDragPlaceholder, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { Ingreso } from 'app/models/ingreso/ingreso.model';
import { IngresoService } from 'app/services/ingreso/ingreso.service';
import { FormDialogIngresoComponent } from '../dialogs/form-dialog-ingreso/form-dialog-ingreso.component';
import { DeleteDialogIngresoComponent } from '../dialogs/delete-dialog-ingreso/delete-dialog-ingreso.component';

@Component({
  selector: 'app-ingreso-tabla',
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
  templateUrl: './ingreso-tabla.component.html',
  styleUrl: './ingreso-tabla.component.scss'
})
export class IngresoTablaComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {

  // Columnas a mostrarse en la tabla
  columnasMostradas = [
    /*'id',*/
    'select',
    'concepto',
    'monto',
    'medio',
    'fecha',
    'tipo',
    'actions',
  ]

  idIngreso?: number;
  seleccion = new SelectionModel<Ingreso>(true, []);
  fuenteData!: FuenteDatos;
  database?: IngresoService;
  ingreso?: Ingreso;
  ingresos: Ingreso[] = [];
  modoIngreso = new UntypedFormControl('side');
  ingresoForm!: UntypedFormGroup;
  esNuevoEvento = false;
  dialogTitulo?: string;
  mediosPago?: string[];

  constructor(private fb: UntypedFormBuilder, private httpClient: HttpClient,
    public dialog: MatDialog,
    public ingresoService: IngresoService,
    private snackBar: MatSnackBar
  ) {
    super();
    const blank = {} as Ingreso;
    this.ingresoForm = this.crearFormGroupIngreso(blank);
    this.fetchIngresos((data: Ingreso[]) => {
      this.ingresos = data;
    });
  }

  // Actualiza los ingresos existentes
  fetchIngresos(cb: (i: Ingreso[]) => void) {
    const req = new XMLHttpRequest();
    req.open('GET', 'assets/data/ingresos.json');
    req.onload = () => {
      const data = JSON.parse(req.response);
      cb(data);
    };
    req.send();
  }

  // Función para eliminar ingreso
  eliminarIngreso(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.ingresos, event.previousIndex, event.currentIndex);
  }

  // Muestra sidebar cuando sucede evento click sobre un Ingreso
  ingresoClick(ingreso: Ingreso, nav: MatSidenav): void {
    this.esNuevoEvento = false;
    this.dialogTitulo = 'Editar Ingreso';
    nav.open();
    this.ingresoForm = this.crearFormGroupIngreso(ingreso);
  }

  editIngreso() {
    const targetIdx = this.ingresos
      .map((item) => item.id_ingreso)
      .indexOf(this.ingresoForm.value.id);
    if (targetIdx != null && this.database) {
      this.database.dataChange.value[targetIdx] =
        this.ingresoForm.value;
      // Actualizar la tabla
      this.refreshTable();
      this.mostrarNotificacion(
        'black',
        '¡¡Se editó el registro correctamente!!',
        'bottom',
        'center'
      );
    }
  }

  // Cierra slider
  cerrarSlider(nav: MatSidenav) {
    nav.close();
  }

  // Prepara data cuando se registra ingreso
  crearFormGroupIngreso(data: Ingreso) { // Se debe verificar si se envian datos nulos
    return this.fb.group({
      id: [data ? data.id_ingreso : null],
      concepto: [data ? data.concepto : null],
      monto_ingreso: [data ? data.monto_ingreso : null],
      medio_de_pago: [data ? data.medio_de_pago : null],
      fecha_ingreso: [data ? data.fecha_ingreso : null],
      // estado: [data ? 1:1],
      tipo_de_pago: [data ? data.tipo_de_pago : null]
    });
  }

  // Guarda ingreso (Usando Sidebar)
  guardarIngreso() {
    this.database?.dataChange.value.unshift(
      this.ingresoForm.value
    );
    console.log(this.database);
    console.log(this.ingresoForm.value);
    this.refreshTable();
    this.mostrarNotificacion(
      'snackbar-success',
      '¡¡Registro agregado correctamente!!',
      'bottom',
      'center'
    );
  }

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  @ViewChild('filter', { static: true }) filter?: ElementRef;

  ngOnInit() {
    // Se cargan los Ingresos al iniciar
    this.cargarInformacionIngresos();
  }

  // Actualiza registro de ingresos
  refrescarIngresos() {
    this.cargarInformacionIngresos();
  }

  // Funcion para mostrar Dialog y agregar nuevo Ingreso
  agregarNuevoIngreso() {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogIngresoComponent, {
      data: {
        ingresos: this.ingresos,
        action: 'add',
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // Actualizaciones después de cerrar dialog
        // Para agregar solo se incluye un nuevo registro en DataBase
        this.database?.dataChange.value.unshift(
          this.ingresoService.getDialogData()
        );
        this.refreshTable();
        this.mostrarNotificacion(
          'snackbar-success',
          '¡¡Se agregó un nuevo registro!!',
          'bottom',
          'center'
        );
      }
    });
  }

  editarLlamadaIngreso(row: Ingreso) {
    console.log("row");
    console.log(row);
    this.idIngreso = (+row.id_ingreso);
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogIngresoComponent, {
      data: {
        ingresos: row,
        action: 'edit',
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        const foundIndex = this.database?.dataChange.value.findIndex(
          (x) => (+x.id_ingreso) === this.idIngreso
        );
        // Then you update that record using data from dialogData (values you enetered)
        if (foundIndex != null && this.database) {
          this.database.dataChange.value[foundIndex] =
            this.ingresoService.getDialogData();
          // And lastly refresh table
          this.refreshTable();
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

  quitarItemIngresos(row: Ingreso) {
    this.idIngreso = (+row.id_ingreso);
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(DeleteDialogIngresoComponent, {
      data: row,
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        const foundIndex = this.database?.dataChange.value.findIndex(
          (x) => (+x.id_ingreso) === this.idIngreso
        );
        // Para borrar utilizamos splice, esto para eliminar un único objeto de DataService
        if (foundIndex != null && this.database) {
          this.database.dataChange.value.splice(foundIndex, 1);
          this.refreshTable();
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


  private refreshTable() {
    this.paginator?._changePageSize(this.paginator?.pageSize);
  }

  estanTodosIngresosSeleccionados() {
    const numSelected = this.seleccion.selected.length;
    const numRows = this.fuenteData.renderedData.length;
    return numSelected === numRows;
  }

  palancaMaestraIngresos() {
    this.estanTodosIngresosSeleccionados()
      ? this.seleccion.clear()
      : this.fuenteData.renderedData.forEach((row) =>
        this.seleccion.select(row)
      );
  }

  eliminarFilasIngresoSeleccionadas() {
    const totalSelect = this.seleccion.selected.length;
    this.seleccion.selected.forEach((item) => {
      const index: number = this.fuenteData.renderedData.findIndex(
        (d) => d === item
      );
      this.database?.dataChange.value.splice(index, 1);

      this.refreshTable();
      this.seleccion = new SelectionModel<Ingreso>(true, []);
    });
    this.mostrarNotificacion(
      'snackbar-danger',
      totalSelect + ' Registros eliminados satisfactoriamente...!!!',
      'bottom',
      'center'
    );
  }

  public cargarInformacionIngresos() {
    this.database = new IngresoService(this.httpClient);
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

  exportarIngresosExcel() {
    // key name with space add in brackets
    const exportData: Partial<TableElement>[] =
      this.fuenteData.filteredData.map((x) => ({
        Id: x.id_ingreso,
        Concepto: x.concepto,
        MedioPago: x.medio_de_pago,
        MontoIngreso: x.monto_ingreso,
        TipoPago: x.tipo_de_pago,
        // 'Joining Date': formatDate(new Date(x.date), 'yyyy-MM-dd', 'en') || '', // en caso de que se requiera hacer ajustes al exportar a excel
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

export class FuenteDatos extends DataSource<Ingreso> {
  filterChange = new BehaviorSubject('');
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: Ingreso[] = [];
  renderedData: Ingreso[] = [];
  constructor(
    public exampleDatabase: IngresoService,
    public paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    // Volver a la primera página cuando el usuario selecciona un filtro
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }
  /** Función de conexión llamada por la tabla para recuperar un flujo que contenga los datos a renderizar. */
  connect(): Observable<Ingreso[]> {
    // Escucha a algún cambio en la fuente de datos en caso de que se requieran usar filtros u ordenar
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    this.exampleDatabase.getAllIngresos();
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Informacion filtrada
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((ingresos: Ingreso) => {
            const searchStr = (
              ingresos.id_ingreso +
              ingresos.concepto +
              ingresos.fecha_ingreso +
              ingresos.medio_de_pago +
              ingresos.monto_ingreso +
              ingresos.tipo_de_pago
            ).toLowerCase();
            return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
          });
        // Ordenar datos filtrados
        const sortedData = this.sortData(this.filteredData.slice());
        // Toma la porción de los datos filtrados y ordenados de la página.
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
  /* Devuelve una copia ordenada de los datos de database. */
  sortData(data: Ingreso[]): Ingreso[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';
      switch (this._sort.active) {
        case 'id':
          [propertyA, propertyB] = [a.id_ingreso, b.id_ingreso];
          break;
        case 'concepto':
          [propertyA, propertyB] = [a.concepto, b.concepto];
          break;
        case 'medio':
          [propertyA, propertyB] = [a.medio_de_pago, b.medio_de_pago];
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
