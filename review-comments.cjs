const fs = require("node:fs");

const apply = process.argv.includes("--apply");
const files = new Map();
const errors = [];

// Preparar las modificaciones sin escribir todavía en disco.
function getFile(path) {
    if (!files.has(path)) {
        const original = fs.readFileSync(path, "utf8");

        files.set(path, {
            original,
            current: original,
            eol: original.includes("\r\n") ? "\r\n" : "\n",
        });
    }

    return files.get(path);
}

// Sustituir un comentario concreto.
function replace(path, original, replacement) {
    const file = getFile(path);

    original = original.replaceAll("\n", file.eol);
    replacement = replacement.replaceAll("\n", file.eol);

    if (
        replacement.includes(original) &&
        file.current.includes(replacement)
    ) {
        return;
    }

    const index = file.current.indexOf(original);

    if (index === -1) {
        if (!file.current.includes(replacement)) {
            errors.push(`${path}: comentario no encontrado`);
        }

        return;
    }

    if (file.current.indexOf(original, index + original.length) !== -1) {
        errors.push(`${path}: comentario ambiguo`);
        return;
    }

    file.current =
        file.current.slice(0, index) +
        replacement +
        file.current.slice(index + original.length);
}

// Añadir un comentario delante de una declaración.
function before(path, anchor, comment) {
    const file = getFile(path);

    if (file.current.includes(comment.replaceAll("\n", file.eol))) {
        return;
    }

    replace(
        path,
        anchor,
        comment + "\n" + anchor
    );
}

// Añadir una descripción al comienzo del archivo.
function header(path, description) {
    const file = getFile(path);

    const comment = path.endsWith(".css")
        ? `/* ${description} */`
        : `// ${description}`;

    // Conservar las directivas de entorno de Vitest.
    const directive = file.current.match(
        /^(?:\uFEFF)?\/\/ @vitest-environment [^\r\n]+\r?\n(?:\r?\n)?/
    );

    const offset = directive
        ? directive[0].length
        : file.current.startsWith("\uFEFF") ? 1 : 0;

    if (file.current.slice(offset).startsWith(comment)) {
        return;
    }

    file.current =
        file.current.slice(0, offset) +
        comment +
        file.eol +
        file.eol +
        file.current.slice(offset);
}

// Añadir las descripciones de un grupo de archivos.
function headers(directory, definitions) {
    for (const line of definitions.trim().split("\n")) {
        const [filename, description] = line.trim().split("|");

        header(
            `${directory}/${filename.trim()}`,
            description.trim()
        );
    }
}

// Aplicación y motor de sonido.
header(
    "src/App.tsx",
    "Coordina la navegación, las preferencias de sonido y las notificaciones de la aplicación."
);

headers("src/audio", `
    soundCatalog.ts | Relaciona los identificadores de sonido con sus archivos de audio.
    soundEngine.ts | Gestiona la reproducción del ambiente y los efectos de sonido, respetando las preferencias del jugador.
`);

// Estadísticas e interfaz del reino.
headers("src/components/kingdom", `
    KingdomStats.tsx | Representa las estadísticas actuales del reino y sus estados críticos.
    StatChangeToast.tsx | Muestra temporalmente las ganancias y pérdidas de estadísticas.
    StatIcon.tsx | Proporciona los iconos asociados a las estadísticas del reino.
`);

header(
    "src/components/layout/Header.tsx",
    "Cabecera común de la partida, con información de la jornada y controles de navegación."
);

// Menús.
headers("src/components/menu", `
    AchievementsScreen.tsx | Presenta los logros disponibles y distingue los que ya se han desbloqueado.
    MainMenu.tsx | Representa el menú principal y los accesos a las opciones de la aplicación.
    MonarchSelection.tsx | Permite seleccionar al protagonista de una nueva partida.
`);

// Ventanas modales.
headers("src/components/modals", `
    NewGameConfirmation.tsx | Solicita confirmación antes de sobrescribir una partida guardada.
    SoundPanel.tsx | Permite ajustar el volumen, silenciar el juego y seleccionar la pista ambiental.
`);

// Componentes narrativos.
headers("src/components/narrative", `
    DialogueController.tsx | Controla la progresión del diálogo, la elección del jugador y las respuestas del visitante.
    NarrativeParchment.tsx | Presenta textos narrativos por párrafos y permite avanzar o saltar su animación.
    SpeechBubble.tsx | Representa los bocadillos de diálogo y los controles correspondientes.
`);

// Pantallas de partida.
headers("src/components/screens", `
    ChapterEnding.tsx | Presenta el epílogo del capítulo y las opciones de continuación disponibles.
    DaySummary.tsx | Resume la evolución de las estadísticas y los modificadores aplicados durante la jornada.
    GameOver.tsx | Presenta la causa de la derrota y el estado final del reino.
    NightRest.tsx | Representa el descanso nocturno antes de mostrar el resumen diario.
    WelcomeIntroduction.tsx | Presenta la introducción narrativa adaptada al protagonista elegido.
`);

// Componentes reutilizables.
headers("src/components/shared", `
    AnimatedNumber.tsx | Anima los cambios numéricos entre un valor anterior y uno nuevo.
    FormattedText.tsx | Aplica el formato narrativo manteniendo la compatibilidad con la escritura progresiva.
    GoldenFrame.tsx | Superpone el marco dorado a las ilustraciones que lo utilizan.
    NotificationToast.tsx | Representa los avisos de modificadores, logros y recompensas.
    TypewriterText.tsx | Revela progresivamente los caracteres de un texto y comunica su finalización.
`);

before(
    "src/components/narrative/DialogueController.tsx",
    "    const decisionLocked = useRef(",
    "    // Bloquear decisiones repetidas, incluso antes de que React actualice el estado."
);

before(
    "src/components/shared/AnimatedNumber.tsx",
    "    const displayedRef = useRef(initialValue);",
    "    // Conservar el último valor mostrado para continuar desde él si cambia el objetivo."
);

before(
    "src/components/narrative/NarrativeParchment.tsx",
    "    function handleParchmentClick() {",
    "    // Permitir que el jugador complete de inmediato la escritura del párrafo."
);

// Actualizar las cabeceras de los siete días del capítulo I.
for (let day = 1; day <= 7; day++) {
    const number = String(day).padStart(2, "0");

    replace(
        `src/data/chapters/chapter1/events/day${number}.ts`,
        `// Capítulo I · día ${number}. Orden y textos del PDF definitivo.`,
        `// Capítulo I · día ${number}. Acontecimientos, decisiones y consecuencias.`
    );
}

// Unificar los títulos de los acontecimientos.
replace(
    "src/data/chapters/chapter1/events/day04.ts",
    "// Evento 12.1 — Cuevas de esmeraldas descubierta",
    "// Evento 12.1 — Descubrimiento de las cuevas de esmeraldas"
);

replace(
    "src/data/chapters/chapter1/events/day05.ts",
    "// Evento 26.1 - Herraduras para los nuevos corceles",
    "// Evento 26.1 — Herraduras para los nuevos corceles"
);

// Contenido del capítulo.
headers("src/data/chapters/chapter1", `
    achievements.ts | Define los logros asociados a las decisiones, acontecimientos y finalización del capítulo I.
    ending.ts | Contiene los párrafos del epílogo del capítulo I.
    events/index.ts | Reúne todos los acontecimientos normales y especiales del capítulo I.
`);

// Configuración de estadísticas.
replace(
    "src/data/kingdom/statDefinitions.ts",
    "// Los colores proceden de src/utils/colours.css.",
    "// Los colores proceden de src/styles/tokens/colours.css."
);

// Textos narrativos compartidos.
replace(
    "src/data/narrative/specialAudiences.ts",
    "// Advertencia cuando las arcas se agotan.\n// Advertencia al entrar en deuda.",
    "// Advertencia al entrar en deuda sin alcanzar el límite de bancarrota."
);

replace(
    "src/data/narrative/royalAddressVariants.ts",
    "// Adaptaciones de los diálogos cuando gobierna la reina.",
    "// Adaptaciones de los diálogos cuando gobierna la reina.\n" +
    "// Las expresiones más específicas preceden a las generales para evitar sustituciones parciales incorrectas."
);

headers("src/data/narrative", `
    gameOverMessages.ts | Define los títulos y mensajes narrativos de las distintas causas de derrota.
    welcomeMessage.ts | Genera los párrafos de la introducción según el protagonista elegido.
`);

// Configuración visual.
headers("src/data/scenes", `
    sceneThemes.ts | Define los fondos del salón del trono y los efectos ambientales asociados a modificadores.
    specialSceneRegistry.ts | Registra los escenarios especiales disponibles y sus configuraciones visuales.
`);

// Presentación de las audiencias.
header(
    "src/game/audiences/getAudiencePresentation.ts",
    "Determina el visitante, el diálogo y el momento del día de la audiencia actual."
);

// Consecuencias de las decisiones.
headers("src/game/consequences", `
    applyDailyModifiers.ts | Acumula las consecuencias diarias de los modificadores activos y genera su informe.
    applyStatChanges.ts | Aplica los cambios de estadísticas sin modificar los valores originales.
    checkGameOver.ts | Determina si el estado del reino provoca una derrota.
    getModifierTransition.ts | Calcula los modificadores resultantes y distingue las altas y las bajas efectivas.
`);

// Notificaciones.
headers("src/game/notifications", `
    getNotificationEffect.ts | Selecciona el efecto de sonido correspondiente a cada notificación.
    insertGameNotification.ts | Inserta los avisos por prioridad y orden de llegada sin interrumpir el que ya está visible.
`);

// Progresión.
header(
    "src/game/progression/getDayEvents.ts",
    "Obtiene las audiencias normales disponibles para una jornada según sus desbloqueos."
);

// Escenarios.
header(
    "src/game/scenes/getSceneBackgrounds.ts",
    "Selecciona los fondos de la jornada según los modificadores visuales fijados al comenzar el día."
);

// Estado de partida.
header(
    "src/game/state/initialState.ts",
    "Define las estadísticas iniciales de una nueva partida."
);

before(
    "src/game/consequences/checkGameOver.ts",
    "    if (stats.gold <= BANKRUPTCY_LIMIT) {",
    "    // Si coinciden varias causas de derrota, prevalece la primera según este orden."
);

before(
    "src/game/audiences/getAudiencePresentation.ts",
    "    const morningCount =",
    "    // Distribuir las audiencias entre la mañana y la tarde, dejando el cierre para la noche."
);

before(
    "src/game/audiences/getEventPresentation.ts",
    "    if (monarch === \"king\") {",
    "    // Los diálogos originales corresponden al rey; la reina utiliza las adaptaciones registradas."
);

replace(
    "src/game/consequences/getModifierTransition.ts",
    "// Primero añadir los nuevos modificadores.",
    "// Incorporar los nuevos modificadores sin duplicarlos."
);

replace(
    "src/game/consequences/getModifierTransition.ts",
    "// Después retirar los que hayan finalizado.",
    "// Las retiradas tienen prioridad si un modificador se añade y se elimina en la misma operación."
);

before(
    "src/game/notifications/insertGameNotification.ts",
    "    waiting.sort((a, b) => {",
    "    // Ordenar por prioridad y conservar el orden de llegada dentro de cada categoría."
);

header(
    "src/hooks/game/useGameController.ts",
    "Conecta el motor de partida con React y coordina la presentación, las acciones y los efectos externos."
);

before(
    "src/hooks/game/useGameController.ts",
    "    const visibleStats = closingStats ?? stats;",
    "    // Mantener las estadísticas anteriores al cierre mientras la interfaz termina la jornada."
);

before(
    "src/hooks/game/useGameController.ts",
    "    useGameAutosave(progress);",
    "    // Persistir el progreso de partida independientemente de sus animaciones."
);

before(
    "src/hooks/game/useGameController.ts",
    "    function handleContinue() {",
    "    // Solicitar la continuación de la audiencia o el cierre diario."
);

before(
    "src/hooks/game/useGameController.ts",
    "    function setChapterEndingParagraphIndex(",
    "    // Registrar el párrafo del epílogo para poder recuperarlo tras una recarga."
);

// Navegación principal.
before(
    "src/hooks/app/useAppNavigation.ts",
    "    function confirmStartNewGame() {",
    "    // Sobrescribir la partida únicamente después de recibir la confirmación del jugador."
);

before(
    "src/hooks/app/useAppNavigation.ts",
    "    function handleNavigationFadeEnd() {",
    "    // Cambiar de pantalla cuando el fundido está completamente oscuro."
);

// Notificaciones.
before(
    "src/hooks/app/useGameNotifications.ts",
    "const NOTIFICATION_DURATION = 5000;",
    "// Mantener esta duración sincronizada con --duration-notification de los estilos."
);

// Transiciones.
before(
    "src/hooks/game/useGameTransitions.ts",
    "const BACKGROUND_TRANSITION_DURATION = 1500;",
    "// Duración del cambio de fondo antes de introducir al siguiente visitante."
);

headers("src/storage", `
    achievementsStorage.ts | Conserva los logros desbloqueados independientemente de la partida activa.
    anthemStorage.ts | Conserva permanentemente el desbloqueo del himno de Astaria.
    soundSettingsStorage.ts | Recupera, valida y almacena las preferencias de sonido del jugador.
`);

replace(
    "src/storage/validateSave.ts",
    "        // Los desbloqueos futuros pueden existir antes\n" +
    "        // de que su evento esté implementado.\n" +
    "        isModifierArray(value.activeModifierIds) &&",
    "        isModifierArray(value.activeModifierIds) &&"
);

before(
    "src/storage/validateSave.ts",
    "        isStringArray(value.unlockedEventIds) &&",
    "        // Los desbloqueos pueden referirse a acontecimientos de capítulos aún no implementados."
);

headers("src/types", `
    achievements.ts | Define los logros y las condiciones necesarias para desbloquearlos.
    audio.ts | Define las pistas ambientales, los efectos de sonido y las preferencias del jugador.
    chapters.ts | Define la estructura completa del contenido de un capítulo.
    dialogue.ts | Define las decisiones posibles y la estructura de los diálogos.
    events.ts | Define los acontecimientos narrativos y sus consecuencias sobre la partida.
    gameOver.ts | Enumera las causas de derrota reconocidas por el motor.
    modifiers.ts | Define los modificadores del reino y los informes de sus consecuencias diarias.
    monarch.ts | Define los protagonistas disponibles al comenzar una partida.
    notifications.ts | Define los avisos generados por las acciones y consecuencias del juego.
    stats.ts | Define las estadísticas del reino y sus posibles variaciones.
`);

replace(
    "src/types/saveGame.ts",
    "// Único formato de guardado del juego.\n" +
    "// Se actualizará cuando evolucionen las mecánicas.",
    "// Estado persistente necesario para recuperar una partida.\n" +
    "// No incluye las fases temporales de las animaciones."
);

before(
    "src/types/saveGame.ts",
    "    chapterEndingParagraphIndex: number;",
    "    // Progreso del jugador en el epílogo del capítulo."
);

before(
    "src/types/saveGame.ts",
    "    dayStartStats: KingdomValues;",
    "    // Estadísticas al comenzar la jornada, utilizadas para calcular el balance diario."
);

before(
    "src/types/saveGame.ts",
    "    closingStats: KingdomValues | null;",
    "    // Estadísticas inmediatamente anteriores a la aplicación de los efectos nocturnos."
);

before(
    "src/types/saveGame.ts",
    "    dayEventIds: string[];",
    "    // Audiencias disponibles para la jornada actual."
);

before(
    "src/types/saveGame.ts",
    "    dayClosed: boolean;",
    "    // Impide volver a aplicar las consecuencias nocturnas al recuperar la partida."
);

before(
    "src/types/saveGame.ts",
    "    storyFlags: StoryFlagId[];",
    "    // Condiciones narrativas que pueden alterar acontecimientos y escenarios futuros."
);

before(
    "src/types/saveGame.ts",
    "    sceneModifierIds: ModifierId[];",
    "    // Modificadores fijados al comenzar el día para conservar sus fondos durante toda la jornada."
);

header(
    "src/utils/assetUrl.ts",
    "Resuelve las rutas de recursos teniendo en cuenta la ruta base de la aplicación."
);

headers("src/styles/base", `
    global.css | Estilos generales, estructura de la aplicación y contenedores comunes.
`);

headers("src/styles/menu", `
    AchievementsScreen.css | Distribución visual y estados de los logros.
    MonarchSelection.css | Distribución de la selección de monarca y sus estados interactivos.
`);

header(
    "src/styles/layout/Header.css",
    "Distribución de la cabecera y los controles superiores."
);

header(
    "src/styles/modals/SoundPanel.css",
    "Distribución de la ventana de sonido y sus controles de configuración."
);

// Unificar la terminología.
replace(
    "src/styles/narrative/SpeechBubble.css",
    "/* Bocadillo del rey */",
    "/* Bocadillo del monarca */"
);

replace(
    "src/styles/shared/FadeOverlay.css",
    "/* Fundido interno que también cubre el header */",
    "/* Fundido interno que también cubre la cabecera */"
);

replace(
    "src/styles/base/responsive.css",
    "/* Header */",
    "/* Cabecera */"
);

replace(
    "src/styles/base/responsive.css",
    "/* Header compacto en dos filas */",
    "/* Cabecera compacta en dos filas */"
);

replace(
    "src/styles/kingdom/StatChangeToast.css",
    "/* Grupo de cambios encima de KingdomStats */",
    "/* Grupo de cambios situado sobre las estadísticas del reino */"
);

// Audio.
headers("src/test/audio", `
    soundCatalog.test.ts | Comprueba la existencia de los recursos de audio registrados.
`);

// Componentes.
headers("src/test/components", `
    FadeOverlay.test.tsx | Comprueba los estados visuales y el alcance de los fundidos.
    FormattedText.test.tsx | Comprueba el formato narrativo y su escritura progresiva.
    Modals.test.tsx | Comprueba el cierre mediante teclado y la gestión del foco de las ventanas modales.
    NightRest.test.tsx | Comprueba la representación del descanso nocturno.
    NotificationToast.test.tsx | Comprueba la presentación de los avisos de contenido.
    SceneVisitor.test.tsx | Comprueba la visibilidad del visitante y la finalización de sus animaciones.
    SpecialScene.test.tsx | Comprueba la representación de los escenarios especiales.
    StatChangeToast.test.tsx | Comprueba la presentación de las variaciones de estadísticas.
    ThroneScene.test.tsx | Comprueba los fondos, las poses y los efectos ambientales del salón del trono.
    WelcomeIntroduction.test.tsx | Comprueba la presentación de la introducción para ambos protagonistas.
`);

// Integridad de los contenidos.
headers("src/test/data", `
    achievements.test.ts | Comprueba los requisitos de desbloqueo de los logros.
    chapter1Events.test.ts | Comprueba la coherencia narrativa y los desbloqueos del capítulo I.
    chapterRegistry.test.ts | Comprueba la integridad global de los capítulos, acontecimientos, logros y recursos.
    modifierDefinitions.test.ts | Comprueba las definiciones de los modificadores del reino.
    welcomeMessage.test.ts | Comprueba la adaptación de los textos introductorios al protagonista.
`);

// Audiencias.
headers("src/test/game/audiences", `
    audienceActions.test.ts | Comprueba las operaciones y efectos preparados al decidir o finalizar una audiencia.
    audienceFlow.test.ts | Comprueba la progresión entre audiencias normales y extraordinarias.
    monarchAudiences.test.ts | Comprueba la adaptación de los diálogos y visitantes al protagonista.
`);

// Consecuencias.
headers("src/test/game/consequences", `
    applyDailyModifiers.test.ts | Comprueba la acumulación de los efectos diarios de los modificadores.
    applyStatChanges.test.ts | Comprueba la aplicación de las variaciones de estadísticas.
    checkGameOver.test.ts | Comprueba las condiciones y prioridades de las causas de derrota.
    debtFlow.test.ts | Comprueba la deuda, los intereses y la recuperación económica.
    getEventCompletionConsequences.test.ts | Comprueba las consecuencias que se aplican al finalizar un acontecimiento.
    getModifierTransition.test.ts | Comprueba las incorporaciones y retiradas de modificadores.
    getStatDifferences.test.ts | Comprueba el cálculo de las variaciones reales de estadísticas.
`);

// Notificaciones.
headers("src/test/game/notifications", `
    getNotificationEffect.test.ts | Comprueba la selección de sonidos para los distintos avisos.
    insertGameNotification.test.ts | Comprueba las prioridades y el orden de aparición de las notificaciones.
`);

// Progresión.
headers("src/test/game/progression", `
    chapterFlow.test.ts | Comprueba la finalización y continuación de los capítulos.
    dayFlow.test.ts | Comprueba la preparación de las nuevas jornadas.
    getDayEvents.test.ts | Comprueba la selección y el orden de las audiencias disponibles.
`);

// Escenarios.
headers("src/test/game/scenes", `
    sceneVisualEffects.test.ts | Comprueba la resolución de los efectos ambientales activos.
    specialScenes.test.ts | Comprueba las variantes visuales y el ciclo de los acontecimientos especiales.
`);

// Estado.
headers("src/test/game/state", `
    createGameState.test.ts | Comprueba la creación y recuperación del estado de partida.
    gameReducer.test.ts | Comprueba las transiciones de estado y evita aplicar consecuencias repetidas.
    storyFlags.test.ts | Comprueba la incorporación y retirada de las condiciones narrativas.
`);

// Funciones auxiliares de pruebas.
header(
    "src/test/helpers/createSave.ts",
    "Construye partidas guardadas válidas que pueden personalizarse para cada prueba."
);

// Integración de los hooks.
headers("src/test/hooks", `
    appHooks.test.tsx | Comprueba la navegación, las notificaciones y la gestión del sonido de la aplicación.
    useGameController.test.tsx | Comprueba el motor integrado mediante recorridos completos, recargas y derrotas.
`);

// Persistencia.
headers("src/test/storage", `
    achievementsStorage.test.ts | Comprueba la persistencia y validación de los logros desbloqueados.
    anthemStorage.test.ts | Comprueba la persistencia del desbloqueo del himno.
    gameStorage.test.ts | Comprueba la recuperación y el rechazo de partidas guardadas inválidas.
    soundSettingsStorage.test.ts | Comprueba la persistencia y validación de las preferencias de sonido.
`);

// Organización del CSS.
header(
    "src/test/styles/styleOrganization.test.ts",
    "Comprueba la centralización de las reglas responsive y el orden de carga de los estilos compartidos."
);

// Configuración de Vite.
header(
    "vite.config.ts",
    "Configura la compilación de la aplicación React y su publicación bajo la ruta base del proyecto."
);

// Configuración de ESLint.
header(
    "eslint.config.js",
    "Configura las comprobaciones de calidad de TypeScript y las reglas de React."
);

// Configuración de TypeScript.
for (const path of [
    "tsconfig.app.json",
    "tsconfig.node.json",
]) {
    replace(
        path,
        "/* Bundler mode */",
        "/* Resolución de módulos y compilación */"
    );

    replace(
        path,
        "/* Linting */",
        "/* Comprobaciones del código */"
    );
}

// Archivos excluidos del repositorio.
replace(
    ".gitignore",
    "# Logs",
    "# Registros de ejecución"
);

replace(
    ".gitignore",
    "# Editor directories and files",
    "# Archivos y directorios de los editores"
);

// Revisar todas las modificaciones antes de escribir.
const changedFiles = [...files.entries()].filter(
    ([, file]) => file.original !== file.current
);

for (const [path] of changedFiles) {
    console.log(`[ACTUALIZADO] ${path}`);
}

for (const error of errors) {
    console.error(`[REVISAR] ${error}`);
}

console.log("\n----------------------------");
console.log(`Archivos procesados: ${files.size}`);
console.log(`Archivos modificados: ${changedFiles.length}`);
console.log(`Pendientes de revisar: ${errors.length}`);

if (errors.length > 0) {
    console.error(
        "No se ha modificado ningún archivo. Revisa las incidencias."
    );

    process.exitCode = 1;
} else if (apply) {
    for (const [path, file] of changedFiles) {
        fs.writeFileSync(path, file.current, "utf8");
    }

    console.log("Comentarios actualizados.");
} else {
    console.log(
        "Simulación: no se ha modificado ningún archivo."
    );
}