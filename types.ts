export type GameStatus = 'INSTRUCTIONS' | 'NAME_INPUT' | 'PLAYING' | 'WON' | 'GAMEOVER';

export type InteractionMode = 'BUILD' | 'ATTACK';

export interface Vector2 {
  x: number;
  y: number;
}

export interface Entity extends Vector2 {
  id: number;
}

export interface Worker extends Entity {
  state: 'IDLE' | 'MOVE_BUILD' | 'BUILDING' | 'RETURN';
  targetId: number | null; // ID of wall segment being targeted
  timer: number;
  anim: number;
}

export interface WallSegment {
  id: number;
  angle: number;
  state: 'EMPTY' | 'RESERVED' | 'BUILDING' | 'BUILT';
  progress: number;
  x?: number; // Calculated render position
  y?: number;
}

export interface Enemy extends Vector2 {
  id: number;
  posAngle: number;
  dir: number; // 1 or -1 for orbit direction logic if implemented
  state: 'CHARGING';
}

export interface Arrow extends Vector2 {
  id: number;
  angle: number;
}

export interface Particle extends Vector2 {
  id: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export interface Tree extends Vector2 {
  size: number;
}

export interface LeaderboardEntry {
  name: string;
  timeMs: number;
  timeStr: string;
  timestamp: number;
}