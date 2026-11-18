import "../styles/ThroneScene.css";

type ThroneSceneProps = {
    timeOfDay: "morning" | "evening" | "night";
};

function ThroneScene({ timeOfDay }: ThroneSceneProps) {
    const backgroundMap = {
        morning: "/assets/backgrounds/background-morning.png",
        evening: "/assets/backgrounds/background-evening.png",
        night: "/assets/backgrounds/background-night.png",
    };

    return (
        <main className="throne-scene">
            <div className="throne-stage">
                <img
                className="throne-stage__background"
                src={backgroundMap[timeOfDay]}
                alt=""
                aria-hidden="true"
                draggable={false}
                />

                <img
                className="character character--king"
                src="/assets/characters/royalty/king.png"
                alt="Rey de Astaria"
                draggable={false}
                />

                <img
                className="character character--visitor"
                src="/assets/characters/courtiers/royal-advisor.png"
                alt="Consejera real"
                draggable={false}
                />
            </div>
        </main>
    );
}

export default ThroneScene;