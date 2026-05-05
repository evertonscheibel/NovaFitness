export const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('pt-BR');
};

export const formatTime = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

export const todayISO = () => {
    return new Date().toISOString().split('T')[0];
};

export const formatRelativeDate = (date) => {
    if (!date) return '—';
    const postDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now - postDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;

    return postDate.toLocaleDateString('pt-BR');
};
