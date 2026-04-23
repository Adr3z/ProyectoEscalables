import { EstadoStock } from '../../models';

/**
 * Calcula el estado de stock de un producto
 * basado en su stock actual, mínimo y máximo.
 * Si no se pasa stockMinimo, usa umbrales fijos para el catálogo.
 */

export function getEstadoStock( stockActual: number, stockMinimo = 5): EstadoStock {
    if (stockActual === 0)           return 'AGOTADO';
    if (stockActual <= stockMinimo)  return 'CRITICO';
    if (stockActual <= stockMinimo * 1.2) return 'BAJO';
    return 'SUFICIENTE';
}