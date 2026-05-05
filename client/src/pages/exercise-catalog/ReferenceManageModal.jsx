import React from 'react';
import Modal from '../../components/Modal';

export default function ReferenceManageModal({
    isOpen,
    onClose,
    manageType,
    newItemName,
    setNewItemName,
    handleAddReference,
    manageList,
    handleToggleReference
}) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Gerenciar ${manageType === 'group' ? 'Grupos Musculares' : 'Equipamentos'}`}
            maxWidth="500px"
        >
            <form onSubmit={handleAddReference} className="flex gap-2 mb-6">
                <input
                    type="text"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Novo item..."
                    required
                />
                <button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold transition-colors"
                >
                    Adicionar
                </button>
            </form>

            <div className="max-h-80 overflow-y-auto rounded-lg border border-slate-700 bg-slate-900/50">
                <table className="w-full border-collapse">
                    <thead className="bg-slate-800/50">
                        <tr>
                            <th className="text-left p-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Nome</th>
                            <th className="text-center p-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-24">Ativo</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {manageList.map(item => (
                            <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                                <td className="p-3 text-slate-300 font-medium">{item.name}</td>
                                <td className="p-3 text-center">
                                    <button
                                        type="button"
                                        onClick={() => handleToggleReference(item.id, item.active)}
                                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${item.active
                                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                            }`}
                                    >
                                        {item.active ? 'Sim' : 'Não'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {manageList.length === 0 && (
                            <tr>
                                <td colSpan="2" className="p-8 text-center text-slate-500 italic">
                                    Nenhum item cadastrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Modal>
    );
}
