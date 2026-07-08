// src/app/mock-data.ts
export const PUBLICACIONES_MOCK = [
  {
    _id: '1',
    titulo: 'Mi primera publicación de prueba',
    mensaje: 'Este es un mensaje de prueba para ver el diseño CSS.',
    autor: 'Alan Mischuk',
    fotoAutor: 'https://via.placeholder.com/150',
    fechaCreado: new Date(),
    likes: [],
    imagenUrl: 'https://via.placeholder.com/600x300'
  },
  {
    _id: '2',
    titulo: 'Probando estilos de Angular',
    mensaje: 'Todo funciona sin necesidad de levantar el backend.',
    autor: 'Aldana Bogado',
    fotoAutor: 'https://via.placeholder.com/150',
    fechaCreado: new Date(),
    likes: ['user123'],
    imagenUrl: ''
  }
];