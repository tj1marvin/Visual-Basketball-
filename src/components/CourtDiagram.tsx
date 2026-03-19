import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation, animate, useMotionValue, useTransform } from 'motion/react';
import { Target, Info, Play, Pause, RotateCcw, LayoutGrid, Eye, EyeOff, Sparkles, BarChart3, Plus, Minus, Pencil, Eraser, StickyNote, Trash2, Save, FolderOpen, Check, Timer, Zap, Shield, Crown, Activity } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface PlayStep {
  positions: Record<string, Point>;
  ball?: Point;
  duration?: number;
  score?: string;
  assist?: string;
  rebound?: string;
}

interface PlayDefinition {
  id: string;
  name: string;
  description: string;
  steps: PlayStep[];
  loop?: boolean;
}

interface PlayerTrail {
  id: string;
  points: Point[];
  color: string;
}

interface SavedStrategy {
  id: string;
  name: string;
  notes: string;
  drawings: Point[][];
  timestamp: number;
}

const POSITIONS = [
  { id: 'pg', name: 'PG', number: '0', fullName: 'Point Guard', color: 'from-blue-500 to-blue-700', initial: { x: 50, y: 15 }, icon: Timer },
  { id: 'sg', name: 'SG', number: '1', fullName: 'Shooting Guard', color: 'from-emerald-500 to-emerald-700', initial: { x: 20, y: 30 }, icon: Target },
  { id: 'sf', name: 'SF', number: '2', fullName: 'Small Forward', color: 'from-violet-500 to-violet-700', initial: { x: 80, y: 30 }, icon: Zap },
  { id: 'pf', name: 'PF', number: '3', fullName: 'Power Forward', color: 'from-rose-500 to-rose-700', initial: { x: 30, y: 65 }, icon: Shield },
  { id: 'c', name: 'C', number: '4', fullName: 'Center', color: 'from-amber-500 to-amber-700', initial: { x: 70, y: 65 }, icon: Crown },
];

const PLAYS: PlayDefinition[] = [
  {
    id: 'five-out',
    name: '5-Out Spacing',
    description: 'Maximum spacing with all players on the perimeter.',
    steps: [
      {
        positions: {
          pg: { x: 50, y: 25 },
          sg: { x: 10, y: 40 },
          sf: { x: 90, y: 40 },
          pf: { x: 15, y: 80 },
          c: { x: 85, y: 80 },
        },
        ball: { x: 50, y: 30 }
      }
    ]
  },
  {
    id: 'horns',
    name: 'Horns Set',
    description: 'Two bigs at the elbows, shooters in the corners.',
    steps: [
      {
        positions: {
          pg: { x: 50, y: 20 },
          sg: { x: 8, y: 90 },
          sf: { x: 92, y: 90 },
          pf: { x: 35, y: 45 },
          c: { x: 65, y: 45 },
        },
        ball: { x: 50, y: 25 }
      }
    ]
  },
  {
    id: 'triangle',
    name: 'Triangle Offense',
    description: 'Classic triple-post spacing for read-and-react play.',
    steps: [
      {
        positions: {
          pg: { x: 75, y: 30 },
          sg: { x: 92, y: 85 },
          sf: { x: 25, y: 25 },
          pf: { x: 10, y: 85 },
          c: { x: 80, y: 70 },
        },
        ball: { x: 75, y: 35 }
      }
    ]
  },
  {
    id: 'spain-pnr',
    name: 'Spain Pick & Roll',
    description: 'Ball screen with a back screen for the roller.',
    steps: [
      {
        positions: {
          pg: { x: 50, y: 20 },
          sg: { x: 10, y: 85 },
          sf: { x: 90, y: 85 },
          pf: { x: 50, y: 45 },
          c: { x: 65, y: 35 },
        },
        ball: { x: 50, y: 25 }
      },
      {
        positions: {
          pg: { x: 35, y: 35 },
          sg: { x: 10, y: 85 },
          sf: { x: 90, y: 85 },
          pf: { x: 50, y: 30 },
          c: { x: 55, y: 60 },
        },
        ball: { x: 35, y: 40 },
        assist: 'pg'
      },
      {
        positions: {
          pg: { x: 30, y: 40 },
          sg: { x: 10, y: 85 },
          sf: { x: 90, y: 85 },
          pf: { x: 50, y: 20 },
          c: { x: 50, y: 15 },
        },
        ball: { x: 50, y: 11 },
        score: 'c'
      }
    ]
  },
  {
    id: 'elevator',
    name: 'Elevator Doors',
    description: 'Two bigs close the "doors" for a shooter.',
    steps: [
      {
        positions: {
          pg: { x: 20, y: 30 },
          sg: { x: 50, y: 85 },
          sf: { x: 90, y: 30 },
          pf: { x: 40, y: 55 },
          c: { x: 60, y: 55 },
        },
        ball: { x: 20, y: 35 }
      },
      {
        positions: {
          pg: { x: 25, y: 35 },
          sg: { x: 50, y: 35 },
          sf: { x: 90, y: 30 },
          pf: { x: 42, y: 55 },
          c: { x: 58, y: 55 },
        },
        ball: { x: 45, y: 35 }
      }
    ]
  },
  {
    id: 'floppy',
    name: 'Floppy Action',
    description: 'Shooter chooses between a single or double screen.',
    steps: [
      {
        positions: {
          pg: { x: 50, y: 20 },
          sg: { x: 50, y: 80 },
          sf: { x: 10, y: 85 },
          pf: { x: 25, y: 65 },
          c: { x: 75, y: 65 },
        },
        ball: { x: 50, y: 25 }
      },
      {
        positions: {
          pg: { x: 40, y: 25 },
          sg: { x: 15, y: 45 },
          sf: { x: 10, y: 85 },
          pf: { x: 25, y: 65 },
          c: { x: 75, y: 65 },
        },
        ball: { x: 25, y: 45 }
      }
    ]
  },
  {
    id: 'fast-break',
    name: 'Fast Break',
    description: 'Dynamic transition play with full court movement.',
    steps: [
      {
        positions: {
          pg: { x: 50, y: 90 },
          sg: { x: 10, y: 80 },
          sf: { x: 90, y: 80 },
          pf: { x: 30, y: 70 },
          c: { x: 70, y: 70 },
        },
        ball: { x: 50, y: 85 },
        duration: 800
      },
      {
        positions: {
          pg: { x: 50, y: 40 },
          sg: { x: 15, y: 30 },
          sf: { x: 85, y: 30 },
          pf: { x: 20, y: 60 },
          c: { x: 80, y: 60 },
        },
        ball: { x: 50, y: 45 },
        duration: 800
      },
      {
        positions: {
          pg: { x: 30, y: 20 },
          sg: { x: 10, y: 15 },
          sf: { x: 90, y: 15 },
          pf: { x: 20, y: 40 },
          c: { x: 50, y: 10 },
        },
        ball: { x: 50, y: 15 },
        duration: 800
      }
    ]
  }
];

const CourtDiagram: React.FC = () => {
  const [playerPositions, setPlayerPositions] = useState<Record<string, { x: number, y: number }>>(
    POSITIONS.reduce((acc, p) => ({ ...acc, [p.id]: p.initial }), {})
  );
  const [ballPosition, setBallPosition] = useState<Point>({ x: 50, y: 25 });
  const [ballTrail, setBallTrail] = useState<Point[]>([]);
  const [activePlay, setActivePlay] = useState<string | null>(null);
  const activePlayRef = useRef<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false);
  const [playerTrails, setPlayerTrails] = useState<PlayerTrail[]>([]);
  const [showTactical, setShowTactical] = useState(false);
  const [playerStats, setPlayerStats] = useState<Record<string, { points: number, assists: number, rebounds: number }>>(
    POSITIONS.reduce((acc, p) => ({ ...acc, [p.id]: { points: 0, assists: 0, rebounds: 0 } }), {})
  );
  
  // Coach Mode State
  const [isCoachMode, setIsCoachMode] = useState(false);
  const [coachDrawings, setCoachDrawings] = useState<Point[][]>([]);
  const [currentDrawing, setCurrentDrawing] = useState<Point[] | null>(null);
  const [coachNotes, setCoachNotes] = useState<string>('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStepIndexRef = useRef(0);
  const [savedStrategies, setSavedStrategies] = useState<SavedStrategy[]>([]);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  
  const courtRef = useRef<HTMLDivElement>(null);
  const prevPositionsRef = useRef(playerPositions);
  const prevBallPositionRef = useRef(ballPosition);
  const ballControls = useAnimation();
  const ballScale = useMotionValue(1);
  const ballRotate = useMotionValue(0);
  const shadowScale = useTransform(ballScale, [1, 1.5], [1, 0.6]);
  const shadowOpacity = useTransform(ballScale, [1, 1.5], [0.6, 0.3]);

  // Load saved strategies from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('hoops-academy-strategies');
    if (saved) {
      try {
        setSavedStrategies(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load strategies', e);
      }
    }
  }, []);

  const saveStrategy = () => {
    const name = prompt('Enter a name for this strategy:');
    if (!name) return;

    const newStrategy: SavedStrategy = {
      id: Date.now().toString(),
      name,
      notes: coachNotes,
      drawings: coachDrawings,
      timestamp: Date.now()
    };

    const updated = [...savedStrategies, newStrategy];
    setSavedStrategies(updated);
    localStorage.setItem('hoops-academy-strategies', JSON.stringify(updated));
    
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 2000);
  };

  const loadStrategy = (strategy: SavedStrategy) => {
    setCoachNotes(strategy.notes);
    setCoachDrawings(strategy.drawings);
  };

  const deleteStrategy = (id: string) => {
    if (!confirm('Are you sure you want to delete this strategy?')) return;
    const updated = savedStrategies.filter(s => s.id !== id);
    setSavedStrategies(updated);
    localStorage.setItem('hoops-academy-strategies', JSON.stringify(updated));
  };

  // Realistic Ball Physics: Spin and Bounce reactive to movement
  useEffect(() => {
    const prev = prevBallPositionRef.current;
    const curr = ballPosition;
    
    const dx = curr.x - prev.x;
    const dy = curr.y - prev.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 0.5) {
      // Calculate spin based on direction and distance
      const spinAngle = distance * 10; // 10 degrees per % distance
      
      // Calculate bounce sequence
      // Long passes have higher arcs (larger scale)
      const maxScale = 1 + Math.min(distance / 50, 0.5); 
      
      animate(ballRotate, [0, spinAngle], { duration: 0.6, ease: "easeOut" });
      animate(ballScale, [1, maxScale, 1], { 
        duration: 0.6, 
        times: [0, 0.5, 1],
        ease: ["easeOut", "easeIn"] 
      });
    }
    
    prevBallPositionRef.current = curr;
  }, [ballPosition, ballScale, ballRotate]);

  // Track movement and create trails
  useEffect(() => {
    const newTrails: PlayerTrail[] = [];
    POSITIONS.forEach(pos => {
      const prev = prevPositionsRef.current[pos.id];
      const curr = playerPositions[pos.id];
      
      if (prev && (Math.abs(prev.x - curr.x) > 1 || Math.abs(prev.y - curr.y) > 1)) {
        newTrails.push({
          id: `${pos.id}-${Date.now()}-${Math.random()}`,
          points: [prev, curr],
          color: pos.color
        });
      }
    });

    if (newTrails.length > 0) {
      setPlayerTrails(prev => [...prev, ...newTrails]);
      setTimeout(() => {
        setPlayerTrails(prev => prev.filter(t => !newTrails.find(nt => nt.id === t.id)));
      }, 2000);
    }
    prevPositionsRef.current = playerPositions;
  }, [playerPositions]);

  // Track ball movement for trail
  useEffect(() => {
    setBallTrail(prev => {
      const newTrail = [...prev, ballPosition].slice(-15);
      return newTrail;
    });
    
    const timer = setTimeout(() => {
      setBallTrail(prev => prev.slice(1));
    }, 1000);

    return () => clearTimeout(timer);
  }, [ballPosition]);

  const getRelativeCoordinates = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent): Point | null => {
    if (!courtRef.current) return null;
    const rect = courtRef.current.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
    };
  };

  const stopPlay = useCallback(() => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    setActivePlay(null);
    activePlayRef.current = null;
  }, []);

  const runPlay = async (playId: string, resume: boolean = false) => {
    if (activePlayRef.current === playId && isPlayingRef.current && !resume) {
      stopPlay();
      return;
    }

    if (!resume) {
      isPlayingRef.current = false;
      activePlayRef.current = null;
      setIsPlaying(false);
      setActivePlay(null);
      setCurrentStepIndex(0);
      currentStepIndexRef.current = 0;
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const play = PLAYS.find(p => p.id === playId);
    if (play) {
      setIsPlaying(true);
      isPlayingRef.current = true;
      setActivePlay(playId);
      activePlayRef.current = playId;
      
      const responsiveDelay = (ms: number) => {
        return new Promise<void>(resolve => {
          const start = Date.now();
          const interval = setInterval(() => {
            if (!isPlayingRef.current || activePlayRef.current !== playId || Date.now() - start >= ms) {
              clearInterval(interval);
              resolve();
            }
          }, 50);
        });
      };

      const executeSteps = async (startIndex: number = 0) => {
        for (let i = startIndex; i < play.steps.length; i++) {
          if (!isPlayingRef.current || activePlayRef.current !== playId) {
            setCurrentStepIndex(i);
            currentStepIndexRef.current = i;
            break;
          }
          
          const step = play.steps[i];
          setCurrentStepIndex(i);
          currentStepIndexRef.current = i;
          
          setPlayerPositions(step.positions);
          if (step.ball) setBallPosition(step.ball);
          
          if (step.score) updateStat(step.score, 'points', 2);
          if (step.assist) updateStat(step.assist, 'assists', 1);
          if (step.rebound) updateStat(step.rebound, 'rebounds', 1);
          
          await responsiveDelay(step.duration || 1000);
        }
      };

      try {
        if (play.loop) {
          while (isPlayingRef.current && activePlayRef.current === playId) {
            await executeSteps(currentStepIndexRef.current);
            if (!isPlayingRef.current || activePlayRef.current !== playId) break;
            setCurrentStepIndex(0);
            currentStepIndexRef.current = 0;
            await responsiveDelay(500);
          }
        } else {
          await executeSteps(currentStepIndexRef.current);
          if (activePlayRef.current === playId && isPlayingRef.current && currentStepIndexRef.current >= play.steps.length - 1) {
            stopPlay();
          }
        }
      } catch (error) {
        console.error("Play execution error:", error);
        stopPlay();
      }
    }
  };

  const pausePlay = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);
  };

  const toggleCoachMode = () => {
    if (!isCoachMode && isPlaying) {
      pausePlay();
    }
    setIsCoachMode(!isCoachMode);
  };

  const handleStartDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isCoachMode) return;
    setIsDrawing(true);
    const point = getRelativeCoordinates(e as any);
    if (point) {
      setCurrentDrawing([point]);
    }
  };

  const handleDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isCoachMode || !isDrawing) return;
    const point = getRelativeCoordinates(e as any);
    if (point) {
      setCurrentDrawing(prev => prev ? [...prev, point] : [point]);
    }
  };

  const handleEndDrawing = () => {
    if (currentDrawing && currentDrawing.length > 1) {
      setCoachDrawings(prev => [...prev, currentDrawing]);
    }
    setIsDrawing(false);
    setCurrentDrawing(null);
  };

  const clearDrawings = () => setCoachDrawings([]);

  const resetPositions = () => {
    stopPlay();
    setPlayerPositions(POSITIONS.reduce((acc, p) => ({ ...acc, [p.id]: p.initial }), {}));
    setBallPosition({ x: 50, y: 25 });
  };

  const updateStat = (playerId: string, stat: 'points' | 'assists' | 'rebounds', delta: number) => {
    setPlayerStats(prev => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [stat]: Math.max(0, prev[playerId][stat] + delta)
      }
    }));
  };

  const resetStats = () => {
    setPlayerStats(POSITIONS.reduce((acc, p) => ({ ...acc, [p.id]: { points: 0, assists: 0, rebounds: 0 } }), {}));
  };

  return (
    <div className="w-full h-full bg-zinc-950 p-2 md:p-4 lg:p-6 flex flex-col lg:flex-row gap-4 lg:gap-6 overflow-hidden relative">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 w-full h-full relative z-10 overflow-hidden">
        
        {/* Left Sidebar: Live Game Stats */}
        <div className="w-full lg:w-72 flex flex-col gap-4 shrink-0 h-full overflow-hidden">
          <div className="p-4 lg:p-6 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-[1.5rem] lg:rounded-[2rem] shadow-xl flex flex-col h-full overflow-hidden">
            <h3 className="text-[10px] lg:text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 mb-4 shrink-0">
              <BarChart3 className="w-4 h-4 text-orange-500" />
              Live Game Stats
            </h3>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
              {POSITIONS.map(pos => (
                <div key={pos.id} className="bg-zinc-800/30 rounded-xl p-3 border border-zinc-700/30 transition-all hover:bg-zinc-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${pos.color}`} />
                      <span className="text-xs font-bold text-zinc-200">{pos.name}</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono">#{pos.number}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(['points', 'assists', 'rebounds'] as const).map(stat => (
                      <div key={stat} className="flex flex-col items-center gap-1">
                        <span className="text-[8px] uppercase text-zinc-500 font-bold tracking-tighter">{stat.slice(0, 3)}</span>
                        <div className="flex items-center gap-1 bg-zinc-900/50 rounded-lg p-1 w-full justify-between">
                          <button 
                            onClick={() => updateStat(pos.id, stat, -1)}
                            className="p-0.5 hover:bg-zinc-800 rounded text-zinc-500 hover:text-white transition-colors"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="text-xs font-bold text-orange-500">{playerStats[pos.id][stat]}</span>
                          <button 
                            onClick={() => updateStat(pos.id, stat, 1)}
                            className="p-0.5 hover:bg-zinc-800 rounded text-zinc-500 hover:text-white transition-colors"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={resetStats}
              className="mt-4 w-full py-3 bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-400 hover:text-orange-500 rounded-xl flex items-center justify-center gap-2 transition-all border border-zinc-700/50 shrink-0 group"
            >
              <RotateCcw className="w-3 h-3 transition-transform group-hover:rotate-[-180deg]" />
              <span className="text-xs font-bold uppercase tracking-wider">Reset Stats</span>
            </button>
          </div>
        </div>

        {/* Middle Sidebar: Playbook & Controls */}
        <div className="w-full lg:w-80 flex flex-col gap-4 shrink-0 h-full overflow-hidden">
          {/* Playbook Header */}
          <div className="bg-zinc-900/50 backdrop-blur-xl p-4 lg:p-6 rounded-[1.5rem] lg:rounded-[2rem] border border-zinc-800/50 shadow-xl shrink-0">
            <h2 className="text-lg lg:text-xl font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-500" />
              Playbook Lab
            </h2>
            <p className="text-zinc-400 text-xs lg:text-sm mt-1">Movement & Spacing</p>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
            {/* Offensive Sets */}
            <div className="bg-zinc-900/50 backdrop-blur-xl p-4 lg:p-6 rounded-[1.5rem] lg:rounded-[2rem] border border-zinc-800/50 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] lg:text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4" />
                  Offensive Sets
                </h3>
                <button 
                  onClick={() => setShowTactical(!showTactical)}
                  className={`p-1.5 rounded-lg transition-colors ${showTactical ? 'bg-orange-500/20 text-orange-500' : 'text-zinc-500 hover:bg-zinc-800'}`}
                  title="Toggle Tactical Grid"
                >
                  {showTactical ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {PLAYS.map(play => (
                  <button
                    key={play.id}
                    onClick={() => runPlay(play.id)}
                    className={`w-full p-3 lg:p-4 rounded-xl lg:rounded-2xl border text-left transition-all group ${
                      activePlay === play.id
                        ? 'bg-orange-500 border-orange-400 text-white shadow-lg shadow-orange-500/20'
                        : 'bg-zinc-800/50 border-zinc-700/50 text-zinc-300 hover:border-zinc-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm lg:text-base">{play.name}</span>
                      {activePlay === play.id && isPlaying ? (
                        <div className="flex gap-1" onClick={(e) => { e.stopPropagation(); pausePlay(); }}>
                          <Pause className="w-4 h-4 text-white animate-pulse cursor-pointer" />
                        </div>
                      ) : activePlay === play.id && !isPlaying && currentStepIndex > 0 ? (
                        <Play className="w-4 h-4 text-white cursor-pointer" onClick={(e) => { e.stopPropagation(); runPlay(play.id, true); }} />
                      ) : (
                        <Play className={`w-3 h-3 lg:w-4 lg:h-4 transition-transform group-hover:scale-110 ${activePlay === play.id ? 'text-white' : 'text-zinc-500 group-hover:text-orange-500'}`} />
                      )}
                    </div>
                    <p className={`text-[10px] lg:text-xs leading-tight ${activePlay === play.id ? 'text-orange-100' : 'text-zinc-500'}`}>
                      {play.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Coach Mode */}
            <div className="bg-zinc-900/50 backdrop-blur-xl p-4 lg:p-6 rounded-[1.5rem] lg:rounded-[2rem] border border-zinc-800/50 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] lg:text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <Target className="w-4 h-4 text-orange-500" />
                  Coach Mode
                </h3>
                <button 
                  onClick={toggleCoachMode}
                  className={`relative w-10 h-5 rounded-full transition-colors ${isCoachMode ? 'bg-orange-500' : 'bg-zinc-700'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isCoachMode ? 'left-6' : 'left-1'}`} />
                </button>
              </div>

              {isCoachMode && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="flex gap-2">
                    <button 
                      onClick={saveStrategy}
                      className="flex-1 p-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-[10px] font-bold text-white flex items-center justify-center gap-2 transition-colors shadow-lg shadow-orange-500/20"
                    >
                      {showSaveSuccess ? <Check className="w-3 h-3" /> : <Save className="w-3 h-3" />}
                      {showSaveSuccess ? 'Saved!' : 'Save Plan'}
                    </button>
                    <button 
                      onClick={clearDrawings}
                      className="flex-1 p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-[10px] font-bold text-zinc-400 flex items-center justify-center gap-2 transition-colors"
                    >
                      <Eraser className="w-3 h-3" />
                      Clear
                    </button>
                  </div>

                  {savedStrategies.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                        <FolderOpen className="w-3 h-3" />
                        Saved Plans
                      </div>
                      <div className="space-y-1 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                        {savedStrategies.map(strategy => (
                          <div key={strategy.id} className="flex items-center gap-1 group">
                            <button
                              onClick={() => loadStrategy(strategy)}
                              className="flex-1 p-2 bg-zinc-800/30 hover:bg-zinc-800 border border-zinc-700/30 hover:border-zinc-600 rounded-lg text-left transition-all"
                            >
                              <div className="text-[10px] font-bold text-zinc-300 truncate">{strategy.name}</div>
                              <div className="text-[8px] text-zinc-500">{new Date(strategy.timestamp).toLocaleDateString()}</div>
                            </button>
                            <button
                              onClick={() => deleteStrategy(strategy.id)}
                              className="p-2 text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      <StickyNote className="w-3 h-3" />
                      Strategic Notes
                    </div>
                    <textarea
                      value={coachNotes}
                      onChange={(e) => setCoachNotes(e.target.value)}
                      placeholder="Enter tactical notes here..."
                      className="w-full h-24 bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-3 text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 transition-colors resize-none custom-scrollbar"
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Player Roles */}
            <div className="p-4 lg:p-6 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-[1.5rem] lg:rounded-[2rem] shadow-xl">
              <h3 className="text-[10px] lg:text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Player Roles</h3>
              <div className="grid grid-cols-1 gap-3">
                {POSITIONS.map(pos => (
                  <div key={pos.id} className="flex items-center gap-2 lg:gap-3 text-[10px] lg:text-xs text-zinc-400 group">
                    <div className={`w-3 h-3 lg:w-4 lg:h-4 rounded-full bg-gradient-to-br ${pos.color} shadow-lg transition-transform group-hover:scale-125 flex items-center justify-center`}>
                      <pos.icon className="w-1.5 h-1.5 lg:w-2 lg:h-2 text-white/80" />
                    </div>
                    <span className="font-medium group-hover:text-zinc-200 transition-colors">{pos.fullName}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Global Actions */}
          <div className="shrink-0">
            <button
              onClick={resetPositions}
              className="w-full py-4 bg-zinc-900/50 backdrop-blur-xl hover:bg-zinc-800/50 text-zinc-300 rounded-xl lg:rounded-2xl flex items-center justify-center gap-2 transition-all border border-zinc-800/50 group"
            >
              <RotateCcw className="w-4 h-4 transition-transform group-hover:rotate-[-180deg]" />
              <span className="font-semibold text-sm lg:text-base uppercase tracking-wider">Reset Court</span>
            </button>
          </div>
        </div>

        {/* Court Container */}
        <div className="flex-1 relative bg-zinc-950 rounded-[1.5rem] lg:rounded-[3rem] border-[8px] lg:border-[16px] border-zinc-900 overflow-hidden shadow-[0_0_120px_rgba(0,0,0,0.6)] flex items-center justify-center p-2 sm:p-4 lg:p-12 min-h-[400px] sm:min-h-[600px] lg:min-h-full">
          {/* Arena Lighting Effects */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none z-40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.02)_0%,transparent_50%)] pointer-events-none z-40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.02)_0%,transparent_50%)] pointer-events-none z-40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.5)_100%)] pointer-events-none z-40" />
          
          {/* Floor Reflection Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/5 pointer-events-none z-40 mix-blend-overlay" />
          
          <div
            ref={courtRef}
            onMouseDown={handleStartDrawing}
            onMouseMove={handleDrawing}
            onMouseUp={handleEndDrawing}
            onMouseLeave={handleEndDrawing}
            onTouchStart={handleStartDrawing}
            onTouchMove={handleDrawing}
            onTouchEnd={handleEndDrawing}
            className={`w-full max-w-7xl aspect-[50/47] relative rounded-lg overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.7)] border border-white/5 ${isCoachMode ? 'cursor-crosshair' : ''}`}
            style={{
              // Realistic Wood Plank Texture
              backgroundImage: `
                linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(0deg, rgba(0,0,0,0.05) 1px, transparent 1px),
                linear-gradient(135deg, #27272a 25%, #18181b 25%, #18181b 50%, #27272a 50%, #27272a 75%, #18181b 75%, #18181b 100%)
              `,
              backgroundSize: '40px 100%, 100% 80px, 120px 120px',
              backgroundColor: '#18181b'
            }}
          >
            {/* Polished Floor Shine */}
            <div className="absolute inset-0 opacity-30 pointer-events-none z-10 animate-shine" 
                 style={{ 
                   background: 'linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 55%, transparent 60%)',
                   backgroundSize: '200% 200%'
                 }} 
            />

            {/* Tactical Grid */}
            <AnimatePresence>
              {showTactical && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
                    backgroundSize: '2.5% 2.5%'
                  }}
                />
              )}
            </AnimatePresence>
            
            {/* Court Markings SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 50 47" preserveAspectRatio="none">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="0.15" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <linearGradient id="paintGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(249,115,22,0.12)" />
                  <stop offset="100%" stopColor="rgba(249,115,22,0.05)" />
                </linearGradient>
              </defs>
              <g stroke="rgba(255,255,255,0.3)" strokeWidth="0.25" fill="none" filter="url(#glow)">
                {/* Boundary - Heavy border for arena feel */}
                <rect x="0" y="0" width="50" height="47" strokeWidth="0.8" stroke="rgba(249,115,22,0.5)" />
                
                {/* Midcourt Line & Center Circle */}
                <g transform="translate(25, 47)">
                  <line x1="-25" y1="0" x2="25" y2="0" strokeWidth="0.6" stroke="rgba(249,115,22,0.6)" />
                  <circle cx="0" cy="0" r="6" strokeWidth="0.5" stroke="rgba(249,115,22,0.8)" />
                  <circle cx="0" cy="0" r="2" strokeWidth="0.5" stroke="rgba(249,115,22,0.8)" fill="rgba(249,115,22,0.15)" />
                </g>
                
                {/* Out of Bounds Areas */}
                <rect x="-10" y="0" width="10" height="47" fill="rgba(0,0,0,0.3)" />
                <rect x="50" y="0" width="10" height="47" fill="rgba(0,0,0,0.3)" />

                {/* NBA Scale Markings (1 unit = 1 foot) */}
                <g>
                  {/* Three Point Line (NBA: 23.75ft arc, 22ft corners) */}
                  <path d="M 3 0 L 3 14.2 A 23.75 23.75 0 0 0 47 14.2 L 47 0" strokeWidth="0.5" stroke="rgba(249,115,22,0.9)" />
                  
                  {/* Key (NBA: 16ft wide, 19ft deep) */}
                  <rect x="17" y="0" width="16" height="19" fill="url(#paintGradient)" strokeWidth="0.5" stroke="rgba(249,115,22,0.9)" />
                  
                  {/* Free Throw Circle & Lane Lines */}
                  <g transform="translate(25, 19)">
                    <circle cx="0" cy="0" r="6" strokeDasharray="0.8,0.8" stroke="rgba(249,115,22,0.7)" />
                    <path d="M -6 0 A 6 6 0 0 1 6 0" strokeWidth="0.5" stroke="rgba(249,115,22,0.9)" />
                  </g>

                  {/* Lane Hash Marks */}
                  <g stroke="rgba(249,115,22,0.6)" strokeWidth="0.3">
                    <line x1="16.5" y1="7" x2="17" y2="7" />
                    <line x1="16.5" y1="8" x2="17" y2="8" />
                    <line x1="16.5" y1="11" x2="17" y2="11" />
                    <line x1="16.5" y1="14" x2="17" y2="14" />
                    
                    <line x1="33" y1="7" x2="33.5" y2="7" />
                    <line x1="33" y1="8" x2="33.5" y2="8" />
                    <line x1="33" y1="11" x2="33.5" y2="11" />
                    <line x1="33" y1="14" x2="33.5" y2="14" />
                  </g>
                  
                  {/* Restricted Area (4ft radius from center of rim) */}
                  <path d="M 21 5.25 A 4 4 0 0 0 29 5.25" stroke="rgba(249,115,22,0.6)" strokeWidth="0.4" />
                  
                  {/* Backboard & Support */}
                  <line x1="22" y1="4" x2="28" y2="4" strokeWidth="1.2" stroke="rgba(255,255,255,0.9)" />
                  <rect x="24.5" y="0" width="1" height="4" fill="rgba(255,255,255,0.15)" />
                  
                  {/* Rim (1.5ft diameter, center 5.25ft from baseline) */}
                  <circle cx="25" cy="5.25" r="0.75" stroke="#f97316" strokeWidth="1.5" />
                  {/* Net Effect */}
                  <path d="M 24.25 5.25 L 24.5 7 L 25.5 7 L 25.75 5.25" stroke="rgba(255,255,255,0.5)" strokeWidth="0.25" strokeDasharray="0.2,0.2" />
                </g>
              </g>
            </svg>

            <div className="absolute inset-0 flex items-center justify-center text-white font-black text-9xl uppercase tracking-tighter opacity-[0.04] pointer-events-none select-none rotate-[-15deg] z-0">
              Hoops Academy
            </div>

            {/* Drawings SVG Overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" viewBox="0 0 100 100" preserveAspectRatio="none">
              <AnimatePresence>
                {playerTrails.map(trail => (
                  <motion.polyline
                    key={trail.id}
                    initial={{ opacity: 0.8, pathLength: 0 }}
                    animate={{ opacity: 0.2, pathLength: 1 }}
                    exit={{ opacity: 0 }}
                    points={trail.points.map(p => `${p.x},${p.y}`).join(' ')}
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeDasharray="1, 2"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
                
                {/* Basketball Trail */}
                {ballTrail.length > 1 && (
                  <motion.path
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    d={`M ${ballTrail.map(p => `${p.x} ${p.y}`).join(' L ')}`}
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="2 2"
                    vectorEffect="non-scaling-stroke"
                  />
                )}

                {/* Coach Drawings */}
                {coachDrawings.map((drawing, idx) => (
                  <polyline
                    key={`coach-drawing-${idx}`}
                    points={drawing.map(p => `${p.x},${p.y}`).join(' ')}
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}

                {/* Current Drawing */}
                {currentDrawing && (
                  <polyline
                    points={currentDrawing.map(p => `${p.x},${p.y}`).join(' ')}
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="4 4"
                    vectorEffect="non-scaling-stroke"
                  />
                )}
              </AnimatePresence>
            </svg>

            {/* Players */}
            {POSITIONS.map(pos => (
              <motion.div
                key={pos.id}
                layout
                initial={false}
                drag
                dragMomentum={true}
                dragElastic={0.1}
                dragTransition={{ bounceStiffness: 500, bounceDamping: 25 }}
                onDragEnd={(e) => {
                  const point = getRelativeCoordinates(e as any);
                  if (point) {
                    setPlayerPositions(prev => ({ ...prev, [pos.id]: point }));
                  }
                }}
                animate={{
                  left: `${playerPositions[pos.id].x}%`,
                  top: `${playerPositions[pos.id].y}%`,
                  scale: isPlaying ? [1, 1.05, 1] : 1,
                }}
                transition={{
                  left: {
                    type: "spring",
                    stiffness: 80,
                    damping: 18,
                    mass: 1,
                    restDelta: 0.001
                  },
                  top: {
                    type: "spring",
                    stiffness: 80,
                    damping: 18,
                    mass: 1,
                    restDelta: 0.001
                  },
                  scale: {
                    duration: 0.5,
                    repeat: isPlaying ? Infinity : 0,
                    ease: "easeInOut"
                  }
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br ${pos.color} border-2 md:border-4 border-white/90 shadow-[0_15px_35px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center text-white cursor-grab active:cursor-grabbing z-30 group`}
                whileHover={{ scale: 1.15, zIndex: 50 }}
                whileTap={{ scale: 0.9, rotate: -5 }}
              >
                <div className="relative flex flex-col items-center justify-center">
                  {/* Role Icon */}
                  <div className="absolute -top-3 md:-top-5 opacity-80 group-hover:opacity-100 transition-opacity">
                    <pos.icon className="w-3 h-3 md:w-4 md:h-4 drop-shadow-md" />
                  </div>
                  {/* Jersey Number Style */}
                  <span className="font-black text-lg md:text-2xl leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] tracking-tighter italic">
                    {pos.name}
                  </span>
                  {/* Subtle Jersey Mesh Texture */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[size:4px_4px] pointer-events-none" />
                </div>
                {showTactical && (
                  <span className="text-[7px] md:text-[9px] font-bold opacity-80 mt-0.5 bg-black/20 px-1 rounded">
                    {Math.round(playerPositions[pos.id].x)},{Math.round(playerPositions[pos.id].y)}
                  </span>
                )}
                {/* Player Glow */}
                <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${pos.color} blur-xl opacity-0 group-hover:opacity-40 transition-opacity -z-10`} />
                
                {/* Dynamic Floor Shadow */}
                <div className="absolute top-[110%] left-1/2 -translate-x-1/2 w-8 md:w-12 h-3 md:h-4 bg-black/40 blur-md rounded-full -z-20 scale-x-125" />
              </motion.div>
            ))}

            {/* Basketball */}
            <motion.div
              drag
              dragMomentum={false}
              onDragEnd={(e) => {
                const point = getRelativeCoordinates(e as any);
                if (point) {
                  setBallPosition(point);
                }
              }}
              animate={{
                left: `${ballPosition.x}%`,
                top: `${ballPosition.y}%`,
                scale: ballScale,
              }}
              transition={{
                left: {
                  type: "spring",
                  stiffness: 160,
                  damping: 20,
                  mass: 0.5,
                  restDelta: 0.001
                },
                top: {
                  type: "spring",
                  stiffness: 160,
                  damping: 20,
                  mass: 0.5,
                  restDelta: 0.001
                }
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 border-2 border-zinc-900 shadow-[0_15px_40px_rgba(0,0,0,0.4)] cursor-grab active:cursor-grabbing z-40 flex items-center justify-center overflow-hidden group"
            >
              {/* Dynamic Ball Floor Shadow - Reactive to Scale (Height) */}
              <motion.div 
                style={{
                  scale: shadowScale,
                  opacity: shadowOpacity
                }}
                className="absolute top-[140%] left-1/2 -translate-x-1/2 w-6 md:w-8 h-2 md:h-3 bg-black/60 blur-lg rounded-full -z-10" 
              />

              {/* Realistic Basketball Texture with Seams for Spin Visualization */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                style={{ rotate: ballRotate }}
              >
                {/* Horizontal Seam */}
                <div className="absolute w-full h-[2px] bg-zinc-900/60 top-1/2 -translate-y-1/2" />
                {/* Vertical Seam */}
                <div className="absolute h-full w-[2px] bg-zinc-900/60 left-1/2 -translate-x-1/2" />
                {/* Curved Seams */}
                <div className="absolute inset-1 border-2 border-zinc-900/40 rounded-full" />
                <div className="absolute inset-2 border border-zinc-900/30 rounded-full" />
              </motion.div>
              
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
              
              {/* Ball Shine */}
              <div className="absolute top-1 left-2 w-3 h-3 bg-white/30 rounded-full blur-[1px]" />
            </motion.div>

            {/* Active Play Overlay */}
            <AnimatePresence>
              {activePlay && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-4 lg:bottom-10 left-1/2 -translate-x-1/2 z-50 w-[90%] sm:w-auto"
                >
                  <div className="bg-zinc-900/80 backdrop-blur-xl px-4 lg:px-8 py-2 lg:py-3 rounded-xl lg:rounded-2xl text-white font-bold text-xs lg:text-sm uppercase tracking-[0.2em] lg:tracking-[0.4em] border border-white/10 shadow-2xl flex items-center justify-center gap-3 lg:gap-4">
                    <Sparkles className="w-3 h-3 lg:w-4 lg:h-4 text-orange-500 animate-pulse" />
                    <span className="truncate">Analyzing {activePlay.replace('-', ' ')}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-orange-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-500/5 blur-[150px] rounded-full" />
      </div>
    </div>
  );
};

export default CourtDiagram;
