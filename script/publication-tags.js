/**
 * Tags editoriais das publicações da Rádio Geração Ativa.
 *
 * Este catálogo é independente das categorias e tags de busca dos ícones.
 * Para incluir uma nova opção no Admin e nos filtros públicos, basta adicioná-la
 * à lista abaixo. Tags já gravadas no Firebase continuam sendo preservadas.
 */
export const PUBLICATION_TAGS = Object.freeze([
    "Semana de Oração",
    "Eventos",
    "UNASP",
    "Esportes",
    "Entrevistas",
    "Avisos",
    "Programação",
    "Bastidores",
    "Música",
    "Cultura",
    "Educação"
]);

export function normalizarTagsPublicacao(tags) {
    if (!Array.isArray(tags)) {
        return [];
    }

    const tagsUnicas = new Map();

    tags.forEach((tag) => {
        const valor = String(tag ?? "").trim();
        const chave = valor
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLocaleLowerCase("pt-BR");

        if (valor && !tagsUnicas.has(chave)) {
            tagsUnicas.set(chave, valor);
        }
    });

    return [...tagsUnicas.values()];
}
