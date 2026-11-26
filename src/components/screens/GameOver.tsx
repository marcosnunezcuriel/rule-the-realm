import type { CSSProperties } from "react";

import StatIcon from "../kingdom/StatIcon";

import { statDefinitions } from "../../data/kingdom/statDefinitions";
import { gameOverMessages } from "../../data/narrative/gameOverMessages";

import type { GameOverReason } from "../../types/gameOver";
import type { KingdomValues } from "../../types/stats";

import "../../styles/screens/GameOver.css";

type GameOverProps = {
    reason: GameOverReason;
    chapter: string;
    day: number;
    stats: KingdomValues;
    onMenu: () => void;
};

function GameOver({
    reason,
    chapter,
    day,
    stats,
    onMenu,
}: GameOverProps) {
    const message = gameOverMessages[reason];

    const statDefinition = statDefinitions.find(
        (stat) => stat.key === message.stat
    );

    const color = statDefinition?.color ?? "var(--colour-gold)";

    return (
        <main className="game-over">
            <div
                className="game-over__panel realm-panel"
                style={
                    { "--game-over-color": color } as CSSProperties
                }
            >
                <div className="game-over__symbol">
                    <StatIcon stat={message.stat} />
                </div>

                <h1 className="game-over__heading">
                    El fin de tu reinado
                </h1>

                <h2 className="game-over__title">
                    {message.title}
                </h2>

                <p className="game-over__description">
                    {message.ending}
                </p>

                <div className="game-over__result">
                    <span>{statDefinition?.label}</span>
                    <strong>{stats[message.stat]}</strong>
                </div>

                <p className="game-over__day">
                    Capítulo {chapter} · Día {day}
                </p>

                <button
                    type="button"
                    className="game-over__button realm-button realm-button--display realm-button--hover"
                    onClick={onMenu}
                >
                    Volver al menú principal
                </button>
            </div>
        </main>
    );
}

export default GameOver;
