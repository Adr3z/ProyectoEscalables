import { Categoria, Producto, Usuario, Movimiento, Inventario } from '../../models';

// ── Categorías principales ────────────────────────────────────────────────────
export const CATEGORIAS_PRINCIPALES: Categoria[] = [
    { _id: 'c1', nombre: 'Pasteles'  },
    { _id: 'c2', nombre: 'Pays'      },
    { _id: 'c3', nombre: 'Galletas'  },
    { _id: 'c4', nombre: 'Gelatinas' },
];

// ── Subcategorías de Pasteles ─────────────────────────────────────────────────
export const SUBCATEGORIAS_PASTELES: Categoria[] = [
    { _id: 's1', nombre: '3 Leches',    padreId: 'c1', padre: { _id: 'c1', nombre: 'Pasteles' } },
    { _id: 's2', nombre: 'Caseros',     padreId: 'c1', padre: { _id: 'c1', nombre: 'Pasteles' } },
    { _id: 's3', nombre: 'Chocolate',   padreId: 'c1', padre: { _id: 'c1', nombre: 'Pasteles' } },
    { _id: 's4', nombre: 'Chicos',      padreId: 'c1', padre: { _id: 'c1', nombre: 'Pasteles' } },
    { _id: 's5', nombre: 'Individuales',padreId: 'c1', padre: { _id: 'c1', nombre: 'Pasteles' } },
];

// ── Todas las categorías ──────────────────────────────────────────────────────
export const TODAS_CATEGORIAS: Categoria[] = [
    ...CATEGORIAS_PRINCIPALES,
    ...SUBCATEGORIAS_PASTELES,
];

// ── Productos mock ────────────────────────────────────────────────────────────
export const PRODUCTOS_MOCK: Producto[] = [
    { _id: 'p1',  nombre: 'Pastel 3 Leches Clásico',    descripcion: 'Esponjoso bizcocho bañado en tres leches con crema chantilly.',  precio: 28.00, categoriaId: 's1', categoria: { _id: 's1', nombre: '3 Leches',     padreId: 'c1' }, stockActual: 10 },
    { _id: 'p2',  nombre: 'Choco-Vanilla Twist',         descripcion: 'Combinación de chocolate oscuro y vainilla con ganache.',         precio: 32.00, categoriaId: 's3', categoria: { _id: 's3', nombre: 'Chocolate',    padreId: 'c1' }, stockActual: 6  },
    { _id: 'p3',  nombre: 'Pastel Casero de Nuez',       descripcion: 'Receta tradicional con nuez pecana y cajeta.',                   precio: 25.00, categoriaId: 's2', categoria: { _id: 's2', nombre: 'Caseros',      padreId: 'c1' }, stockActual: 4  },
    { _id: 'p4',  nombre: 'Pastel Chico de Fresa',       descripcion: 'Tamaño personal con fresas frescas y crema pastelera.',          precio: 8.00,  categoriaId: 's4', categoria: { _id: 's4', nombre: 'Chicos',       padreId: 'c1' }, stockActual: 15 },
    { _id: 'p5',  nombre: 'Individual de Zanahoria',     descripcion: 'Pastelito individual con betún de queso crema.',                 precio: 6.50,  categoriaId: 's5', categoria: { _id: 's5', nombre: 'Individuales', padreId: 'c1' }, stockActual: 20 },
    { _id: 'p6',  nombre: 'Pay de Limón',                descripcion: 'Base de galleta con relleno cremoso de limón.',                  precio: 18.00, categoriaId: 'c2', categoria: { _id: 'c2', nombre: 'Pays'                          }, stockActual: 8  },
    { _id: 'p7',  nombre: 'Pay de Manzana',              descripcion: 'Pay tradicional con manzanas caramelizadas y canela.',           precio: 20.00, categoriaId: 'c2', categoria: { _id: 'c2', nombre: 'Pays'                          }, stockActual: 5  },
    { _id: 'p8',  nombre: 'Galletas de Avena',           descripcion: 'Galletas artesanales con avena, pasas y canela.',                precio: 4.50,  categoriaId: 'c3', categoria: { _id: 'c3', nombre: 'Galletas'                      }, stockActual: 40 },
    { _id: 'p9',  nombre: 'Galletas de Chispas',         descripcion: 'Clásicas galletas con chispas de chocolate semiamargo.',        precio: 4.00,  categoriaId: 'c3', categoria: { _id: 'c3', nombre: 'Galletas'                      }, stockActual: 35 },
    { _id: 'p10', nombre: 'Gelatina de Mosaico',         descripcion: 'Colorida gelatina de leche con cubos de gelatina de sabores.',  precio: 5.00,  categoriaId: 'c4', categoria: { _id: 'c4', nombre: 'Gelatinas'                     }, stockActual: 12 },
    { _id: 'p11', nombre: 'Gelatina de Rompope',         descripcion: 'Suave gelatina cremosa con sabor a rompope.',                   precio: 5.50,  categoriaId: 'c4', categoria: { _id: 'c4', nombre: 'Gelatinas'                     }, stockActual: 0  },
];

// ── Usuarios mock ────────────────────────────────────────────────────────────
export const USUARIOS: Usuario[] = [
    { _id: 'u1', nombre: 'María García',   email: 'maria.garcia@bakepos.com',   rol: 'Administrador', fechaCreacion: new Date('2024-01-10'), activo: true  },
    { _id: 'u2', nombre: 'Carlos Ruiz',    email: 'carlos.ruiz@bakepos.com',    rol: 'Empleado',      fechaCreacion: new Date('2024-02-15'), activo: true  },
    { _id: 'u3', nombre: 'Lucía Méndez',   email: 'lucia.mendez@bakepos.com',   rol: 'Empleado',      fechaCreacion: new Date('2024-03-20'), activo: true  },
    { _id: 'u4', nombre: 'Roberto Soto',   email: 'roberto.soto@bakepos.com',   rol: 'Empleado',      fechaCreacion: new Date('2024-04-05'), activo: false },
    { _id: 'u5', nombre: 'Ana Torres',     email: 'ana.torres@bakepos.com',     rol: 'Empleado',      fechaCreacion: new Date('2024-05-12'), activo: true  },
    { _id: 'u6', nombre: 'Juan Delgado',   email: 'juan.delgado@bakepos.com',   rol: 'Administrador', fechaCreacion: new Date('2024-06-18'), activo: true  },
];

// ── Movimientos mock ─────────────────────────────────────────────────────────
export const MOVIMIENTOS_MOCK: Movimiento[] = [
    { _id: 'm1',  tipo: 'ENTRADA', productoId: 'p1',  producto: PRODUCTOS_MOCK[0],  cantidad: 10, fecha: new Date('2026-03-01T09:00:00'), usuarioId: 'u1' },
    { _id: 'm2',  tipo: 'SALIDA',  productoId: 'p1',  producto: PRODUCTOS_MOCK[0],  cantidad: 2,  fecha: new Date('2026-03-01T11:30:00'), usuarioId: 'u2' },
    { _id: 'm3',  tipo: 'ENTRADA', productoId: 'p2',  producto: PRODUCTOS_MOCK[1],  cantidad: 8,  fecha: new Date('2026-03-02T08:15:00'), usuarioId: 'u1' },
    { _id: 'm4',  tipo: 'SALIDA',  productoId: 'p3',  producto: PRODUCTOS_MOCK[2],  cantidad: 3,  fecha: new Date('2026-03-02T14:00:00'), usuarioId: 'u2' },
    { _id: 'm5',  tipo: 'ENTRADA', productoId: 'p6',  producto: PRODUCTOS_MOCK[5],  cantidad: 20, fecha: new Date('2026-03-03T09:30:00'), usuarioId: 'u1' },
    { _id: 'm6',  tipo: 'SALIDA',  productoId: 'p8',  producto: PRODUCTOS_MOCK[7],  cantidad: 5,  fecha: new Date('2026-03-03T16:00:00'), usuarioId: 'u3' },
    { _id: 'm7',  tipo: 'ENTRADA', productoId: 'p4',  producto: PRODUCTOS_MOCK[3],  cantidad: 12, fecha: new Date('2026-03-04T08:00:00'), usuarioId: 'u1' },
    { _id: 'm8',  tipo: 'SALIDA',  productoId: 'p5',  producto: PRODUCTOS_MOCK[4],  cantidad: 4,  fecha: new Date('2026-03-04T12:45:00'), usuarioId: 'u2' },
    { _id: 'm9',  tipo: 'SALIDA',  productoId: 'p9',  producto: PRODUCTOS_MOCK[8],  cantidad: 6,  fecha: new Date('2026-03-05T10:00:00'), usuarioId: 'u3' },
    { _id: 'm10', tipo: 'ENTRADA', productoId: 'p10', producto: PRODUCTOS_MOCK[9],  cantidad: 15, fecha: new Date('2026-03-05T15:30:00'), usuarioId: 'u1' },
    { _id: 'm11', tipo: 'SALIDA',  productoId: 'p7',  producto: PRODUCTOS_MOCK[6],  cantidad: 3,  fecha: new Date('2026-03-06T09:00:00'), usuarioId: 'u2' },
    { _id: 'm12', tipo: 'ENTRADA', productoId: 'p11', producto: PRODUCTOS_MOCK[10], cantidad: 10, fecha: new Date('2026-03-06T11:00:00'), usuarioId: 'u1' },
];

// ── Movimientos mock ─────────────────────────────────────────────────────────
export const INVENTARIO_MOCK: Inventario[] = PRODUCTOS_MOCK.map((p, i) => ({
    _id:                `inv-${i + 1}`,
    productoId:         p._id,
    producto:           p,
    stockMinimo:        5,
    stockMaximo:        50,
    fechaActualizacion: new Date()
}));
