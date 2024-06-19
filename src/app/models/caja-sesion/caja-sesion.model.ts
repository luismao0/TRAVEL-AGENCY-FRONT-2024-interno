export class CajaSesion{
    id_caja_sesion:    string;
    nombre_caja_sesion:      string;
    monto_apertura: number;
    fecha_apertura: Date;
    fecha_cierre: Date;
    descripcion:    string;
    caja:        Caja;
    estado:  number;
    moneda:  Moneda;
  
    constructor(appointment : CajaSesion){
      this. id_caja_sesion = appointment. id_caja_sesion;
      this.nombre_caja_sesion = appointment.nombre_caja_sesion;
      this.monto_apertura = appointment.monto_apertura;
      this.fecha_apertura = appointment.fecha_apertura;
      this.fecha_cierre = appointment.fecha_cierre;
      this. descripcion = appointment. descripcion;
      this.caja = appointment.caja;
      this.estado = appointment.estado;
      this. moneda = appointment. moneda;
    }
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
  