import React from 'react';

export default function LoadingSpinner({ message = 'Carregando...' }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            gap: '1rem',
            width: '100%',
            height: '100%'
        }}>
            <div style={{
                width: '3rem',
                height: '3rem',
                border: '4px solid rgba(249, 115, 22, 0.1)',
                borderTop: '4px solid #f97316',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }} />
            <p style={{
                color: '#94a3b8',
                fontSize: '0.875rem',
                fontWeight: 'medium'
            }}>⏳ {message}</p>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
