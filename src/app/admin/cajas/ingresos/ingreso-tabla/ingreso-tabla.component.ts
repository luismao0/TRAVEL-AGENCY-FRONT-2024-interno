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

  // displayedColumns = [
  //   'select',
  //   'concepto',
  //   'monto',
  //   'medio',
  //   'fecha',
  //   'tipo',
  //   'actions',
  // ];

  columnasMostradas = [
    'id',
    'select',
    'concepto',
    'monto',
    'medio',
    'fecha',
    'tipo',
    'actions',
  ]

  ids?: number;                                        // Falta refactorizar
  indexs?: number;                                     // Falta refactorizar
  selections = new SelectionModel<Ingreso>(true, []);  // Falta refactorizar
  dataSources!: ExampleDataSources;                     // Falta refactorizar
  database?: IngresoService;
  // ingreso?: Ingreso;                                    // Falta refactorizar
  ingresos: Ingreso[] = [];


  mode_ingreso = new UntypedFormControl('side');                      // Falta refactorizar
  ingresoForm!: UntypedFormGroup;

  showFiller = false;
  isNewEvent = false;
  dialogTitle?: string;
  userImg?: string;

  mediosPago?: string[];
  constructor(private fb: UntypedFormBuilder, private httpClient: HttpClient,
    public dialog: MatDialog,

    public ingresoService: IngresoService,

    private snackBar: MatSnackBar
  ) {
    super();

    const blank = {} as Ingreso;
    this.ingresoForm = this.createFormGroupI(blank);

    this.fetchI((data: Ingreso[]) => {
      this.ingresos = data;
    });
  }


  fetchI(cb: (i: Ingreso[]) => void) {
    const req = new XMLHttpRequest();
    req.open('GET', 'assets/data/ingresos.json');
    req.onload = () => {
      const data = JSON.parse(req.response);
      cb(data);
    };
    req.send();
  }

  dropIngreso(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.ingresos, event.previousIndex, event.currentIndex);
  }

  toggle(task: { done: boolean }, nav: MatSidenav) {
    nav.close();
    task.done = !task.done;
  }

  addNewIngreso(nav: MatSidenav) {
    this.resetFormFieldIngreso();
    this.isNewEvent = true;
    this.dialogTitle = 'Nuevo Ingreso';
    nav.open();
  }

  ingresoClick(ingreso: Ingreso, nav: MatSidenav): void {
    this.isNewEvent = false;
    this.dialogTitle = 'Editar Ingreso';
    nav.open();
    this.ingresoForm = this.createFormGroupI(ingreso);
  }

  closeSlider(nav: MatSidenav) {
    nav.close();
  }

  createFormGroupI(data: Ingreso) { // Se debe verificar si se envian datos nulos
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

  saveIngreso() {
    this.database?.dataChange.value.unshift(
      this.ingresoForm.value
    );
    console.log(this.database);
    console.log(this.ingresoForm.value);
    this.refreshTable();
    this.showNotification(
      'snackbar-success',
      '¡¡Registro agregado correctamente!!',
      'bottom',
      'center'
    );
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
      this.showNotification(
        'black',
        '¡¡Se editó el registro correctamente!!',
        'bottom',
        'center'
      );
    }
  }
  editCallIs(row: Ingreso) {
    this.ids = (+row.id_ingreso);
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
        // En primer lugar encontramos el registro dentro de DataService por id
        const foundIndex = this.database?.dataChange.value.findIndex(
          (x) => (+x.id_ingreso) === this.ids
        );
        // Actualizar el registro utilizando los datos de dialogData (valores que ha introducido)
        if (foundIndex != null && this.database) {
          this.database.dataChange.value[foundIndex] =
            this.ingresoService.getDialogData();
          // Actualizar la tabla
          this.refreshTable();
          this.showNotification(
            'black',
            'Edit Record Successfully...!!!',
            'bottom',
            'center'
          );
        }
      }
    });
  }

  deleteIngreso(nav: MatSidenav) {
    const targetIdx = this.ingresos
      .map((item) => item.id_ingreso)
      .indexOf(this.ingresoForm.value.id);
    this.ingresos.splice(targetIdx, 1);
    nav.close();
  }

  resetFormFieldIngreso() {
    this.ingresoForm.controls['id'].reset();
    this.ingresoForm.controls['concepto'].reset();
    this.ingresoForm.controls['monto_ingreso'].reset();
    this.ingresoForm.controls['tipo_de_pago'].reset();
    this.ingresoForm.controls['fecha_ingreso'].reset();
    this.ingresoForm.controls['medio_de_pago'].reset();
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
    // this.mediosPago = Object.keys(MedioPagoEnum).map(key => MedioPagoEnum[(+key)]);
    this.loadDataI();
  }


  refresh() {
    // this.loadData();
    this.loadDataI();
  }

  addNewI() {
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
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataServicex
        this.database?.dataChange.value.unshift(
          this.ingresoService.getDialogData()
        );
        this.refreshTable();
        this.showNotification(
          'snackbar-success',
          'Add Record Successfully...!!!',
          'bottom',
          'center'
        );
      }
    });
  }

  editCallI(row: Ingreso) {
    console.log("row");
    console.log(row);
    this.ids = (+row.id_ingreso);
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
          (x) => (+x.id_ingreso) === this.ids
        );
        // Then you update that record using data from dialogData (values you enetered)
        if (foundIndex != null && this.database) {
          this.database.dataChange.value[foundIndex] =
            this.ingresoService.getDialogData();
          // And lastly refresh table
          this.refreshTable();
          this.showNotification(
            'black',
            '¡¡Registro editado correctamente!!',
            'bottom',
            'center'
          );
        }
      }
    });
  }

  deleteItemI(row: Ingreso) {
    this.ids = (+row.id_ingreso);
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
          (x) => (+x.id_ingreso) === this.ids
        );
        // for delete we use splice in order to remove single object from DataService
        if (foundIndex != null && this.database) {
          this.database.dataChange.value.splice(foundIndex, 1);
          this.refreshTable();
          this.showNotification(
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
    const numRows = this.dataSources.renderedData.length;
    return numSelected === numRows;
  }

  masterToggleI() {
    this.isAllSelectedI()
      ? this.selections.clear()
      : this.dataSources.renderedData.forEach((row) =>
        this.selections.select(row)
      );
  }

  removeSelectedRowsI() {
    const totalSelect = this.selections.selected.length;
    this.selections.selected.forEach((item) => {
      const index: number = this.dataSources.renderedData.findIndex(
        (d) => d === item
      );
      // console.log(this.dataSource.renderedData.findIndex((d) => d === item));
      this.database?.dataChange.value.splice(index, 1);

      this.refreshTable();
      this.selections = new SelectionModel<Ingreso>(true, []);
    });
    this.showNotification(
      'snackbar-danger',
      totalSelect + ' Registros eliminados satisfactoriamente...!!!',
      'bottom',
      'center'
    );
  }

  public loadDataI() {
    this.database = new IngresoService(this.httpClient);
    // console.log(this.database);
    this.dataSources = new ExampleDataSources(
      this.database,
      this.paginator,
      this.sort
    );
    this.subs.sink = fromEvent(this.filter?.nativeElement, 'keyup').subscribe(
      () => {
        if (!this.dataSources) {
          return;
        }
        this.dataSources.filter = this.filter?.nativeElement.value;
      }
    );
  }

  exportExcelI() {
    // key name with space add in brackets
    const exportData: Partial<TableElement>[] =
      this.dataSources.filteredData.map((x) => ({
        Id: x.id_ingreso,
        Concepto: x.concepto,
        // FechaIngreso: x.fecha_ingreso,
        MedioPago: x.medio_de_pago,
        MontoIngreso: x.monto_ingreso,
        TipoPago: x.tipo_de_pago,
        // 'Joining Date': formatDate(new Date(x.date), 'yyyy-MM-dd', 'en') || '',
      }));
    TableExportUtil.exportToExcel(exportData, 'excel');
  }

  showNotification(
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

export class ExampleDataSources extends DataSource<Ingreso> {
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
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Ingreso[]> {
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
