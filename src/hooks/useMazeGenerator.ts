import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Cell, MazeGrid, Position } from '../types';

const createCell = (x: number, y: number): Cell => ({
  x,
  y,
  visited: false,
  walls: {
    top: true,
    right: true,
    bottom: true,
    left: true,
  },
});

const shuffle = <T,>(items: T[]): T[] => {
  return items
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
};

const removeWall = (current: Cell, next: Cell, direction: string) => {
  if (direction === 'UP') {
    current.walls.top = false;
    next.walls.bottom = false;
  }
  if (direction === 'DOWN') {
    current.walls.bottom = false;
    next.walls.top = false;
  }
  if (direction === 'LEFT') {
    current.walls.left = false;
    next.walls.right = false;
  }
  if (direction === 'RIGHT') {
    current.walls.right = false;
    next.walls.left = false;
  }
};

const generateMaze = (size: number): MazeGrid => {
  const grid: MazeGrid = Array.from({ length: size }, (_, y) =>
    Array.from({ length: size }, (_, x) => createCell(x, y))
  );

  const stack: Cell[] = [];
  const start = grid[0][0];
  start.visited = true;
  stack.push(start);

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const { x, y } = current;
    const neighbours: Array<{ cell: Cell; direction: string }> = [];

    if (y > 0 && !grid[y - 1][x].visited) {
      neighbours.push({ cell: grid[y - 1][x], direction: 'UP' });
    }
    if (y < size - 1 && !grid[y + 1][x].visited) {
      neighbours.push({ cell: grid[y + 1][x], direction: 'DOWN' });
    }
    if (x > 0 && !grid[y][x - 1].visited) {
      neighbours.push({ cell: grid[y][x - 1], direction: 'LEFT' });
    }
    if (x < size - 1 && !grid[y][x + 1].visited) {
      neighbours.push({ cell: grid[y][x + 1], direction: 'RIGHT' });
    }

    if (neighbours.length > 0) {
      const next = shuffle(neighbours)[0];
      removeWall(current, next.cell, next.direction);
      next.cell.visited = true;
      stack.push(next.cell);
    } else {
      stack.pop();
    }
  }

  return grid;
};

export default function useMazeGenerator(size: number) {
  const [grid, setGrid] = useState<MazeGrid>(() => generateMaze(size));

  useEffect(() => {
    setGrid(generateMaze(size));
  }, [size]);

  const regenerate = useCallback(() => {
    setGrid(generateMaze(size));
  }, [size]);

  const start = useMemo<Position>(() => ({ x: 0, y: 0 }), []);
  const exit = useMemo<Position>(() => ({ x: size - 1, y: size - 1 }), [size]);

  return { grid, start, exit, regenerate };
}
