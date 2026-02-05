import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Save } from 'lucide-react';

export default function AddItemModal({ onClose }) {
    const { categories, addNewItem } = useApp();
    const [formData, setFormData] = useState({
        name: '',
        category: categories[0],
        description: '',
        imageUrl: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name) return;
        addNewItem(formData);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2>Novo Item</h2>
                    <button className="btn-icon" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Nome</label>
                        <input
                            className="input-field"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ex: Arroz Tio João"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Categoria</label>
                        <select
                            className="input-field"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Descrição (Opcional)</label>
                        <input
                            className="input-field"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Ex: 5kg, pacote azul"
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        {/* Simple Toggle Mock */}
                        <input type="checkbox" id="stock" style={{ width: '20px', height: '20px' }} />
                        <label htmlFor="stock">Item de estoque mensal?</label>
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                        <Save size={20} />
                        Salvar Item
                    </button>
                </form>
            </div>
        </div>
    );
}
