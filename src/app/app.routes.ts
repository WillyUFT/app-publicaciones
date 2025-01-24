import { Routes } from '@angular/router';

export const routes: Routes = [

  // * ~~~~~~~~~~~~~~~~~~~~~~~~~ Ver Publicaciones ~~~~~~~~~~~~~~~~~~~~~~~~~ */
  {
    path: 'ver-publicaciones',
    loadComponent: () => import('./ver-publicaciones/ver-publicaciones.page').then((m) => m.VerPublicaciones),
  },
  // * ~~~~~~~~~~~~~~~~~~~~~~~~ Crear Publicaciones ~~~~~~~~~~~~~~~~~~~~~~~~ */
  {
    path: 'crear-publicaciones',
    loadComponent: () => import('./crear-publicaciones/crear-publicaciones.page').then((m) => m.CrearPublicaciones),
  },
  {
    path: '',
    redirectTo: 'ver-publicaciones',
    pathMatch: 'full',
  },
];
