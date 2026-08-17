import { ArjunOSVisualization } from '../3d/ArjunOSVisualization';

export const Hero: React.FC = () => {
  return (
    <section className="premium-section premium-aurora relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="premium-container grid lg:grid-cols-2 gap-12 items-center">
        <div className="hero-fade-up">
          <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tight mb-6 premium-gradient-text">
            Arjun Automation.
          </h1>
          <p className="text-xl text-premium-fg-muted mb-8 max-w-xl">
            Run your entire organization on one intelligent, unified operating system.
          </p>
          <div className="flex gap-4">
            <button className="bg-premium-accent text-white px-8 py-3 rounded-full font-medium hover:opacity-90 transition">
              Get Started
            </button>
            <button className="border border-premium-border px-8 py-3 rounded-full font-medium hover:bg-premium-glass transition">
              View Demo
            </button>
          </div>
        </div>
        <div className="relative h-[500px] w-full">
            <ArjunOSVisualization />
        </div>
      </div>
    </section>
  );
};
