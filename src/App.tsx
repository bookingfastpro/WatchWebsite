import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Settings, ChevronRight, Filter, Plus, Trash2, Edit2, Upload, ArrowLeft, Phone } from 'lucide-react';
import { cn, formatPrice } from './lib/utils';
import { Watch } from './types';

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Nos montres', path: '/catalog' },
    { name: 'À propos', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass-dark border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="text-xl font-display font-bold tracking-tighter flex items-center gap-2">
          <span className="text-gold-500">MMW</span>
          <span className="text-white/90">WATCHES</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-sm uppercase tracking-[0.2em] transition-colors hover:text-gold-400",
                location.pathname === link.path ? "text-gold-500 font-semibold" : "text-white/60"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button 
            className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-20 left-0 w-full bg-[#050505]/95 backdrop-blur-3xl border-b border-white/5 p-8 flex flex-col gap-6 shadow-2xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "text-lg uppercase tracking-widest",
                  location.pathname === link.path ? "text-gold-500" : "text-white/60"
                )}
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const WatchCard = ({ watch }: { watch: Watch }) => {
  return (
    <motion.div
      whileHover={{ y: -12, scale: 1.02 }}
      className="group relative glass rounded-[2.5rem] overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-500"
    >
      <Link to={`/watch/${watch.id}`} className="block">
        <div className="aspect-[4/5] overflow-hidden bg-neutral-950 relative">
          <img
            src={watch.images[0]}
            alt={watch.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
          
          {/* Badge Price Floating */}
          <div className="absolute bottom-6 right-6 glass px-4 py-2 rounded-full border-gold-500/30">
            <p className="text-lg font-bold text-gold-400 tracking-tight">{formatPrice(watch.price)}</p>
          </div>
        </div>
        <div className="p-8">
          <div className="flex justify-between items-start mb-3">
            <p className="text-[10px] uppercase tracking-[0.4em] text-gold-500/60 font-bold">{watch.brand}</p>
            <span className="text-[10px] uppercase tracking-widest text-white/40">{watch.type}</span>
          </div>
          <h3 className="text-2xl font-display font-bold mb-1 group-hover:text-gold-400 transition-colors leading-tight">{watch.name}</h3>
          <div className="w-12 h-0.5 bg-gold-500/20 group-hover:w-full transition-all duration-500 mt-4" />
        </div>
      </Link>
    </motion.div>
  );
};

// --- Pages ---

const Home = () => {
  const [featured, setFeatured] = useState<Watch[]>([]);
  const [randomWatch, setRandomWatch] = useState<Watch | null>(null);

  useEffect(() => {
    fetch('/api/watches')
      .then(res => res.json())
      .then(data => {
        setFeatured(data.slice(0, 3));
        if (data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length);
          setRandomWatch(data[randomIndex]);
        }
      });
  }, []);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={randomWatch?.images[0] || "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=1920"} 
            alt="Luxury Watch Background"
            className="w-full h-full object-cover opacity-30 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-500 text-[10px] uppercase tracking-[0.3em] font-bold mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
                Expertise Professionnelle Certifiée
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-8 leading-[1.1] tracking-tight">
                La référence des <br />
                <span className="text-gradient-gold italic pr-2">collectionneurs</span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/50 mb-12 max-w-lg leading-relaxed font-light">
                Acquérez des garde-temps d'exception auprès d'un réseau de professionnels vérifiés. 
                Chaque montre est expertisée pour garantir son authenticité et sa valeur.
              </p>
              
              <div className="flex flex-wrap gap-6 items-center">
                <Link 
                  to="/catalog"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-gold-500 text-black font-bold uppercase tracking-widest rounded-full hover:bg-gold-400 transition-all transform hover:scale-105 shadow-lg shadow-gold-500/20"
                >
                  Explorer la collection <ChevronRight size={20} />
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="hidden lg:block relative max-w-md ml-auto"
            >
              <AnimatePresence mode="wait">
                {randomWatch && (
                  <motion.div
                    key={randomWatch.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="relative z-10 glass rounded-[3rem] p-3 border-white/5 overflow-hidden transform hover:rotate-2 transition-transform duration-700 aspect-[4/5] max-h-[60vh]"
                  >
                    <Link to={`/watch/${randomWatch.id}`}>
                      <img 
                        src={randomWatch.images[0]} 
                        alt={randomWatch.name} 
                        className="rounded-[2.5rem] w-full h-full object-cover shadow-2xl"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-6 left-6 right-6 glass p-4 rounded-2xl border-white/10 backdrop-blur-xl">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-white font-bold text-base">{randomWatch.brand}</h4>
                            <p className="text-white/40 text-[10px] uppercase tracking-widest">{randomWatch.name}</p>
                          </div>
                          <div className="text-gold-500 font-display font-bold text-lg">
                            {formatPrice(randomWatch.price)}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-gold-500/10 rounded-full blur-[80px]" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-gold-500/5 rounded-full blur-[80px]" />
            </motion.div>
          </div>
        </div>

        {/* Trust Bar */}
        <div className="absolute bottom-0 left-0 w-full glass-dark border-t border-white/5 py-8 hidden md:block">
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center opacity-40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center">
                <Settings size={16} className="text-gold-500" />
              </div>
              <div>
                <p className="text-white text-[10px] uppercase tracking-widest font-bold">Authenticité</p>
                <p className="text-white/50 text-[9px] uppercase tracking-tighter">Garantie à 100%</p>
              </div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center">
                <Plus size={16} className="text-gold-500" />
              </div>
              <div>
                <p className="text-white text-[10px] uppercase tracking-widest font-bold">Expertise</p>
                <p className="text-white/50 text-[9px] uppercase tracking-tighter">Par des professionnels</p>
              </div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center">
                <ChevronRight size={16} className="text-gold-500" />
              </div>
              <div>
                <p className="text-white text-[10px] uppercase tracking-widest font-bold">Livraison</p>
                <p className="text-white/50 text-[9px] uppercase tracking-tighter">Sécurisée & Assurée</p>
              </div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center">
                <Filter size={16} className="text-gold-500" />
              </div>
              <div>
                <p className="text-white text-[10px] uppercase tracking-widest font-bold">Paiement</p>
                <p className="text-white/50 text-[9px] uppercase tracking-tighter">Escrow sécurisé</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Section 1: Professional Intermediary */}
      <section className="py-24 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xs uppercase tracking-[0.5em] text-gold-500/60 font-bold mb-6">Notre Rôle</h2>
              <h3 className="text-3xl md:text-5xl font-display font-bold mb-8 leading-tight tracking-tight">
                L'intermédiaire <br />
                <span className="text-gradient-gold italic pr-2">professionnel</span> de confiance
              </h3>
              <p className="text-white/50 text-lg font-light leading-relaxed mb-8">
                MMW Watches n'est pas qu'une simple plateforme. Nous garantissons une transaction sécurisée et transparente pour chaque collectionneur. Notre expertise de 4 ans nous permet de filtrer, vérifier et garantir chaque pièce.
              </p>
              <ul className="space-y-4">
                {[
                  "Sélection rigoureuse des garde-temps",
                  "Inspection physique de chaque pièce",
                  "Vérification de la provenance et des documents",
                  "Accompagnement personnalisé de A à Z"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/70 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-video glass rounded-[2.5rem] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1585123334904-845d60e97b29?auto=format&fit=crop&q=80&w=1000" 
                  alt="Expertise horlogère" 
                  className="w-full h-full object-cover opacity-60"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -top-6 -left-6 glass p-6 rounded-2xl border-gold-500/20">
                <Settings className="text-gold-500 mb-2" size={24} />
                <p className="text-xs font-bold uppercase tracking-widest">Expertise 100%</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* New Section 2: Security & Escrow */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-xs uppercase tracking-[0.5em] text-gold-500/60 font-bold mb-6">Transactions Sécurisées</h2>
          <h3 className="text-3xl md:text-5xl font-display font-bold tracking-tight">Votre sérénité est notre <span className="text-gradient-gold italic pr-2">priorité</span></h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Paiement Séquestre",
              desc: "Vos fonds sont conservés sur un compte tiers sécurisé et ne sont débloqués qu'après réception et validation de la montre.",
              icon: <Plus className="rotate-45" />
            },
            {
              title: "Contrat de Vente",
              desc: "Chaque transaction est encadrée par un contrat professionnel garantissant vos droits et l'authenticité du produit.",
              icon: <ChevronRight />
            },
            {
              title: "Expédition Assurée",
              desc: "Toutes nos livraisons sont effectuées via des transporteurs spécialisés avec une assurance à 100% de la valeur.",
              icon: <ChevronRight className="rotate-90" />
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="glass p-10 rounded-[2.5rem] border-white/5 hover:border-gold-500/20 transition-colors group"
            >
              <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-500 mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h4 className="text-xl font-display font-bold mb-4">{feature.title}</h4>
              <p className="text-white/40 text-sm leading-relaxed font-light">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Watches */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-xs uppercase tracking-[0.5em] text-gold-500/60 font-bold mb-4">Sélection Premium</h2>
            <h3 className="text-3xl md:text-4xl font-display font-bold">Modèles Populaires</h3>
          </div>
          <Link to="/catalog" className="text-white/40 hover:text-gold-500 transition-colors uppercase text-[10px] font-bold tracking-[0.3em] flex items-center gap-2">
            Voir tout <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map((watch, idx) => (
            <motion.div
              key={watch.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <WatchCard watch={watch} />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

const Catalog = () => {
  const [watches, setWatches] = useState<Watch[]>([]);
  const [filter, setFilter] = useState({ brand: 'All', type: 'All' });

  useEffect(() => {
    fetch('/api/watches')
      .then(res => res.json())
      .then(data => setWatches(data));
  }, []);

  const brands = ['All', ...new Set(watches.map(w => w.brand))];
  const types = ['All', ...new Set(watches.map(w => w.type))];

  const filteredWatches = watches.filter(w => 
    (filter.brand === 'All' || w.brand === filter.brand) &&
    (filter.type === 'All' || w.type === filter.type)
  );

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-6">
      <header className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4 tracking-tighter">Nos montres</h1>
        <p className="text-white/40 max-w-2xl mx-auto text-sm md:text-base font-light">
          Chaque pièce est sélectionnée pour son histoire, sa mécanique et son design intemporel.
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-8 mb-16 justify-center">
        <div className="flex items-center gap-6 glass px-8 py-5 rounded-full">
          <Filter size={20} className="text-gold-500" />
          <select 
            className="bg-transparent text-white/80 outline-none cursor-pointer"
            value={filter.brand}
            onChange={(e) => setFilter({ ...filter, brand: e.target.value })}
          >
            {brands.map(b => <option key={b} value={b} className="bg-black">{b}</option>)}
          </select>
          <div className="w-px h-6 bg-white/10 mx-2" />
          <select 
            className="bg-transparent text-white/80 outline-none cursor-pointer"
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          >
            {types.map(t => <option key={t} value={t} className="bg-black">{t}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredWatches.map((watch) => (
          <WatchCard key={watch.id} watch={watch} />
        ))}
      </div>
    </div>
  );
};

const About = () => {
  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="aspect-[4/5] glass rounded-[3rem] overflow-hidden card-shadow">
            <img 
              src="https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=1000" 
              alt="Passionné de montres" 
              className="w-full h-full object-cover opacity-80"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-10 -right-10 glass p-8 rounded-3xl border-gold-500/20 hidden md:block">
            <p className="text-4xl font-display font-bold text-gold-500">4+</p>
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Années d'expertise</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-xs uppercase tracking-[0.5em] text-gold-500/60 font-bold mb-6">L'histoire de MMW</h2>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-8 leading-tight tracking-tight">
            Une passion <br />
            <span className="text-gradient-gold italic pr-2">intemporelle</span>
          </h1>
          
          <div className="space-y-6 text-white/50 text-lg font-light leading-relaxed">
            <p>
              Ma fascination pour l'horlogerie ne date pas d'hier. Depuis mon plus jeune âge, j'ai toujours été captivé par la complexité des mouvements mécaniques et l'élégance des designs qui traversent les époques. Ce qui n'était au départ qu'une curiosité d'enfant s'est transformé en une véritable vocation.
            </p>
            <p>
              Aujourd'hui, cela fait maintenant 4 ans que je me consacre professionnellement à la vente et à l'expertise de montres de luxe. Mon objectif avec MMW Watches est simple : partager cette passion avec d'autres collectionneurs et offrir un accès sécurisé à des pièces d'exception.
            </p>
            <p>
              Chaque montre qui passe entre mes mains est traitée avec le respect qu'elle mérite. Je m'assure personnellement de l'authenticité et de la qualité de chaque garde-temps, car je sais qu'une montre est bien plus qu'un simple instrument de mesure du temps ; c'est un héritage, un investissement et une œuvre d'art.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 mt-12">
            <div className="glass p-6 rounded-2xl border-white/5">
              <p className="text-white font-bold mb-1 italic">Expertise</p>
              <p className="text-white/40 text-xs">Vérification rigoureuse de chaque pièce.</p>
            </div>
            <div className="glass p-6 rounded-2xl border-white/5">
              <p className="text-white font-bold mb-1 italic">Confiance</p>
              <p className="text-white/40 text-xs">Un réseau de collectionneurs satisfaits.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const Contact = () => {
  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-6">
      <div className="text-center mb-20">
        <h2 className="text-xs uppercase tracking-[0.5em] text-gold-500/60 font-bold mb-6">Contactez-nous</h2>
        <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight">Parlons de votre <span className="text-gradient-gold italic pr-2">prochain</span> projet</h1>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="glass p-10 rounded-[2.5rem] border-white/5">
            <h3 className="text-xl font-display font-bold mb-8 italic">Nos coordonnées</h3>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center shrink-0">
                  <Phone size={20} className="text-gold-500" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Téléphone</p>
                  <p className="text-white font-medium">+33 1 23 45 67 89</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center shrink-0">
                  <Settings size={20} className="text-gold-500" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Email</p>
                  <p className="text-white font-medium">contact@mmw-watches.fr</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center shrink-0">
                  <ChevronRight size={20} className="text-gold-500" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Boutique</p>
                  <p className="text-white font-medium">Place Vendôme, Paris</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="glass p-10 rounded-[2.5rem] border-gold-500/10 bg-gold-500/[0.02] h-full flex items-center">
              <p className="text-white/50 text-lg leading-relaxed font-light italic">
                "Chaque montre raconte une histoire. Je suis là pour vous aider à trouver celle qui écrira la vôtre."
              </p>
            </div>
            
            <a 
              href="tel:+33123456789"
              className="w-full py-6 bg-gold-500 text-black font-bold uppercase tracking-[0.3em] rounded-2xl hover:bg-gold-400 transition-all shadow-xl shadow-gold-500/20 flex items-center justify-center gap-3"
            >
              <Phone size={20} /> Appeler maintenant
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [watch, setWatch] = useState<Watch | null>(null);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    fetch('/api/watches')
      .then(res => res.json())
      .then(data => {
        const found = data.find((w: Watch) => w.id === id);
        setWatch(found || null);
      });
  }, [id]);

  if (!watch) return <div className="pt-40 text-center font-display text-2xl animate-pulse">Chargement...</div>;

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-6">
      <Link to="/catalog" className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-12 transition-colors uppercase text-[10px] font-bold tracking-[0.3em]">
        <ArrowLeft size={14} /> Retour à nos montres
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Gallery */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square glass rounded-[3rem] overflow-hidden bg-neutral-950 card-shadow"
          >
            <img 
              src={watch.images[activeImg]} 
              alt={watch.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="flex gap-6 justify-center">
            {watch.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImg(idx)}
                className={cn(
                  "w-24 h-24 glass rounded-2xl overflow-hidden border-2 transition-all duration-300",
                  activeImg === idx ? "border-gold-500 scale-110" : "border-transparent opacity-40 hover:opacity-80"
                )}
              >
                <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <p className="text-gold-500 uppercase tracking-[0.6em] text-[10px] font-bold mb-4">{watch.brand}</p>
          <h1 className="text-3xl md:text-5xl font-display font-extrabold mb-6 leading-tight tracking-tighter">{watch.name}</h1>
          <div className="inline-block glass px-6 py-3 rounded-full border-gold-500/20 w-fit mb-8">
            <p className="text-xl md:text-2xl font-bold text-gradient-gold">{formatPrice(watch.price)}</p>
          </div>
          
          <div className="glass p-10 rounded-[2.5rem] mb-12">
            <h3 className="text-xl font-display font-bold mb-6 border-b border-white/5 pb-4">Description</h3>
            <p className="text-white/50 leading-relaxed mb-10 font-light text-lg">{watch.description}</p>
            
            <h3 className="text-xl font-display font-bold mb-6 border-b border-white/5 pb-4">Caractéristiques</h3>
            <div className="grid grid-cols-2 gap-y-6 text-sm">
              <div className="text-white/40 uppercase tracking-widest text-[10px] font-bold">Mouvement</div>
              <div className="text-white/90 font-medium">{watch.specs.movement}</div>
              <div className="text-white/40 uppercase tracking-widest text-[10px] font-bold">Matériau</div>
              <div className="text-white/90 font-medium">{watch.specs.material}</div>
              <div className="text-white/40 uppercase tracking-widest text-[10px] font-bold">Année</div>
              <div className="text-white/90 font-medium">{watch.specs.year || 'N/A'}</div>
              <div className="text-white/40 uppercase tracking-widest text-[10px] font-bold">État / Set</div>
              <div className="text-white/90 font-medium">{watch.specs.set || 'N/A'}</div>
              <div className="text-white/40 uppercase tracking-widest text-[10px] font-bold">Réserve de marche</div>
              <div className="text-white/90 font-medium">{watch.specs.powerReserve}</div>
              <div className="text-white/40 uppercase tracking-widest text-[10px] font-bold">Étanchéité</div>
              <div className="text-white/90 font-medium">{watch.specs.waterResistance}</div>
            </div>
          </div>

          <a 
            href="tel:+33123456789"
            className="w-full py-5 bg-gold-500 text-black font-bold uppercase tracking-widest rounded-2xl hover:bg-gold-400 transition-all shadow-lg shadow-gold-500/20 flex items-center justify-center gap-3"
          >
            <Phone size={20} /> Contacter le vendeur
          </a>
        </div>
      </div>
    </div>
  );
};

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [watches, setWatches] = useState<Watch[]>([]);
  const [isEditing, setIsEditing] = useState<Watch | null>(null);
  const [newWatch, setNewWatch] = useState<Partial<Watch>>({
    name: '', brand: '', price: 0, type: 'Sport', description: '',
    specs: { movement: '', material: '', powerReserve: '', waterResistance: '', year: '', set: 'Full Set' },
    images: []
  });

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/check-auth');
      const data = await res.json();
      setIsAuthenticated(data.isAuthenticated);
    } catch (err) {
      setIsAuthenticated(false);
    }
  };

  const fetchWatches = () => {
    fetch('/api/watches')
      .then(res => res.json())
      .then(data => setWatches(data));
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWatches();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: loginPassword })
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
      } else {
        setLoginError('Mot de passe incorrect');
      }
    } catch (err) {
      setLoginError('Erreur de connexion au serveur');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    setIsAuthenticated(false);
    setLoginPassword('');
  };

  const handleSave = async () => {
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `/api/watches/${isEditing.id}` : '/api/watches';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isEditing || newWatch)
    });
    
    setIsEditing(null);
    setNewWatch({
      name: '', brand: '', price: 0, type: 'Sport', description: '',
      specs: { movement: '', material: '', powerReserve: '', waterResistance: '' },
      images: []
    });
    fetchWatches();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer cette montre ?')) {
      await fetch(`/api/watches/${id}`, { method: 'DELETE' });
      fetchWatches();
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleUpload triggered");
    const file = e.target.files?.[0];
    if (!file) {
      console.log("No file selected");
      return;
    }
    console.log("File selected:", file.name, file.size, file.type);

    const formData = new FormData();
    formData.append('image', file);

    try {
      console.log("Sending upload request to /api/upload");
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      console.log("Upload response status:", res.status);
      const data = await res.json();
      console.log("Upload response data:", data);
      
      if (!res.ok) {
        alert(`Erreur d'upload: ${data.message || res.statusText}`);
        return;
      }

      const { url } = data;
      console.log("Extracted URL:", url);
      
      if (url) {
        if (isEditing) {
          setIsEditing({ ...isEditing, images: [...isEditing.images, url] });
        } else {
          setNewWatch({ ...newWatch, images: [...(newWatch.images || []), url] });
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Une erreur est survenue lors de l'envoi de l'image.");
    }
  };

  if (isAuthenticated === null) return <div className="pt-40 text-center font-display text-2xl animate-pulse">Vérification...</div>;

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6 pt-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-12 rounded-[3rem] w-full max-w-md border-white/10 card-shadow"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/20 text-gold-500 mb-6">
              <Settings size={32} />
            </div>
            <h1 className="text-3xl font-display font-bold tracking-tighter">Accès Admin</h1>
            <p className="text-white/40 text-sm mt-2 font-light">Veuillez vous authentifier pour continuer</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-2">Mot de passe</label>
              <input 
                type="password" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-gold-500 transition-colors text-white"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            {loginError && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-xs ml-2 font-medium"
              >
                {loginError}
              </motion.p>
            )}
            <button 
              type="submit"
              className="w-full py-5 bg-gold-500 text-black font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-gold-400 transition-all shadow-lg shadow-gold-500/10 active:scale-95"
            >
              Se connecter
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tighter">Admin Panel</h1>
          <p className="text-white/40 text-sm font-light mt-1">Gérez votre collection de montres d'exception</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleLogout}
            className="px-6 py-4 bg-white/5 hover:bg-red-500/10 text-white/60 hover:text-red-400 rounded-2xl transition-all border border-white/10 font-bold uppercase text-[10px] tracking-[0.3em]"
          >
            Déconnexion
          </button>
          <button 
            onClick={() => setIsEditing(null)}
            className="flex items-center gap-3 px-8 py-4 bg-gold-500 text-black rounded-2xl transition-all hover:bg-gold-400 font-bold uppercase text-[10px] tracking-[0.3em] shadow-lg shadow-gold-500/10"
          >
            <Plus size={18} /> Ajouter une montre
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Form */}
        <div className="lg:col-span-1 glass p-10 rounded-[2.5rem] h-fit sticky top-32">
          <h2 className="text-3xl font-display font-bold mb-8">{isEditing ? 'Modifier' : 'Ajouter'}</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-2">Nom du modèle</label>
              <input 
                type="text" placeholder="Ex: Daytona" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-gold-500 transition-colors"
                value={(isEditing ? isEditing.name : newWatch.name) || ''}
                onChange={e => isEditing ? setIsEditing({...isEditing, name: e.target.value}) : setNewWatch({...newWatch, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-2">Marque</label>
              <input 
                type="text" placeholder="Ex: Rolex" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-gold-500 transition-colors"
                value={(isEditing ? isEditing.brand : newWatch.brand) || ''}
                onChange={e => isEditing ? setIsEditing({...isEditing, brand: e.target.value}) : setNewWatch({...newWatch, brand: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-2">Prix (€)</label>
              <input 
                type="number" placeholder="Ex: 15000" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-gold-500 transition-colors"
                value={(isEditing ? isEditing.price : newWatch.price) || 0}
                onChange={e => isEditing ? setIsEditing({...isEditing, price: Number(e.target.value)}) : setNewWatch({...newWatch, price: Number(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-2">Description</label>
              <textarea 
                placeholder="Détails du garde-temps..." className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-gold-500 h-32 transition-colors resize-none"
                value={(isEditing ? isEditing.description : newWatch.description) || ''}
                onChange={e => isEditing ? setIsEditing({...isEditing, description: e.target.value}) : setNewWatch({...newWatch, description: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-2">Mouvement</label>
                <input 
                  type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-gold-500 transition-colors text-sm"
                  value={(isEditing ? isEditing.specs.movement : newWatch.specs?.movement) || ''}
                  onChange={e => isEditing ? setIsEditing({...isEditing, specs: {...isEditing.specs, movement: e.target.value}}) : setNewWatch({...newWatch, specs: {...(newWatch.specs as any), movement: e.target.value}})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-2">Matériau</label>
                <input 
                  type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-gold-500 transition-colors text-sm"
                  value={(isEditing ? isEditing.specs.material : newWatch.specs?.material) || ''}
                  onChange={e => isEditing ? setIsEditing({...isEditing, specs: {...isEditing.specs, material: e.target.value}}) : setNewWatch({...newWatch, specs: {...(newWatch.specs as any), material: e.target.value}})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-2">Année</label>
                <input 
                  type="text" placeholder="Ex: 2023" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-gold-500 transition-colors text-sm"
                  value={(isEditing ? isEditing.specs.year : newWatch.specs?.year) || ''}
                  onChange={e => isEditing ? setIsEditing({...isEditing, specs: {...isEditing.specs, year: e.target.value}}) : setNewWatch({...newWatch, specs: {...(newWatch.specs as any), year: e.target.value}})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-2">Set</label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-gold-500 transition-colors text-sm appearance-none"
                  value={(isEditing ? isEditing.specs.set : newWatch.specs?.set) || 'Full Set'}
                  onChange={e => isEditing ? setIsEditing({...isEditing, specs: {...isEditing.specs, set: e.target.value}}) : setNewWatch({...newWatch, specs: {...(newWatch.specs as any), set: e.target.value}})}
                >
                  <option value="Full Set" className="bg-black">Full Set</option>
                  <option value="Boîte uniquement" className="bg-black">Boîte uniquement</option>
                  <option value="Papiers uniquement" className="bg-black">Papiers uniquement</option>
                  <option value="Montre seule" className="bg-black">Montre seule</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-2">Galerie Photos</label>
              <div className="flex flex-wrap gap-3 mb-4">
                {(isEditing ? isEditing.images : newWatch.images)?.map((img, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-2xl overflow-hidden glass border border-white/10">
                    <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <button 
                      onClick={() => {
                        const imgs = isEditing ? [...isEditing.images] : [...(newWatch.images || [])];
                        imgs.splice(i, 1);
                        isEditing ? setIsEditing({...isEditing, images: imgs}) : setNewWatch({...newWatch, images: imgs});
                      }}
                      className="absolute top-1 right-1 bg-red-500/80 backdrop-blur-md p-1.5 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                <label className="flex flex-col items-center justify-center gap-3 w-full py-8 border-2 border-dashed border-white/10 rounded-[2rem] cursor-pointer hover:border-gold-500/50 hover:bg-white/[0.02] transition-all">
                  <Upload size={24} className="text-gold-500/50" />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-white/40">Ajouter une image</span>
                  <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Ou collez une URL d'image..." 
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-xs outline-none focus:border-gold-500 transition-colors"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const url = (e.target as HTMLInputElement).value;
                        if (url) {
                          if (isEditing) {
                            setIsEditing({ ...isEditing, images: [...isEditing.images, url] });
                          } else {
                            setNewWatch({ ...newWatch, images: [...(newWatch.images || []), url] });
                          }
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={handleSave}
              className="w-full py-5 bg-gold-500 text-black font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-gold-400 transition-all shadow-lg shadow-gold-500/10 mt-4"
            >
              Enregistrer les modifications
            </button>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2 space-y-6">
          {watches.map(watch => (
            <div key={watch.id} className="glass p-8 rounded-[2rem] flex items-center gap-8 group hover:border-white/20 transition-all">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-neutral-950 border border-white/5">
                <img src={watch.images[0]} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-[0.4em] text-gold-500/60 font-bold mb-1">{watch.brand}</p>
                <h3 className="text-2xl font-display font-bold mb-1">{watch.name}</h3>
                <p className="text-gold-400 font-bold tracking-tight">{formatPrice(watch.price)}</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsEditing(watch)}
                  className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-white/60 hover:text-gold-400"
                >
                  <Edit2 size={20} />
                </button>
                <button 
                  onClick={() => handleDelete(watch.id)}
                  className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-white/60 hover:text-red-400"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Footer = () => (
  <footer className="glass-dark border-t border-white/5 py-24">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
      <div className="col-span-1 md:col-span-2">
        <Link to="/" className="text-xl font-display font-bold tracking-tighter mb-8 block">
          <span className="text-gold-500">MMW</span> WATCHES
        </Link>
        <p className="text-white/30 max-w-sm leading-relaxed font-light text-base">
          Votre partenaire de confiance pour l'acquisition et l'expertise de montres de luxe. L'excellence au service du temps.
        </p>
      </div>
      <div>
        <h4 className="text-gold-500 uppercase tracking-[0.4em] text-[10px] font-bold mb-8">Navigation</h4>
        <ul className="space-y-5 text-white/40 text-sm font-medium">
          <li><Link to="/" className="hover:text-gold-400 transition-colors">Accueil</Link></li>
          <li><Link to="/catalog" className="hover:text-gold-400 transition-colors">Nos montres</Link></li>
          <li><Link to="/about" className="hover:text-gold-400 transition-colors">À propos</Link></li>
          <li><Link to="/contact" className="hover:text-gold-400 transition-colors">Contact</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-gold-500 uppercase tracking-[0.4em] text-[10px] font-bold mb-8">Contact</h4>
        <ul className="space-y-5 text-white/40 text-sm font-medium">
          <li>Place Vendôme, Paris</li>
          <li>+33 1 23 45 67 89</li>
          <li>contact@luxe-horlogerie.fr</li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-white/30 text-[10px] uppercase tracking-[0.5em] font-bold">
      <div>© 2026 MMW Watches. Tous droits réservés.</div>
      <Link to="/admin" className="hover:text-gold-500/50 transition-colors">Espace Admin</Link>
    </div>
  </footer>
);

export default function App() {
  return (
    <div className="min-h-screen font-sans">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/watch/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
