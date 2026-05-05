import React from 'react';
import Modal from '../../components/Modal';

export default function ExerciseFormModal({
    isOpen,
    onClose,
    onSubmit,
    editingExercise,
    formData,
    setFormData,
    muscleGroups,
    equipments,
    handleFileChange,
    uploading
}) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editingExercise ? '✏️ Editar Exercício' : '➕ Novo Exercício'}
            maxWidth="600px"
        >
            <form onSubmit={onSubmit} className="space-y-4">
                <div className="form-group">
                    <label className="block text-sm font-semibold !text-slate-200 mb-1">Nome do Exercício *</label>
                    <input
                        type="text"
                        className="w-full !bg-slate-800/50 border !border-slate-600 rounded-lg p-2.5 !text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                        value={formData.nome || ''}
                        onChange={e => setFormData({ ...formData, nome: e.target.value })}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                        <label className="block text-sm font-semibold !text-slate-200 mb-1">Grupo Muscular *</label>
                        <select
                            className="w-full !bg-slate-800 border !border-slate-600 rounded-lg p-2.5 !text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                            value={formData.grupo_muscular || ''}
                            onChange={e => setFormData({ ...formData, grupo_muscular: e.target.value })}
                            required
                        >
                            <option value="" disabled className="bg-slate-900">Selecione um grupo</option>
                            {muscleGroups.filter(g => g.active).map(g => (
                                <option key={g.id} value={g.name} className="bg-slate-900 text-white">
                                    {g.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="block text-sm font-semibold !text-slate-200 mb-1">Equipamento *</label>
                        <select
                            className="w-full !bg-slate-800 border !border-slate-600 rounded-lg p-2.5 !text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                            value={formData.equipamento || ''}
                            onChange={e => setFormData({ ...formData, equipamento: e.target.value })}
                            required
                        >
                            <option value="" disabled className="bg-slate-900">Selecione um equipamento</option>
                            {equipments.filter(e => e.active).map(eq => (
                                <option key={eq.id} value={eq.name} className="bg-slate-900 text-white">
                                    {eq.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label className="block text-sm font-semibold !text-slate-200 mb-1">Imagem do Exercício</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            id="exercise-image-upload"
                        />
                        <label
                            htmlFor="exercise-image-upload"
                            className="cursor-pointer bg-slate-800/80 hover:bg-slate-700 text-white px-4 py-2.5 rounded-lg border !border-slate-600 flex items-center justify-center gap-2 transition-colors"
                        >
                            {uploading ? '⏳' : '📷'} {uploading ? 'Carregando...' : 'Escolher Arquivo'}
                        </label>
                        <input
                            type="text"
                            className="flex-1 !bg-slate-800/50 border !border-slate-600 rounded-lg p-2.5 !text-slate-100 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                            value={formData.image_url || ''}
                            onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                            placeholder="Ou cole uma URL aqui"
                        />
                    </div>
                    {formData.image_url && (
                        <div className="mt-3 p-2 bg-slate-800/50 rounded-lg border border-slate-700 flex items-center gap-3">
                            <img
                                src={formData.image_url}
                                alt="Preview"
                                className="w-16 h-16 object-cover rounded border border-slate-600"
                            />
                            <span className="text-xs text-slate-500 truncate">{formData.image_url}</span>
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label className="block text-sm font-semibold !text-slate-200 mb-1">URL do Vídeo (Youtube)</label>
                    <input
                        type="text"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={formData.video_url || ''}
                        onChange={e => setFormData({ ...formData, video_url: e.target.value })}
                        placeholder="https://youtube.com/..."
                    />
                </div>

                <div className="form-group">
                    <label className="block text-sm font-semibold !text-slate-200 mb-1">Descrição / Instruções</label>
                    <textarea
                        className="w-full !bg-slate-800/50 border !border-slate-600 rounded-lg p-2.5 !text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 h-24 resize-none transition-all"
                        value={formData.descricao || ''}
                        onChange={e => setFormData({ ...formData, descricao: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label className="block text-sm font-semibold !text-slate-200 mb-1">Status</label>
                    <select
                        className="w-full !bg-slate-800 border !border-slate-600 rounded-lg p-2.5 !text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                        value={formData.ativo}
                        onChange={e => setFormData({ ...formData, ativo: e.target.value === 'true' })}
                    >
                        <option value="true" className="bg-slate-900 text-white">Ativo</option>
                        <option value="false" className="bg-slate-900 text-white">Inativo (Ocultar na prescrição)</option>
                    </select>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/50">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 !text-slate-400 hover:!text-white font-medium hover:bg-slate-800 rounded-lg transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2 rounded-lg shadow-lg shadow-orange-500/20 transition-all"
                    >
                        💾 Salvar
                    </button>
                </div>
            </form>
        </Modal>
    );
}
