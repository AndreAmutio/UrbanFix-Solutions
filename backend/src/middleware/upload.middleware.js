import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

// Configuración para IMÁGENES DE PERFIL (usuarios)
const userStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'urbanfix/users',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

// Configuración para IMÁGENES DE SOLICITUDES (servicios)
const requestStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'urbanfix/solicitudes',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

// Middlewares específicos
export const uploadUserImage = multer({ storage: userStorage });
export const uploadRequestImage = multer({ storage: requestStorage });
