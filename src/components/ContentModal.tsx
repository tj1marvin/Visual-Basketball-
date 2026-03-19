import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, BookOpen } from 'lucide-react';
import { BasketballNode } from '../data/basketballData';

interface ContentModalProps {
  node: BasketballNode | null;
  onClose: () => void;
}

const ContentModal: React.FC<ContentModalProps> = ({ node, onClose }) => {
  if (!node) return null;

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getVimeoId = (url: string) => {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : null;
  };

  const youtubeId = node.videoUrl ? getYoutubeId(node.videoUrl) : null;
  const vimeoId = node.videoUrl ? getVimeoId(node.videoUrl) : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="p-6 border-bottom border-zinc-800 flex justify-between items-center bg-zinc-900/50">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-orange-500" />
                {node.label}
              </h2>
              <p className="text-zinc-400 text-sm mt-1">{node.description}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {node.videoUrl ? (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-zinc-800 bg-black shadow-2xl">
                {youtubeId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}`}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                ) : vimeoId ? (
                  <iframe
                    src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&loop=1`}
                    className="w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    key={node.videoUrl}
                    src={node.videoUrl}
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ) : node.media && (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-zinc-800 group">
                <img
                  src={node.media}
                  alt={node.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-orange-500 p-3 rounded-full text-white">
                    <Play className="w-6 h-6 fill-current" />
                  </div>
                </div>
              </div>
            )}

            <div className="prose prose-invert max-w-none">
              <p className="text-zinc-300 leading-relaxed text-lg">
                {node.content || "Explore more about this topic in the Hoops Academy curriculum. This section covers the fundamental concepts and advanced techniques used by professionals."}
              </p>
            </div>

            {node.children && node.children.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Subtopics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {node.children.map(child => (
                    <div
                      key={child.id}
                      className="p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-300 text-sm hover:border-orange-500/50 transition-colors"
                    >
                      {child.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-lg transition-colors"
            >
              Got it
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ContentModal;
