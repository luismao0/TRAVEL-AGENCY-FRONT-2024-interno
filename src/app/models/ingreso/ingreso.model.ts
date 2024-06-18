export class Ingreso{
  id_ingreso:    string;
  concepto:      string;
  monto_ingreso: number;
  medio_de_pago: string;
  fecha_ingreso: Date;
  cajaSesion:    CajaSesion;
  estado:        number;
  tipo_de_pago:  string;

  constructor(appointment : Ingreso){
    this.id_ingreso = appointment.id_ingreso;
    this.concepto = appointment.concepto;
    this.monto_ingreso = appointment.monto_ingreso;
    this.medio_de_pago = appointment.medio_de_pago;
    this.fecha_ingreso = appointment.fecha_ingreso;
    this.cajaSesion = appointment.cajaSesion;
    this.estado = appointment.estado;
    this.tipo_de_pago = appointment.tipo_de_pago;
  }
}
export interface CajaSesion {
  id_caja_sesion:     number;
  nombre_caja_sesion: string;
  monto_apertura:     number;
  fecha_apertura:     Date;
  fecha_cierre:       Date;
  descripcion:        string;
  caja:               Caja;
  estado:             number;
  moneda:             Moneda;
}

export interface Caja {
  id_caja:        number;
  nombre:         string;
  estado:         number;
  fecha_creacion: Date;
  monto_inicial:  number;
}

export interface Moneda {
  id_moneda:    number;
  nombre:       string;
  simbolo:      string;
  es_principal: boolean;
  estado:       number;
}
