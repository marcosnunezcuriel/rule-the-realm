// Permite seleccionar al protagonista de una nueva partida.

import type { MonarchRole } from "../../types/monarch";

import { assetUrl } from "../../utils/assetUrl";

import "../../styles/menu/MonarchSelection.css";

type MonarchSelectionProps = {
    onChoose: (monarch: MonarchRole) => void;
    onBack: () => void;
};

const options = [
    {
        role: "king",
        title: "Rey",
        image: "/assets/characters/royalty/king-throne-pose-1.png",
    },
    {
        role: "queen",
        title: "Reina",
        image: "/assets/characters/royalty/queen-throne-pose-1.png",
    },
] as const;

function MonarchSelection({
    onChoose,
    onBack,
}: MonarchSelectionProps) {
    return (
        <main className="monarch-selection">
            <section className="monarch-selection__panel realm-panel">
                <h1 className="monarch-selection__title">
                    ¿Quién gobernará Astaria?
                </h1>

                <p className="monarch-selection__description">
                    Elige quién llevará la Corona de las
                    Estrellas durante este reinado.
                </p>

                <div className="monarch-selection__options">
                    {options.map((option) => (
                        <button
                            key={option.role}
                            type="button"
                            className="monarch-selection__option realm-button realm-button--display realm-button--hover"
                            onClick={() => {
                                onChoose(option.role);
                            }}
                        >
                            <img
                                src={assetUrl(option.image)}
                                alt=""
                                draggable={false}
                            />

                            <strong>
                                {option.title}
                            </strong>
                        </button>
                    ))}
                </div>

                <button
                    type="button"
                    className="monarch-selection__back realm-button realm-button--display"
                    onClick={onBack}
                >
                    Volver al menú principal
                </button>
            </section>
        </main>
    );
}

export default MonarchSelection;
