
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDragPlaceholder, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { DatePipe, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { NgScrollbar } from 'ngx-scrollbar';
import { Direction } from '@angular/cdk/bidi';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

import { UnsubscribeOnDestroyAdapter } from '@shared';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, fromEvent, map, merge } from 'rxjs';
import { CajaSesion } from '../../../../models/caja-sesion/caja-sesion.model';
import { CajaSesionService } from '../../../../services/caja-sesion/caja-sesion.service';
import { DeleteDialogCajaSesionComponent } from '../dialog/delete-dialog-caja-sesion/delete-dialog-caja-sesion.component';
import { FormDialogCajaSesionComponent } from '../dialog/form-dialog-caja-sesion/form-dialog-caja-sesion.component';
import { MatRadioModule } from '@angular/material/radio';


@Component({
  selector: 'app-caja-sesion-tabla',
  standalone: true,
  templateUrl: './caja-sesion-tabla.component.html',
  styleUrl: './caja-sesion-tabla.component.scss',
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
    MatRadioModule
  ]
})
export class CajaSesionTablaComponent extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  // columans de la tabla caja sesion
  columnasMostradas = [
    'id',
    'select',
    'nombre',
    'monto',
    'fecha',
    'descripcion',
    'moneda',
    'actions'
  ]

  ids?: number;                                        // Falta refactorizar
  indexs?: number;                                     // Falta refactorizar
  selections = new SelectionModel<CajaSesion>(true, []);  // Falta refactorizar
  fuenteData!: FuenteDatos;                     // Falta refactorizar
  database?: CajaSesionService;                                 // Falta refactorizar
  cajaSesion: CajaSesion[] = [];
  mode_ingreso = new UntypedFormControl('side');                      // Falta refactorizar
  cajaSesionForm!: UntypedFormGroup;
  showFiller = false;
  isNewEvent = false;
  dialogTitle?: string;
  userImg?: string;
  mediosPago?: string[];

  constructor(private fb: UntypedFormBuilder, private httpClient: HttpClient,
    public dialog: MatDialog,
    public cajaSesionService: CajaSesionService,
    private snackBar: MatSnackBar
  ) {
    super();
    const blank = {} as CajaSesion;
    this.cajaSesionForm = this.crearFormGroupCajaSesion(blank);
    this.fetchCajaSesion((data: CajaSesion[]) => {
      this.cajaSesion = data;
    });
  }

  // actualiza los cambios mas recientes
  fetchCajaSesion(cb: (i: CajaSesion[]) => void) {
    const req = new XMLHttpRequest();
    req.open('GET', 'assets/data/cajaSesion.json');
    req.onload = () => {
      const data = JSON.parse(req.response);
      cb(data);
    };
    req.send();
  }
  // funcion para eliminar la caja sesion
  eliminarRegistroCajaSesion(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.cajaSesion, event.previousIndex, event.currentIndex);
  }

  toggle(task: { done: boolean }, nav: MatSidenav) {
    nav.close();
    task.done = !task.done;
  }

  // añade un nuevo registro para la caja sesion
  añadirCajaSesion(nav: MatSidenav) {
    this.resetFormFieldCajaSesion();
    this.isNewEvent = true;
    this.dialogTitle = 'Nuevo Ingreso';
    nav.open();
  }

  // Muestra sidebar cuando sucede evento click sobre un Ingreso
  cajaSesionClick(cajaSesion: CajaSesion, nav: MatSidenav): void {
    this.isNewEvent = false;
    this.dialogTitle = 'Editar Ingreso';
    nav.open();
    this.cajaSesionForm = this.crearFormGroupCajaSesion(cajaSesion);
  }

  cerrarSlider(nav: MatSidenav) {
    nav.close();
  }

  crearFormGroupCajaSesion(data: CajaSesion) { // Se debe verificar si se envian datos nulos
    return this.fb.group({
      id_caja_sesion: [data ? data.id_caja_sesion : null],
      nombre_caja_sesion: [data ? data.nombre_caja_sesion : null],
      monto_apertura: [data ? data.monto_apertura : null],
      fecha_apertura: [data ? data.fecha_apertura : null],
      fecha_cierre: [data ? data.fecha_cierre : null],
      // estado: [data ? 1:1],
      descripcion: [data ? data.descripcion : null],
      moneda: [data ? data.moneda : null],
    });
  }
  // Guarda la caja sesion (Usando Sidebar)
  guardarCajaSesion() {
    this.database?.dataChange.value.unshift(
      this.cajaSesionForm.value
    );
    console.log(this.database);
    console.log(this.cajaSesionForm.value);
    this.refreshTable();
    this.mostrarNotification(
      'snackbar-success',
      '¡¡Registro agregado correctamente!!',
      'bottom',
      'center'
    );
  }

  editarCajaSesion() {
    const targetIdx = this.cajaSesion
      .map((item) => item.id_caja_sesion)
      .indexOf(this.cajaSesionForm.value.id);
    if (targetIdx != null && this.database) {
      this.database.dataChange.value[targetIdx] =
        this.cajaSesionForm.value;
      // Actualizar la tabla
      this.refreshTable();
      this.mostrarNotification(
        'black',
        '¡¡Se editó el registro correctamente!!',
        'bottom',
        'center'
      );
    }
  }
  editCallIs(row: CajaSesion) {
    this.ids = (+row.id_caja_sesion);
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogCajaSesionComponent, {
      data: {
        ingresos: row,
        action: 'edit',
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // En primer lugar encontramos el registro dentro de DataService por id
        const foundIndex = this.database?.dataChange.value.findIndex(
          (x) => (+x.id_caja_sesion) === this.ids
        );
        // Actualizar el registro utilizando los datos de dialogData (valores que ha introducido)
        if (foundIndex != null && this.database) {
          this.database.dataChange.value[foundIndex] =
            this.cajaSesionService.getDialogData();
          // Actualizar la tabla
          this.refreshTable();
          this.mostrarNotification(
            'black',
            'Edit Record Successfully...!!!',
            'bottom',
            'center'
          );
        }
      }
    });
  }

  eliminarCajaSesion(nav: MatSidenav) {
    const targetIdx = this.cajaSesion
      .map((item) => item.id_caja_sesion)
      .indexOf(this.cajaSesionForm.value.id);
    this.cajaSesion.splice(targetIdx, 1);
    nav.close();
  }

  resetFormFieldCajaSesion() {
    this.cajaSesionForm.controls['id_caja_sesion'].reset();
    this.cajaSesionForm.controls['nombre_caja_sesion'].reset();
    this.cajaSesionForm.controls['monto_apertura'].reset();
    this.cajaSesionForm.controls['fecha_apertura'].reset();
    this.cajaSesionForm.controls['fecha_cierre'].reset();
    this.cajaSesionForm.controls['descripcion'].reset();
  }

  public getRandomID(): string {
    const S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4();
  }


  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  @ViewChild('filter', { static: true }) filter?: ElementRef;

  ngOnInit() {
    // this.loadData();
    //this.mediosPago = Object.keys(MedioPagoEnum).map(key => MedioPagoEnum[(+key)]);
    this.cargaInformacionCajaSesion();
  }


  refresh() {
    // this.loadData();
    this.cargaInformacionCajaSesion();
  }
  addNewI() {
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

  editCallI(row: CajaSesion) {
    console.log("row");
    console.log(row);
    this.ids = (+row.id_caja_sesion);
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogCajaSesionComponent, {
      data: {
        cajaSesion: row,
        action: 'edit',
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        const foundIndex = this.database?.dataChange.value.findIndex(
          (x) => (+x.id_caja_sesion) === this.ids
        );
        // Then you update that record using data from dialogData (values you enetered)
        if (foundIndex != null && this.database) {
          this.database.dataChange.value[foundIndex] =
            this.cajaSesionService.getDialogData();
          // And lastly refresh table
          this.refreshTable();
          this.mostrarNotification(
            'black',
            '¡¡Registro editado correctamente!!',
            'bottom',
            'center'
          );
        }
      }
    });
  }

  deleteItemI(row: CajaSesion) {
    this.ids = (+row.id_caja_sesion);
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(DeleteDialogCajaSesionComponent, {
      data: row,
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        const foundIndex = this.database?.dataChange.value.findIndex(
          (x) => (+x.id_caja_sesion) === this.ids
        );
        // for delete we use splice in order to remove single object from DataService
        if (foundIndex != null && this.database) {
          this.database.dataChange.value.splice(foundIndex, 1);
          this.refreshTable();
          this.mostrarNotification(
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

  isAllSelectedI() {
    const numSelected = this.selections.selected.length;
    const numRows = this.fuenteData.renderedData.length;
    return numSelected === numRows;
  }

  masterToggleI() {
    this.isAllSelectedI()
      ? this.selections.clear()
      : this.fuenteData.renderedData.forEach((row) =>
        this.selections.select(row)
      );
  }

  removeSelectedRowsI() {
    const totalSelect = this.selections.selected.length;
    this.selections.selected.forEach((item) => {
      const index: number = this.fuenteData.renderedData.findIndex(
        (d) => d === item
      );
      // console.log(this.dataSource.renderedData.findIndex((d) => d === item));
      this.database?.dataChange.value.splice(index, 1);

      this.refreshTable();
      this.selections = new SelectionModel<CajaSesion>(true, []);
    });
    this.mostrarNotification(
      'snackbar-danger',
      totalSelect + ' Registros eliminados satisfactoriamente...!!!',
      'bottom',
      'center'
    );
  }

  public cargaInformacionCajaSesion() {
    this.database = new CajaSesionService(this.httpClient);
    // console.log(this.database);
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

  // exportExcelI() {
  //   // key name with space add in brackets
  //   const exportData: Partial<TableElement>[] =
  //     this.fuenteData.filteredData.map((x) => ({
  //       Id: x.id_caja_sesion,
  //       Concepto: x.,
  //       // FechaIngreso: x.fecha_ingreso,
  //       MedioPago: x.medio_de_pago,
  //       MontoIngreso: x.monto_ingreso,
  //       TipoPago: x.tipo_de_pago,
  //       // 'Joining Date': formatDate(new Date(x.date), 'yyyy-MM-dd', 'en') || '',
  //     }));
  //   TableExportUtil.exportToExcel(exportData, 'excel');
  // }

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


export class FuenteDatos extends DataSource<CajaSesion> {
  filterChange = new BehaviorSubject('');
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: CajaSesion[] = [];
  renderedData: CajaSesion[] = [];
  constructor(
    public exampleDatabase: CajaSesionService,
    public paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    // Volver a la primera página cuando el usuario selecciona un filtro
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<CajaSesion[]> {
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
          .filter((cajaSesion: CajaSesion) => {
            const searchStr = (
              cajaSesion.id_caja_sesion +
              cajaSesion.nombre_caja_sesion +
              cajaSesion.fecha_apertura +
              cajaSesion.fecha_cierre +
              cajaSesion.descripcion +
              cajaSesion.moneda
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
  sortData(data: CajaSesion[]): CajaSesion[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';
      switch (this._sort.active) {
        case 'id_caja_sesion':
          [propertyA, propertyB] = [a.id_caja_sesion, b.id_caja_sesion];
          break;
        case 'nombre_caja_sesion':
          [propertyA, propertyB] = [a.nombre_caja_sesion, b.nombre_caja_sesion];
          break;
        case 'monto_apertura':
          [propertyA, propertyB] = [a.monto_apertura, b.monto_apertura];
          break;
        // case 'time':
        //   [propertyA, propertyB] = [a.monto_ingreso, b.monto_ingreso];
        //   break;
        // case 'mobile':
        //   [propertyA, propertyB] = [a.mobile, b.mobile];
        //   break;
      }
      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
      return (
        (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1)
      );
    });
  }
}
