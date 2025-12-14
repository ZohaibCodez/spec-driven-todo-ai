import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Sparkles, Zap, CheckCircle2 } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-32 lg:px-8 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-indigo-950/50 dark:to-purple-950/50">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/30 dark:bg-blue-600/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-[32rem] h-[32rem] bg-purple-400/30 dark:bg-purple-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-400/20 dark:bg-pink-600/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="mx-auto max-w-6xl relative">
        <div className="text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center rounded-full backdrop-blur-md bg-white/60 dark:bg-gray-900/60 border border-blue-500/30 px-5 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 animate-fade-in shadow-lg shadow-blue-500/10">
            <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
            Powered by AI • Trusted by 10,000+ Users
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-5xl font-black tracking-tight sm:text-7xl lg:text-8xl animate-fade-in leading-tight text-gray-900 dark:text-white">
            Organize Your Life,
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent inline-block mt-2">
              One Task at a Time
            </span>
          </h1>

          {/* Description */}
          <p className="mb-10 text-lg text-gray-600 dark:text-gray-300 sm:text-xl max-w-3xl mx-auto animate-fade-in leading-relaxed">
            Experience the future of productivity with our modern, AI-powered task management platform.
            Beautiful design meets powerful functionality.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in">
            <Link href="/signup">
              <Button size="lg" className="group w-full sm:w-auto px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto px-8 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-900 shadow-lg hover:shadow-xl transition-all">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Features List */}
          <div className="flex flex-wrap justify-center gap-6 mb-16 animate-fade-in">
            {[
              { icon: Zap, text: 'Lightning Fast' },
              { icon: CheckCircle2, text: 'Easy to Use' },
              { icon: Sparkles, text: 'Beautiful UI' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="font-medium">{text}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in">
            {[
              { value: '10,000+', label: 'Active Users', gradient: 'from-blue-600 to-cyan-600', iconBg: 'from-blue-500/20 to-cyan-500/20' },
              { value: '50,000+', label: 'Tasks Completed', gradient: 'from-purple-600 to-pink-600', iconBg: 'from-purple-500/20 to-pink-500/20' },
              { value: '99.9%', label: 'Uptime', gradient: 'from-emerald-600 to-teal-600', iconBg: 'from-emerald-500/20 to-teal-500/20' },
            ].map(({ value, label, gradient, iconBg }) => (
              <div key={label} className="group cursor-default">
                <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  <div className={`text-4xl font-bold bg-gradient-to-r ${gradient} dark:from-blue-400 dark:to-cyan-400 dark:[&:nth-child(2)]:from-purple-400 dark:[&:nth-child(2)]:to-pink-400 dark:[&:nth-child(3)]:from-emerald-400 dark:[&:nth-child(3)]:to-teal-400 bg-clip-text text-transparent mb-2`}>
                    {value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
