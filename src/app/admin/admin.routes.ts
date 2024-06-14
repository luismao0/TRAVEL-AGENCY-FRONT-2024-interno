import { Route } from '@angular/router';

export const ADMIN_ROUTE: Route[] = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTE),
  },
  {
    path: 'cajas',
    loadChildren: () =>
      import('./cajas/cajas.routes').then((m) => m.CAJAS_ROUTE),
  },
];
