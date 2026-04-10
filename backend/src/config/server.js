const express = require('express');
const cors = require('cors');
const conectarDB = require('./db');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        //Prefijos para las rutas
        this.paths = {
            categorias: '/api/categorias',
            productos: '/api/productos',
            inventario: '/api/inventario',
            ventas: '/api/ventas',
            usuarios: '/api/usuarios',
            movimientos: '/api/movimientos',
        };

        this.conectarDB();
        this.middlewares();
        this.routes();
    }

    async conectarDB() {
        await conectarDB();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
    }

    routes() {
        this.app.get('/api', (req, res) => {
            res.json({ ok: true, mensaje: 'BakePOS API corriendo' });
        });

        this.app.use(this.paths.categorias, require('../routes/categoria.routes'));
        this.app.use(this.paths.productos, require('../routes/productos.routes'));
        this.app.use(this.paths.inventario, require('../routes/inventario.routes'));
        this.app.use(this.paths.movimientos, require('../routes/movimientos.routes'));
        this.app.use(this.paths.ventas, require('../routes/venta.routes'));
    }


    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor levantado en el puerto ${this.port}`);
        });
    }
}

module.exports = Server;