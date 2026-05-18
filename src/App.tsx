import { useState, useEffect, useCallback, useRef } from 'react';
import { generateMaze, type Cell } from './mazeGenerator';
import './index.css';

function App() {
  const [level, setLevel] = useState(1);
  const [gridSize, setGridSize] = useState(5);
  const [maze, setMaze] = useState<Cell[][]>([]);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [endPos, setEndPos] = useState({ x: 0, y: 0 });
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [time, setTime] = useState(0);

  const initLevel = useCallback((lvl: number) => {
    const newSize = 5 + lvl + Math.floor(Math.random() * 3);
    setGridSize(newSize);
    setMaze(generateMaze(newSize, newSize));
    const corners = [
      { start: { x: 0, y: 0 }, end: { x: newSize - 1, y: newSize - 1 } },
      { start: { x: newSize - 1, y: 0 }, end: { x: 0, y: newSize - 1 } },
      { start: { x: 0, y: newSize - 1 }, end: { x: newSize - 1, y: 0 } },
      { start: { x: newSize - 1, y: newSize - 1 }, end: { x: 0, y: 0 } }
    ];
    const picked = corners[Math.floor(Math.random() * corners.length)];
    setPlayerPos(picked.start);
    setEndPos(picked.end);
  }, []);

  useEffect(() => {
    initLevel(level);
  }, [level, initLevel]);

  useEffect(() => {
    setTime(0);
  }, [level]);

  useEffect(() => {
    const timer = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    let timeoutId: number | ReturnType<typeof setTimeout>;
    if (maze.length > 0 && playerPos.x === endPos.x && playerPos.y === endPos.y) {
      timeoutId = setTimeout(() => setLevel(l => l + 1), 50);
    }
    return () => clearTimeout(timeoutId);
  }, [playerPos, endPos, maze]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key.startsWith('Arrow')) e.preventDefault();
    if (!maze.length) return;

    setPlayerPos(prev => {
      const { x, y } = prev;
      if (!maze[y] || !maze[y][x]) return prev;
      const currentCell = maze[y][x];
      let nx = x, ny = y;

      if (e.key === 'ArrowUp' && !currentCell.walls.top) ny--;
      else if (e.key === 'ArrowRight' && !currentCell.walls.right) nx++;
      else if (e.key === 'ArrowDown' && !currentCell.walls.bottom) ny++;
      else if (e.key === 'ArrowLeft' && !currentCell.walls.left) nx--;

      return { x: nx, y: ny };
    });
  }, [maze]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStart.current) return;
    const touchEnd = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    const dx = touchEnd.x - touchStart.current.x;
    const dy = touchEnd.y - touchStart.current.y;

    if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
      const key = Math.abs(dx) > Math.abs(dy)
        ? (dx > 0 ? 'ArrowRight' : 'ArrowLeft')
        : (dy > 0 ? 'ArrowDown' : 'ArrowUp');
      handleKeyDown({ key, preventDefault: () => {} } as KeyboardEvent);
      touchStart.current = touchEnd;
    }
  }, [handleKeyDown]);

  const handleTouchEnd = useCallback(() => {
    touchStart.current = null;
  }, []);

  useEffect(() => {
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const rs = s % 60;
    return `${m.toString().padStart(2, '0')}:${rs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`app-container ${theme}`}>
      <header>
        <h1>Level {level}</h1>
        <div className="timer">{formatTime(time)}</div>
        <button onClick={toggleTheme}>Mode {theme === 'light' ? 'Nuit' : 'Jour'}</button>
      </header>
      <main>
        <div
          className="maze"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gridTemplateRows: `repeat(${gridSize}, 1fr)`,
            width: `${Math.min(gridSize * 30, 800)}px`
          }}
        >
          {maze.map(row => row.map(cell => {
            const isPlayer = playerPos.x === cell.x && playerPos.y === cell.y;
            const isEnd = cell.x === endPos.x && cell.y === endPos.y;
            return (
              <div
                key={`${cell.x}-${cell.y}`}
                className={`cell ${cell.walls.top ? 'top' : ''} ${cell.walls.right ? 'right' : ''} ${cell.walls.bottom ? 'bottom' : ''} ${cell.walls.left ? 'left' : ''}`}
              >
                {isPlayer && <div className="player" />}
                {isEnd && <div className="flag">🚩</div>}
              </div>
            );
          }))}
        </div>
      </main>
    </div>
  );
}

export default App;