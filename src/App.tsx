import { useState, useEffect } from 'react';
import { auth } from './firebase';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User, signOut } from 'firebase/auth';
import { LogIn, LogOut, LayoutDashboard, User as UserIcon, Trophy, ListChecks, Calendar } from 'lucide-react';
import RegistrationForm from './components/RegistrationForm';
import RegistrationList from './components/RegistrationList';
import ErrorBoundary from './components/ErrorBoundary';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'register' | 'admin'>('register');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  const handleLogout = () => signOut(auth);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#F8F9FC] text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-black tracking-tight text-gray-900 uppercase">TORNEIO VOLEIBOL 6X6</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => setView('register')}
              className={`text-sm font-bold transition-colors ${view === 'register' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Inscrição
            </button>
            {user && (
              <button 
                onClick={() => setView('admin')}
                className={`text-sm font-bold transition-colors ${view === 'admin' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Dashboard
              </button>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-gray-900">{user.displayName}</p>
                  <button onClick={handleLogout} className="text-[10px] text-gray-500 hover:text-red-600 font-bold uppercase tracking-wider">Sair</button>
                </div>
                <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-gray-200" />
              </div>
            ) : (
              <button 
                onClick={handleLogin}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all"
              >
                <LogIn className="w-4 h-4" /> Admin
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Info */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
                Edição 2026
              </span>
              <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-[0.9] tracking-tighter mb-6">
                O MAIOR <br />
                <span className="text-indigo-600">DESAFIO</span> <br />
                DO ANO.
              </h1>
              <p className="text-gray-600 text-lg max-w-md">
                Junta-te aos melhores atletas da região. Inscrições abertas para todas as categorias. Garante o teu lugar agora.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <Calendar className="w-5 h-5 text-indigo-600 mb-2" />
                <p className="text-xs font-bold text-gray-400 uppercase">Data</p>
                <p className="text-sm font-bold text-gray-900">Maio</p>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <ListChecks className="w-5 h-5 text-indigo-600 mb-2" />
                <p className="text-xs font-bold text-gray-400 uppercase">Vagas</p>
                <p className="text-sm font-bold text-gray-900">Limitadas</p>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <img key={i} src={`https://picsum.photos/seed/user${i}/100/100`} className="w-10 h-10 rounded-full border-2 border-white" referrerPolicy="no-referrer" />
                  ))}
                </div>
                <p className="text-sm font-medium text-gray-500">
                  <span className="text-gray-900 font-bold">+150</span> atletas já inscritos
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Content */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {view === 'register' ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <RegistrationForm />
                </motion.div>
              ) : (
                <motion.div
                  key="admin"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Dashboard Admin</h2>
                        <p className="text-sm text-gray-500">Gestão de inscrições em tempo real.</p>
                      </div>
                      <button 
                        onClick={() => setView('register')}
                        className="text-xs font-bold text-indigo-600 hover:underline"
                      >
                        Voltar ao formulário
                      </button>
                    </div>
                    <RegistrationList />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">TORNEIO VOLEIBOL 6X6 &copy; 2026</p>
          <p className="text-sm text-gray-500">Desenvolvido para excelência desportiva.</p>
        </div>
      </footer>
    </div>
    </ErrorBoundary>
  );
}
