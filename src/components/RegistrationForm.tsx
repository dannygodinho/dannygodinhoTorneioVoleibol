import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Player } from '../types';
import { Trophy, User, Mail, Phone, Users, CheckCircle2, AlertCircle, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    teamName: '',
  });
  const [players, setPlayers] = useState<Player[]>(Array(8).fill({ name: '', studentNumber: '' }));
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const activePlayers = players.filter(p => p.name.trim() !== '' && p.studentNumber.trim() !== '');
      
      await addDoc(collection(db, 'registrations'), {
        ...formData,
        players: activePlayers,
        createdAt: serverTimestamp(),
      });
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', teamName: '' });
      setPlayers(Array(8).fill({ name: '', studentNumber: '' }));
    } catch (error: any) {
      console.error('Error adding registration:', error);
      setStatus('error');
      setErrorMessage('Ocorreu um erro ao processar a sua inscrição. Por favor, tente novamente.');
    }
  };

  if (status === 'success') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-100 text-center"
      >
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Inscrição Confirmada!</h3>
        <p className="text-gray-600 mb-6">A sua inscrição no TORNEIO VOLEIBOL 6X6 foi registada com sucesso. Entraremos em contacto em breve.</p>
        <button 
          onClick={() => setStatus('idle')}
          className="px-6 py-2 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
        >
          Nova Inscrição
        </button>
      </motion.div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
          <Trophy className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Formulário de Inscrição</h2>
          <p className="text-sm text-gray-500">Preencha os dados para participar no torneio.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <User className="w-4 h-4" /> Nome do Responsável da Equipa *
          </label>
          <input
            required
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: João Silva"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Mail className="w-4 h-4" /> Email *
            </label>
            <input
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="joao@exemplo.com"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Phone className="w-4 h-4" /> Telemóvel
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="912 345 678"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Users className="w-4 h-4" /> Nome da Equipa
          </label>
          <input
            type="text"
            value={formData.teamName}
            onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
            placeholder="Ex: Os Vencedores"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Users className="w-4 h-4" /> Jogadores (Mínimo 6, Máximo 8)
          </label>
          <div className="space-y-3">
            {players.map((player, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-gray-50/50 rounded-xl border border-gray-100">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    required={index < 6}
                    value={player.name}
                    onChange={(e) => {
                      const newPlayers = [...players];
                      newPlayers[index] = { ...player, name: e.target.value };
                      setPlayers(newPlayers);
                    }}
                    placeholder={`Nome do Jogador ${index + 1}`}
                    className="w-full pl-8 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                  <input
                    type="text"
                    required={index < 6}
                    value={player.studentNumber}
                    onChange={(e) => {
                      const newPlayers = [...players];
                      newPlayers[index] = { ...player, studentNumber: e.target.value };
                      setPlayers(newPlayers);
                    }}
                    placeholder="Nº de aluno"
                    className="w-full pl-8 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 italic">
            * Os primeiros 6 jogadores são obrigatórios para a constituição da equipa.
          </p>
        </div>

        <AnimatePresence>
          {status === 'error' && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
        >
          {status === 'submitting' ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              A processar...
            </>
          ) : (
            'Confirmar Inscrição'
          )}
        </button>
      </form>
    </div>
  );
}
