import "../styles/Header.css";

type HeaderProps = {
    chapter: string;
    day: number;
};

function Header({ chapter, day }: HeaderProps) {
    return (
        <header className="site-header">
            <div className="site-header__brand">
                <div className="site-header__logo">
                    <svg viewBox="0 0 40 40" aria-hidden="true">
                        <path d="M20 3V37 M3 20H37 M8 8L32 32 M32 8L8 32" />
                    </svg>
                </div>

                <div className="site-header__identity">
                    <h1>Rule the Realm</h1>
                    <p>Las crónicas de Astaria</p>
                </div>
            </div>

            <div className="site-header__status">
                Capítulo {chapter}
                <span className="site-header__separator">·</span>
                Día {String(day).padStart(2, "0")}
            </div>
        </header>
    );
}

export default Header;
