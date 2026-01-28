/**
 * Formatea el nombre de una categoría/área para mostrar en formato sentence case
 * @param category - El nombre de la categoría (ej: "GERIATRIA", "PSICOLOGIA")
 * @returns El nombre formateado (ej: "Geriatria", "Psicologia")
 */
export function formatCategoryDisplay(category: string): string {
    if (!category) return '';
    if (category === 'Todas las áreas') return 'Todas las áreas';
    return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
}
