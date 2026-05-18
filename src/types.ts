// src/types.ts

// Une position sur la grille
export interface Position {
  x: number;
  y: number;
}

// theme
export type Theme = 'light' | 'dark';

// La structure d'une cellule de ton labyrinthe
export interface Cell {
  x: number;
  y: number;
  walls: { top: boolean; right: boolean; bottom: boolean; left: boolean };
  visited: boolean;
}