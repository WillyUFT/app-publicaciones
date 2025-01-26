import { Routes } from '@angular/router';

export const routes: Routes = [

  // * --------------------- Ver Lista De Publicaciones -------------------- */
  {
    path: 'lista-publicaciones',
    loadComponent: () => import('./pages/lista-publicaciones/lista-publicaciones.page').then((m) => m.ListaPublicaciones),
  },

  // * ------------------------- Crear Publicación ------------------------- */
  {
    path: 'crear-publicaciones',
    loadComponent: () => import('./pages/crear-publicaciones/crear-publicaciones.page').then((m) => m.CrearPublicaciones),
  },
  {
    path: '',
    redirectTo: 'lista-publicaciones',
    pathMatch: 'full',
  },
];
