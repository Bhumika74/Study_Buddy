import { useState, useRef } from 'react';

const API_BASE = "";

// ─── Lightweight AI response formatter ───────────────────────────────────────
const FormattedAnswer = ({ text }) => {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) { elements.push(<div key={i} className="h-2" />); i++; continue; }

    const numberedMatch = line.match(/^(\d+[\.\):])\s+(.+)/);
    if (numberedMatch) {
      const num = numberedMatch[1].replace(/[.):]/, '');
      const content = numberedMatch[2];
      const subItems = [];
      let j = i + 1;
      while (j < lines.length) {
        const sub = lines[j].trim();
        if (!sub) { j++; break; }
        const optMatch = sub.match(/^([A-Da-d][\.\):])\s+(.+)/);
        const answerMatch = sub.match(/^(Answer|Correct|Ans)[\s:]+(.+)/i);
        const nextNum = sub.match(/^\d+[\.\):]/);
        if (optMatch) { subItems.push({ type: 'option', label: optMatch[1].toUpperCase().replace(/[.):]/,''), text: optMatch[2] }); j++; }
        else if (answerMatch) { subItems.push({ type: 'answer', text: answerMatch[2] }); j++; }
        else if (nextNum) { break; }
        else { subItems.push({ type: 'text', text: sub }); j++; }
      }
      elements.push(
        <div key={i} className="mb-4 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          {/* ✅ teal question header */}
          <div className="flex items-start gap-3 p-4 border-b border-teal-100" style={{ background: 'linear-gradient(to right, #f0faf8, #f5f0ff)' }}>
            <span className="flex-shrink-0 w-7 h-7 rounded-full text-white text-sm font-bold flex items-center justify-center" style={{ background: '#1a7a6e' }}>
              {num}
            </span>
            <p className="font-semibold text-gray-800 leading-snug pt-0.5">{content}</p>
          </div>
          {subItems.length > 0 && (
            <div className="p-3 space-y-1">
              {subItems.map((item, si) => {
                if (item.type === 'option') return (
                  <div key={si} className="flex items-start gap-2 px-3 py-2 rounded-lg hover:bg-gray-50">
                    <span className="flex-shrink-0 w-6 h-6 rounded-md bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center">{item.label}</span>
                    <span className="text-sm text-gray-700">{item.text}</span>
                  </div>
                );
                if (item.type === 'answer') return (
                  <div key={si} className="flex items-center gap-2 mt-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                    <span className="text-green-600 font-bold text-xs">✓ Answer:</span>
                    <span className="text-sm text-green-800 font-medium">{item.text}</span>
                  </div>
                );
                return <p key={si} className="text-sm text-gray-600 px-2">{item.text}</p>;
              })}
            </div>
          )}
        </div>
      );
      i = j; continue;
    }

    const headingMatch = line.match(/^#{1,3}\s+(.+)/);
    if (headingMatch || (line.endsWith(':') && line.length < 60 && !line.match(/^[A-Da-d][.)]/))) {
      const title = headingMatch ? headingMatch[1] : line.slice(0, -1);
      elements.push(<h3 key={i} className="font-bold text-gray-800 text-base mt-4 mb-2 pb-1 border-b border-gray-200">{title}</h3>);
      i++; continue;
    }

    if (line.match(/^[-*•]\s+/)) {
      const bullets = [];
      let j = i;
      while (j < lines.length && lines[j].trim().match(/^[-*•]\s+/)) { bullets.push(lines[j].trim().replace(/^[-*•]\s+/, '')); j++; }
      elements.push(
        <ul key={i} className="mb-3 space-y-1">
          {bullets.map((b, bi) => (
            <li key={bi} className="flex items-start gap-2 text-sm text-gray-700">
              {/* ✅ teal bullet */}
              <span className="mt-1 flex-shrink-0" style={{ color: '#1a7a6e' }}>•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      );
      i = j; continue;
    }

    if (line.startsWith('```')) {
      const codeLines = [];
      let j = i + 1;
      while (j < lines.length && !lines[j].trim().startsWith('```')) { codeLines.push(lines[j]); j++; }
      elements.push(<pre key={i} className="mb-3 bg-gray-900 text-green-300 rounded-lg p-4 text-xs overflow-x-auto"><code>{codeLines.join('\n')}</code></pre>);
      i = j + 1; continue;
    }

    const answerLine = line.match(/^(Answer|Correct answer|Ans)[\s:]+(.+)/i);
    if (answerLine) {
      elements.push(
        <div key={i} className="mb-2 flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
          <span className="text-green-600 font-bold text-xs">✓ Answer:</span>
          <span className="text-sm text-green-800 font-medium">{answerLine[2]}</span>
        </div>
      );
      i++; continue;
    }

    elements.push(<p key={i} className="text-sm text-gray-700 leading-relaxed mb-2">{line}</p>);
    i++;
  }

  return <div className="space-y-1">{elements}</div>;
};
// ─────────────────────────────────────────────────────────────────────────────

const UploadMaterial = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadingActions, setLoadingActions] = useState({});
  const [quizModal, setQuizModal] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const fileInputRef = useRef(null);
  const [questions, setQuestions] = useState({});
  const [answers, setAnswers] = useState({});
  const [asking, setAsking] = useState({});

  const readFileAsBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const readFileAsText = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });

  const callAnalyze = async (messages) => {
    const response = await fetch(`${API_BASE}/api/ai/analyze`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: messages })
    });
    const data = await response.json();
    return data?.content?.[0]?.text || "";
  };

  const callQuiz = async (messages) => {
    const response = await fetch(`${API_BASE}/api/ai/quiz`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: messages })
    });
    if (!response.ok) { const err = await response.json().catch(() => ({})); throw new Error(err.error || `Quiz API error: ${response.status}`); }
    const data = await response.json();
    return data?.content?.[0]?.text || "";
  };

  const analyzeFile = async (file) => {
    const isImage = file.type.startsWith('image/');
    const isPDF = file.type === 'application/pdf';
    const isText = file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md');

    if (isPDF) {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(`${API_BASE}/api/ai/upload-material`, { method: 'POST', body: formData });
      if (!response.ok) throw new Error('PDF upload failed');
      const data = await response.json();
      return { summary: data.summary || 'Analysis complete.', topics: data.topics || [], keyPoints: data.keyPoints || [], studyTips: data.studyTips || '', extractedText: data.extractedText || '' };
    }

    let messageContent = [];
    if (isImage) {
      const base64 = await readFileAsBase64(file);
      messageContent = [
        { type: 'image', source: { type: 'base64', media_type: file.type, data: base64 } },
        { type: 'text', text: 'Analyze this study material image. Extract all text and key concepts visible.' }
      ];
    } else if (isText) {
      const text = await readFileAsText(file);
      messageContent = [{ type: 'text', text: `Here is the study material content:\n\n${text.slice(0, 8000)}` }];
    } else {
      try {
        const text = await readFileAsText(file);
        messageContent = [{ type: 'text', text: `Here is the study material:\n\n${text.slice(0, 8000)}` }];
      } catch {
        messageContent = [{ type: 'text', text: `The file is named "${file.name}". Please provide a generic study analysis.` }];
      }
    }

    const raw = await callAnalyze([{ role: 'user', content: messageContent }]);
    try {
      const clean = raw.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      return { ...parsed, extractedText: '' };
    } catch {
      return {
        summary: raw.slice(0, 300) || 'AI analysis complete.',
        topics: ['Core Concepts', 'Key Principles', 'Applications', 'Examples', 'Summary'],
        keyPoints: ['Material analyzed successfully', 'Review the content thoroughly', 'Focus on main concepts'],
        studyTips: 'Review this material in sections and test yourself after each part.',
        extractedText: ''
      };
    }
  };

  const handleFileUpload = async (files) => {
    setProcessing(true);
    const fileArray = Array.from(files);
    const newFiles = [];
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      setProcessingStage(`Analyzing ${file.name} (${i + 1}/${fileArray.length})...`);
      try {
        const analysis = await analyzeFile(file);
        newFiles.push({
          id: Date.now() + i, name: file.name,
          size: file.size < 1024 ? file.size + ' B' : file.size < 1048576 ? (file.size / 1024).toFixed(1) + ' KB' : (file.size / 1048576).toFixed(1) + ' MB',
          type: file.type, fileObj: file, uploadDate: new Date(), aiProcessed: true,
          summary: analysis.summary, topics: analysis.topics, keyPoints: analysis.keyPoints,
          studyTips: analysis.studyTips, extractedText: analysis.extractedText || '', quiz: null,
        });
      } catch (err) {
        console.error('File analysis error:', err);
        newFiles.push({
          id: Date.now() + i, name: file.name, size: (file.size / 1024).toFixed(1) + ' KB',
          type: file.type, fileObj: file, uploadDate: new Date(), aiProcessed: false,
          summary: 'Could not analyze this file. Please try again.',
          topics: [], keyPoints: [], studyTips: '', extractedText: '', quiz: null,
        });
      }
    }
    setUploadedFiles(prev => [...prev, ...newFiles]);
    setProcessing(false);
    setProcessingStage('');
  };

  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files.length > 0) handleFileUpload(e.dataTransfer.files); };
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleFileInput = (e) => { if (e.target.files.length > 0) handleFileUpload(e.target.files); };

  const handleRegenerateSummary = async (fileId) => {
    setLoadingActions(prev => ({ ...prev, [`summary_${fileId}`]: true }));
    const file = uploadedFiles.find(f => f.id === fileId);
    if (!file) return;
    try {
      const analysis = await analyzeFile(file.fileObj);
      setUploadedFiles(prev => prev.map(f => f.id === fileId ? { ...f, summary: analysis.summary, topics: analysis.topics, keyPoints: analysis.keyPoints, studyTips: analysis.studyTips } : f));
    } catch (err) { console.error(err); }
    setLoadingActions(prev => ({ ...prev, [`summary_${fileId}`]: false }));
  };

  const handleGenerateQuiz = async (fileId) => {
    setLoadingActions(prev => ({ ...prev, [`quiz_${fileId}`]: true }));
    const file = uploadedFiles.find(f => f.id === fileId);
    if (!file) return;
    let messageContent = [];
    try {
      if (file.type === 'application/pdf') {
        const context = file.extractedText?.trim().length > 20
          ? `Generate a 5-question quiz from this study material:\n\n${file.extractedText.slice(0, 2500)}`
          : `Generate a 5-question quiz. Topics: ${file.topics.join(', ')}. Summary: ${file.summary}`;
        messageContent = [{ type: 'text', text: context }];
      } else if (file.type.startsWith('image/')) {
        const base64 = await readFileAsBase64(file.fileObj);
        messageContent = [
          { type: 'image', source: { type: 'base64', media_type: file.type, data: base64 } },
          { type: 'text', text: 'Generate a 5-question multiple choice quiz from this material.' }
        ];
      } else {
        const text = await readFileAsText(file.fileObj);
        messageContent = [{ type: 'text', text: `Generate a 5-question quiz from this material:\n\n${text.slice(0, 6000)}` }];
      }
    } catch {
      messageContent = [{ type: 'text', text: `Generate a 5-question quiz. Topics: ${file.topics.join(', ')}. Summary: ${file.summary}` }];
    }
    try {
      const raw = await callQuiz([{ role: 'user', content: messageContent }]);
      const clean = raw.replace(/```json|```/g, '').trim();
      const first = clean.indexOf('{'); const last = clean.lastIndexOf('}');
      const jsonStr = first !== -1 && last !== -1 ? clean.substring(first, last + 1) : clean;
      const parsed = JSON.parse(jsonStr);
      if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length === 0) throw new Error('No questions returned');
      setUploadedFiles(prev => prev.map(f => f.id === fileId ? { ...f, quiz: parsed.questions } : f));
      setQuizModal(fileId); setQuizAnswers({}); setQuizSubmitted(false);
    } catch (err) {
      console.error('Quiz generation error:', err);
      alert(`Could not generate quiz: ${err.message}. Please try again.`);
    }
    setLoadingActions(prev => ({ ...prev, [`quiz_${fileId}`]: false }));
  };

  const handleDownloadNotes = (fileId) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (!file) return;
    const notes = `# Study Notes: ${file.name}\nGenerated on: ${new Date().toLocaleDateString()}\n\n## Summary\n${file.summary}\n\n## Key Topics\n${file.topics.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\n## Key Points\n${file.keyPoints.map(p => `• ${p}`).join('\n')}\n\n## Study Tips\n${file.studyTips}\n`;
    const blob = new Blob([notes], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `notes_${file.name.replace(/\.[^/.]+$/, '')}.md`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = (fileId) => { setUploadedFiles(prev => prev.filter(f => f.id !== fileId)); if (selectedFile === fileId) setSelectedFile(null); };

  const handleAskQuestion = async (fileId) => {
    const q = questions[fileId];
    if (!q?.trim()) return;
    setAsking(prev => ({ ...prev, [fileId]: true }));
    const file = uploadedFiles.find(f => f.id === fileId);
    try {
      const response = await fetch(`${API_BASE}/api/ai/ask-pdf`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, documentText: file?.extractedText || `${file?.summary}\n\nKey Points:\n${file?.keyPoints?.join('\n')}` })
      });
      const data = await response.json();
      setAnswers(prev => ({ ...prev, [fileId]: data.answer }));
    } catch (err) {
      console.error(err);
      setAnswers(prev => ({ ...prev, [fileId]: 'Failed to get answer. Please try again.' }));
    }
    setAsking(prev => ({ ...prev, [fileId]: false }));
  };

  const getFileIcon = (type) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('image')) return '🖼️';
    if (type.includes('text')) return '📝';
    if (type.includes('word') || type.includes('document')) return '📘';
    return '📎';
  };

  const quizFile = quizModal ? uploadedFiles.find(f => f.id === quizModal) : null;
  const quizScore = quizSubmitted && quizFile?.quiz
    ? quizFile.quiz.filter((q, i) => quizAnswers[i] === q.correct).length : 0;

  return (
    <div className="space-y-6">

      {/* Header — ✅ teal + purple contrast */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ background: '#1a7a6e' }}>
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Upload Study Materials</h1>
            <p className="text-gray-600">Upload notes, books, or documents for AI-powered analysis</p>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div
          onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
          onClick={() => !processing && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition cursor-pointer`}
          style={isDragging
            ? { borderColor: '#1a7a6e', background: '#f0faf8' }
            : { borderColor: '#d1d5db' }}
          onMouseEnter={e => { if (!isDragging) { e.currentTarget.style.borderColor = '#1a7a6e'; e.currentTarget.style.background = '#f9fffe'; } }}
          onMouseLeave={e => { if (!isDragging) { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.background = ''; } }}
        >
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Drop files here or click to upload</h3>
          <p className="text-gray-500 mb-4">Supports PDF, DOCX, TXT, images and more</p>
          {/* ✅ teal Choose Files button */}
          <span className="inline-block px-6 py-3 text-white rounded-lg cursor-pointer hover:shadow-lg transform hover:-translate-y-0.5 transition"
            style={{ background: '#1a7a6e' }}>
            Choose Files
          </span>
          <input ref={fileInputRef} type="file" className="hidden" multiple onChange={handleFileInput} accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.md" />
        </div>
        {processing && (
          <div className="mt-4 flex flex-col items-center justify-center space-y-2" style={{ color: '#1a7a6e' }}>
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2" style={{ borderColor: '#1a7a6e' }}></div>
              <span className="font-medium">Processing with AI...</span>
            </div>
            {processingStage && <p className="text-sm text-gray-500">{processingStage}</p>}
          </div>
        )}
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Uploaded Materials ({uploadedFiles.length})</h2>
          <div className="space-y-4">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3 flex-1">
                    <span className="text-3xl">{getFileIcon(file.type)}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{file.name}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-500">
                        <span>{file.size}</span><span>•</span>
                        <span>{file.uploadDate.toLocaleDateString()}</span>
                        {file.aiProcessed && (
                          <><span>•</span>
                          <span className="flex items-center space-x-1 text-green-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>AI Processed</span>
                          </span></>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* ✅ teal View Details link */}
                  <button onClick={() => setSelectedFile(selectedFile === file.id ? null : file.id)}
                    className="text-sm font-medium whitespace-nowrap ml-2" style={{ color: '#1a7a6e' }}>
                    {selectedFile === file.id ? 'Hide' : 'View'} Details
                  </button>
                </div>

                {selectedFile === file.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                    {/* Summary — purple contrast */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>AI-Generated Summary</span>
                      </h4>
                      <div className="bg-purple-50 rounded-lg p-4">
                        <p className="text-gray-700 leading-relaxed">{file.summary}</p>
                      </div>
                    </div>

                    {/* Key Points */}
                    {file.keyPoints?.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">📌 Key Points</h4>
                        <ul className="space-y-1">
                          {file.keyPoints.map((point, i) => (
                            <li key={i} className="flex items-start space-x-2 text-sm text-gray-700">
                              {/* ✅ teal bullet */}
                              <span className="mt-0.5" style={{ color: '#1a7a6e' }}>•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Topics — ✅ teal tags */}
                    {file.topics?.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">🏷️ Key Topics Identified</h4>
                        <div className="flex flex-wrap gap-2">
                          {file.topics.map((topic, index) => (
                            <span key={index} className="px-3 py-1 rounded-full text-sm font-medium"
                              style={{ background: '#f0faf8', color: '#1a7a6e', border: '1px solid #d1faf4' }}>
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Study Tips */}
                    {file.studyTips && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-yellow-800"><span className="font-semibold">💡 Study Tip: </span>{file.studyTips}</p>
                      </div>
                    )}

                    {/* Ask Questions */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        💬 Ask Questions About This Material
                      </h4>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="e.g. give quiz on this / explain topic 3 / what are key formulas?"
                          value={questions[file.id] || ''}
                          onChange={(e) => setQuestions(prev => ({ ...prev, [file.id]: e.target.value }))}
                          onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion(file.id)}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none transition"
                          onFocus={e => e.target.style.borderColor = '#1a7a6e'}
                          onBlur={e => e.target.style.borderColor = '#d1d5db'}
                        />
                        {/* ✅ teal Ask AI button */}
                        <button
                          onClick={() => handleAskQuestion(file.id)}
                          disabled={asking[file.id]}
                          className="px-4 py-2 text-white rounded-lg text-sm disabled:opacity-60 transition whitespace-nowrap"
                          style={{ background: '#1a7a6e' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#155f55'}
                          onMouseLeave={e => e.currentTarget.style.background = '#1a7a6e'}
                        >
                          {asking[file.id] ? (
                            <span className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                              Thinking...
                            </span>
                          ) : 'Ask AI'}
                        </button>
                      </div>

                      {answers[file.id] && (
                        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4 max-h-[500px] overflow-y-auto">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#1a7a6e' }}>AI Response</span>
                            <button onClick={() => setAnswers(prev => ({ ...prev, [file.id]: null }))}
                              className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
                          </div>
                          <FormattedAnswer text={answers[file.id]} />
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <button onClick={() => handleRegenerateSummary(file.id)} disabled={loadingActions[`summary_${file.id}`]}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm disabled:opacity-60 flex items-center gap-1">
                        {loadingActions[`summary_${file.id}`] ? <><div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>Regenerating...</> : '🔄 Regenerate Summary'}
                      </button>
                      <button onClick={() => handleGenerateQuiz(file.id)} disabled={loadingActions[`quiz_${file.id}`]}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm disabled:opacity-60 flex items-center gap-1">
                        {loadingActions[`quiz_${file.id}`] ? <><div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>Generating Quiz...</> : '🧩 Generate Quiz'}
                      </button>
                      {file.quiz && (
                        <button onClick={() => { setQuizModal(file.id); setQuizAnswers({}); setQuizSubmitted(false); }}
                          className="px-4 py-2 text-white rounded-lg transition text-sm"
                          style={{ background: '#7c3aed' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#6d28d9'}
                          onMouseLeave={e => e.currentTarget.style.background = '#7c3aed'}>
                          📋 Retake Quiz
                        </button>
                      )}
                      {/* ✅ teal Download Notes */}
                      <button onClick={() => handleDownloadNotes(file.id)}
                        className="px-4 py-2 text-white rounded-lg transition text-sm"
                        style={{ background: '#1a7a6e' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#155f55'}
                        onMouseLeave={e => e.currentTarget.style.background = '#1a7a6e'}>
                        ⬇️ Download Notes
                      </button>
                      <button onClick={() => handleDelete(file.id)}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm">
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {quizModal && quizFile?.quiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">📝 Quiz: {quizFile.name}</h2>
                  <p className="text-sm text-gray-500">{quizFile.quiz.length} questions • AI-generated from your material</p>
                </div>
                <button onClick={() => setQuizModal(null)} className="text-gray-400 hover:text-gray-600 text-2xl font-light">×</button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {quizFile.quiz.map((q, qi) => (
                <div key={qi} className={`rounded-xl p-4 border-2 transition ${quizSubmitted ? (quizAnswers[qi] === q.correct ? 'border-green-400 bg-green-50' : 'border-red-300 bg-red-50') : 'border-gray-200'}`}>
                  <p className="font-semibold text-gray-800 mb-3">
                    {/* ✅ teal Q number */}
                    <span className="mr-2 font-bold" style={{ color: '#1a7a6e' }}>Q{qi + 1}.</span>{q.question}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((opt, oi) => (
                      <label key={oi} className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition ${
                        quizSubmitted ? oi === q.correct ? 'bg-green-100 border border-green-400' : quizAnswers[qi] === oi ? 'bg-red-100 border border-red-400' : 'bg-white border border-gray-200'
                        : quizAnswers[qi] === oi ? 'border' : 'bg-gray-50 border border-gray-200 hover:bg-teal-50'
                      }`}
                      style={!quizSubmitted && quizAnswers[qi] === oi ? { background: '#f0faf8', borderColor: '#1a7a6e' } : {}}>
                        <input type="radio" name={`q${qi}`} disabled={quizSubmitted} checked={quizAnswers[qi] === oi}
                          onChange={() => setQuizAnswers(prev => ({ ...prev, [qi]: oi }))}
                          style={{ accentColor: '#1a7a6e' }} />
                        <span className="text-sm text-gray-700">{opt}</span>
                        {quizSubmitted && oi === q.correct && <span className="ml-auto text-green-600 text-xs font-bold">✓ Correct</span>}
                      </label>
                    ))}
                  </div>
                  {quizSubmitted && (
                    <div className="mt-3 p-3 rounded-lg" style={{ background: '#f0faf8' }}>
                      <p className="text-xs" style={{ color: '#155f55' }}><span className="font-semibold">💡 Explanation: </span>{q.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
              {quizSubmitted ? (
                <div className={`rounded-xl p-6 text-center ${quizScore >= quizFile.quiz.length * 0.8 ? 'bg-green-50 border-2 border-green-400' : quizScore >= quizFile.quiz.length * 0.5 ? 'bg-yellow-50 border-2 border-yellow-400' : 'bg-red-50 border-2 border-red-400'}`}>
                  <p className="text-4xl mb-2">{quizScore >= quizFile.quiz.length * 0.8 ? '🎉' : quizScore >= quizFile.quiz.length * 0.5 ? '📚' : '💪'}</p>
                  <p className="text-2xl font-bold text-gray-800">{quizScore}/{quizFile.quiz.length} Correct</p>
                  <p className="text-gray-600 mt-1">{quizScore >= quizFile.quiz.length * 0.8 ? 'Excellent work!' : quizScore >= quizFile.quiz.length * 0.5 ? 'Good effort, keep reviewing!' : 'Review the material and try again!'}</p>
                  {/* ✅ teal Try Again */}
                  <button onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); }}
                    className="mt-4 px-5 py-2 text-white rounded-lg transition text-sm"
                    style={{ background: '#1a7a6e' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#155f55'}
                    onMouseLeave={e => e.currentTarget.style.background = '#1a7a6e'}>
                    Try Again
                  </button>
                </div>
              ) : (
                <button onClick={() => setQuizSubmitted(true)} disabled={Object.keys(quizAnswers).length < quizFile.quiz.length}
                  className="w-full py-3 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #1a7a6e, #2d9d8f)' }}>
                  {Object.keys(quizAnswers).length < quizFile.quiz.length ? `Answer all questions (${Object.keys(quizAnswers).length}/${quizFile.quiz.length})` : '✅ Submit Quiz'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Info Card — ✅ teal + purple contrast */}
      <div className="rounded-xl p-6 border" style={{ background: 'linear-gradient(to right, #f0faf8, #f5f0ff)', borderColor: '#d1faf4' }}>
        <div className="flex items-start space-x-3">
          <svg className="w-6 h-6 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#1a7a6e' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">How it works:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>📂 <strong>Upload</strong> your study materials (notes, textbooks, PDFs, images)</li>
              <li>🤖 <strong>AI analyzes</strong> and extracts key information, topics & points instantly</li>
              <li>📋 <strong>Get summaries</strong>, topic identification, key points & personalized study tips</li>
              <li>💬 <strong>Ask questions</strong> — quiz, explain a topic, list formulas, and more</li>
              <li>🧩 <strong>Generate custom quizzes</strong> based on your uploaded content and test yourself</li>
              <li>⬇️ <strong>Download notes</strong> as a structured markdown file to study offline</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
};

export default UploadMaterial;