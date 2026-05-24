import { useState } from 'react';

const QuizGeneration = () => {
  const [quizConfig, setQuizConfig] = useState({
    topic: '',
    difficulty: 'medium',
    numQuestions: 10,
    questionType: 'mixed'
  });
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [generating, setGenerating] = useState(false);

  const difficulties = ['easy', 'medium', 'hard'];
  const questionTypes = [
    { value: 'mixed', label: 'Mixed (MCQ + True/False)' },
    { value: 'mcq', label: 'Multiple Choice Only' },
    { value: 'truefalse', label: 'True/False Only' },
    { value: 'short', label: 'Short Answer' }
  ];

  const handleGenerateQuiz = async () => {
    if (!quizConfig.topic.trim()) {
      alert('Please enter a topic!');
      return;
    }

    setGenerating(true);

    try {
      const response = await fetch('http://localhost:5000/api/ai/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: quizConfig.topic,
          difficulty: quizConfig.difficulty,
          numQuestions: quizConfig.numQuestions,
          questionType: quizConfig.questionType
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert('Error generating quiz: ' + (data.error || 'Unknown error'));
        setGenerating(false);
        return;
      }

      // Transform API response to match our quiz format
      const generatedQuizData = {
        topic: quizConfig.topic,
        difficulty: quizConfig.difficulty,
        questions: data.questions.map((q, idx) => ({
          id: idx + 1,
          question: q.question,
          type: q.type || 'mcq',
          options: q.options || [],
          correctAnswer: q.correct,
          explanation: q.explanation || 'This is the correct answer because...'
        }))
      };

      setGeneratedQuiz(generatedQuizData);
      setCurrentQuestion(0);
      setUserAnswers({});
      setShowResults(false);
      setGenerating(false);
    } catch (error) {
      console.error('Quiz generation error:', error);
      alert('Error generating quiz. Make sure the backend is running.');
      setGenerating(false);
    }
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: answerIndex
    });
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    if (!generatedQuiz) return 0;
    let correct = 0;
    let totalGradable = 0;
    generatedQuiz.questions.forEach((q) => {
      // Only count MCQ and True/False for scoring
      if (q.type !== 'short') {
        totalGradable++;
        if (userAnswers[q.id] === q.correctAnswer) {
          correct++;
        }
      }
    });
    return totalGradable > 0 ? Math.round((correct / totalGradable) * 100) : 0;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif", color: 'white' }}>
      {/* Header */}
      <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }} className="rounded-xl shadow-md p-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI Quiz Generator</h1>
            <p className="text-gray-400">Create personalized quizzes on any topic</p>
          </div>
        </div>
      </div>

      {!generatedQuiz ? (
        /* Quiz Configuration */
        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }} className="rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-white mb-6">Configure Your Quiz</h2>
          
          <div className="space-y-6">
            {/* Topic Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Topic or Subject
              </label>
              <input
                type="text"
                value={quizConfig.topic}
                onChange={(e) => setQuizConfig({ ...quizConfig, topic: e.target.value })}
                placeholder="e.g., Photosynthesis, World War II, Python Programming..."
                className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                style={{ background: '#1e293b', border: '1.5px solid rgba(255,255,255,0.1)', color: '#fff' }}
              />
            </div>

            {/* Difficulty Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {difficulties.map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setQuizConfig({ ...quizConfig, difficulty: diff })}
                    className={`px-4 py-3 rounded-lg font-medium capitalize transition ${
                      quizConfig.difficulty === diff
                        ? 'bg-green-600 text-white'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Questions */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Number of Questions: {quizConfig.numQuestions}
              </label>
              <input
                type="range"
                min="5"
                max="20"
                step="5"
                value={quizConfig.numQuestions}
                onChange={(e) => setQuizConfig({ ...quizConfig, numQuestions: parseInt(e.target.value) })}
                className="w-full"
                style={{ accentColor: '#16a34a' }}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>5</span>
                <span>10</span>
                <span>15</span>
                <span>20</span>
              </div>
            </div>

            {/* Question Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Question Type
              </label>
              <select
                value={quizConfig.questionType}
                onChange={(e) => setQuizConfig({ ...quizConfig, questionType: e.target.value })}
                className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                style={{ background: '#1e293b', border: '1.5px solid rgba(255,255,255,0.1)', color: '#fff' }}
              >
                {questionTypes.map((type) => (
                  <option key={type.value} value={type.value} style={{ background: '#1e293b' }}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateQuiz}
              disabled={generating || !quizConfig.topic.trim()}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {generating ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generating Quiz with AI...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Generate Quiz</span>
                </div>
              )}
            </button>
          </div>
        </div>
      ) : !showResults ? (
        /* Quiz Taking Interface */
        <div className="space-y-4">
          {/* Progress Bar */}
          <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }} className="rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-300">
                Question {currentQuestion + 1} of {generatedQuiz.questions.length}
              </span>
              <span className="text-sm text-gray-400">
                {Object.keys(userAnswers).length} answered
              </span>
            </div>
            <div className="w-full rounded-full h-2" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div
                className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestion + 1) / generatedQuiz.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }} className="rounded-xl shadow-md p-6">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-green-950/40 text-green-400 border border-green-800/40 rounded-full text-sm font-medium mb-4 capitalize">
                {generatedQuiz.difficulty}
              </span>
              <h2 className="text-xl font-bold text-white mb-4">
                {generatedQuiz.questions[currentQuestion].question}
              </h2>
            </div>

            {/* Options / Input for question type */}
            <div className="space-y-3 mb-6">
              {generatedQuiz.questions[currentQuestion].type === 'mcq' &&
                generatedQuiz.questions[currentQuestion].options.map((option, index) => (
                  <label
                    key={index}
                    className={`w-full flex items-center p-4 rounded-lg border-2 transition cursor-pointer ${
                      userAnswers[generatedQuiz.questions[currentQuestion].id] === index
                        ? 'border-green-500'
                        : 'border-gray-700 hover:border-green-300/40 hover:bg-white/5'
                    }`}
                    style={userAnswers[generatedQuiz.questions[currentQuestion].id] === index ? { background: 'rgba(16,185,129,0.1)' } : {}}
                  >
                    <input
                      type="radio"
                      name={`question_${generatedQuiz.questions[currentQuestion].id}`}
                      checked={userAnswers[generatedQuiz.questions[currentQuestion].id] === index}
                      onChange={() => handleAnswerSelect(generatedQuiz.questions[currentQuestion].id, index)}
                      className="form-radio h-5 w-5 text-green-600 mr-4"
                      style={{ accentColor: '#16a34a' }}
                    />
                    <span className="font-medium text-gray-200">{option}</span>
                  </label>
                ))}

              {generatedQuiz.questions[currentQuestion].type === 'truefalse' &&
                generatedQuiz.questions[currentQuestion].options.map((option, index) => (
                  <label
                    key={index}
                    className={`w-full flex items-center p-4 rounded-lg border-2 transition cursor-pointer ${
                      userAnswers[generatedQuiz.questions[currentQuestion].id] === index
                        ? 'border-green-500'
                        : 'border-gray-700 hover:border-green-300/40 hover:bg-white/5'
                    }`}
                    style={userAnswers[generatedQuiz.questions[currentQuestion].id] === index ? { background: 'rgba(16,185,129,0.1)' } : {}}
                  >
                    <input
                      type="radio"
                      name={`question_${generatedQuiz.questions[currentQuestion].id}`}
                      checked={userAnswers[generatedQuiz.questions[currentQuestion].id] === index}
                      onChange={() => handleAnswerSelect(generatedQuiz.questions[currentQuestion].id, index)}
                      className="form-radio h-5 w-5 text-green-600 mr-4"
                      style={{ accentColor: '#16a34a' }}
                    />
                    <span className="font-medium text-gray-200">{option}</span>
                  </label>
                ))}

              {generatedQuiz.questions[currentQuestion].type === 'short' && (
                <input
                  type="text"
                  className="w-full p-4 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  style={{ background: '#1e293b', border: '1.5px solid rgba(255,255,255,0.1)', color: '#fff' }}
                  placeholder="Type your answer here..."
                  value={userAnswers[generatedQuiz.questions[currentQuestion].id] || ''}
                  onChange={e => handleAnswerSelect(generatedQuiz.questions[currentQuestion].id, e.target.value)}
                />
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className="px-6 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {currentQuestion === generatedQuiz.questions.length - 1 ? (
                <button
                  onClick={handleSubmitQuiz}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition"
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={() => setCurrentQuestion(Math.min(generatedQuiz.questions.length - 1, currentQuestion + 1))}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="space-y-4">
          {/* Score Card */}
          <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }} className="rounded-xl shadow-md p-8 text-center">
            <div className="mb-4">
              <div className={`text-6xl font-bold ${getScoreColor(calculateScore())}`}>
                {calculateScore()}%
              </div>
              <p className="text-gray-400 mt-2">Your Score</p>
            </div>
            <div className="flex justify-center space-x-8 mt-6">
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {generatedQuiz.questions.filter((q) => q.type !== 'short' && userAnswers[q.id] === q.correctAnswer).length}
                </div>
                <p className="text-sm text-gray-400">Correct</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">
                  {generatedQuiz.questions.filter((q) => q.type !== 'short' && userAnswers[q.id] !== q.correctAnswer).length}
                </div>
                <p className="text-sm text-gray-400">Incorrect</p>
              </div>
              {generatedQuiz.questions.some((q) => q.type === 'short') && (
                <div>
                  <div className="text-2xl font-bold text-blue-400">
                    {generatedQuiz.questions.filter((q) => q.type === 'short').length}
                  </div>
                  <p className="text-sm text-gray-400">Short Answer</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setGeneratedQuiz(null)}
              className="mt-6 px-8 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition"
            >
              Generate New Quiz
            </button>
          </div>

          {/* Detailed Results */}
          <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }} className="rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-white mb-4">Review Answers</h3>
            <div className="space-y-4">
              {generatedQuiz.questions.map((question, index) => (
                <div key={question.id} className="border-b border-white/5 pb-4">
                  {question.type === 'short' ? (
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white mb-2">{question.question}</p>
                        <p className="text-sm text-blue-400 mb-1">
                          Your Answer: {userAnswers[question.id] || '(No answer provided)'}
                        </p>
                        <p className="text-sm text-gray-400 italic mt-2">{question.explanation}</p>
                      </div>
                    </div>
                  ) : userAnswers[question.id] === question.correctAnswer ? (
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white mb-2">{question.question}</p>
                        <p className="text-sm text-green-400 mb-1">
                          ✓ Correct Answer: {question.options[question.correctAnswer]}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-red-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white mb-2">{question.question}</p>
                        <p className="text-sm text-green-400 mb-1">
                          ✓ Correct Answer: {question.options[question.correctAnswer]}
                        </p>
                        <p className="text-sm text-red-400">
                          ✗ Your Answer: {question.options[userAnswers[question.id]] || 'Not answered'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizGeneration;