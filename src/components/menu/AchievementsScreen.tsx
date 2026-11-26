// Presenta los logros disponibles y distingue los que ya se han desbloqueado.

import { useState } from "react";

import FormattedText from "../shared/FormattedText";

import { achievements } from "../../data/registries/achievementRegistry";

import { loadUnlockedAchievements } from "../../storage/achievementsStorage";

import "../../styles/menu/AchievementsScreen.css";


type AchievementsScreenProps = {
    onBack: () => void;
};

function AchievementsScreen({
    onBack,
}: AchievementsScreenProps) {
    const [unlocked] = useState(() => loadUnlockedAchievements());
    const unlockedSet = new Set(unlocked);

    return (
        <main className="achievements-screen">
            <div className="achievements-screen__container">
                <button
                    type="button"
                    className="achievements-screen__back realm-button realm-button--hover"
                    onClick={onBack}
                >
                    Volver al menú
                </button>

                <h1 className="achievements-screen__title">
                    Logros
                </h1>

                <p className="achievements-screen__subtitle">
                    Las hazañas de la Corona de las Estrellas
                </p>

                <p className="achievements-screen__progress">
                    {unlocked.length} / {achievements.length} conseguidos
                </p>

                <div className="achievements-screen__grid">
                    {achievements.map((achievement) => {
                        const isUnlocked = unlockedSet.has(
                            achievement.id
                        );

                        return (
                            <article
                                key={achievement.id}
                                className={[
                                    "achievements-screen__card",
                                    isUnlocked
                                        ? "achievements-screen__card--unlocked"
                                        : "achievements-screen__card--locked",
                                ].join(" ")}
                            >

                            <svg
                                className="achievements-screen__icon"
                                viewBox="0 0 24 24"
                                fill={isUnlocked ? "currentColor" : "none"}
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path
                                    d="
                                        M12 2
                                        L14.2 7.7
                                        L19.1 4.9
                                        L16.3 9.8
                                        L22 12
                                        L16.3 14.2
                                        L19.1 19.1
                                        L14.2 16.3
                                        L12 22
                                        L9.8 16.3
                                        L4.9 19.1
                                        L7.7 14.2
                                        L2 12
                                        L7.7 9.8
                                        L4.9 4.9
                                        L9.8 7.7
                                        Z
                                    "
                                />
                            </svg>

                                <div>
                                    <h2 className="achievements-screen__name">
                                        {achievement.name}
                                    </h2>

                                    <p className="achievements-screen__description">
                                        {isUnlocked ? (
                                            <FormattedText text={achievement.description} />
                                        ) : (
                                            "???"
                                        )}
                                    </p>

                                    <span className="achievements-screen__status">
                                        {isUnlocked
                                            ? "Conseguido"
                                            : "Pendiente"}
                                    </span>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}

export default AchievementsScreen;
