const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const root = path.resolve("src");
const apply = process.argv.includes("--apply");

// Orden de los grupos de importaciones.
const groups = [
    "external",
    "audio",
    "components",
    "data",
    "game",
    "hooks",
    "storage",
    "types",
    "utils",
    "test",
    "styles",
];

// Archivos cuyo orden de importación debe conservarse.
const excludedFiles = new Set([
    path.join(root, "main.tsx"),
]);

// Obtener los archivos TypeScript del proyecto.
function getFiles(directory) {
    return fs.readdirSync(directory, {
        withFileTypes: true,
    }).flatMap((entry) => {
        const fullPath = path.join(
            directory,
            entry.name
        );

        return entry.isDirectory()
            ? getFiles(fullPath)
            : [fullPath];
    });
}

// Normalizar una ruta para compararla.
function normalize(value) {
    return value.replaceAll("\\", "/");
}

// Identificar el grupo según la carpeta de destino.
function getImportInfo(file, specifier) {
    if (!specifier.startsWith(".")) {
        return {
            group: "external",
            destination: specifier,
        };
    }

    const target = path.resolve(
        path.dirname(file),
        specifier
    );

    const destination = normalize(
        path.relative(root, target)
    );

    const group = specifier.endsWith(".css")
        ? "styles"
        : destination.split("/")[0];

    return {
        group,
        destination,
    };
}

// Ordenar las importaciones de un archivo.
function sortImports(file) {
    const content = fs.readFileSync(file, "utf8");

    const source = ts.createSourceFile(
        file,
        content,
        ts.ScriptTarget.Latest,
        true
    );

    const imports = [];

    for (const statement of source.statements) {
        if (!ts.isImportDeclaration(statement)) {
            break;
        }

        imports.push(statement);
    }

    if (imports.length < 2) {
        return { status: "unchanged" };
    }

    // Evitar mover comentarios asociados a imports.
    for (let index = 1; index < imports.length; index++) {
        const previous = imports[index - 1];
        const current = imports[index];

        const gap = content.slice(
            previous.getEnd(),
            current.getStart(source)
        );

        if (gap.trim() !== "") {
            return {
                status: "review",
                reason: "Comentarios entre imports",
            };
        }
    }

    const firstImport = imports[0];
    const lastImport = imports[imports.length - 1];

    const start = firstImport.getStart(source);
    const end = lastImport.getEnd();

    const prefix = content.slice(0, start);

    // Conservar las directivas de entorno de Vitest.
    if (
        !/^\s*(?:\/\/ @vitest-environment \w+\s*)?$/.test(
            prefix
        )
    ) {
        return {
            status: "review",
            reason: "Comentarios o directivas iniciales",
        };
    }

    // No separar un comentario situado al final de un import.
    if (
        /^[ \t]*(?:\/\/|\/\*)/.test(
            content.slice(end)
        )
    ) {
        return {
            status: "review",
            reason: "Comentario al final del import",
        };
    }

    const entries = [];

    for (const [index, declaration] of imports.entries()) {
        const specifier =
            declaration.moduleSpecifier.text;

        const info = getImportInfo(
            file,
            specifier
        );

        if (!groups.includes(info.group)) {
            return {
                status: "review",
                reason: `Grupo desconocido: ${specifier}`,
            };
        }

        // Los imports con efectos secundarios distintos
        // del CSS requieren una revisión manual.
        if (
            declaration.importClause === undefined &&
            info.group !== "styles"
        ) {
            return {
                status: "review",
                reason: `Import con efectos secundarios: ${specifier}`,
            };
        }

        entries.push({
            text: declaration.getText(source),
            group: info.group,
            destination: info.destination,
            index,
        });
    }

    entries.sort((first, second) => {
        const groupDifference =
            groups.indexOf(first.group) -
            groups.indexOf(second.group);

        if (groupDifference !== 0) {
            return groupDifference;
        }

        // Conservar el orden relativo de los CSS.
        if (first.group === "styles") {
            return first.index - second.index;
        }

        return first.destination.localeCompare(
            second.destination,
            "en"
        ) || first.index - second.index;
    });

    // Respetar los saltos de línea originales.
    const newLine = content.includes("\r\n")
        ? "\r\n"
        : "\n";

    const sections = [];

    for (const group of groups) {
        const declarations = entries
            .filter((entry) => entry.group === group)
            .map((entry) => entry.text);

        if (declarations.length > 0) {
            sections.push(
                declarations.join(newLine)
            );
        }
    }

    const replacement = sections.join(
        newLine + newLine
    );

    const updated =
        content.slice(0, start) +
        replacement +
        content.slice(end);

    if (updated === content) {
        return { status: "unchanged" };
    }

    if (apply) {
        fs.writeFileSync(
            file,
            updated,
            "utf8"
        );
    }

    return {
        status: "changed",
    };
}

// Archivos que deben revisarse.
const files = [
    ...getFiles(root).filter((file) => {
        return /\.(ts|tsx)$/.test(file);
    }),

    path.resolve("vite.config.ts"),
    path.resolve("eslint.config.js"),
];

let changed = 0;
let unchanged = 0;
let excluded = 0;
let pending = 0;

for (const file of files) {
    const relative = normalize(
        path.relative(process.cwd(), file)
    );

    if (excludedFiles.has(file)) {
        excluded++;

        console.log(`[EXCLUIDO] ${relative}`);
        continue;
    }

    const result = sortImports(file);

    switch (result.status) {
        case "changed":
            changed++;

            console.log(`[ORDENADO] ${relative}`);
            break;

        case "unchanged":
            unchanged++;
            break;

        case "review":
            pending++;

            console.warn(`[REVISAR] ${relative}`);
            console.warn(`  ${result.reason}`);
            break;
    }
}

console.log("\n----------------------------");
console.log(`Archivos ordenados: ${changed}`);
console.log(`Sin cambios: ${unchanged}`);
console.log(`Excluidos: ${excluded}`);
console.log(`Pendientes de revisar: ${pending}`);

console.log(
    apply
        ? "Cambios aplicados."
        : "Simulación: no se ha modificado nada."
);