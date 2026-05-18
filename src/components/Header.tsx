interface HeaderProps {
  time: number;
  level: number;
}

export default function Header({ time, level }: HeaderProps) {
  // Formatage des secondes en MM:SS
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <header className="app-header">
      <div className="timer" aria-label="Chronomètre">
        {formatTime(time)}
      </div>
      <div className="level-label" aria-label={`Niveau ${level}`}>
        {level}
      </div>
    </header>
  );
}