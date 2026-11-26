// Solicita confirmación antes de sobrescribir una partida guardada.

import { useModalFocus } from "../../hooks/modals/useModalFocus";

type NewGameConfirmationProps = {
    onConfirm: () => void;
    onCancel: () => void;
};

function NewGameConfirmation({
    onConfirm,
    onCancel,
}: NewGameConfirmationProps) {
    const modalRef = useModalFocus(onCancel);

    return (
        <div className="main-menu__backdrop realm-backdrop">
            <div
                ref={modalRef}
                tabIndex={-1}
                className="main-menu__confirmation realm-panel"
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
                        onClick={onCancel}
                        className="realm-button realm-button--display realm-button--hover"
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        className="realm-button realm-button--display realm-button--hover"
                    >
                        Sobrescribir y empezar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NewGameConfirmation;
