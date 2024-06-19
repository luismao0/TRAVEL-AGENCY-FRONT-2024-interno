
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { CajaSesion } from '../../models/caja-sesion/caja-sesion.model';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CajaSesionService extends UnsubscribeOnDestroyAdapter{

  private readonly API_URL = 'assets/data/cajaSesion.json';
  isTblLoading = true;
  dataChange: BehaviorSubject<CajaSesion[]> = new BehaviorSubject<CajaSesion[]>([]);
  dialogData!: CajaSesion;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): CajaSesion[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  deleteCajaSesion(id: number): void {
    console.log(id);
  }
  addCajaSesion(cajaSesion: CajaSesion): void {
    this.dialogData = cajaSesion;

  }
  /** METODOS CRUD */
  getAllDoctorss(): void {
    this.subs.sink = this.httpClient.get<CajaSesion[]>(this.API_URL).subscribe({
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
