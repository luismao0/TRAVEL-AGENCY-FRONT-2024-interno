import { Page404Component } from "../../authentication/page404/page404.component";
import { Route } from "@angular/router";
import { IngresoComponent } from "./ingresos/ingresos.component";
import { CajaComponent } from "./caja/caja.component";
import { EgresosComponent } from "./egresos/egresos.component";
export const CAJAS_ROUTE: Route[] = [
  {
    path: "",
    redirectTo: "main",
    pathMatch: "full",
  },
  {
    path: "ingresos",
    component: IngresoComponent,
  },
  {
    path: "caja",
    component: CajaComponent,
  },
  {
    path: "egresos",
    component: EgresosComponent
  },
  { path: "**", component: Page404Component },
];
