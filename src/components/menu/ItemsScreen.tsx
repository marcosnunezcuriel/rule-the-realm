// Presenta los objetos de la colección real y sus estados de desbloqueo.

import { useState } from "react";

import FormattedText from "../shared/FormattedText";

import {
    items,
    type ItemId,
} from "../../data/registries/itemRegistry";

import { loadUnlockedItems } from "../../storage/itemsStorage";

import { assetUrl } from "../../utils/assetUrl";

import "../../styles/shared/CollectionScreen.css";

type ItemsScreenProps = {
    onBack: () => void;
};

const itemIds = Object.keys(items) as ItemId[];

function ItemsScreen({
    onBack,
}: ItemsScreenProps) {
    const [unlocked] = useState(loadUnlockedItems);
    const unlockedSet = new Set(unlocked);

    return (
        <main className="collection-screen collection-screen--items">
            <div className="collection-screen__container">
                <button
                    type="button"
                    className="collection-screen__back realm-button realm-button--hover"
                    onClick={onBack}
                >
                    Volver al menú
                </button>

                <h1 className="collection-screen__title">
                    Colección real
                </h1>

                <p className="collection-screen__subtitle">
                    Los tesoros de la Corona de las Estrellas
                </p>

                <p className="collection-screen__progress">
                    {unlocked.length} / {itemIds.length} conseguidos
                </p>

                <div className="collection-screen__grid">
                    {itemIds.map((id) => {
                        const item = items[id];
                        const isUnlocked =
                            unlockedSet.has(id);

                        return (
                            <article
                                key={id}
                                className={[
                                    "collection-screen__card",
                                    isUnlocked
                                        ? "collection-screen__card--unlocked"
                                        : "collection-screen__card--locked",
                                ].join(" ")}
                            >
                                <img
                                    className="collection-screen__item-image"
                                    src={assetUrl(item.image)}
                                    alt=""
                                    draggable={false}
                                />

                                <div>
                                    <h2 className="collection-screen__name">
                                        <FormattedText text={item.name} />
                                    </h2>

                                    <p className="collection-screen__description">
                                        {isUnlocked ? (
                                            <FormattedText
                                                text={item.description}
                                            />
                                        ) : (
                                            "???"
                                        )}
                                    </p>

                                    <span className="collection-screen__status">
                                        {isUnlocked
                                            ? "Conseguido"
                                            : "Pendiente"}
                                    </span>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}

export default ItemsScreen;
