interface ControlsProps {
  onReset: () => void;
  onNextLevel: () => void;
  onNavigate: (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void;
  gameActive: boolean;
  hasWon: boolean;
}

export default function Controls({ onReset, onNextLevel, onNavigate, gameActive, hasWon }: ControlsProps) {
  return (
    <section className="controls-panel">
      <div className="controls-actions">
        <button type="button" onClick={onReset}>
          Régénérer
        </button>
        <button type="button" onClick={onNextLevel}>
          Niveau suivant
        </button>
      </div>

      <div className="navigation-pad" aria-label="Déplacement du joueur">
        <button type="button" onClick={() => onNavigate('UP')} disabled={!gameActive || hasWon}>
          ▲
        </button>
        <div>
          <button type="button" onClick={() => onNavigate('LEFT')} disabled={!gameActive || hasWon}>
            ◀
          </button>
          <button type="button" onClick={() => onNavigate('DOWN')} disabled={!gameActive || hasWon}>
            ▼
          </button>
          <button type="button" onClick={() => onNavigate('RIGHT')} disabled={!gameActive || hasWon}>
            ▶
          </button>
        </div>
      </div>
    </section>
  );
}
