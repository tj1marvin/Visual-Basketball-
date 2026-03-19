import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, Trophy, ArrowRight } from 'lucide-react';

const QUESTIONS = [
  {
    question: "Who invented basketball in 1891?",
    options: ["James Naismith", "Michael Jordan", "Larry Bird", "Abner Doubleday"],
    correct: 0
  },
  {
    question: "Which position is typically the team's primary ball handler?",
    options: ["Center", "Small Forward", "Point Guard", "Power Forward"],
    correct: 2
  },
  {
    question: "How many points is a shot worth if taken from outside the arc?",
    options: ["1", "2", "3", "4"],
    correct: 2
  },
  {
    question: "What does B.E.E.F. stand for in shooting technique?",
    options: ["Balance, Eyes, Elbow, Follow-through", "Bounce, Energy, Effort, Finish", "Back, Entry, Exit, Force", "Body, Eyes, Edge, Flow"],
    correct: 0
  }
];

const Quiz: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === QUESTIONS[currentStep].correct) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentStep + 1 < QUESTIONS.length) {
      setCurrentStep(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  if (showResult) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto bg-zinc-900 p-8 rounded-3xl border border-zinc-800 text-center space-y-6"
      >
        <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto">
          <Trophy className="w-10 h-10 text-orange-500" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">Quiz Complete!</h2>
          <p className="text-zinc-400 mt-2">You scored {score} out of {QUESTIONS.length}</p>
        </div>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(score / QUESTIONS.length) * 100}%` }}
            className="h-full bg-orange-500"
          />
        </div>
        <button
          onClick={resetQuiz}
          className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors"
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  const q = QUESTIONS[currentStep];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-orange-500 font-mono text-sm uppercase tracking-widest">Question {currentStep + 1} of {QUESTIONS.length}</span>
          <h2 className="text-2xl font-bold text-white mt-1">{q.question}</h2>
        </div>
        <div className="text-zinc-500 font-mono text-sm">Score: {score}</div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {q.options.map((option, index) => {
          const isCorrect = index === q.correct;
          const isSelected = index === selectedOption;
          const showCorrect = isAnswered && isCorrect;
          const showWrong = isAnswered && isSelected && !isCorrect;

          return (
            <button
              key={index}
              onClick={() => handleOptionClick(index)}
              disabled={isAnswered}
              className={`
                p-5 rounded-2xl border-2 text-left transition-all duration-200 flex items-center justify-between group
                ${!isAnswered ? 'border-zinc-800 hover:border-orange-500 bg-zinc-900' : ''}
                ${showCorrect ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : ''}
                ${showWrong ? 'border-red-500 bg-red-500/10 text-red-500' : ''}
                ${isAnswered && !isCorrect && !isSelected ? 'border-zinc-800 opacity-50' : ''}
              `}
            >
              <span className="font-semibold">{option}</span>
              {showCorrect && <CheckCircle2 className="w-6 h-6" />}
              {showWrong && <XCircle className="w-6 h-6" />}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={nextQuestion}
          className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          {currentStep + 1 === QUESTIONS.length ? 'Finish Quiz' : 'Next Question'}
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      )}
    </div>
  );
};

export default Quiz;
