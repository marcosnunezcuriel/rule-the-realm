// Representa el menú principal y los accesos a las opciones de la aplicación.

import MapPreview from "../modals/MapPreview";
import NewGameConfirmation from "../modals/NewGameConfirmation";

import { assetUrl } from "../../utils/assetUrl";

import "../../styles/menu/MainMenu.css";

type MainMenuProps = {
    onAccess: () => void;
    hasSave: boolean;
    showNewGameConfirmation: boolean;
    onNewGame: () => void;
    onContinue: () => void;
    onConfirmNewGame: () => void;
    onCancelNewGame: () => void;
    onAchievements: () => void;
    onItems: () => void;
    onSoundSettings: () => void;
};

function MainMenu({
    onAccess,
    hasSave,
    showNewGameConfirmation,
    onNewGame,
    onContinue,
    onConfirmNewGame,
    onCancelNewGame,
    onAchievements,
    onItems,
    onSoundSettings,
}: MainMenuProps) {

    return (
        <main className="main-menu">
            {/* Mapa decorativo de Astaria */}
            <MapPreview />

            {/* Acceso a la cuenta del jugador */}
            <button
                type="button"
                className="main-menu__account realm-button realm-button--display realm-button--hover"
                onClick={onAccess}
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
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
                </svg>

                Iniciar sesión
            </button>

            {/* Panel principal centrado */}
            <div className="main-menu__panel realm-panel">
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
                        className="realm-button realm-button--display realm-button--hover"
                    >
                        Nueva partida
                    </button>

                    <button
                        type="button"
                        disabled={!hasSave}
                        onClick={onContinue}
                        className="realm-button realm-button--display realm-button--hover"
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
                className="main-menu__achievements main-menu__sound realm-button realm-button--display realm-button--hover"
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

            {/* Botón de objetos */}
            <button
                type="button"
                className="main-menu__achievements main-menu__items realm-button realm-button--display realm-button--hover"
                onClick={onItems}
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
                    <rect
                        x="3"
                        y="8"
                        width="18"
                        height="13"
                        rx="2"
                    />
                    <path d="M3 13h18M12 13v4" />
                    <path d="M5 8V6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v2" />
                </svg>

                Tesoro Real
            </button>

            {/* Botón de logros */}
            <button
                type="button"
                className="main-menu__achievements realm-button realm-button--display realm-button--hover"
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
                <NewGameConfirmation
                    onConfirm={onConfirmNewGame}
                    onCancel={onCancelNewGame}
                />
            )}
        </main>
    );
}

export default MainMenu;
