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

  const handleGenerateQuiz = () => {
    if (!quizConfig.topic.trim()) {
      alert('Please enter a topic!');
      return;
    }

    setGenerating(true);

    // Simulate AI quiz generation
    setTimeout(() => {
      const mockQuiz = {
        topic: quizConfig.topic,
        difficulty: quizConfig.difficulty,
        questions: Array.from({ length: quizConfig.numQuestions }, (_, i) => ({
          id: i + 1,
          question: `Sample question ${i + 1} about ${quizConfig.topic}?`,
          type: i % 2 === 0 ? 'mcq' : 'truefalse',
          options: i % 2 === 0 ? [
            'Option A - First answer',
            'Option B - Second answer',
            'Option C - Third answer',
            'Option D - Fourth answer'
          ] : ['True', 'False'],
          correctAnswer: i % 2 === 0 ? 1 : 0,
          explanation: 'This is the correct answer because...'
        }))
      };

      setGeneratedQuiz(mockQuiz);
      setCurrentQuestion(0);
      setUserAnswers({});
      setShowResults(false);
      setGenerating(false);
    }, 2000);
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
    generatedQuiz.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / generatedQuiz.questions.length) * 100);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">AI Quiz Generator</h1>
            <p className="text-gray-600">Create personalized quizzes on any topic</p>
          </div>
        </div>
      </div>

      {!generatedQuiz ? (
        /* Quiz Configuration */
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Configure Your Quiz</h2>
          
          <div className="space-y-6">
            {/* Topic Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic or Subject
              </label>
              <input
                type="text"
                value={quizConfig.topic}
                onChange={(e) => setQuizConfig({ ...quizConfig, topic: e.target.value })}
                placeholder="e.g., Photosynthesis, World War II, Python Programming..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Difficulty Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Questions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5</span>
                <span>10</span>
                <span>15</span>
                <span>20</span>
              </div>
            </div>

            {/* Question Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Type
              </label>
              <select
                value={quizConfig.questionType}
                onChange={(e) => setQuizConfig({ ...quizConfig, questionType: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {questionTypes.map((type) => (
                  <option key={type.value} value={type.value}>
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
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Question {currentQuestion + 1} of {generatedQuiz.questions.length}
              </span>
              <span className="text-sm text-gray-500">
                {Object.keys(userAnswers).length} answered
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestion + 1) / generatedQuiz.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4 capitalize">
                {generatedQuiz.difficulty}
              </span>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {generatedQuiz.questions[currentQuestion].question}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {generatedQuiz.questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(generatedQuiz.questions[currentQuestion].id, index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition ${
                    userAnswers[generatedQuiz.questions[currentQuestion].id] === index
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      userAnswers[generatedQuiz.questions[currentQuestion].id] === index
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                    }`}>
                      {userAnswers[generatedQuiz.questions[currentQuestion].id] === index && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="mb-4">
              <div className={`text-6xl font-bold ${getScoreColor(calculateScore())}`}>
                {calculateScore()}%
              </div>
              <p className="text-gray-600 mt-2">Your Score</p>
            </div>
            <div className="flex justify-center space-x-8 mt-6">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {generatedQuiz.questions.filter((q) => userAnswers[q.id] === q.correctAnswer).length}
                </div>
                <p className="text-sm text-gray-600">Correct</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {generatedQuiz.questions.filter((q) => userAnswers[q.id] !== q.correctAnswer).length}
                </div>
                <p className="text-sm text-gray-600">Incorrect</p>
              </div>
            </div>
            <button
              onClick={() => setGeneratedQuiz(null)}
              className="mt-6 px-8 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition"
            >
              Generate New Quiz
            </button>
          </div>

          {/* Detailed Results */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Review Answers</h3>
            <div className="space-y-4">
              {generatedQuiz.questions.map((question, index) => (
                <div key={question.id} className="border-b border-gray-200 pb-4">
                  <div className="flex items-start space-x-3">
                    {userAnswers[question.id] === question.correctAnswer ? (
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 mb-2">{question.question}</p>
                      <p className="text-sm text-green-600 mb-1">
                        ✓ Correct Answer: {question.options[question.correctAnswer]}
                      </p>
                      {userAnswers[question.id] !== question.correctAnswer && (
                        <p className="text-sm text-red-600">
                          ✗ Your Answer: {question.options[userAnswers[question.id]] || 'Not answered'}
                        </p>
                      )}
                    </div>
                  </div>
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