import { useModalFocus } from "../../hooks/useModalFocus";

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
        <div className="main-menu__backdrop">
            <div
                ref={modalRef}
                tabIndex={-1}
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
                        onClick={onCancel}
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                    >
                        Sobrescribir y empezar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NewGameConfirmation;
