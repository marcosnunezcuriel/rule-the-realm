// Presenta los logros disponibles y distingue los que ya se han desbloqueado.

import { useState } from "react";

import FormattedText from "../shared/FormattedText";

import { achievements } from "../../data/registries/achievementRegistry";

import { loadUnlockedAchievements } from "../../storage/achievementsStorage";

import "../../styles/shared/CollectionScreen.css";


type AchievementsScreenProps = {
    onBack: () => void;
};

function AchievementsScreen({
    onBack,
}: AchievementsScreenProps) {
    const [unlocked] = useState(() => loadUnlockedAchievements());
    const unlockedSet = new Set(unlocked);

    return (
        <main className="collection-screen">
            <div className="collection-screen__container">
                <button
                    type="button"
                    className="collection-screen__back realm-button realm-button--hover"
                    onClick={onBack}
                >
                    Volver al menú
                </button>

                <h1 className="collection-screen__title">
                    Logros
                </h1>

                <p className="collection-screen__subtitle">
                    Las hazañas de la Corona de las Estrellas
                </p>

                <p className="collection-screen__progress">
                    {unlocked.length} / {achievements.length} conseguidos
                </p>

                <div className="collection-screen__grid">
                    {achievements.map((achievement) => {
                        const isUnlocked = unlockedSet.has(
                            achievement.id
                        );

                        return (
                            <article
                                key={achievement.id}
                                className={[
                                    "collection-screen__card",
                                    isUnlocked
                                        ? "collection-screen__card--unlocked"
                                        : "collection-screen__card--locked",
                                ].join(" ")}
                            >

                            <svg
                                className="collection-screen__icon"
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
                                    <h2 className="collection-screen__name">
                                        {achievement.name}
                                    </h2>

                                    <p className="collection-screen__description">
                                        {isUnlocked ? (
                                            <FormattedText text={achievement.description} />
                                        ) : (
                                            "???"
                                        )}
                                    </p>

                                    <span className="collection-screen__status">
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
