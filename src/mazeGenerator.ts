export type Cell = {
  x: number;
  y: number;
  walls: { top: boolean; right: boolean; bottom: boolean; left: boolean };
  visited: boolean;
};

export const generateMaze = (width: number, height: number): Cell[][] => {
  const grid: Cell[][] = [];
  for (let y = 0; y < height; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < width; x++) {
      row.push({ x, y, walls: { top: true, right: true, bottom: true, left: true }, visited: false });
    }
    grid.push(row);
  }

  const stack: Cell[] = [];
  let current = grid[0][0];
  current.visited = true;

  let unvisitedCount = width * height - 1;

  while (unvisitedCount > 0) {
    const neighbors: { cell: Cell; dir: string }[] = [];
    const { x, y } = current;

    if (y > 0 && !grid[y - 1][x].visited) neighbors.push({ cell: grid[y - 1][x], dir: 'top' });
    if (x < width - 1 && !grid[y][x + 1].visited) neighbors.push({ cell: grid[y][x + 1], dir: 'right' });
    if (y < height - 1 && !grid[y + 1][x].visited) neighbors.push({ cell: grid[y + 1][x], dir: 'bottom' });
    if (x > 0 && !grid[y][x - 1].visited) neighbors.push({ cell: grid[y][x - 1], dir: 'left' });

    if (neighbors.length > 0) {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      stack.push(current);

      if (next.dir === 'top') { current.walls.top = false; next.cell.walls.bottom = false; }
      else if (next.dir === 'right') { current.walls.right = false; next.cell.walls.left = false; }
      else if (next.dir === 'bottom') { current.walls.bottom = false; next.cell.walls.top = false; }
      else if (next.dir === 'left') { current.walls.left = false; next.cell.walls.right = false; }

      current = next.cell;
      current.visited = true;
      unvisitedCount--;
    } else if (stack.length > 0) {
      current = stack.pop()!;
    } else {
      break;
    }
  }

  return grid;
};
