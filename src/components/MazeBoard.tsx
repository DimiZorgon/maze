import type { Cell, Position } from '../types';

interface MazeBoardProps {
  size: number;
  player: Position;
  exit: Position;
  grid: Cell[][];
}

export default function MazeBoard({ size, player, exit, grid }: MazeBoardProps) {
  const cellSize = Math.min(420 / size, 32);

  return (
    <div
      className="maze-board"
      style={{
        gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${size}, ${cellSize}px)`,
      }}
    >
      {grid.flat().map((cell) => {
        const isPlayer = cell.x === player.x && cell.y === player.y;
        const isExit = cell.x === exit.x && cell.y === exit.y;

        return (
          <div
            key={`${cell.x}-${cell.y}`}
            className={`maze-cell ${isPlayer ? 'maze-player' : ''} ${isExit ? 'maze-exit' : ''}`}
            style={{
              width: `${cellSize}px`,
              height: `${cellSize}px`,
              borderTop: cell.walls.top ? '2px solid currentColor' : '2px solid transparent',
              borderRight: cell.walls.right ? '2px solid currentColor' : '2px solid transparent',
              borderBottom: cell.walls.bottom ? '2px solid currentColor' : '2px solid transparent',
              borderLeft: cell.walls.left ? '2px solid currentColor' : '2px solid transparent',
            }}
            aria-label={`Cellule ${cell.x + 1}, ${cell.y + 1}${isPlayer ? ' joueur ici' : ''}${isExit ? ' sortie' : ''}`}
          >
            {isExit && <span className="exit-dot" aria-hidden="true">⚑</span>}
            {isPlayer && <span className="player-dot" aria-hidden="true" />}
          </div>
        );
      })}
    </div>
  );
}