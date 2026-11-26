import {
    useEffect,
    useRef,
} from "react";

// Recuperar los controles accesibles mediante el teclado.
function getFocusableElements(
    modal: HTMLElement
): HTMLElement[] {
    const elements = Array.from(
        modal.querySelectorAll<HTMLElement>(
            "button:not([disabled]), " +
            "input:not([disabled]):not([type='hidden']), " +
            "select:not([disabled]), " +
            "textarea:not([disabled]), " +
            "a[href], [tabindex]"
        )
    ).filter((element) => {
        return element.tabIndex >= 0 &&
            !element.hidden;
    });

    // Un grupo de botones de radio constituye una
    // única parada al navegar mediante Tab.
    return elements.filter((element) => {
        if (
            !(element instanceof HTMLInputElement) ||
            element.type !== "radio" ||
            element.name === ""
        ) {
            return true;
        }

        const group = elements.filter(
            (candidate): candidate is HTMLInputElement => {
                return (
                    candidate instanceof HTMLInputElement &&
                    candidate.type === "radio" &&
                    candidate.name === element.name
                );
            }
        );

        const selected =
            group.find((radio) => radio.checked) ??
            group[0];

        return element === selected;
    });
}

// Gestionar el teclado y el foco de una ventana modal.
export function useModalFocus<
    T extends HTMLElement = HTMLDivElement
>(
    onClose: () => void
) {
    const modalRef = useRef<T>(null);

    // Colocar el foco al abrir y devolverlo al cerrar.
    useEffect(() => {
        const previousFocus =
            document.activeElement;

        const modal = modalRef.current;

        if (modal === null) {
            return;
        }

        const first =
            getFocusableElements(modal)[0] ??
            modal;

        first.focus({
            preventScroll: true,
        });

        return () => {
            if (
                previousFocus instanceof HTMLElement &&
                previousFocus.isConnected
            ) {
                previousFocus.focus({
                    preventScroll: true,
                });
            }
        };
    }, []);

    // Escape cierra el modal y Tab permanece dentro.
    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            const modal = modalRef.current;

            if (modal === null) {
                return;
            }

            if (event.key === "Escape") {
                event.preventDefault();
                onClose();
                return;
            }

            if (event.key !== "Tab") {
                return;
            }

            const elements =
                getFocusableElements(modal);

            if (elements.length === 0) {
                event.preventDefault();
                modal.focus();
                return;
            }

            const first = elements[0];
            const last =
                elements[elements.length - 1];

            const active = document.activeElement;

            if (
                active === null ||
                !modal.contains(active)
            ) {
                event.preventDefault();

                (
                    event.shiftKey
                        ? last
                        : first
                ).focus();

                return;
            }

            if (
                event.shiftKey &&
                (active === first || active === modal)
            ) {
                event.preventDefault();
                last.focus();
            } else if (
                !event.shiftKey &&
                (active === last || active === modal)
            ) {
                event.preventDefault();
                first.focus();
            }
        }

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [onClose]);

    return modalRef;
}
