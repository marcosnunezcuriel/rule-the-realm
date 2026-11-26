import type {
    CSSProperties,
    ReactNode,
} from "react";

import type {
    SpecialSceneLayout,
} from "../../types/scene";

import "../../styles/scene/SceneStage.css";

type SceneStageProps = {
    visuals: ReactNode;
    children?: ReactNode;

    visualClassName?: string;
    layout?: SpecialSceneLayout;
};

// Permitir variables CSS personalizadas en React.
type SceneStyle = CSSProperties & {
    [name: `--${string}`]: string;
};

// Convertir la configuración del escenario
// en variables utilizadas por los estilos.
function getLayoutStyle(
    layout: SpecialSceneLayout
): SceneStyle {
    const [width, height] =
        layout.aspectRatio;

    return {
        "--scene-aspect-ratio":
            `${width} / ${height}`,

        "--scene-stage-width":
            `${100 * width / height}cqh`,

        "--scene-visitor-right":
            `${layout.visitor.right}%`,

        "--scene-visitor-bottom":
            `${layout.visitor.bottom}%`,

        "--scene-visitor-width":
            `${layout.visitor.width}%`,

        "--scene-dialogue-visitor-left":
            `${layout.dialogue.visitor.left}%`,

        "--scene-dialogue-visitor-bottom":
            `${layout.dialogue.visitor.bottom}%`,

        "--scene-dialogue-visitor-width":
            `${layout.dialogue.visitor.width}%`,

        "--scene-dialogue-visitor-tail":
            `${layout.dialogue.visitor.tailRight}%`,

        "--scene-dialogue-monarch-top":
            `${layout.dialogue.monarch.top}%`,

        "--scene-dialogue-monarch-left":
            `${layout.dialogue.monarch.left}%`,

        "--scene-dialogue-monarch-tail":
            `${layout.dialogue.monarch.tailLeft}%`,
    };
}

// Estructura compartida por todos los escenarios.
function SceneStage({
    visuals,
    children,
    visualClassName,
    layout,
}: SceneStageProps) {
    const isSpecialScene =
        layout !== undefined;

    const sceneClassName =
        "throne-scene" +
        (
            isSpecialScene
                ? " scene--special"
                : ""
        );

    const stageClassName =
        "throne-stage" +
        (
            isSpecialScene
                ? " scene-stage--special"
                : ""
        );

    const visualsClassName =
        "throne-stage__visuals" +
        (
            visualClassName
                ? ` ${visualClassName}`
                : ""
        );

    return (
        <main className={sceneClassName}>
            <div
                className={stageClassName}
                style={
                    layout !== undefined
                        ? getLayoutStyle(layout)
                        : undefined
                }
            >
                {/* Ilustraciones y personajes */}
                <div className={visualsClassName}>
                    {visuals}
                </div>

                {/* Diálogo y decisiones */}
                <div className="throne-stage__dialogue">
                    {children}
                </div>
            </div>
        </main>
    );
}

export default SceneStage;
