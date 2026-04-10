import { useState } from 'react'
import { useStore } from '../store/useStore'
import { useAuthStore } from '../store/useAuthStore'
import { lessons, categories } from '../data/lessons'
import { useToast } from '../components/Toast'
import Confetti from '../components/Confetti'
import { BookOpen, Clock, Zap, Trophy, ChevronRight, ChevronLeft, CheckCircle2, X, Star } from 'lucide-react'

function LessonCard({ lesson, isCompleted, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-slate-900 hover:bg-slate-800/80 rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all text-left group relative overflow-hidden"
    >
      {/* Subtle bg glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: `radial-gradient(circle at 80% 20%, ${lesson.color}15, transparent 60%)` }}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${lesson.color}20` }}
          >
            {lesson.icon}
          </div>
          <div className="flex items-center gap-2">
            {isCompleted && (
              <div className="w-6 h-6 rounded-full bg-brand-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-brand-400" />
              </div>
            )}
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              lesson.difficulty === 'Beginner' ? 'bg-brand-500/10 text-brand-400' :
              lesson.difficulty === 'Intermediate' ? 'bg-blue-500/10 text-blue-400' :
              'bg-purple-500/10 text-purple-400'
            }`}>
              {lesson.difficulty}
            </span>
          </div>
        </div>

        <div className="text-sm text-slate-400 mb-1">{lesson.category}</div>
        <h3 className="font-bold text-white text-lg mb-1 group-hover:text-brand-300 transition-colors">{lesson.title}</h3>
        <p className="text-sm text-slate-400 mb-4 line-clamp-2">{lesson.description}</p>

        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{lesson.duration}</span>
          <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-yellow-400" />+{lesson.xp} XP</span>
          <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{lesson.quiz.length} questions</span>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 group-hover:text-brand-400 transition-colors">
          <span>{isCompleted ? 'Review lesson' : 'Start lesson'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </button>
  )
}

function LessonViewer({ lesson, onClose, onComplete, isCompleted }) {
  const [step, setStep] = useState(0) // 0..n-1 = content, n = quiz
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  const totalSteps = lesson.content.length
  const isQuizStep = step === totalSteps
  const isDone = step > totalSteps

  const currentContent = !isQuizStep && !isDone ? lesson.content[step] : null
  const progress = ((step) / (totalSteps + 1)) * 100

  const handleAnswer = (qIdx, aIdx) => {
    if (quizSubmitted) return
    setQuizAnswers(prev => ({ ...prev, [qIdx]: aIdx }))
  }

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true)
    const allCorrect = lesson.quiz.every((q, i) => quizAnswers[i] === q.correct)
    if (allCorrect && !isCompleted) {
      setTimeout(() => {
        setShowCelebration(true)
        onComplete(lesson.id, lesson.xp)
      }, 500)
    }
  }

  const allAnswered = lesson.quiz.every((_, i) => quizAnswers[i] !== undefined)
  const score = quizSubmitted
    ? lesson.quiz.filter((q, i) => quizAnswers[i] === q.correct).length
    : 0

  const contentTypeStyles = {
    intro: { bg: 'bg-brand-500/10', border: 'border-brand-500/20', icon: '🌟' },
    concept: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: '💡' },
    tip: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: '⚡' },
    action: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: '🎯' },
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-950/90 backdrop-blur-xl border-b border-white/5 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-white">{lesson.title}</span>
              <span className="text-xs text-slate-400">{Math.min(step + 1, totalSteps + 1)}/{totalSteps + 1}</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-400 to-brand-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Celebration Banner */}
        {showCelebration && (
          <div className="mb-6 p-6 bg-gradient-to-r from-brand-500/20 to-brand-600/10 border border-brand-500/30 rounded-2xl text-center animate-slide-up">
            <div className="text-4xl mb-2">🎉</div>
            <div className="text-xl font-black text-white">Lesson Complete!</div>
            <div className="text-brand-400 font-bold mt-1">+{lesson.xp} XP Earned!</div>
            <div className="text-sm text-slate-400 mt-2">Keep learning to level up your financial IQ</div>
          </div>
        )}

        {/* Content Step */}
        {currentContent && (
          <div className="animate-fade-in space-y-6">
            <div className={`p-6 rounded-2xl border ${contentTypeStyles[currentContent.type]?.bg || 'bg-slate-900'} ${contentTypeStyles[currentContent.type]?.border || 'border-white/10'}`}>
              <div className="flex items-start gap-4">
                <div className="text-2xl flex-shrink-0">{contentTypeStyles[currentContent.type]?.icon || '📖'}</div>
                <div>
                  <h2 className="text-lg font-bold text-white mb-3">{currentContent.title}</h2>
                  <p className="text-slate-300 leading-relaxed">{currentContent.text}</p>
                  {currentContent.bullets && (
                    <ul className="mt-4 space-y-2">
                      {currentContent.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                          <span className="text-brand-400 mt-0.5 flex-shrink-0">→</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(s => s + 1)}
              className="w-full py-4 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-2xl transition-all shadow-glow text-lg"
            >
              {step === totalSteps - 1 ? 'Take the Quiz →' : 'Continue →'}
            </button>
          </div>
        )}

        {/* Quiz Step */}
        {isQuizStep && (
          <div className="animate-fade-in space-y-6">
            <div className="text-center mb-8">
              <div className="text-3xl mb-2">🧠</div>
              <h2 className="text-2xl font-black text-white">Knowledge Check</h2>
              <p className="text-slate-400 mt-1">{lesson.quiz.length} questions · Answer all to complete</p>
            </div>

            {lesson.quiz.map((q, qIdx) => (
              <div key={qIdx} className="bg-slate-900 rounded-2xl p-6 border border-white/5">
                <p className="font-semibold text-white mb-4">
                  <span className="text-brand-400 mr-2">Q{qIdx + 1}.</span>
                  {q.question}
                </p>
                <div className="space-y-2">
                  {q.options.map((opt, aIdx) => {
                    const isSelected = quizAnswers[qIdx] === aIdx
                    const isCorrect = quizSubmitted && aIdx === q.correct
                    const isWrong = quizSubmitted && isSelected && aIdx !== q.correct

                    return (
                      <button
                        key={aIdx}
                        onClick={() => handleAnswer(qIdx, aIdx)}
                        className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-all ${
                          isCorrect
                            ? 'border-brand-500 bg-brand-500/10 text-white'
                            : isWrong
                            ? 'border-red-500 bg-red-500/10 text-white'
                            : isSelected
                            ? 'border-brand-500/60 bg-brand-500/5 text-white'
                            : 'border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/5'
                        }`}
                        disabled={quizSubmitted}
                      >
                        <div className="flex items-center justify-between">
                          <span>{opt}</span>
                          {isCorrect && <CheckCircle2 className="w-4 h-4 text-brand-400 flex-shrink-0 ml-2" />}
                          {isWrong && <X className="w-4 h-4 text-red-400 flex-shrink-0 ml-2" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
                {quizSubmitted && (
                  <div className={`mt-3 p-3 rounded-xl text-sm ${quizAnswers[qIdx] === q.correct ? 'bg-brand-500/10 text-brand-300' : 'bg-red-500/10 text-red-300'}`}>
                    <span className="font-semibold">{quizAnswers[qIdx] === q.correct ? '✓ Correct!' : '✗ Not quite.'}</span>
                    {' '}{q.explanation}
                  </div>
                )}
              </div>
            ))}

            {!quizSubmitted ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={!allAnswered}
                className="w-full py-4 bg-brand-500 hover:bg-brand-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-2xl transition-all shadow-glow text-lg"
              >
                Submit Answers
              </button>
            ) : (
              <div className="space-y-4">
                <div className={`p-6 rounded-2xl text-center border ${score === lesson.quiz.length ? 'bg-brand-500/10 border-brand-500/20' : 'bg-slate-800 border-white/10'}`}>
                  <div className="text-4xl mb-2">{score === lesson.quiz.length ? '🏆' : score >= lesson.quiz.length / 2 ? '👍' : '📚'}</div>
                  <div className="text-2xl font-black text-white">{score}/{lesson.quiz.length} Correct</div>
                  <div className="text-slate-400 mt-1 text-sm">
                    {score === lesson.quiz.length ? 'Perfect score! Well done!' : 'Review the explanations above and try again.'}
                  </div>
                  {score === lesson.quiz.length && !isCompleted && (
                    <div className="mt-3 text-brand-400 font-bold">+{lesson.xp} XP Earned!</div>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="w-full py-4 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-2xl transition-all shadow-glow"
                >
                  Back to Academy
                </button>
              </div>
            )}
          </div>
        )}

        {/* Back button for content steps */}
        {!isQuizStep && step > 0 && (
          <button
            onClick={() => setStep(s => s - 1)}
            className="mt-4 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm mx-auto"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        )}
      </div>
    </div>
  )
}

export default function Learn() {
  const { user, completeLesson } = useStore()
  const { currentUser, awardXp, addBadge } = useAuthStore()
  const { addToast } = useToast()
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeLesson, setActiveLesson] = useState(null)
  const [confetti, setConfetti] = useState(false)

  const filtered = activeCategory === 'All'
    ? lessons
    : lessons.filter(l => l.category === activeCategory)

  const completedCount = user.completedLessons.length
  const nextLessons = lessons.filter(l => !user.completedLessons.includes(l.id))

  const handleComplete = (lessonId, xpReward) => {
    completeLesson(lessonId, xpReward)
    awardXp(xpReward, 'Lesson completed')
    setConfetti(true)
    setTimeout(() => setConfetti(false), 3100)
    addToast({ type: 'xp', title: `+${xpReward} XP!`, message: 'Lesson complete — great work!' })
    // Scholar badge if all lessons done
    const newCount = user.completedLessons.length + 1
    if (newCount >= lessons.length) {
      addBadge('scholar')
      addToast({ type: 'achievement', title: '🎓 Badge: Finance Scholar!', message: 'You completed all lessons!' })
    }
  }

  if (activeLesson) {
    return (
      <>
        <Confetti active={confetti} />
        <LessonViewer
          lesson={activeLesson}
          isCompleted={user.completedLessons.includes(activeLesson.id)}
          onClose={() => setActiveLesson(null)}
          onComplete={handleComplete}
        />
      </>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Finance Academy</h1>
        <p className="text-slate-400 mt-1">Master personal finance. Level up your wealth.</p>
      </div>

      {/* Progress Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-500/20 via-brand-600/10 to-transparent border border-brand-500/20 rounded-2xl p-6">
        <div className="absolute top-0 right-0 w-40 h-40 bg-brand-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        <div className="relative flex items-center justify-between gap-6">
          <div>
            <div className="text-sm text-brand-400 font-medium mb-1">Your Progress</div>
            <div className="text-3xl font-black text-white">{completedCount}/{lessons.length} Lessons</div>
            <div className="text-slate-400 text-sm mt-1">{totalXp} XP earned · Level {user.level}</div>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-1">🎓</div>
            <div className="text-xs text-slate-400">{user.streak} day streak</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="h-2 bg-brand-500/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-400 to-brand-500 rounded-full transition-all duration-700"
              style={{ width: `${(completedCount / lessons.length) * 100}%` }}
            />
          </div>
          <div className="text-right text-xs text-slate-400 mt-1">{Math.round((completedCount / lessons.length) * 100)}% complete</div>
        </div>
      </div>

      {/* Badges */}
      {user.badges.length > 0 && (
        <div className="bg-slate-900 rounded-2xl p-5 border border-white/5">
          <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            Badges Earned
          </h2>
          <div className="flex gap-3 flex-wrap">
            {[
              { id: 'first-budget', icon: '📊', name: 'Budget Master' },
              { id: 'saver', icon: '🏦', name: 'Super Saver' },
              { id: 'debt-warrior', icon: '⚔️', name: 'Debt Warrior' },
              { id: 'investor', icon: '📈', name: 'Investor' },
            ].filter(b => user.badges.includes(b.id)).map(badge => (
              <div key={badge.id} className="flex items-center gap-2 px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <span className="text-lg">{badge.icon}</span>
                <span className="text-xs font-medium text-yellow-300">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {['All', 'Basics', 'Savings', 'Investing', 'Debt', 'Credit'].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeCategory === cat
                ? 'bg-brand-500/20 text-brand-400 border border-brand-500/40'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-transparent'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Lessons Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(lesson => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            isCompleted={user.completedLessons.includes(lesson.id)}
            onClick={() => setActiveLesson(lesson)}
          />
        ))}
      </div>

      {/* Coming Soon */}
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { icon: '🏡', title: 'Home Buying 101', desc: 'Mortgage basics, down payments, and when to buy vs. rent' },
          { icon: '🧾', title: 'Tax Optimization', desc: 'Legally minimize your tax burden with smart strategies' },
          { icon: '💼', title: '401k & Roth IRA Deep Dive', desc: 'Maximize your retirement accounts' },
          { icon: '🌐', title: 'Passive Income Streams', desc: 'Build income that works while you sleep' },
        ].map(course => (
          <div key={course.title} className="bg-slate-900/50 rounded-2xl p-5 border border-dashed border-white/10 flex items-center gap-4">
            <div className="text-3xl">{course.icon}</div>
            <div>
              <div className="text-sm font-semibold text-slate-400">{course.title}</div>
              <div className="text-xs text-slate-600 mt-0.5">{course.desc}</div>
              <div className="text-xs text-slate-600 mt-1">Coming soon</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
