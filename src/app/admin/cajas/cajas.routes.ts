import { Page404Component } from "../../authentication/page404/page404.component";
import { Route } from "@angular/router";
import { IngresoComponent } from "./ingresos/ingresos.component";
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
  { path: "**", component: Page404Component },
];
