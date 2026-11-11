interface HomePageProps {
    onNewGame: () => void;
}

export function HomePage({onNewGame}: HomePageProps) {
    return (
        <>
            <h1>Rule the Realm</h1>
            <h3>Kingdom of astaria</h3>

            <button onClick={onNewGame}>
                Nueva partida
            </button>
        </>
    );
}
