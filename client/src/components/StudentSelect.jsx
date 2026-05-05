import React from 'react';

export default function StudentSelect({ value, onChange, students, label = 'Selecione um Aluno', error }) {
    return (
        <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 'medium',
                color: '#94a3b8',
                marginBottom: '0.5rem'
            }}>{label}</label>
            <select
                value={value}
                onChange={onChange}
                style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#0f172a',
                    border: `1px solid ${error ? '#ef4444' : '#334155'}`,
                    borderRadius: '0.5rem',
                    color: '#f8fafc',
                    fontSize: '1rem',
                    outline: 'none'
                }}
            >
                <option value="">Selecione...</option>
                {students.map(s => (
                    <option key={s.id || s._id} value={s.id || s._id}>{s.nome}</option>
                ))}
            </select>
            {error && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{error}</p>}
        </div>
    );
}
