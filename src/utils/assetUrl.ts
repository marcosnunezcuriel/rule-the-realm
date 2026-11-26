// Resuelve las rutas de recursos teniendo en cuenta la ruta base de la aplicación.

export function assetUrl(path: string): string {
    const relativePath = path.replace(/^\/+/, "");

    return `${import.meta.env.BASE_URL}${relativePath}`;
}
