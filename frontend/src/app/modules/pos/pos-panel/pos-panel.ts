import { Component, OnInit, OnDestroy, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Modal } from '../../../shared/components';
import { Carrito } from '../carrito/carrito';
import { CardPos } from '../card-pos/card-pos';
import { Producto, ItemCarrito, Categoria, Inventario, ItemValidado, EstadoItemVenta, DetalleVentaForm } from '../../../models';

//Busqueda
import { Subscription } from 'rxjs';
import { BusquedaService } from '../../../core/services/busqueda.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { ProductoService } from '../../../core/services/producto.service';
import { InventarioService } from '../../../core/services/inventario.service';
import { VentaService } from '../../../core/services/venta.service';

@Component({
    selector: 'app-pos-panel',
    standalone: true,
    imports: [CommonModule, Carrito, Modal, CardPos],
    templateUrl: './pos-panel.html',
    styleUrl: './pos-panel.css'
})

export class PosPanel implements OnInit, OnDestroy {

    productos = signal<Producto[]>([]);
    categoriasPrincipales = signal<Categoria[]>([]);
    subcategorias = signal<Categoria[]>([]);

    inventario = signal<Inventario[]>([]);
    categoriaPrincipalActivaId = signal<string | null>(null);
    subcategoriaActivaId = signal<string | null>(null);
    terminoBusqueda = signal('');
    carrito = signal<ItemCarrito[]>([]);
    modalConfirmarAbierto = signal(false);
    ventaConfirmada = signal(false);
    carritoVisible = signal(false);
    productosFiltradosSignal = signal<Producto[]>([]);

    get itemsEnCarrito() { return this.carrito().reduce((a, i) => a + i.cantidad, 0); }
    get totalCarrito() { return this.carrito().reduce((a, i) => a + i.producto.precio * i.cantidad, 0); }
    toggleCarrito() { this.carritoVisible.set(!this.carritoVisible()); }

    //Busqueda
    private sub!: Subscription;

    constructor(
        private busquedaService: BusquedaService,
        private productoService: ProductoService,
        private categoriaService: CategoriaService,
        private inventarioService: InventarioService,
        private ventaService: VentaService,
    ) {}

    private filtrosEffect = effect(() => {
        const busqueda = this.terminoBusqueda().trim().toLowerCase();
        const categoriaPrincipalId = this.categoriaPrincipalActivaId();
        const subcategoriaId = this.subcategoriaActivaId();

        let lista = this.productos().filter(p => p.stockActual > 0);

        if (subcategoriaId) {
        lista = lista.filter(p => p.categoriaId._id === subcategoriaId);
        }

        else if (categoriaPrincipalId) {
        const hijos = this.subcategorias()
            .filter(s => s.padreId === categoriaPrincipalId)
            .map(s => s._id);

        lista = lista.filter(p =>
            p.categoriaId._id === categoriaPrincipalId ||
            hijos.includes(p.categoriaId._id)
        );
        }

        if (busqueda) {
        lista = lista.filter(p => p.nombre.toLowerCase().includes(busqueda));
        }

        this.productosFiltradosSignal.set(lista);
    });

    ngOnInit(): void {
        this.sub = this.busquedaService.termino$.subscribe(t => {
        this.terminoBusqueda.set(t);
        });

        this.loadProductos();
        this.loadCategorias();
        this.loadInventario();
    }

    ngOnDestroy(): void { this.sub.unsubscribe(); }

    get productosFiltrados(): Producto[] {
        return this.productosFiltradosSignal();
    }

    get mostrarSubcategorias(): boolean {
        return !!this.categoriaPrincipalActivaId() && this.subcategorias().some(s => s.padreId === this.categoriaPrincipalActivaId());
    }

    get subcategoriasActivas(): Categoria[] {
        const categoriaId = this.categoriaPrincipalActivaId();
        if (!categoriaId) {
        return [];
        }
        return this.subcategorias().filter(s => s.padreId === categoriaId);
    }

    tieneSubcategorias(cat: Categoria): boolean {
        return this.subcategorias().some(s => s.padreId === cat._id);
    }

    private loadProductos(): void {
        this.productoService.getProductos().subscribe({
        next: productos => this.productos.set(productos),
        error: () => this.productos.set([]),
        });
    }

    private loadCategorias(): void {
        this.categoriaService.getCategorias().subscribe({
        next: categorias => {
            this.categoriasPrincipales.set(categorias.filter(c => !c.padreId));
            this.subcategorias.set(categorias.filter(c => !!c.padreId));
        },
        error: () => {
            this.categoriasPrincipales.set([]);
            this.subcategorias.set([]);
        }
        });
    }

    private loadInventario(): void {
        this.inventarioService.getInventario().subscribe({
        next: inventario => this.inventario.set(inventario),
        error: () => this.inventario.set([]),
        });
    }

    private getRegistroInventario(productoId: string): Inventario | undefined {
        return this.inventario().find(item => {
        if (item.productoId === productoId) {
            return true;
        }
        return item.producto?._id === productoId;
        });
    }

    getStockMinimo(productoId: string): number {
        return this.getRegistroInventario(productoId)?.stockMinimo ?? 0;
    }

    getEstadoItem(item: ItemCarrito): EstadoItemVenta {
        const stockTras = item.producto.stockActual - item.cantidad;
        if (stockTras < 0) return 'insuficiente';
        if (stockTras < this.getStockMinimo(item.producto._id)) return 'bajo-minimo';
        return 'ok';
    }

    get itemsValidados(): ItemValidado[] {
        return this.carrito().map(item => ({
        item,
        estado: this.getEstadoItem(item),
        stockTrasVenta: item.producto.stockActual - item.cantidad,
        stockMinimo: this.getStockMinimo(item.producto._id),
        }));
    }

    get hayInsuficiente(): boolean {
        return this.itemsValidados.some(v => v.estado === 'insuficiente');
    }

    get hayBajoMinimo(): boolean {
        return this.itemsValidados.some(v => v.estado === 'bajo-minimo');
    }

    seleccionarPrincipal(cat: Categoria): void {
        if (this.categoriaPrincipalActivaId() === cat._id) {
        this.limpiarFiltro();
        return;
        }

        this.categoriaPrincipalActivaId.set(cat._id);
        this.subcategoriaActivaId.set(null); 
    }

    seleccionarSubcategoria(cat: Categoria): void {
        if (this.subcategoriaActivaId() === cat._id) {
        this.limpiarFiltro();
        return;
        }

        this.subcategoriaActivaId.set(cat._id);
    }

    limpiarFiltro(): void {
      this.categoriaPrincipalActivaId.set(null);
      this.subcategoriaActivaId.set(null);
    }

    estaActiva(id: string): boolean {
      const categoriaPrincipalId = this.categoriaPrincipalActivaId();
      const subcategoriaId = this.subcategoriaActivaId();

      if (categoriaPrincipalId === id) {
        return true;
      }

      if (subcategoriaId === id) {
        return true;
      }

      if (subcategoriaId) {
        const sub = this.subcategorias().find(s => s._id === subcategoriaId);
        if (sub && sub.padreId === id) {
          return true;
        }
      }

      return false;
    }

    agregarAlCarrito(producto: Producto): void {
        const items = this.carrito();
        const item = items.find(i => i.producto._id === producto._id);
        if (item) {
        item.cantidad++;
        this.carrito.set([...items]);
        } else {
        this.carrito.set([...items, { producto, cantidad: 1 }]);
        }
    }

    incrementar(productoId: string): void {
        const items = this.carrito();
        const item = items.find(i => i.producto._id === productoId);
        if (item) {
        item.cantidad++;
        this.carrito.set([...items]);
        }
    }

    decrementar(productoId: string): void {
        const items = this.carrito();
        const item = items.find(i => i.producto._id === productoId);
        if (!item) return;
        if (item.cantidad === 1) {
        this.eliminarDelCarrito(productoId);
        } else {
        item.cantidad--;
        this.carrito.set([...items]);
        }
    }

    eliminarDelCarrito(productoId: string): void {
        this.carrito.set(this.carrito().filter(i => i.producto._id !== productoId));
    }

    cancelarVenta(): void {
        this.carrito.set([]);
    }

    abrirConfirmar(): void { this.modalConfirmarAbierto.set(true); }
    cerrarConfirmar(): void { this.modalConfirmarAbierto.set(false); }

    confirmarVenta(): void {
        const detalles: DetalleVentaForm[] = this.carrito().map(item => ({
        productoId: item.producto._id,
        cantidad: item.cantidad,
        precioUnitario: item.producto.precio,
        }));

        if (detalles.length === 0) {
        this.modalConfirmarAbierto.set(false);
        return;
        }

        this.ventaService.registrarVenta({
        usuarioId: '000000000000000000000000',
        detalles,
        }).subscribe({
        next: () => {
            this.carrito.set([]);
            this.ventaConfirmada.set(true);
            this.modalConfirmarAbierto.set(false);
            this.loadProductos();
            this.loadInventario();
            setTimeout(() => this.ventaConfirmada.set(false), 3000);
        },
        error: () => {
            this.modalConfirmarAbierto.set(false);
        }
        });
    }

    enCarrito(productoId: string): number {
        return this.carrito().find(i => i.producto._id === productoId)?.cantidad ?? 0;
    }
}
