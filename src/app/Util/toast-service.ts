import { ToastController } from '@ionic/angular';

// Variable para almacenar el ToastController
let toastControllerInstance: ToastController | null = null;

// Inicializar el ToastController (se llama desde el AppModule o cualquier lugar donde se configure)
export function setToastController(controller: ToastController) {
  toastControllerInstance = controller;
}

// Función para mostrar el toast
export async function mostrarToast(mensaje: string, color: string) {
  if (!toastControllerInstance) {
    throw new Error('ToastController no está inicializado. Llama a setToastController primero.');
  }

  const toast = await toastControllerInstance.create({
    message: mensaje,
    duration: 2000,
    color: color,
  });
  await toast.present();
}
