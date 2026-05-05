export function getErrorMessage(error, prefix = 'Erro') {
    if (typeof error === 'string') return `${prefix}: ${error}`;

    const msg = error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Erro inesperado ocorrido.';

    return `${prefix}: ${msg}`;
}

export function handleAPIError(error, prefix = 'Erro') {
    const message = getErrorMessage(error, prefix);
    alert(message);
    console.error(`[API Error] ${prefix}:`, error);
    return message;
}
