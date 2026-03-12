import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Registration } from '../types';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Search, Filter, Download, User, Mail, Calendar } from 'lucide-react';

export default function RegistrationList() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'registrations'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Registration[];
      setRegistrations(docs);
      setLoading(false);
    }, (error) => {
      console.error("Erro ao carregar inscrições:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filtered = registrations.filter(reg => {
    const matchesSearch = reg.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (reg.teamName?.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-gray-500 font-medium">A carregar inscrições...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Procurar por nome, email ou equipa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
            <Download className="w-4 h-4" /> Exportar
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-bottom border-gray-200">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Participante</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Equipa</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Jogadores</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Contacto</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((reg) => (
                <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs">
                        {reg.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{reg.name}</div>
                        <div className="text-xs text-gray-500">{reg.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{reg.teamName || 'Individual'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-500">
                      {reg.players?.length || 0} jogadores inscritos
                    </div>
                    <div className="text-[10px] text-gray-400 truncate max-w-[200px]">
                      {reg.players?.map(p => `${p.name} (${p.studentNumber})`).join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{reg.phone || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-500">
                      {reg.createdAt ? format(reg.createdAt.toDate(), "d 'de' MMM, HH:mm", { locale: pt }) : 'Pendente'}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                    Nenhuma inscrição encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
