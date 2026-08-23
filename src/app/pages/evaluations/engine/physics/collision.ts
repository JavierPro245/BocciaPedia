import { Vec2, distance, normalize, subtract } from './vector';

/**
 * ¿El punto donde cayó/pasó el tiro está lo bastante cerca de una
 * bocha como para considerarse un impacto real?
 */
export function isHit(point: Vec2, ballCenter: Vec2, hitRadius: number): boolean {

  return distance(point, ballCenter) <= hitRadius;

}

/**
 * Dirección de una bocha empujada en línea recta, a partir de dos
 * puntos reales (de dónde viene el impacto, hacia dónde va) — no
 * hardcodeada. Se usa para Push On, Push Off, Bochada, Smash, y
 * para Ricochet (ahí "throwFrom" es la bocha objetivo e
 * "impactPoint" el jack: tras el rebote, se dirige directo a él en
 * vez de intentar un rebote físico exacto contra el muro, que no
 * garantiza terminar apuntando al jack).
 */
export function resolvePushDirection(throwFrom: Vec2, impactPoint: Vec2): Vec2 {

  return normalize(subtract(impactPoint, throwFrom));

}
