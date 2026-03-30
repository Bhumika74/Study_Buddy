import { useState } from 'react';

const QuizGeneration = () => {
  const [quizConfig, setQuizConfig] = useState({
    topic: '',
    difficulty: 'medium',
    numQuestions: 10,
    questionType: 'mcq',
  });
  const [generatedQuiz, setGeneratedQuiz]     = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers]         = useState({});
  const [showResults, setShowResults]         = useState(false);
  const [generating, setGenerating]           = useState(false);
  const [error, setError]                     = useState('');
  const [savingResult, setSavingResult]       = useState(false); // NEW

  const difficulties  = ['easy', 'medium', 'hard'];
  const questionTypes = [
    { value: 'mcq',       label: 'Multiple Choice' },
    { value: 'truefalse', label: 'True / False'    },
    { value: 'mixed',     label: 'Mixed'            },
  ];
  const questionCounts = [5, 10, 15, 20];

  // ── Generate Quiz via API ──────────────────────────────────────
  const handleGenerateQuiz = async () => {
    if (!quizConfig.topic.trim()) return;
    setGenerating(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/ai/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic:        quizConfig.topic.trim(),
          difficulty:   quizConfig.difficulty,
          count:        quizConfig.numQuestions,
          questionType: quizConfig.questionType,
        }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();

      let parsed;
      if (data.content?.[0]?.text) {
        const raw   = data.content[0].text.trim().replace(/```json|```/g, '').trim();
        const first = raw.indexOf('{'), last = raw.lastIndexOf('}');
        parsed = JSON.parse(first !== -1 ? raw.slice(first, last + 1) : raw);
      } else if (data.questions) {
        parsed = data;
      } else {
        throw new Error('Unexpected response format');
      }

      if (!parsed.questions?.length) throw new Error('No questions returned');

      const questions = parsed.questions.map((q, i) => ({
        ...q,
        id: i + 1,
        correctAnswer:
          q.correctAnswer !== undefined ? q.correctAnswer
          : q.correct      !== undefined ? q.correct
          : 0,
      }));

      setGeneratedQuiz({
        topic:        quizConfig.topic,
        difficulty:   quizConfig.difficulty,
        questionType: quizConfig.questionType,
        questions,
      });
      setCurrentQuestion(0);
      setUserAnswers({});
      setShowResults(false);
    } catch (err) {
      console.error(err);
      setError('Failed to generate quiz. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleAnswerSelect = (qId, idx) =>
    setUserAnswers(prev => ({ ...prev, [qId]: idx }));

  // ── Submit + SAVE to backend ───────────────────────────────────
  const handleSubmitQuiz = async () => {
    setShowResults(true);   // show results immediately

    // Calculate score
    const correct = generatedQuiz.questions.filter(
      q => userAnswers[q.id] === q.correctAnswer
    ).length;
    const scorePct = Math.round((correct / generatedQuiz.questions.length) * 100);

    // Save to backend in background
    setSavingResult(true);
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/student/quiz-result', {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          score:          scorePct,
          topic:          generatedQuiz.topic,
          totalQuestions: generatedQuiz.questions.length,
        }),
      });
      // silent success — progress page will reflect on next visit
    } catch (err) {
      console.error('Failed to save quiz result:', err.message);
      // non-blocking — user still sees their results
    } finally {
      setSavingResult(false);
    }
  };

  const calculateScore = () => {
    if (!generatedQuiz) return 0;
    const correct = generatedQuiz.questions.filter(
      q => userAnswers[q.id] === q.correctAnswer
    ).length;
    return Math.round((correct / generatedQuiz.questions.length) * 100);
  };

  const score        = calculateScore();
  const correctCount = generatedQuiz?.questions.filter(q => userAnswers[q.id] === q.correctAnswer).length ?? 0;
  const wrongCount   = (generatedQuiz?.questions.length ?? 0) - correctCount;

  const scoreColor = score >= 80 ? '#15803d' : score >= 60 ? '#a16207' : '#b91c1c';
  const scoreBg    = score >= 80 ? '#f0fdf4' : score >= 60 ? '#fefce8' : '#fef2f2';
  const scoreBdr   = score >= 80 ? '#bbf7d0' : score >= 60 ? '#fde68a' : '#fecaca';
  const scoreEmoji = score >= 80 ? '🏆' : score >= 60 ? '👍' : '📚';
  const scoreMsg   = score >= 80 ? 'Excellent work!' : score >= 60 ? 'Good effort — keep going!' : 'Keep practising — you got this!';

  const curQ = generatedQuiz?.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-5"
      style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .teal-btn { transition: all 0.18s ease; }
        .teal-btn:hover:not(:disabled) { background: #0d9488 !important; box-shadow: 0 4px 16px rgba(20,184,166,0.4) !important; }
        .opt-btn { transition: all 0.15s ease; }
        .opt-btn:hover:not(:disabled) { transform: translateX(3px); }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.3s ease forwards; }
      `}</style>

      {/* ── Header ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
            style={{ background: 'linear-gradient(135deg,#0f766e,#0891b2)' }}>🧠</div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 leading-none">AI Quiz Generator</h1>
            <p className="text-xs text-gray-400 mt-0.5">Create personalised quizzes on any topic</p>
          </div>
        </div>
      </div>

      {/* ══ SCREEN 1 — Config ══ */}
      {!generatedQuiz && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 fade-up"
          style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Configure Your Quiz</h2>

          <div className="space-y-5">
            {/* Topic */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Topic or Subject</label>
              <input
                type="text"
                value={quizConfig.topic}
                onChange={e => setQuizConfig(c => ({ ...c, topic: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleGenerateQuiz()}
                placeholder="e.g. Photosynthesis, Binary Trees, World War II..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 transition"
                onFocus={e => e.target.style.borderColor = '#14b8a6'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                disabled={generating}
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {["Newton's Laws", 'SQL Joins', 'French Revolution', 'React Hooks', 'Organic Chemistry'].map(s => (
                  <button key={s} type="button"
                    onClick={() => setQuizConfig(c => ({ ...c, topic: s }))}
                    className="px-2.5 py-1 rounded-full text-xs font-medium transition"
                    style={{ background: '#f0fdfa', color: '#0f766e', border: '1px solid #99f6e4' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#ccfbf1'}
                    onMouseLeave={e => e.currentTarget.style.background = '#f0fdfa'}
                  >{s}</button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Difficulty Level</label>
              <div className="grid grid-cols-3 gap-2">
                {difficulties.map(d => (
                  <button key={d} type="button"
                    onClick={() => setQuizConfig(c => ({ ...c, difficulty: d }))}
                    className="py-2.5 rounded-xl text-xs font-bold capitalize transition"
                    style={quizConfig.difficulty === d
                      ? { background: '#14b8a6', color: 'white', boxShadow: '0 2px 8px rgba(20,184,166,0.35)' }
                      : { background: '#f9fafb', color: '#6b7280', border: '1px solid #e5e7eb' }
                    }
                  >
                    {d === 'easy' ? '🟢 Easy' : d === 'medium' ? '🟡 Medium' : '🔴 Hard'}
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Questions */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Number of Questions</label>
              <div className="grid grid-cols-4 gap-2">
                {questionCounts.map(n => (
                  <button key={n} type="button"
                    onClick={() => setQuizConfig(c => ({ ...c, numQuestions: n }))}
                    className="py-2.5 rounded-xl text-sm font-bold transition"
                    style={quizConfig.numQuestions === n
                      ? { background: '#14b8a6', color: 'white', boxShadow: '0 2px 8px rgba(20,184,166,0.3)' }
                      : { background: '#f9fafb', color: '#6b7280', border: '1px solid #e5e7eb' }
                    }
                  >{n}</button>
                ))}
              </div>
            </div>

            {/* Question Type */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Question Type</label>
              <div className="grid grid-cols-3 gap-2">
                {questionTypes.map(t => (
                  <button key={t.value} type="button"
                    onClick={() => setQuizConfig(c => ({ ...c, questionType: t.value }))}
                    className="py-2.5 px-2 rounded-xl text-xs font-semibold transition text-center"
                    style={quizConfig.questionType === t.value
                      ? { background: '#14b8a6', color: 'white', boxShadow: '0 2px 8px rgba(20,184,166,0.3)' }
                      : { background: '#f9fafb', color: '#6b7280', border: '1px solid #e5e7eb' }
                    }
                  >{t.label}</button>
                ))}
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">⚠️ {error}</div>
            )}

            <button
              onClick={handleGenerateQuiz}
              disabled={generating || !quizConfig.topic.trim()}
              className="teal-btn w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center space-x-2"
              style={{
                background: generating || !quizConfig.topic.trim() ? '#9ca3af' : '#14b8a6',
                boxShadow:  generating || !quizConfig.topic.trim() ? 'none' : '0 2px 10px rgba(20,184,166,0.35)',
              }}
            >
              {generating ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10"/>
                  </svg>
                  <span>Generating {quizConfig.numQuestions} Questions...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  <span>Generate {quizConfig.numQuestions} Questions · {quizConfig.difficulty} · {questionTypes.find(t => t.value === quizConfig.questionType)?.label}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ══ SCREEN 2 — Quiz Taking ══ */}
      {generatedQuiz && !showResults && curQ && (
        <div className="space-y-4 fade-up">
          <div className="bg-white rounded-2xl border border-gray-100 p-4"
            style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-600">
                Question {currentQuestion + 1} of {generatedQuiz.questions.length}
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold capitalize"
                  style={{ background: '#f0fdfa', color: '#0f766e', border: '1px solid #99f6e4' }}>
                  {generatedQuiz.difficulty}
                </span>
                <span className="text-xs text-gray-400">{Object.keys(userAnswers).length} answered</span>
              </div>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-100">
              <div className="h-2 rounded-full transition-all duration-400"
                style={{
                  width: `${((currentQuestion + 1) / generatedQuiz.questions.length) * 100}%`,
                  background: 'linear-gradient(90deg,#0d9488,#2dd4bf)',
                  boxShadow: '0 0 6px rgba(20,184,166,0.4)',
                }}/>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6"
            style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <div className="flex items-center space-x-2 mb-4">
              <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: '#f0fdfa', color: '#0f766e' }}>{currentQuestion + 1}</span>
              <h2 className="text-sm font-bold text-gray-800 leading-relaxed">{curQ.question}</h2>
            </div>

            <div className="space-y-2.5 mb-6">
              {curQ.options.map((opt, idx) => {
                const isSel = userAnswers[curQ.id] === idx;
                return (
                  <button key={idx}
                    onClick={() => handleAnswerSelect(curQ.id, idx)}
                    className="opt-btn w-full p-4 text-left rounded-xl border-2 flex items-center space-x-3"
                    style={{ borderColor: isSel ? '#14b8a6' : '#e5e7eb', background: isSel ? '#f0fdfa' : 'white' }}
                  >
                    <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                      style={{ borderColor: isSel ? '#14b8a6' : '#d1d5db', background: isSel ? '#14b8a6' : 'white' }}>
                      {isSel && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{opt}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentQuestion(p => Math.max(0, p - 1))}
                disabled={currentQuestion === 0}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >← Previous</button>

              {currentQuestion === generatedQuiz.questions.length - 1 ? (
                <button onClick={handleSubmitQuiz}
                  className="teal-btn px-6 py-2.5 rounded-xl text-sm font-bold text-white"
                  style={{ background: '#14b8a6', boxShadow: '0 2px 10px rgba(20,184,166,0.35)' }}>
                  Submit Quiz ✓
                </button>
              ) : (
                <button
                  onClick={() => setCurrentQuestion(p => Math.min(generatedQuiz.questions.length - 1, p + 1))}
                  className="teal-btn px-6 py-2.5 rounded-xl text-sm font-bold text-white"
                  style={{ background: '#14b8a6', boxShadow: '0 2px 10px rgba(20,184,166,0.35)' }}>
                  Next →
                </button>
              )}
            </div>
          </div>

          {/* Jump dots */}
          <div className="flex flex-wrap gap-1.5 justify-center">
            {generatedQuiz.questions.map((q, i) => (
              <button key={i} onClick={() => setCurrentQuestion(i)}
                className="w-7 h-7 rounded-lg text-xs font-bold transition"
                style={{
                  background: i === currentQuestion ? '#14b8a6' : userAnswers[q.id] !== undefined ? '#f0fdfa' : '#f3f4f6',
                  color:      i === currentQuestion ? 'white'    : userAnswers[q.id] !== undefined ? '#0f766e' : '#9ca3af',
                  border:     `1px solid ${i === currentQuestion ? '#14b8a6' : userAnswers[q.id] !== undefined ? '#99f6e4' : '#e5e7eb'}`,
                }}
              >{i + 1}</button>
            ))}
          </div>
        </div>
      )}

      {/* ══ SCREEN 3 — Results ══ */}
      {generatedQuiz && showResults && (
        <div className="space-y-4 fade-up">
          <div className="bg-white rounded-2xl border p-8 text-center"
            style={{ borderColor: scoreBdr, background: scoreBg, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <span className="text-5xl block mb-3">{scoreEmoji}</span>
            <p className="text-5xl font-bold mb-1" style={{ color: scoreColor }}>{score}%</p>
            <p className="text-sm font-semibold mb-1" style={{ color: scoreColor }}>{scoreMsg}</p>
            <p className="text-xs text-gray-400 mb-1">"{generatedQuiz.topic}" · {generatedQuiz.difficulty} · {generatedQuiz.questions.length} questions</p>

            {/* Saving indicator */}
            <p className="text-xs mb-6" style={{ color: savingResult ? '#14b8a6' : '#a3e7dc' }}>
              {savingResult ? '💾 Saving to your progress...' : '✅ Saved to your progress'}
            </p>

            <div className="flex justify-center space-x-10 mb-6">
              <div><p className="text-2xl font-bold text-green-600">{correctCount}</p><p className="text-xs text-gray-500">Correct</p></div>
              <div><p className="text-2xl font-bold text-red-500">{wrongCount}</p><p className="text-xs text-gray-500">Incorrect</p></div>
              <div><p className="text-2xl font-bold text-gray-500">{generatedQuiz.questions.length}</p><p className="text-xs text-gray-500">Total</p></div>
            </div>

            <div className="flex justify-center space-x-3">
              <button
                onClick={() => { setUserAnswers({}); setShowResults(false); setCurrentQuestion(0); }}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
              >Retry Quiz</button>
              <button onClick={() => setGeneratedQuiz(null)}
                className="teal-btn px-6 py-2.5 rounded-xl text-sm font-bold text-white"
                style={{ background: '#14b8a6', boxShadow: '0 2px 10px rgba(20,184,166,0.35)' }}>
                New Quiz
              </button>
            </div>
          </div>

          {/* Review */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6"
            style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-5">Review Answers</h3>
            <div className="space-y-3">
              {generatedQuiz.questions.map((q, idx) => {
                const isCorrect = userAnswers[q.id] === q.correctAnswer;
                return (
                  <div key={q.id} className="rounded-xl border p-4"
                    style={{ borderColor: isCorrect ? '#bbf7d0' : '#fecaca', background: isCorrect ? '#f0fdf4' : '#fef2f2' }}>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: isCorrect ? '#bbf7d0' : '#fecaca' }}>
                        {isCorrect
                          ? <svg className="w-3.5 h-3.5" fill="none" stroke="#15803d" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                          : <svg className="w-3.5 h-3.5" fill="none" stroke="#b91c1c" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12"/></svg>
                        }
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800 mb-1.5">Q{idx + 1}. {q.question}</p>
                        <p className="text-xs font-semibold text-green-700">✓ {q.options[q.correctAnswer]}</p>
                        {!isCorrect && (
                          <p className="text-xs font-semibold text-red-600 mt-0.5">
                            ✗ Your answer: {q.options[userAnswers[q.id]] ?? 'Not answered'}
                          </p>
                        )}
                        {q.explanation && (
                          <div className="mt-2 px-3 py-2 rounded-lg"
                            style={{ background: 'rgba(20,184,166,0.06)', border: '1px solid #ccfbf1' }}>
                            <p className="text-xs text-teal-700">💡 {q.explanation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizGeneration;