import type { SoundSettings } from "../../types/audio";

import "../../styles/screens/SoundPanel.css";

type SoundPanelProps = {
    settings: SoundSettings;
    hymnUnlocked: boolean;
    onChange: (changes: Partial<SoundSettings>) => void;
    onClose: () => void;
};

type VolumeControlProps = {
    id: string;
    label: string;
    value: number;
    disabled: boolean;
    onChange: (value: number) => void;
};

function VolumeControl({
    id,
    label,
    value,
    disabled,
    onChange,
}: VolumeControlProps) {
    const displayedValue = disabled ? 0 : value;

    return (
        <div className="sound-panel__volume">
            <div className="sound-panel__volume-heading">
                <label htmlFor={id}>
                    {label}
                </label>

                <output htmlFor={id}>
                    {displayedValue} %
                </output>
            </div>

            <input
                id={id}
                type="range"
                min={0}
                max={100}
                step={1}
                value={displayedValue}
                disabled={disabled}
                onChange={(event) => {
                    onChange(Number(event.target.value));
                }}
            />
        </div>
    );
}

function SoundPanel({
    settings,
    hymnUnlocked,
    onChange,
    onClose,
}: SoundPanelProps) {
    return (
        <div
            className="sound-panel__backdrop"
            onClick={onClose}
        >
            <section
                className="sound-panel"
                role="dialog"
                aria-modal="true"
                aria-labelledby="sound-panel-heading"
                onClick={(event) => {
                    event.stopPropagation();
                }}
            >
                <header className="sound-panel__header">
                    <h2 id="sound-panel-heading">
                        Control de sonido
                    </h2>

                    <button
                        type="button"
                        className="sound-panel__close"
                        onClick={onClose}
                        aria-label="Cerrar panel de sonido"
                    >
                        ×
                    </button>
                </header>

                <div className="sound-panel__mute-row">
                    <span>
                        Silenciar todo
                    </span>

                    <button
                        type="button"
                        className="sound-panel__mute-button"
                        role="switch"
                        aria-checked={settings.muted}
                        aria-label="Silenciar todo"
                        title={
                            settings.muted
                                ? "Activar sonido"
                                : "Silenciar todo"
                        }
                        onClick={() => {
                            onChange({
                                muted: !settings.muted,
                            });
                        }}
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

                            {settings.muted ? (
                                <>
                                    <path d="M16 9l6 6" />
                                    <path d="M22 9l-6 6" />
                                </>
                            ) : (
                                <>
                                    <path d="M15 9a5 5 0 0 1 0 6" />
                                    <path d="M18 6a9 9 0 0 1 0 12" />
                                </>
                            )}
                        </svg>
                    </button>
                </div>

                <VolumeControl
                    id="sound-master-volume"
                    label="Volumen general"
                    value={settings.masterVolume}
                    disabled={settings.muted}
                    onChange={(masterVolume) => {
                        onChange({ masterVolume });
                    }}
                />

                <VolumeControl
                    id="sound-ambience-volume"
                    label="Ambiente y música"
                    value={settings.ambienceVolume}
                    disabled={settings.muted}
                    onChange={(ambienceVolume) => {
                        onChange({ ambienceVolume });
                    }}
                />

                <VolumeControl
                    id="sound-effects-volume"
                    label="Efectos y notificaciones"
                    value={settings.effectsVolume}
                    disabled={settings.muted}
                    onChange={(effectsVolume) => {
                        onChange({ effectsVolume });
                    }}
                />

                <fieldset className="sound-panel__ambiences">
                    <legend>
                        Sonido ambiental
                    </legend>

                    <label className="sound-panel__option">
                        <input
                            type="radio"
                            name="ambient-track"
                            value="birds"
                            checked={
                                settings.ambientTrack === "birds"
                            }
                            onChange={() => {
                                onChange({
                                    ambientTrack: "birds",
                                });
                            }}
                        />

                        Pájaros de Astaria
                    </label>

                    <label className="sound-panel__option">
                        <input
                            type="radio"
                            name="ambient-track"
                            value="anthem"
                            checked={
                                settings.ambientTrack === "anthem"
                            }
                            disabled={!hymnUnlocked}
                            onChange={() => {
                                onChange({
                                    ambientTrack: "anthem",
                                });
                            }}
                        />

                        <span>
                            Himno de Astaria

                            {!hymnUnlocked && (
                                <small>
                                    Bloqueado: completa el evento
                                    del músico de la corte.
                                </small>
                            )}
                        </span>
                    </label>
                </fieldset>
            </section>
        </div>
    );
}

export default SoundPanel;
