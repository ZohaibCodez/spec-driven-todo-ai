import * as React from 'react';
import { CheckCircle, Zap, Shield, Smartphone, Palette, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

const features = [
  {
    icon: CheckCircle,
    title: 'Simple Task Management',
    description: 'Create, organize, and complete tasks with an intuitive interface that gets out of your way.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Built for speed with instant updates and smooth animations at 60fps.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is encrypted and protected with industry-standard security practices.',
  },
  {
    icon: Smartphone,
    title: 'Works Everywhere',
    description: 'Fully responsive design that works beautifully on mobile, tablet, and desktop.',
  },
  {
    icon: Palette,
    title: 'Beautiful Design',
    description: 'Modern, professional interface with dark mode support for comfortable viewing anytime.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Share tasks and collaborate with your team members effortlessly.',
  },
];

export const Features: React.FC = () => {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 bg-surface/30">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">
            Everything you need to stay productive
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Powerful features wrapped in a beautiful, intuitive interface designed for modern teams.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              hover
              className="transition-all duration-200 hover:border-primary/50"
            >
              <CardHeader>
                <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-primary/10 p-3 text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
