import { useState, useEffect } from 'react';
import { SignInForm } from './SignInForm';
import { Dialog } from '@headlessui/react';

export function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [statCount, setStatCount] = useState(0);
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setInterval(() => {
      setStatCount(prev => Math.min(prev + 1, 87));
    }, 30);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1E90FF]/5 to-[#A259FF]/5 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={`space-y-6 transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
              <h1 className="text-5xl font-bold leading-tight">
                Build Better Habits,<br />
                <span className="accent-text">Transform Your Life</span>
              </h1>
              <p className="text-xl text-gray-600">
                Track, measure, and achieve your goals with a science-backed habit formation system.
              </p>
              <div className="pt-4">
                <button 
                  onClick={() => setIsSignInOpen(true)}
                  className="btn-primary text-lg px-8 py-3"
                >
                  Get Started
                </button>
              </div>
            </div>
            <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#1E90FF] to-[#A259FF] rounded-2xl transform rotate-2 scale-105 opacity-10"></div>
                <div className="relative bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-semibold mb-4">Today's Habits</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-[#1E90FF]/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded border-2 border-[#1E90FF] bg-white flex items-center justify-center text-[#1E90FF]">
                          ✓
                        </div>
                        <span className="font-medium">Morning Meditation</span>
                      </div>
                      <span className="text-sm text-[#1E90FF]">7 day streak</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#1E90FF]/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded border-2 border-[#1E90FF] bg-white flex items-center justify-center text-[#1E90FF]">
                          ✓
                        </div>
                        <span className="font-medium">Read 30 Minutes</span>
                      </div>
                      <span className="text-sm text-[#1E90FF]">12 day streak</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded border-2 border-gray-300"></div>
                        <span className="font-medium">Evening Exercise</span>
                      </div>
                      <span className="text-sm text-gray-500">Due today</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded border-2 border-gray-300"></div>
                        <span className="font-medium">Practice Guitar</span>
                      </div>
                      <span className="text-sm text-gray-500">Due today</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard 
              icon="📈"
              title="Visual Progress"
              description="Watch your progress unfold with beautiful, interactive charts and streaks."
              delay={0}
            />
            <FeatureCard 
              icon="🎯"
              title="Smart Tracking"
              description="Set daily, weekly, or monthly goals with intelligent reminders."
              delay={200}
            />
            <FeatureCard 
              icon="🏆"
              title="Reward System"
              description="Stay motivated with achievement badges and milestone celebrations."
              delay={400}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-[#1E90FF]/5 to-[#A259FF]/5">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12 accent-text">Trusted by Habit Builders</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <StatCard 
              number={statCount}
              label="Success Rate"
              symbol="%"
            />
            <StatCard 
              number={Math.floor(statCount * 1.1)}
              label="Active Users"
              symbol="k+"
            />
            <StatCard 
              number={Math.floor(statCount * 0.9)}
              label="Habits Tracked"
              symbol="M+"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Life?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of others who are building better habits, one day at a time.
          </p>
          <button 
            onClick={() => setIsSignInOpen(true)}
            className="btn-primary text-lg px-8 py-3"
          >
            Get Started Now
          </button>
        </div>
      </section>

      {/* Sign In Modal */}
      <Dialog
        open={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded-xl bg-white p-6 shadow-lg">
            <Dialog.Title className="text-2xl font-bold mb-4 accent-text">
              Start Your Journey
            </Dialog.Title>
            <SignInForm />
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { 
  icon: string; 
  title: string; 
  description: string;
  delay: number;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`p-6 rounded-xl bg-white shadow-sm border border-gray-200/50 transform transition-all duration-1000 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
    }`}>
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function StatCard({ number, label, symbol }: { 
  number: number; 
  label: string;
  symbol: string;
}) {
  return (
    <div className="p-6 rounded-xl bg-white shadow-sm border border-gray-200/50">
      <div className="text-4xl font-bold text-[#1E90FF] mb-2">
        {number}{symbol}
      </div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
}
