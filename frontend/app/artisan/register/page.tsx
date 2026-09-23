'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { useAuthStore } from '@/lib/store';

interface VoiceStep {
  key: string;
  question: string;
  field: string;
}

const VOICE_STEPS: VoiceStep[] = [
  { key: 'name', question: "What is your full name?", field: 'full_name' },
  { key: 'region', question: "What village, city or cluster region are you from?", field: 'region' },
  { key: 'craft', question: "What craft or handloom tradition do you practice?", field: 'craft' },
  { key: 'experience', question: "How many years have you practiced this craft?", field: 'experience_years' },
  { key: 'story', question: "Tell me briefly about your craft technique or family tradition.", field: 'story' }
];

export default function ArtisanRegisterPage() {
  const [mode, setMode] = useState<'voice' | 'form'>('voice');
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    password: '',
    region: '',
    craft: '',
    specialization: '',
    experience_years: 5,
    skills: '',
    story: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeredResult, setRegisteredResult] = useState<{
    artisan_id: number;
    craftproof_id: string;
    full_name: string;
  } | null>(null);

  const { login } = useAuthStore();

  // Web Speech State
  const [speechSupported, setSpeechSupported] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [aiSpeechText, setAiSpeechText] = useState("Press 'Start Voice Assistant' to begin your registration.");
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const [pendingValue, setPendingValue] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recog = new SpeechRecognition();
        recog.continuous = false;
        recog.interimResults = true;
        recog.lang = 'en-US';

        recog.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
          }
          setInterimTranscript(transcript);

          if (event.results[0].isFinal) {
            handleUserSpokenInput(transcript.trim());
          }
        };

        recog.onerror = (event: any) => {
          setIsListening(false);
          if (event.error !== 'no-speech') {
            speakText("I could not hear clearly. Please try speaking again or use the keyboard form.");
          }
        };

        recog.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recog;
      }
    }
  }, [stepIndex, awaitingConfirmation, pendingValue, form]);

  const speakText = (text: string, onEnd?: () => void) => {
    setAiSpeechText(text);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => {
        if (onEnd) onEnd();
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setInterimTranscript('');
      setIsListening(true);
      try {
        recognitionRef.current.start();
      } catch {}
    }
  };

  const startVoiceRegistration = () => {
    setStepIndex(0);
    setAwaitingConfirmation(false);
    const q = VOICE_STEPS[0].question;
    speakText(q, () => {
      startListening();
    });
  };

  const handleUserSpokenInput = (input: string) => {
    if (!input) return;

    if (!awaitingConfirmation) {
      setPendingValue(input);
      setAwaitingConfirmation(true);
      speakText(`I heard "${input}". Is that correct? Say Yes to confirm, or No to repeat.`, () => {
        startListening();
      });
    } else {
      const lower = input.toLowerCase();
      if (lower.includes('yes') || lower.includes('correct') || lower.includes('sure') || lower.includes('yeah')) {
        const currentField = VOICE_STEPS[stepIndex].field;
        setForm(prev => ({
          ...prev,
          [currentField]: currentField === 'experience_years' ? (parseInt(pendingValue) || 5) : pendingValue
        }));

        setAwaitingConfirmation(false);
        setPendingValue('');

        const nextStep = stepIndex + 1;
        if (nextStep < VOICE_STEPS.length) {
          setStepIndex(nextStep);
          speakText(`Got it. Next question: ${VOICE_STEPS[nextStep].question}`, () => {
            startListening();
          });
        } else {
          speakText("All voice details recorded. Please enter your mobile number and password below to finalize your VirasatSetu ID.");
          setMode('form');
        }
      } else {
        setAwaitingConfirmation(false);
        setPendingValue('');
        speakText(`Let's try again. ${VOICE_STEPS[stepIndex].question}`, () => {
          startListening();
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.full_name || !form.phone || !form.password || !form.craft || !form.region) {
      setError("Please fill in Name, Phone, Password, Region and Craft.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/artisan/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Registration failed');
      }

      setRegisteredResult({
        artisan_id: data.artisan_id,
        craftproof_id: data.craftproof_id,
        full_name: data.full_name
      });

      login(data.artisan_id, data.craftproof_id, data.full_name, 'auth-token');
      localStorage.setItem('artisan_id', String(data.artisan_id));
      localStorage.setItem('craftproof_id', data.craftproof_id);
      localStorage.setItem('full_name', data.full_name);
    } catch (err: any) {
      setError(err.message || 'Error communicating with server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#111111] flex flex-col selection:bg-[#b15f2c] selection:text-white">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="shell max-w-3xl mx-auto">
          {/* SUCCESS VIEW */}
          {registeredResult ? (
            <div className="rounded-[2rem] bg-[#0a0a0a] text-white p-8 sm:p-12 text-center border border-white/10 shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-[#cf8047] text-white flex items-center justify-center mx-auto text-2xl font-bold mb-6">
                ✓
              </div>
              <span className="text-xs uppercase tracking-widest text-[#cf8047] font-semibold block mb-2">
                VirasatSetu Practitioner Identity Created
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold mb-3">
                Welcome, {registeredResult.full_name}
              </h2>
              <p className="text-sm text-white/60 max-w-md mx-auto mb-8">
                Your profile is now active on the national living heritage registry with an initial status of <strong className="text-white">PENDING</strong> verifier review.
              </p>

              <div className="p-6 rounded-[1.25rem] bg-white/5 border border-white/10 max-w-sm mx-auto mb-8 text-left">
                <span className="text-[10px] text-white/40 uppercase font-mono block mb-1">Assigned Practitioner ID</span>
                <span className="text-2xl font-mono font-bold text-[#cf8047] block tracking-wider">
                  {registeredResult.craftproof_id}
                </span>
                <span className="text-xs text-white/50 block mt-2">
                  Database record created with 0 pre-filled demo data. Ready for batch creation & workshops.
                </span>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/artisan/dashboard"
                  className="inline-flex items-center gap-2 rounded-full bg-white text-[#0a0a0a] px-7 py-3 text-sm font-semibold hover:bg-[#f1f0ee] transition"
                >
                  Enter Practitioner Dashboard →
                </Link>
                <Link
                  href="/verifier"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 text-white px-7 py-3 text-sm font-semibold hover:bg-white/10 transition"
                >
                  Review in Verifier Desk 🛡️
                </Link>
              </div>
            </div>
          ) : (
            <div>
              {/* Header */}
              <div className="mb-8 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#e6e5e2] bg-[#f1f0ee] text-xs font-semibold text-[#111111]/80 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b15f2c]"></span>
                  Practitioner Onboarding
                </div>
                <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#111111]">
                  Register as a Living Heritage Practitioner
                </h1>
                <p className="text-sm text-[#8d8d8d] mt-2">
                  Use our interactive conversational voice assistant or standard keyboard input. No predefined demo records.
                </p>

                {/* Mode Switcher */}
                <div className="flex items-center gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setMode('voice')}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                      mode === 'voice'
                        ? 'bg-[#0a0a0a] text-white shadow-sm'
                        : 'bg-[#f1f0ee] text-[#8d8d8d] hover:text-[#111111]'
                    }`}
                  >
                    🎙️ Voice Registration Flow
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('form')}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                      mode === 'form'
                        ? 'bg-[#0a0a0a] text-white shadow-sm'
                        : 'bg-[#f1f0ee] text-[#8d8d8d] hover:text-[#111111]'
                    }`}
                  >
                    ⌨️ Standard Form
                  </button>
                </div>
              </div>

              {/* VOICE ASSISTANT CARD */}
              {mode === 'voice' && (
                <div className="mb-8 p-6 sm:p-8 rounded-[2rem] bg-[#0a0a0a] text-white shadow-xl relative overflow-hidden">
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between text-xs text-white/50">
                      <span>Conversational AI Assistant</span>
                      <span>Step {stepIndex + 1} of {VOICE_STEPS.length}</span>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-[10px] uppercase tracking-wider text-[#cf8047] font-semibold block mb-1">
                        VirasatSetu Assistant asks:
                      </span>
                      <p className="text-base sm:text-lg font-medium text-white">
                        {aiSpeechText}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={startVoiceRegistration}
                        className="px-5 py-2.5 rounded-full bg-[#cf8047] text-white text-xs font-semibold hover:bg-[#cf8047]/90 transition"
                      >
                        Start Voice Assistant
                      </button>

                      {isListening ? (
                        <div className="flex items-center gap-2 text-xs text-[#cf8047]">
                          <span className="w-2 h-2 rounded-full bg-[#cf8047] animate-ping" />
                          <span>Listening to your microphone...</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={startListening}
                          className="px-4 py-2 rounded-full border border-white/20 text-xs text-white/80 hover:bg-white/10 transition"
                        >
                          🎙️ Speak Answer
                        </button>
                      )}
                    </div>

                    {interimTranscript && (
                      <span className="text-xs text-white/60 italic font-mono bg-white/5 px-3 py-1 rounded-md block">
                        "{interimTranscript}"
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* THE FORM */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 rounded-[1rem] bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                    {error}
                  </div>
                )}

                <div className="p-6 sm:p-8 rounded-[2rem] bg-[#f1f0ee]/60 border border-[#e6e5e2] space-y-4">
                  <h3 className="text-base font-semibold text-[#111111] mb-2">
                    Practitioner Identification Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#8d8d8d] uppercase tracking-wider mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.full_name}
                        onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                        placeholder="e.g. Master Ustad Rahim"
                        className="w-full px-4 py-3 rounded-[0.875rem] bg-[#ffffff] border border-[#e6e5e2] text-sm text-[#111111] focus:outline-none focus:border-[#b15f2c]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#8d8d8d] uppercase tracking-wider mb-1.5">
                        Mobile Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="10-digit mobile number"
                        className="w-full px-4 py-3 rounded-[0.875rem] bg-[#ffffff] border border-[#e6e5e2] text-sm text-[#111111] focus:outline-none focus:border-[#b15f2c]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#8d8d8d] uppercase tracking-wider mb-1.5">
                        Region / Cluster / Village *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.region}
                        onChange={(e) => setForm({ ...form, region: e.target.value })}
                        placeholder="e.g. Varanasi Handloom Cluster, UP"
                        className="w-full px-4 py-3 rounded-[0.875rem] bg-[#ffffff] border border-[#e6e5e2] text-sm text-[#111111] focus:outline-none focus:border-[#b15f2c]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#8d8d8d] uppercase tracking-wider mb-1.5">
                        Primary Craft Tradition *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.craft}
                        onChange={(e) => setForm({ ...form, craft: e.target.value })}
                        placeholder="e.g. Banarasi Brocade Weaving"
                        className="w-full px-4 py-3 rounded-[0.875rem] bg-[#ffffff] border border-[#e6e5e2] text-sm text-[#111111] focus:outline-none focus:border-[#b15f2c]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#8d8d8d] uppercase tracking-wider mb-1.5">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        value={form.experience_years}
                        onChange={(e) => setForm({ ...form, experience_years: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 rounded-[0.875rem] bg-[#ffffff] border border-[#e6e5e2] text-sm text-[#111111] focus:outline-none focus:border-[#b15f2c]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#8d8d8d] uppercase tracking-wider mb-1.5">
                        Password *
                      </label>
                      <input
                        type="password"
                        required
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder="Secret login password"
                        className="w-full px-4 py-3 rounded-[0.875rem] bg-[#ffffff] border border-[#e6e5e2] text-sm text-[#111111] focus:outline-none focus:border-[#b15f2c]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#8d8d8d] uppercase tracking-wider mb-1.5">
                      Heritage Story / Technique Notes
                    </label>
                    <textarea
                      rows={3}
                      value={form.story}
                      onChange={(e) => setForm({ ...form, story: e.target.value })}
                      placeholder="Generational techniques passed down from family elders..."
                      className="w-full px-4 py-3 rounded-[0.875rem] bg-[#ffffff] border border-[#e6e5e2] text-sm text-[#111111] focus:outline-none focus:border-[#b15f2c] resize-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Link href="/artisan/login" className="text-xs text-[#8d8d8d] hover:text-[#111111] font-medium">
                    Already registered? Sign In →
                  </Link>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-3 rounded-full bg-[#0a0a0a] text-white py-2.5 pl-7 pr-3 text-sm font-semibold hover:scale-[1.02] transition disabled:opacity-50"
                  >
                    <span>{loading ? 'Creating Identity...' : 'Submit Registration'}</span>
                    <span className="w-7 h-7 rounded-full bg-white text-[#0a0a0a] flex items-center justify-center text-xs">
                      →
                    </span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}