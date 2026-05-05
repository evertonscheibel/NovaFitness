import React from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, maxWidth = '500px', children }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
        }} onClick={onClose}>
            <div className="modal" style={{
                backgroundColor: '#1e293b',
                border: '1px solid rgba(249, 115, 22, 0.3)',
                borderRadius: '1rem',
                width: '100%',
                maxWidth,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                overflow: 'hidden'
            }} onClick={e => e.stopPropagation()}>
                <div className="modal-header" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1.25rem',
                    borderBottom: '1px solid rgba(51, 65, 85, 0.5)'
                }}>
                    <h2 style={{
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        color: '#f8fafc',
                        margin: 0
                    }}>{title}</h2>
                    <button onClick={onClose} className="btn-close" style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#64748b',
                        cursor: 'pointer',
                        padding: '0.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <X className="w-6 h-6 hover:text-white transition-colors" />
                    </button>
                </div>
                <div className="modal-body" style={{ padding: '1.5rem' }}>
                    {children}
                </div>
            </div>
        </div>
    );
}
