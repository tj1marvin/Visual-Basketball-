import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Network,
  Layout,
  GraduationCap,
  MessageCircle,
  Dribbble,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

import BasketballWeb from './components/BasketballWeb';
import ContentModal from './components/ContentModal';
import CourtDiagram from './components/CourtDiagram';
import Quiz from './components/Quiz';
import FeedbackForm from './components/FeedbackForm';
import { BasketballNode } from './data/basketballData';

type Section = 'web' | 'court' | 'quiz' | 'feedback';

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('web');
  const [selectedNode, setSelectedNode] = useState<BasketballNode | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'web', label: 'Knowledge Web', icon: Network },
    { id: 'court', label: 'Position Lab', icon: Layout },
    { id: 'quiz', label: 'Skill Check', icon: GraduationCap },
    { id: 'feedback', label: 'Feedback', icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-orange-500/30">
      {/* Sidebar Navigation */}
      <nav className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-zinc-950 border-r border-zinc-800 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-8">
            <div className="flex items-center gap-3 text-orange-500 mb-2">
              <Dribbble className="w-8 h-8 animate-pulse" />
              <span className="text-xl font-black uppercase tracking-tighter">Hoops Academy</span>
            </div>
            <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest">Master the Game</p>
          </div>

          <div className="flex-1 px-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id as Section);
                  setIsMobileMenuOpen(false);
                }}
                className={`
                  w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 group
                  ${activeSection === item.id
                    ? 'bg-zinc-900 text-white shadow-lg shadow-black/50'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'}
                `}
              >
                <item.icon className={`w-5 h-5 ${activeSection === item.id ? 'text-orange-500' : 'text-zinc-600 group-hover:text-zinc-400'}`} />
                <span className="font-semibold tracking-tight">{item.label}</span>
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeNav"
                    className="ml-auto"
                  >
                    <ChevronRight className="w-4 h-4 text-orange-500" />
                  </motion.div>
                )}
              </button>
            ))}
          </div>

          <div className="p-8 border-t border-zinc-900">
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4">
              <h4 className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-1">Current Progress</h4>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-black text-white">42%</span>
                <span className="text-zinc-500 text-xs mb-1">of curriculum</span>
              </div>
              <div className="mt-3 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 w-[42%]" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 inset-x-0 h-16 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 z-30 flex items-center justify-between px-6">
        <div className="flex items-center gap-2 text-orange-500">
          <Dribbble className="w-6 h-6" />
          <span className="font-black uppercase tracking-tighter">Hoops Academy</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-zinc-400"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="lg:ml-72 min-h-screen pt-16 lg:pt-0 relative">
        <div className="h-full">
          {activeSection === 'web' && (
            <div className="h-[calc(100vh-64px)] lg:h-screen">
              <BasketballWeb onNodeClick={(node) => setSelectedNode(node)} />
            </div>
          )}

          {activeSection === 'court' && (
            <div className="p-6 lg:p-12 h-full">
              <CourtDiagram />
            </div>
          )}

          {activeSection === 'quiz' && (
            <div className="p-6 lg:p-12 flex items-center justify-center min-h-[calc(100vh-64px)] lg:min-h-screen">
              <Quiz />
            </div>
          )}

          {activeSection === 'feedback' && (
            <div className="p-6 lg:p-12 flex items-center justify-center min-h-[calc(100vh-64px)] lg:min-h-screen">
              <FeedbackForm />
            </div>
          )}
        </div>

        {/* Content Overlay Modal */}
        <ContentModal
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      </main>

      {/* Global Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}
