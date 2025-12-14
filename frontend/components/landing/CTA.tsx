import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

export const CTA: React.FC = () => {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 dark:from-primary dark:to-secondary p-12 text-center shadow-2xl">
          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
              Ready to get started?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of productive individuals and teams using TaskFlow to organize their work and achieve more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 hover:text-blue-700 border-0 shadow-xl font-semibold group w-full sm:w-auto"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 hover:border-white/50 backdrop-blur-sm w-full sm:w-auto font-semibold"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        </div>
      </div>
    </section>
  );
};
