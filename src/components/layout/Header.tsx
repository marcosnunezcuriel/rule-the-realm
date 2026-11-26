import { assetUrl } from "../../utils/assetUrl";

import "../../styles/layout/Header.css";

type HeaderProps = {
    chapter: string;
    day: number;
    onMenu: () => void;
    onSoundSettings: () => void;
};

function Header({
    chapter,
    day,
    onMenu,
    onSoundSettings,
}: HeaderProps) {
    return (
        <header className="site-header">
            <div className="site-header__brand">
                <div className="site-header__logo">
                    <img
                        src={assetUrl("/assets/ui/astaria-emblem.png")}
                        alt="Emblema de Astaria"
                        draggable={false}
                    />
                </div>

                <div className="site-header__identity">
                    <h1>Rule the Realm</h1>
                    <p>Las crónicas de Astaria</p>
                </div>
            </div>

            <div className="site-header__right">
                <div className="site-header__status">
                    Capítulo {chapter}

                    <span className="site-header__separator">
                        ·
                    </span>

                    Día {String(day).padStart(2, "0")}
                </div>

                <button
                    type="button"
                    className="site-header__menu realm-button realm-button--hover"
                    aria-label="Control de sonido"
                    title="Control de sonido"
                    onClick={onSoundSettings}
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
                        <path d="M15 9a5 5 0 0 1 0 6" />
                        <path d="M18 6a9 9 0 0 1 0 12" />
                    </svg>
                </button>

                <button
                    type="button"
                    className="site-header__menu realm-button realm-button--hover"
                    aria-label="Volver al menú principal"
                    title="Menú principal"
                    onClick={onMenu}
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
                        <path d="M2 8l5 4 5-7 5 7 5-4-2 13H4L2 8z" />
                    </svg>
                </button>
            </div>
        </header>
    );
}

export default Header;
