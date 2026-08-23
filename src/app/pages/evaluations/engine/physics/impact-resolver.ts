import { Vec2 } from './vector';
import { isHit, resolvePushDirection } from './collision';
import { OpponentBall } from '../../models/opponent-ball.model';
import { CourtMode } from '../../models/court-mode.model';

const HIT_RADIUS = 28;

export interface RicochetRoles {
  wallA: OpponentBall;
  wallB: OpponentBall;
  target: OpponentBall;
}

/**
 * Determina cuál de las 3 bochas de Ricochet es el "muro" (las 2 más
 * cercanas entre sí) y cuál es la "suelta" — por posición real, no
 * por el orden en que el entrenador las fue tocando.
 */
export function resolveRicochetRoles(balls: OpponentBall[]): RicochetRoles | null {

  if (balls.length !== 3) {
    return null;
  }

  const pairs: Array<[number, number]> = [[0, 1], [0, 2], [1, 2]];

  let closestPair = pairs[0];

  let closestDistance = Infinity;

  for (const [i, j] of pairs) {

    const d = Math.hypot(balls[i].x - balls[j].x, balls[i].y - balls[j].y);

    if (d < closestDistance) {

      closestDistance = d;

      closestPair = [i, j];

    }

  }

  const targetIndex = [0, 1, 2].find(
    i => i !== closestPair[0] && i !== closestPair[1]
  )!;

  return {
    wallA: balls[closestPair[0]],
    wallB: balls[closestPair[1]],
    target: balls[targetIndex]
  };

}

export interface ImpactResult {
  // Qué entidad se anima al confirmarse el impacto:
  // - 'opponent': la bocha rival/propia impactada (Push On, Push Off)
  // - 'jack': el jack se separa de la bocha pegada a él (Bochada)
  // - 'own': la bocha del deportista sigue viaje hasta el jack (Ricochet)
  moves: 'opponent' | 'jack' | 'own';
  // Índice dentro de opponentBalls de la bocha involucrada (impactada
  // o, en Ricochet, la bocha "suelta" que se usó para calcular el
  // rebote).
  opponentIndex: number;
  direction: Vec2;
  distance: number;
}

/**
 * Resuelve si un tiro (throwPoint) impactó la bocha objetivo del
 * modo dado, y si es así qué debe animarse y en qué dirección.
 * Solo aplica a Push On, Push Off, Bochada y Ricochet — Smash usa su
 * propia animación (ya validada, sin cambios) y First Ball/Placement
 * no tienen bocha rival.
 *
 * Es una función pura para poder reproducir exactamente la misma
 * animación tanto en vivo (court-engine) como al revisar un
 * lanzamiento después (heatmap).
 */
export function resolveImpact(
  mode: CourtMode,
  ballColor: 'red' | 'blue',
  throwPoint: Vec2,
  jack: Vec2,
  opponentBalls: OpponentBall[]
): ImpactResult | null {

  if (
    mode !== 'push-on' &&
    mode !== 'push-off' &&
    mode !== 'bochada' &&
    mode !== 'ricochet'
  ) {

    return null;

  }

  let target: OpponentBall | undefined;

  if (mode === 'ricochet') {

    target = resolveRicochetRoles(opponentBalls)?.target;

  } else if (mode === 'push-on') {

    // La bocha a empujar es la del mismo color que el deportista.
    target = opponentBalls.find(b => b.color === ballColor);

  } else {

    target = opponentBalls[0];

  }

  if (!target || !isHit(throwPoint, target, HIT_RADIUS)) {

    return null;

  }

  const opponentIndex = opponentBalls.indexOf(target);

  if (mode === 'bochada') {

    return {
      moves: 'jack',
      opponentIndex,
      direction: resolvePushDirection(throwPoint, target),
      distance: 60
    };

  }

  if (mode === 'ricochet') {

    const distance = Math.max(
      40,
      Math.hypot(jack.x - throwPoint.x, jack.y - throwPoint.y) - 24
    );

    return {
      moves: 'own',
      opponentIndex,
      direction: resolvePushDirection(target, jack),
      distance
    };

  }

  // push-on / push-off
  return {
    moves: 'opponent',
    opponentIndex,
    direction: resolvePushDirection(throwPoint, target),
    distance: 70
  };

}
