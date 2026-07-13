import React, { useState } from 'react';
import {
  GraduationCap, Play, Clock, CheckCircle, BookOpen, Award,
  Lock, Star, ChevronRight, X, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Module {
  id: string; title: string; description: string; category: string;
  duration: number; lessons: string[]; level: 'Beginner' | 'Intermediate' | 'Advanced';
  image: string; enrolledCount: number; rating: number; reviews: number;
  progress?: number; completed?: boolean; locked?: boolean;
}

const MODULES: Module[] = [
  { id: '1', title: 'Digital Literacy Fundamentals', description: 'Learn basic computer skills, internet usage, email, UPI payments, and digital tools for modern rural business.', category: 'Technology', duration: 120, lessons: ['Introduction to Computers', 'Internet & Email Basics', 'UPI & Digital Payments', 'Using Government Portals', 'Online Safety & Security', 'Mobile App Navigation', 'Digital Documentation', 'Practical Assessment'], level: 'Beginner', image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg', enrolledCount: 1240, rating: 4.8, reviews: 312, progress: 75 },
  { id: '2', title: 'Financial Literacy & Banking', description: 'Understand banking services, insurance products, investment basics, PMJDY, MUDRA and financial planning for rural entrepreneurs.', category: 'Finance', duration: 180, lessons: ['Jan Dhan Yojana Overview', 'Banking Basics', 'Insurance Products', 'Loan Types & Eligibility', 'Investment Fundamentals', 'GST for Small Business', 'Accounting Basics', 'MUDRA Loan Process', 'Credit Score', 'Final Assessment'], level: 'Intermediate', image: 'https://images.pexels.com/photos/3483098/pexels-photo-3483098.jpeg', enrolledCount: 890, rating: 4.7, reviews: 198, progress: 30 },
  { id: '3', title: 'Government Schemes Mastery', description: 'Comprehensive guide to all central and state welfare schemes — PM Kisan, Ayushman Bharat, PMAY, and how to help citizens apply.', category: 'Government', duration: 240, lessons: ['PM Kisan Samman Nidhi', 'Ayushman Bharat PM-JAY', 'PMAY Housing Scheme', 'Scholarship Schemes', 'Pension Schemes', 'Women Empowerment Schemes', 'Agriculture Schemes', 'State Government Portals', 'Application Processes', 'Document Checklist', 'Tracking Applications', 'Final Quiz'], level: 'Intermediate', image: 'https://images.pexels.com/photos/8112199/pexels-photo-8112199.jpeg', enrolledCount: 2100, rating: 4.9, reviews: 567, progress: 0 },
  { id: '4', title: 'Passport & Documentation Services', description: 'Complete guide to passports, PAN, Aadhaar, birth/death certificates, and other official documentation services.', category: 'Documentation', duration: 90, lessons: ['Passport Application Process', 'Tatkal Passport', 'Passport Renewal', 'PAN Card Services', 'Aadhaar Update Process', 'Birth Certificate', 'Income Certificate', 'Final Assessment'], level: 'Beginner', image: 'https://images.pexels.com/photos/1386604/pexels-photo-1386604.jpeg', enrolledCount: 654, rating: 4.6, reviews: 145, completed: true },
  { id: '5', title: 'Healthcare Facilitation Training', description: 'Help patients with telemedicine, PM-JAY enrollment, health scheme applications, and medical documentation.', category: 'Healthcare', duration: 150, lessons: ['Telemedicine Basics', 'PM-JAY Enrollment', 'Health Record Management', 'Medicine Delivery Services', 'Health Scheme Applications', 'Emergency Services', 'Mental Health Awareness', 'Final Assessment'], level: 'Intermediate', image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg', enrolledCount: 445, rating: 4.5, reviews: 98, locked: true },
  { id: '6', title: 'E-Commerce & ONDC Integration', description: 'Build and manage an online store, integrate with ONDC, manage inventory, and scale your digital business.', category: 'Business', duration: 200, lessons: ['Intro to E-Commerce', 'ONDC Network Overview', 'Seller Registration', 'Product Listing', 'Order Management', 'Payment Settlement', 'Customer Service', 'Shipping & Logistics', 'Returns & Refunds', 'Business Analytics', 'Marketing Basics', 'Final Assessment'], level: 'Advanced', image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg', enrolledCount: 320, rating: 4.7, reviews: 72, locked: true },
];

const QUIZ: { q: string; opts: string[]; correct: number }[] = [
  { q: 'What does AEPS stand for?', opts: ['Aadhaar Enabled Payment System', 'Advanced Electronic Payment System', 'Automated E-Payment Service', 'Aadhaar Extension Service'], correct: 0 },
  { q: 'Under PM Kisan, how much annual income support is provided?', opts: ['₹4,000', '₹6,000', '₹8,000', '₹10,000'], correct: 1 },
  { q: 'Which portal is used for passport services in India?', opts: ['passportindia.gov.in', 'passport.gov.in', 'mea.gov.in', 'passporthome.in'], correct: 0 },
  { q: 'What is the Tatkal fee for a 36-page passport (above 18)?', opts: ['₹1500', '₹2000', '₹2000 (Normal) + ₹2000 (Tatkal)', '₹3500'], correct: 3 },
  { q: 'Which scheme provides health coverage up to ₹5 lakh per family?', opts: ['ESIC', 'PM-JAY / Ayushman Bharat', 'PMSBY', 'Jan Dhan'], correct: 1 },
];

const LEVEL_COLOR = { Beginner: 'bg-green-100 text-green-700', Intermediate: 'bg-blue-100 text-blue-700', Advanced: 'bg-orange-100 text-orange-700' };

const Training: React.FC = () => {
  const { user } = useAuth();
  const [modules, setModules] = useState<Module[]>(MODULES);
  const [activeCat, setActiveCat] = useState('All');
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [quizMode, setQuizMode] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const categories = ['All', ...Array.from(new Set(modules.map(m => m.category)))];
  const filtered = activeCat === 'All' ? modules : modules.filter(m => m.category === activeCat);

  const enrolled = modules.filter(m => m.progress !== undefined || m.completed);
  const completed = modules.filter(m => m.completed);
  const totalHours = Math.round(enrolled.reduce((s, m) => s + m.duration, 0) / 60);

  const enroll = (id: string) => setModules(prev => prev.map(m => m.id === id ? { ...m, progress: 0 } : m));
  const advanceLesson = (module: Module) => {
    const newProgress = Math.min(100, Math.round(((currentLesson + 1) / module.lessons.length) * 100));
    const updated = { ...module, progress: newProgress, completed: newProgress >= 100 };
    setModules(prev => prev.map(m => m.id === module.id ? updated : m));
    setSelectedModule(updated);
    if (currentLesson < module.lessons.length - 1) setCurrentLesson(p => p + 1);
    else setQuizMode(true);
  };

  const submitQuiz = () => setQuizSubmitted(true);
  const correctCount = quizAnswers.filter((a, i) => a === QUIZ[i].correct).length;
  const passed = correctCount >= Math.ceil(QUIZ.length * 0.6);

  const closeModal = () => {
    setSelectedModule(null);
    setCurrentLesson(0);
    setQuizMode(false);
    setQuizSubmitted(false);
    setQuizAnswers([]);
  };

  const openModule = (m: Module) => {
    if (m.locked) return;
    setSelectedModule(m);
    setCurrentLesson(Math.floor(((m.progress || 0) / 100) * m.lessons.length));
    setQuizMode(false);
    setQuizSubmitted(false);
    setQuizAnswers([]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Training & Certification</h2>
        <p className="text-gray-500 text-sm mt-0.5">Upskill yourself and earn recognized certificates</p>
      </div>

      {/* Progress Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Enrolled Courses', value: enrolled.length, icon: BookOpen, color: 'blue' },
          { label: 'Completed', value: completed.length, icon: CheckCircle, color: 'green' },
          { label: 'Certificates Earned', value: completed.length, icon: Award, color: 'amber' },
          { label: 'Hours Learned', value: `${totalHours}h`, icon: Clock, color: 'teal' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`bg-${s.color}-50 border border-${s.color}-200 rounded-xl p-4 flex items-center gap-3`}>
              <Icon className={`w-8 h-8 text-${s.color}-500 flex-shrink-0`} />
              <div>
                <p className={`text-2xl font-bold text-${s.color}-900`}>{s.value}</p>
                <p className={`text-xs text-${s.color}-600 font-medium`}>{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Continue Learning */}
      {enrolled.filter(m => !m.completed && (m.progress || 0) > 0).length > 0 && (
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl p-5 text-white">
          <h3 className="font-bold mb-3">Continue Learning</h3>
          <div className="space-y-2">
            {enrolled.filter(m => !m.completed && (m.progress || 0) > 0).map(m => (
              <div key={m.id} className="bg-white/10 rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:bg-white/20 transition-colors" onClick={() => openModule(m)}>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{m.title}</p>
                  <div className="w-full bg-white/20 rounded-full h-1.5 mt-1.5">
                    <div className="bg-white h-1.5 rounded-full" style={{ width: `${m.progress}%` }} />
                  </div>
                </div>
                <span className="text-xs font-bold text-blue-100">{m.progress}%</span>
                <Play className="w-5 h-5" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCat(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeCat === cat ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(m => (
          <div key={m.id} className={`bg-white rounded-xl border overflow-hidden hover:shadow-md transition-all ${m.completed ? 'border-green-300' : m.locked ? 'border-gray-200 opacity-70' : 'border-gray-200'}`}>
            <div className="relative">
              <img src={m.image} alt={m.title} className="w-full h-40 object-cover" loading="lazy" />
              {m.completed && (
                <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1.5 shadow">
                  <CheckCircle className="w-4 h-4" />
                </div>
              )}
              {m.locked && (
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                  <Lock className="w-8 h-8 text-white mb-2" />
                  <p className="text-white text-xs font-semibold">Complete previous courses</p>
                </div>
              )}
              <div className="absolute top-2 left-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${LEVEL_COLOR[m.level]}`}>{m.level}</span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{m.category}</span>
                <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />{m.rating} ({m.reviews})
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-1 text-sm leading-tight">{m.title}</h3>
              <p className="text-gray-500 text-xs mb-3 line-clamp-2">{m.description}</p>
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{m.duration} min</span>
                <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{m.lessons.length} lessons</span>
                <span>{(m.enrolledCount / 1000).toFixed(m.enrolledCount >= 1000 ? 1 : 0)}{m.enrolledCount >= 1000 ? 'K' : ''} enrolled</span>
              </div>
              {m.progress !== undefined && !m.completed && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span><span className="font-semibold text-blue-600">{m.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${m.progress}%` }} />
                  </div>
                </div>
              )}
              <button onClick={() => m.locked ? null : (m.progress === undefined && !m.completed ? enroll(m.id) : openModule(m))}
                disabled={m.locked}
                className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                  m.locked ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :
                  m.completed ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100' :
                  m.progress !== undefined ? 'bg-blue-600 text-white hover:bg-blue-700' :
                  'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                }`}>
                {m.locked ? <><Lock className="w-4 h-4" />Locked</> :
                 m.completed ? <><Award className="w-4 h-4" />Review & Certificate</> :
                 m.progress !== undefined ? <><Play className="w-4 h-4" />Continue ({m.progress}%)</> :
                 <><GraduationCap className="w-4 h-4" />Enroll Free</>}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Course Modal */}
      {selectedModule && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="relative">
              <img src={selectedModule.image} alt={selectedModule.title} className="w-full h-44 object-cover rounded-t-2xl" />
              <button onClick={closeModal} className="absolute top-3 right-3 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {!quizMode && !quizSubmitted && (
                <>
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-xl font-bold text-gray-900 flex-1 pr-4">{selectedModule.title}</h3>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0 ${LEVEL_COLOR[selectedModule.level]}`}>{selectedModule.level}</span>
                  </div>
                  <p className="text-gray-500 text-sm mb-4">{selectedModule.description}</p>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-gray-700">Course Progress</span>
                      <span className="text-blue-600 font-bold">{selectedModule.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3">
                      <div className="bg-gradient-to-r from-blue-500 to-teal-500 h-3 rounded-full transition-all" style={{ width: `${selectedModule.progress || 0}%` }} />
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-3">Course Content ({selectedModule.lessons.length} Lessons)</h4>
                  <div className="space-y-2 mb-5">
                    {selectedModule.lessons.map((lesson, i) => {
                      const lessonProgress = Math.floor(((selectedModule.progress || 0) / 100) * selectedModule.lessons.length);
                      const done = i < lessonProgress;
                      const current = i === currentLesson;
                      return (
                        <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${current ? 'bg-blue-50 border-blue-200' : done ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100'}`}>
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${current ? 'bg-blue-600 text-white' : done ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                            {done ? <CheckCircle className="w-4 h-4" /> : i + 1}
                          </div>
                          <span className={`text-sm flex-1 ${current ? 'font-semibold text-blue-800' : done ? 'text-green-800' : 'text-gray-600'}`}>{lesson}</span>
                          {current && <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">Current</span>}
                          {done && <CheckCircle className="w-4 h-4 text-green-500" />}
                        </div>
                      );
                    })}
                  </div>
                  <button onClick={() => advanceLesson(selectedModule)}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                    {currentLesson < selectedModule.lessons.length - 1 ? <><Play className="w-5 h-5" />Complete Lesson {currentLesson + 1}</> : <><Award className="w-5 h-5" />Complete & Take Quiz</>}
                  </button>
                </>
              )}

              {quizMode && !quizSubmitted && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <button onClick={() => setQuizMode(false)} className="text-gray-400 hover:text-gray-600"><ArrowLeft className="w-5 h-5" /></button>
                    <h4 className="font-bold text-gray-900 text-lg">Final Assessment Quiz</h4>
                  </div>
                  <p className="text-gray-500 text-sm">Answer {Math.ceil(QUIZ.length * 0.6)} or more questions correctly to earn your certificate.</p>
                  {QUIZ.map((q, qi) => (
                    <div key={qi} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <p className="font-semibold text-gray-900 mb-3 text-sm">{qi + 1}. {q.q}</p>
                      <div className="space-y-2">
                        {q.opts.map((opt, oi) => (
                          <label key={oi} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${quizAnswers[qi] === oi ? 'bg-blue-50 border-blue-400' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
                            <input type="radio" name={`q${qi}`} checked={quizAnswers[qi] === oi}
                              onChange={() => { const a = [...quizAnswers]; a[qi] = oi; setQuizAnswers(a); }}
                              className="text-blue-600 focus:ring-blue-500" />
                            <span className="text-sm text-gray-700">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button onClick={submitQuiz} disabled={quizAnswers.length < QUIZ.length}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    Submit Quiz ({quizAnswers.length}/{QUIZ.length} answered)
                  </button>
                </div>
              )}

              {quizSubmitted && (
                <div className="text-center py-6">
                  <div className={`w-24 h-24 rounded-full flex flex-col items-center justify-center mx-auto mb-4 ${passed ? 'bg-green-100' : 'bg-orange-100'}`}>
                    <span className={`text-3xl font-bold ${passed ? 'text-green-700' : 'text-orange-600'}`}>{correctCount}/{QUIZ.length}</span>
                    <span className="text-xs font-medium mt-0.5" style={{ color: passed ? '#15803d' : '#c2410c' }}>score</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{passed ? 'Congratulations!' : 'Keep Practicing!'}</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    {passed ? `You scored ${correctCount}/${QUIZ.length}. Your certificate is ready!` : `You need ${Math.ceil(QUIZ.length * 0.6)} correct answers. You got ${correctCount}. Try again!`}
                  </p>
                  {passed && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
                      <Award className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                      <p className="font-bold text-amber-900">Certificate of Completion Awarded!</p>
                      <p className="text-amber-700 text-sm mt-0.5">{selectedModule.title}</p>
                    </div>
                  )}
                  {QUIZ.map((q, qi) => (
                    <div key={qi} className={`text-left p-3 rounded-lg mb-2 text-sm ${quizAnswers[qi] === q.correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                      <p className="font-medium">{q.q}</p>
                      <p className={`text-xs mt-1 ${quizAnswers[qi] === q.correct ? 'text-green-700' : 'text-red-600'}`}>
                        {quizAnswers[qi] === q.correct ? '✓ Correct' : `✗ Correct: ${q.opts[q.correct]}`}
                      </p>
                    </div>
                  ))}
                  <div className="flex gap-3 mt-4">
                    {!passed && <button onClick={() => { setQuizSubmitted(false); setQuizAnswers([]); }} className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50">Retry Quiz</button>}
                    <button onClick={closeModal} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold">Close</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Training;
