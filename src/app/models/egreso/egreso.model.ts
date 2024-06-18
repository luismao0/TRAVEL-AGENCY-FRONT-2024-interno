export class Egreso{
  id_egreso:       number;
  concepto:        string;
  monto_egreso:    number;
  medio_de_egreso: string;
  fecha_egreso:    Date;
  // cajaSesion:      CajaSesion;
  estado:          number;

  constructor(appointment : Egreso){
    this.id_egreso = appointment.id_egreso;
    this.concepto = appointment.concepto;
    this.monto_egreso = appointment.monto_egreso;
    this.medio_de_egreso = appointment.medio_de_egreso;
    this.fecha_egreso = appointment.fecha_egreso;
    // this.cajaSesion = appointment.cajaSesion;
    this.estado = appointment.estado;
  }
}
