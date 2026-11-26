// @vitest-environment jsdom

import { act } from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import MapPreview from "../../components/modals/MapPreview";
import NewGameConfirmation from "../../components/modals/NewGameConfirmation";
import SoundPanel from "../../components/modals/SoundPanel";

import { DEFAULT_SOUND_SETTINGS } from "../../storage/soundSettingsStorage";

let container: HTMLDivElement;
let root: Root;
let trigger: HTMLButtonElement;

function pressKey(
    key: string,
    shiftKey = false
) {
    act(() => {
        window.dispatchEvent(
            new KeyboardEvent("keydown", {
                key,
                shiftKey,
                bubbles: true,
                cancelable: true,
            })
        );
    });
}

describe("Ventanas modales", () => {
    beforeEach(() => {
        vi.stubGlobal(
            "IS_REACT_ACT_ENVIRONMENT",
            true
        );

        container = document.createElement("div");

        trigger = document.createElement("button");

        document.body.append(
            trigger,
            container
        );

        trigger.focus();

        root = createRoot(container);
    });

    afterEach(() => {
        act(() => {
            root.unmount();
        });

        container.remove();
        trigger.remove();

        vi.unstubAllGlobals();
    });

    it("enfoca Cancelar y permite cerrar la confirmación con Escape", () => {
        const onCancel = vi.fn();
        const onConfirm = vi.fn();

        act(() => {
            root.render(
                <NewGameConfirmation
                    onCancel={onCancel}
                    onConfirm={onConfirm}
                />
            );
        });

        const buttons =
            container.querySelectorAll("button");

        const cancel = buttons[0];
        const confirm = buttons[1];

        expect(
            document.activeElement
        ).toBe(cancel);

        // Shift + Tab desde el primer botón
        // debe llevar al último.
        pressKey("Tab", true);

        expect(
            document.activeElement
        ).toBe(confirm);

        pressKey("Tab");

        expect(
            document.activeElement
        ).toBe(cancel);

        pressKey("Escape");

        expect(onCancel).toHaveBeenCalledTimes(1);
        expect(onConfirm).not.toHaveBeenCalled();

        act(() => {
            root.render(null);
        });

        expect(
            document.activeElement
        ).toBe(trigger);
    });

    it("cierra el mapa ampliado y devuelve el foco a su botón", () => {
        act(() => {
            root.render(<MapPreview />);
        });

        const mapButton =
            container.querySelector<HTMLButtonElement>(
                ".main-menu__map"
            );

        if (mapButton === null) {
            throw new Error(
                "No existe el botón del mapa."
            );
        }

        mapButton.focus();

        act(() => {
            mapButton.click();
        });

        expect(
            container.querySelector(
                ".main-menu__map-overlay"
            )
        ).not.toBeNull();

        expect(
            document.activeElement
        ).toBe(
            container.querySelector(
                ".main-menu__map-dismiss"
            )
        );

        pressKey("Escape");

        expect(
            container.querySelector(
                ".main-menu__map-overlay"
            )
        ).toBeNull();

        expect(
            document.activeElement
        ).toBe(mapButton);
    });

    it("mantiene el foco dentro del panel de sonido", () => {
        const onClose = vi.fn();

        act(() => {
            root.render(
                <SoundPanel
                    settings={DEFAULT_SOUND_SETTINGS}
                    hymnUnlocked={true}
                    onChange={() => {}}
                    onClose={onClose}
                />
            );
        });

        const closeButton =
            container.querySelector<HTMLButtonElement>(
                ".sound-panel__close"
            );

        const birdsOption =
            container.querySelector<HTMLInputElement>(
                'input[value="birds"]'
            );

        expect(
            document.activeElement
        ).toBe(closeButton);

        if (birdsOption === null) {
            throw new Error(
                "No existe la opción de ambiente."
            );
        }

        birdsOption.focus();

        // La pista seleccionada es la última parada
        // de teclado del panel.
        pressKey("Tab");

        expect(
            document.activeElement
        ).toBe(closeButton);

        pressKey("Escape");

        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
