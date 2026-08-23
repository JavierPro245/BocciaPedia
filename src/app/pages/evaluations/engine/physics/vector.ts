export interface Vec2 {
  x: number;
  y: number;
}

export function subtract(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function add(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function scale(v: Vec2, factor: number): Vec2 {
  return { x: v.x * factor, y: v.y * factor };
}

export function length(v: Vec2): number {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

export function distance(a: Vec2, b: Vec2): number {
  return length(subtract(a, b));
}

export function normalize(v: Vec2): Vec2 {

  const len = length(v);

  if (len === 0) {
    return { x: 0, y: 0 };
  }

  return { x: v.x / len, y: v.y / len };

}

export function dot(a: Vec2, b: Vec2): number {
  return a.x * b.x + a.y * b.y;
}

/**
 * Refleja la dirección `d` (se asume normalizada) contra una
 * superficie de normal `n` (también normalizada): R = D - 2(D·N)N.
 */
export function reflect(d: Vec2, n: Vec2): Vec2 {

  const factor = 2 * dot(d, n);

  return {
    x: d.x - factor * n.x,
    y: d.y - factor * n.y
  };

}
