import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Language, 
  UserRole, 
  ActiveTab, 
  AdaptationEvent, 
  StudentExpectation, 
  TeacherProfile, 
  OfficeHourBooking, 
  FeedbackSubmission, 
  DialogueTopic, 
  DialogueEvent, 
  WeHeardItem, 
  MentorProfile, 
  OnlineQuestion 
} from './types';
import { 
  INITIAL_ADAPTATION_EVENTS, 
  INITIAL_EXPECTATIONS, 
  INITIAL_TEACHERS, 
  INITIAL_FEEDBACKS, 
  INITIAL_DIALOGUE_EVENT, 
  INITIAL_DIALOGUE_TOPICS, 
  INITIAL_WE_HEARD_ITEMS, 
  INITIAL_MENTORS, 
  INITIAL_ONLINE_QUESTIONS 
} from './data/initialData';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CampusMap } from './components/CampusMap';
import { PedagogicalPractice } from './components/PedagogicalPractice';
import { ResourceCenter } from './components/ResourceCenter';
import { AdaptationWeek } from './components/AdaptationWeek';
import { OfficeHours } from './components/OfficeHours';
import { TrustBoxFeedback } from './components/TrustBoxFeedback';
import { DialogueMeetings } from './components/DialogueMeetings';
import { WeHeardYou } from './components/WeHeardYou';
import { PeerMentors } from './components/PeerMentors';
import { KopuroOnline } from './components/KopuroOnline';
import { mergeUniqueById, saveTrustFeedbacksToIDB, getTrustFeedbacksFromIDB } from './utils/dbStorage';
import { AdminPanel } from './components/AdminPanel';
import { MarqueeTicker } from './components/MarqueeTicker';
import { Footer } from './components/Footer';

export default function App() {
  // Persistent language and role preferences
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('kopuro_lang');
    return (saved === 'ru' || saved === 'ky' || saved === 'en') ? saved : 'ky';
  });

  const [role, setRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('kopuro_role');
    return (saved === 'teacher' || saved === 'student' || saved === 'admin') ? saved : 'student';
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Application Data States (seeded and persisted to localStorage)
  const [adaptationEvents, setAdaptationEvents] = useState<AdaptationEvent[]>(() => {
    const saved = localStorage.getItem('kopuro_events');
    return saved ? JSON.parse(saved) : INITIAL_ADAPTATION_EVENTS;
  });

  const [expectations, setExpectations] = useState<StudentExpectation[]>(() => {
    const saved = localStorage.getItem('kopuro_expectations');
    return saved ? JSON.parse(saved) : INITIAL_EXPECTATIONS;
  });

  const [teachers] = useState<TeacherProfile[]>(INITIAL_TEACHERS);

  const [officeHourBookings, setOfficeHourBookings] = useState<OfficeHourBooking[]>(() => {
    const saved = localStorage.getItem('kopuro_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [feedbacks, setFeedbacks] = useState<FeedbackSubmission[]>(() => {
    let saved: FeedbackSubmission[] = [];
    let vault: FeedbackSubmission[] = [];
    try {
      const s = localStorage.getItem('kopuro_feedbacks');
      if (s) saved = JSON.parse(s);
    } catch {}
    try {
      const v = localStorage.getItem('kopuro_feedbacks_vault');
      if (v) vault = JSON.parse(v);
    } catch {}
    return mergeUniqueById(saved, vault, INITIAL_FEEDBACKS);
  });

  const [dialogueEvent, setDialogueEvent] = useState<DialogueEvent>(INITIAL_DIALOGUE_EVENT);

  const [dialogueTopics, setDialogueTopics] = useState<DialogueTopic[]>(() => {
    const saved = localStorage.getItem('kopuro_topics');
    return saved ? JSON.parse(saved) : INITIAL_DIALOGUE_TOPICS;
  });

  const [weHeardItems, setWeHeardItems] = useState<WeHeardItem[]>(() => {
    const saved = localStorage.getItem('kopuro_we_heard');
    return saved ? JSON.parse(saved) : INITIAL_WE_HEARD_ITEMS;
  });

  const [mentors, setMentors] = useState<MentorProfile[]>(() => {
    const saved = localStorage.getItem('kopuro_mentors');
    return saved ? JSON.parse(saved) : INITIAL_MENTORS;
  });

  const [onlineQuestions, setOnlineQuestions] = useState<OnlineQuestion[]>(() => {
    const saved = localStorage.getItem('kopuro_questions');
    return saved ? JSON.parse(saved) : INITIAL_ONLINE_QUESTIONS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('kopuro_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('kopuro_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('kopuro_expectations', JSON.stringify(expectations));
  }, [expectations]);

  useEffect(() => {
    localStorage.setItem('kopuro_bookings', JSON.stringify(officeHourBookings));
  }, [officeHourBookings]);

  useEffect(() => {
    localStorage.setItem('kopuro_feedbacks', JSON.stringify(feedbacks));
    localStorage.setItem('kopuro_feedbacks_vault', JSON.stringify(feedbacks));
    saveTrustFeedbacksToIDB(feedbacks);
  }, [feedbacks]);

  // Fetch server-persisted trust feedbacks and IndexedDB on initial mount
  useEffect(() => {
    getTrustFeedbacksFromIDB().then((idbFeedbacks) => {
      if (idbFeedbacks && idbFeedbacks.length > 0) {
        setFeedbacks((prev) => {
          const merged = mergeUniqueById(prev, idbFeedbacks);
          localStorage.setItem('kopuro_feedbacks', JSON.stringify(merged));
          localStorage.setItem('kopuro_feedbacks_vault', JSON.stringify(merged));
          return merged;
        });
      }
    });

    const fetchTrustFeedbacks = async () => {
      try {
        let localFeedbacks: FeedbackSubmission[] = [];
        try {
          const s = localStorage.getItem('kopuro_feedbacks');
          if (s) localFeedbacks = JSON.parse(s);
        } catch {}

        const syncRes = await fetch('/api/trust-feedbacks/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(localFeedbacks)
        });

        if (syncRes.ok) {
          const data = await syncRes.json();
          if (Array.isArray(data) && data.length > 0) {
            setFeedbacks((prev) => {
              const merged = mergeUniqueById(data, prev, localFeedbacks);
              localStorage.setItem('kopuro_feedbacks', JSON.stringify(merged));
              localStorage.setItem('kopuro_feedbacks_vault', JSON.stringify(merged));
              saveTrustFeedbacksToIDB(merged);
              return merged;
            });
            return;
          }
        }

        const res = await fetch('/api/trust-feedbacks');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setFeedbacks((prev) => {
              const merged = mergeUniqueById(data, prev);
              localStorage.setItem('kopuro_feedbacks', JSON.stringify(merged));
              localStorage.setItem('kopuro_feedbacks_vault', JSON.stringify(merged));
              saveTrustFeedbacksToIDB(merged);
              return merged;
            });
          }
        }
      } catch (err) {
        console.warn('Could not fetch trust feedbacks from server', err);
      }
    };
    fetchTrustFeedbacks();
  }, []);

  useEffect(() => {
    localStorage.setItem('kopuro_topics', JSON.stringify(dialogueTopics));
  }, [dialogueTopics]);

  useEffect(() => {
    localStorage.setItem('kopuro_we_heard', JSON.stringify(weHeardItems));
  }, [weHeardItems]);

  useEffect(() => {
    localStorage.setItem('kopuro_mentors', JSON.stringify(mentors));
  }, [mentors]);

  useEffect(() => {
    localStorage.setItem('kopuro_questions', JSON.stringify(onlineQuestions));
  }, [onlineQuestions]);

  // Handlers for interactive actions
  const handleAddExpectation = (text: string, author: string, faculty: string) => {
    const newExp: StudentExpectation = {
      id: `exp-${Date.now()}`,
      author,
      role: 'first-year',
      textKy: text,
      textRu: text,
      likes: 1,
      faculty,
      date: new Date().toISOString().split('T')[0]
    };
    setExpectations(prev => [newExp, ...prev]);
  };

  const handleLikeExpectation = (id: string) => {
    setExpectations(prev => prev.map(e => e.id === id ? { ...e, likes: e.likes + 1 } : e));
  };

  const handleRegisterAdaptationEvent = (eventId: string) => {
    setAdaptationEvents(prev => prev.map(e => e.id === eventId ? { ...e, attendeesCount: e.attendeesCount + 1 } : e));
  };

  const handleBookOfficeHourSlot = (bookingData: Omit<OfficeHourBooking, 'id' | 'ticketNumber' | 'createdAt' | 'status'>): OfficeHourBooking => {
    const ticketCode = `#DEM-TIME-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: OfficeHourBooking = {
      ...bookingData,
      id: `book-${Date.now()}`,
      ticketNumber: ticketCode,
      status: 'confirmed',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setOfficeHourBookings(prev => [newBooking, ...prev]);
    return newBooking;
  };

  const handleSubmitFeedback = (feedbackData: Omit<FeedbackSubmission, 'id' | 'trackingCode' | 'status' | 'submittedAt' | 'upvotes'>): FeedbackSubmission => {
    const code = `#DEM-${Math.floor(1000 + Math.random() * 9000)}`;
    const newFb: FeedbackSubmission = {
      ...feedbackData,
      id: `fb-${Date.now()}`,
      trackingCode: code,
      status: 'received',
      submittedAt: new Date().toISOString().split('T')[0],
      upvotes: 1
    };
    setFeedbacks(prev => {
      const merged = mergeUniqueById([newFb], prev);
      localStorage.setItem('kopuro_feedbacks', JSON.stringify(merged));
      localStorage.setItem('kopuro_feedbacks_vault', JSON.stringify(merged));
      saveTrustFeedbacksToIDB(merged);
      return merged;
    });

    // Persist to server trust-feedbacks API
    fetch('/api/trust-feedbacks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newFb)
    }).catch(err => console.warn('Could not sync trust feedback to server', err));

    return newFb;
  };

  const handleUpvoteFeedback = (id: string) => {
    setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, upvotes: f.upvotes + 1 } : f));
  };

  const handleAddTeacherResponse = (feedbackId: string, responseText: string, responderName: string) => {
    const updatedResp = {
      responderName,
      responderRole: 'Окутуучу / Администрация',
      responseText,
      respondedAt: new Date().toISOString().split('T')[0]
    };
    setFeedbacks(prev => prev.map(f => {
      if (f.id === feedbackId) {
        return {
          ...f,
          status: 'resolved',
          officialResponse: updatedResp
        };
      }
      return f;
    }));

    fetch(`/api/trust-feedbacks/${feedbackId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'resolved', officialResponse: updatedResp })
    }).catch(err => console.warn('Could not sync teacher response to server', err));
  };

  const handleVoteTopic = (topicId: string) => {
    setDialogueTopics(prev => prev.map(t => {
      if (t.id === topicId) {
        const nextVote = t.hasVoted ? t.votes - 1 : t.votes + 1;
        return { ...t, votes: nextVote, hasVoted: !t.hasVoted };
      }
      return t;
    }));
  };

  const handleProposeTopic = (titleKy: string, titleRu: string, descKy: string, descRu: string, category: string) => {
    const newTopic: DialogueTopic = {
      id: `dt-${Date.now()}`,
      titleKy,
      titleRu,
      descriptionKy: descKy,
      descriptionRu: descRu,
      votes: 1,
      hasVoted: true,
      proposedBy: role === 'student' ? 'Студент' : 'Окутуучу',
      category
    };
    setDialogueTopics(prev => [newTopic, ...prev]);
  };

  const handleRegisterDialogueRsvp = (eventId: string, studentName: string) => {
    setDialogueEvent(prev => ({
      ...prev,
      registeredCount: prev.registeredCount + 1
    }));
  };

  const handleLikeWeHeard = (id: string) => {
    setWeHeardItems(prev => prev.map(item => item.id === id ? { ...item, likes: item.likes + 1 } : item));
  };

  const handleAddNewResolution = (itemData: Omit<WeHeardItem, 'id' | 'likes'>) => {
    const newItem: WeHeardItem = {
      ...itemData,
      id: `wh-${Date.now()}`,
      likes: 1
    };
    setWeHeardItems(prev => [newItem, ...prev]);
  };

  const handleRequestMentor = (mentorId: string, studentName: string, contactInfo: string, message: string) => {
    setMentors(prev => prev.map(m => m.id === mentorId ? { ...m, sessionsCompleted: m.sessionsCompleted + 1 } : m));
  };

  const handleApplyBecomeMentor = (newMentorData: Omit<MentorProfile, 'id' | 'sessionsCompleted' | 'isAvailable'>) => {
    const newMentor: MentorProfile = {
      ...newMentorData,
      id: `m-${Date.now()}`,
      sessionsCompleted: 0,
      isAvailable: true
    };
    setMentors(prev => [newMentor, ...prev]);
  };

  const handleAskOnlineQuestion = (questionText: string, isAnonymous: boolean, authorName: string, category: string) => {
    const newQ: OnlineQuestion = {
      id: `q-${Date.now()}`,
      authorName: isAnonymous ? 'Анонимдүү студент' : authorName,
      authorFaculty: 'Студент',
      isAnonymous,
      questionKy: questionText,
      questionRu: questionText,
      category,
      date: new Date().toISOString().split('T')[0],
      likes: 1,
      answers: []
    };
    setOnlineQuestions(prev => [newQ, ...prev]);
  };

  const handleAnswerOnlineQuestion = (questionId: string, answerText: string, authorRole: 'teacher' | 'dean_office' | 'student_mentor') => {
    const answerObj = {
      id: `ans-${Date.now()}`,
      authorName: role === 'teacher' ? 'Окутуучу (Верификацияланган)' : 'Студент-наставник',
      authorRole,
      answerKy: answerText,
      answerRu: answerText,
      date: new Date().toISOString().split('T')[0],
      isVerified: role === 'teacher'
    };

    setOnlineQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          answers: [...q.answers, answerObj]
        };
      }
      return q;
    }));
  };

  const handleLikeOnlineQuestion = (questionId: string) => {
    setOnlineQuestions(prev => prev.map(q => q.id === questionId ? { ...q, likes: q.likes + 1 } : q));
  };

  // Administrative handlers
  const handleUpdateFeedbackStatus = (id: string, status: FeedbackSubmission['status']) => {
    setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status } : f));
  };

  const handleAddFeedbackResponse = (id: string, responseText: string, responderName: string, responderRole = 'Администрация') => {
    setFeedbacks(prev => prev.map(f => {
      if (f.id === id) {
        return {
          ...f,
          status: 'resolved',
          officialResponse: {
            responderName,
            responderRole,
            respondedAt: new Date().toISOString().split('T')[0],
            responseText
          }
        };
      }
      return f;
    }));
  };

  const handleDeleteFeedback = (id: string) => {
    setFeedbacks(prev => prev.filter(f => f.id !== id));
  };

  const handleUpdateBookingStatus = (id: string, status: OfficeHourBooking['status']) => {
    setOfficeHourBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const handleDeleteBooking = (id: string) => {
    setOfficeHourBookings(prev => prev.filter(b => b.id !== id));
  };

  const handleAddWeHeardItem = (itemData: Omit<WeHeardItem, 'id' | 'likes'>) => {
    const newItem: WeHeardItem = {
      ...itemData,
      id: `wh-${Date.now()}`,
      likes: 1
    };
    setWeHeardItems(prev => [newItem, ...prev]);
  };

  const handleUpdateWeHeardStatus = (id: string, status: WeHeardItem['status']) => {
    setWeHeardItems(prev => prev.map(w => w.id === id ? { ...w, status } : w));
  };

  const handleDeleteWeHeardItem = (id: string) => {
    setWeHeardItems(prev => prev.filter(w => w.id !== id));
  };

  const handleUpdateDialogueEvent = (updated: DialogueEvent) => {
    setDialogueEvent(updated);
  };

  const handleDeleteTopic = (id: string) => {
    setDialogueTopics(prev => prev.filter(t => t.id !== id));
  };

  const handleAddTopic = (titleKy: string, titleRu: string, descKy: string, descRu: string, category: string) => {
    const newTopic: DialogueTopic = {
      id: `top-${Date.now()}`,
      titleKy,
      titleRu,
      descriptionKy: descKy,
      descriptionRu: descRu,
      category,
      votes: 1,
      proposedBy: 'Администрация'
    };
    setDialogueTopics(prev => [newTopic, ...prev]);
  };

  const handleAddAdaptationEvent = (eventData: Omit<AdaptationEvent, 'id' | 'attendeesCount'>) => {
    const newEv: AdaptationEvent = {
      ...eventData,
      id: `ev-${Date.now()}`,
      attendeesCount: 0
    };
    setAdaptationEvents(prev => [...prev, newEv]);
  };

  const handleDeleteAdaptationEvent = (id: string) => {
    setAdaptationEvents(prev => prev.filter(e => e.id !== id));
  };

  const handleDeleteExpectation = (id: string) => {
    setExpectations(prev => prev.filter(e => e.id !== id));
  };

  const handleRespondExpectation = (id: string, response: string) => {
    setExpectations(prev => prev.map(e => e.id === id ? { ...e, responseFromTeacher: response } : e));
  };

  const handleToggleMentorAvailability = (id: string) => {
    setMentors(prev => prev.map(m => m.id === id ? { ...m, isAvailable: !m.isAvailable } : m));
  };

  const handleDeleteMentor = (id: string) => {
    setMentors(prev => prev.filter(m => m.id !== id));
  };

  const handleAddMentor = (mentorData: Omit<MentorProfile, 'id' | 'sessionsCompleted'>) => {
    const newM: MentorProfile = {
      ...mentorData,
      id: `m-${Date.now()}`,
      sessionsCompleted: 0
    };
    setMentors(prev => [newM, ...prev]);
  };

  const handleDeleteQuestion = (id: string) => {
    setOnlineQuestions(prev => prev.filter(q => q.id !== id));
  };

  const handleResetData = () => {
    localStorage.removeItem('kopuro_events');
    localStorage.removeItem('kopuro_expectations');
    localStorage.removeItem('kopuro_bookings');
    localStorage.removeItem('kopuro_feedbacks');
    localStorage.removeItem('kopuro_topics');
    localStorage.removeItem('kopuro_we_heard');
    localStorage.removeItem('kopuro_mentors');
    localStorage.removeItem('kopuro_questions');
    setAdaptationEvents(INITIAL_ADAPTATION_EVENTS);
    setExpectations(INITIAL_EXPECTATIONS);
    setOfficeHourBookings([]);
    setFeedbacks(INITIAL_FEEDBACKS);
    setDialogueEvent(INITIAL_DIALOGUE_EVENT);
    setDialogueTopics(INITIAL_DIALOGUE_TOPICS);
    setWeHeardItems(INITIAL_WE_HEARD_ITEMS);
    setMentors(INITIAL_MENTORS);
    setOnlineQuestions(INITIAL_ONLINE_QUESTIONS);
  };

  // Metrics for hero
  const metrics = {
    dialogues: dialogueEvent.registeredCount + 24,
    officeHoursPerWeek: teachers.reduce((acc, t) => acc + t.availableHours.reduce((s, h) => s + h.slots.length, 0), 0),
    resolvedProblems: weHeardItems.filter(i => i.status === 'implemented').length + feedbacks.filter(f => f.status === 'resolved').length,
    mentorsCount: mentors.length
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        lang={lang}
        setLang={setLang}
        role={role}
        setRole={setRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickFeedback={() => setActiveTab('your-voice')}
      />

      {/* Live Announcement Marquee Ticker / Бегущая строка */}
      <MarqueeTicker
        lang={lang}
        setActiveTab={setActiveTab}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${lang}-${role}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === 'overview' && (
              <HeroSection
                lang={lang}
                role={role}
                setActiveTab={setActiveTab}
                stats={metrics}
              />
            )}

            {activeTab === 'campus-map' && (
              <CampusMap
                lang={lang}
                setActiveTab={setActiveTab}
                onOpenQuickFeedback={() => setActiveTab('your-voice')}
              />
            )}

            {activeTab === 'practice' && (
              <PedagogicalPractice
                lang={lang}
                role={role}
                onNavigateToMap={() => setActiveTab('campus-map')}
              />
            )}

            {activeTab === 'resource-center' && (
              <ResourceCenter
                lang={lang}
                onNavigateToMap={() => setActiveTab('campus-map')}
              />
            )}

            {activeTab === 'start-together' && (
              <AdaptationWeek
                lang={lang}
                role={role}
                events={adaptationEvents}
                expectations={expectations}
                onAddExpectation={handleAddExpectation}
                onLikeExpectation={handleLikeExpectation}
                onRegisterEvent={handleRegisterAdaptationEvent}
              />
            )}

            {activeTab === 'office-hours' && (
              <OfficeHours
                lang={lang}
                role={role}
                teachers={teachers}
                bookings={officeHourBookings}
                onBookSlot={handleBookOfficeHourSlot}
              />
            )}

            {activeTab === 'your-voice' && (
              <TrustBoxFeedback
                lang={lang}
                role={role}
                feedbacks={feedbacks}
                onSubmitFeedback={handleSubmitFeedback}
                onUpvote={handleUpvoteFeedback}
                onAddTeacherResponse={handleAddTeacherResponse}
              />
            )}

            {activeTab === 'dialogue' && (
              <DialogueMeetings
                lang={lang}
                role={role}
                dialogueEvent={dialogueEvent}
                topics={dialogueTopics}
                onVoteTopic={handleVoteTopic}
                onProposeTopic={handleProposeTopic}
                onRegisterRsvp={handleRegisterDialogueRsvp}
              />
            )}

            {activeTab === 'we-heard' && (
              <WeHeardYou
                lang={lang}
                role={role}
                items={weHeardItems}
                onLikeItem={handleLikeWeHeard}
                onAddNewResolution={handleAddNewResolution}
              />
            )}

            {activeTab === 'mentors' && (
              <PeerMentors
                lang={lang}
                role={role}
                mentors={mentors}
                onRequestMentor={handleRequestMentor}
                onApplyBecomeMentor={handleApplyBecomeMentor}
              />
            )}

            {activeTab === 'online' && (
              <KopuroOnline
                lang={lang}
                role={role}
                questions={onlineQuestions}
                onAskQuestion={handleAskOnlineQuestion}
                onAnswerQuestion={handleAnswerOnlineQuestion}
                onLikeQuestion={handleLikeOnlineQuestion}
              />
            )}

            {activeTab === 'admin' && (
              <AdminPanel
                lang={lang}
                role={role}
                setRole={setRole}
                setActiveTab={setActiveTab}
                feedbacks={feedbacks}
                onUpdateFeedbackStatus={handleUpdateFeedbackStatus}
                onAddFeedbackResponse={handleAddFeedbackResponse}
                onDeleteFeedback={handleDeleteFeedback}
                officeHourBookings={officeHourBookings}
                onUpdateBookingStatus={handleUpdateBookingStatus}
                onDeleteBooking={handleDeleteBooking}
                weHeardItems={weHeardItems}
                onAddWeHeardItem={handleAddWeHeardItem}
                onUpdateWeHeardStatus={handleUpdateWeHeardStatus}
                onDeleteWeHeardItem={handleDeleteWeHeardItem}
                dialogueEvent={dialogueEvent}
                onUpdateDialogueEvent={handleUpdateDialogueEvent}
                dialogueTopics={dialogueTopics}
                onDeleteTopic={handleDeleteTopic}
                onAddTopic={handleAddTopic}
                adaptationEvents={adaptationEvents}
                onAddAdaptationEvent={handleAddAdaptationEvent}
                onDeleteAdaptationEvent={handleDeleteAdaptationEvent}
                expectations={expectations}
                onDeleteExpectation={handleDeleteExpectation}
                onRespondExpectation={handleRespondExpectation}
                mentors={mentors}
                onToggleMentorAvailability={handleToggleMentorAvailability}
                onDeleteMentor={handleDeleteMentor}
                onAddMentor={handleAddMentor}
                onlineQuestions={onlineQuestions}
                onAnswerQuestion={handleAnswerOnlineQuestion}
                onDeleteQuestion={handleDeleteQuestion}
                onResetData={handleResetData}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer
        lang={lang}
        setActiveTab={setActiveTab}
        onOpenQuickFeedback={() => setActiveTab('your-voice')}
      />
    </div>
  );
}
