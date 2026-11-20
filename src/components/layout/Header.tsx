import "../../styles/layout/Header.css";

type HeaderProps = {
    chapter: string;
    day: number;
    onMenu: () => void;
};

function Header({
    chapter,
    day,
    onMenu,
}: HeaderProps) {
    return (
        <header className="site-header">
            <div className="site-header__brand">
                <div className="site-header__logo">
                    <img
                        src="/assets/ui/astaria-emblem.png"
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
                    className="site-header__menu"
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
