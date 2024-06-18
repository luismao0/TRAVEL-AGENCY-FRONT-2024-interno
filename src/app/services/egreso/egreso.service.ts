import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { Egreso } from 'app/models/egreso/egreso.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EgresoService extends UnsubscribeOnDestroyAdapter{

  private readonly API_URL = 'assets/data/egresos.json';
  isTblLoading = true;
  dataChange: BehaviorSubject<Egreso[]> = new BehaviorSubject<Egreso[]>([]);
  dialogData!: Egreso;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): Egreso[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  deleteEgresos(id: number): void {
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
  addEgreso(egreso: Egreso): void {
    this.dialogData = egreso;

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
    this.subs.sink = this.httpClient.get<Egreso[]>(this.API_URL).subscribe({
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
