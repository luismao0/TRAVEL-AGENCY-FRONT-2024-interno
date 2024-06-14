import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { Ingreso } from 'app/models/ingreso/ingreso.model';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class IngresoService extends UnsubscribeOnDestroyAdapter{

  private readonly API_URL = 'assets/data/ingresos.json';
  isTblLoading = true;
  dataChange: BehaviorSubject<Ingreso[]> = new BehaviorSubject<Ingreso[]>([]);
  dialogData!: Ingreso;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): Ingreso[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  deleteIngresos(id: number): void {
    console.log(id);

    // this.httpClient.delete(this.API_URL + id)
    //     .subscribe({
    //       next: (data) => {
    //         console.log(id);
    //       },
    //       error: (error: HttpErrorResponse) => {
    //          // error code here
    //       },
    //     });
  }
  addIngreso(ingreso: Ingreso): void {
    this.dialogData = ingreso;

    // this.httpClient.post(this.API_URL, doctors)
    //   .subscribe({
    //     next: (data) => {
    //       this.dialogData = doctors;
    //     },
    //     error: (error: HttpErrorResponse) => {
    //        // error code here
    //     },
    //   });
  }
  /** METODOS CRUD */
  getAllDoctorss(): void {
    this.subs.sink = this.httpClient.get<Ingreso[]>(this.API_URL).subscribe({
      next: (data) => {
        this.isTblLoading = false;
        this.dataChange.next(data);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        console.log(error.name + ' ' + error.message);
      },
    });
  }
}
