import { assetUrl } from "../../utils/assetUrl";

import GoldenFrame from "../shared/GoldenFrame";

import "../../styles/screens/MainMenu.css";
import "../../styles/screens/SoundMenuButton.css";

type MainMenuProps = {
    hasSave: boolean;
    showNewGameConfirmation: boolean;
    onNewGame: () => void;
    onContinue: () => void;
    onConfirmNewGame: () => void;
    onCancelNewGame: () => void;
    onAchievements: () => void;
    onSoundSettings: () => void;
};

function MainMenu({
    hasSave,
    showNewGameConfirmation,
    onNewGame,
    onContinue,
    onConfirmNewGame,
    onCancelNewGame,
    onAchievements,
    onSoundSettings,
}: MainMenuProps) {
    return (
        <main className="main-menu">
            {/* Mapa decorativo de Astaria */}
            <div
                className="main-menu__map"
                aria-hidden="true"
            >
                <GoldenFrame
                    image="/assets/ui/astaria-map.png"
                    alt=""
                />
            </div>

            {/* Panel principal centrado */}
            <div className="main-menu__panel">
                <div className="main-menu__emblem">
                    <img
                        src={assetUrl(
                            "/assets/ui/astaria-emblem.png"
                        )}
                        alt=""
                        draggable={false}
                    />
                </div>

                <h1 className="main-menu__title">
                    Rule the Realm
                </h1>

                <p className="main-menu__subtitle">
                    Las crónicas de Astaria
                </p>

                <div className="main-menu__actions">
                    <button
                        type="button"
                        onClick={onNewGame}
                    >
                        Nueva partida
                    </button>

                    <button
                        type="button"
                        disabled={!hasSave}
                        onClick={onContinue}
                    >
                        Continuar partida
                    </button>
                </div>
            </div>

            {/* Créditos en el borde inferior */}
            <p className="main-menu__credit">
                Hecho por Marcos Núñez Curiel
            </p>

            {/* Botón de sonido */}
            <button
                type="button"
                className="main-menu__achievements main-menu__sound"
                onClick={onSoundSettings}
                aria-label="Control de sonido"
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="M11 5 6 9H3v6h3l5 4V5Z" />
                    <path d="M15 9a5 5 0 0 1 0 6" />
                    <path d="M18 6a9 9 0 0 1 0 12" />
                </svg>

                Sonido
            </button>

            {/* Botón de logros */}
            <button
                type="button"
                className="main-menu__achievements"
                onClick={onAchievements}
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <circle cx="12" cy="8" r="5" />

                    <path
                        d="M8.2 12.5 6.9 22l5.1-3 5.1 3-1.3-9.5"
                    />
                </svg>

                Logros
            </button>

            {/* Confirmación al comenzar otra partida */}
            {showNewGameConfirmation && (
                <div className="main-menu__backdrop">
                    <div
                        className="main-menu__confirmation"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="new-game-title"
                        aria-describedby="new-game-description"
                    >
                        <h2 id="new-game-title">
                            Nueva partida
                        </h2>

                        <p id="new-game-description">
                            Ya existe una partida guardada.
                            Si comienzas una nueva,
                            se sobrescribirá.
                        </p>

                        <div className="main-menu__confirmation-actions">
                            <button
                                type="button"
                                onClick={onCancelNewGame}
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                onClick={onConfirmNewGame}
                            >
                                Sobrescribir y empezar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default MainMenu;
