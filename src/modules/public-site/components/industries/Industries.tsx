import React from 'react';

export const Industries: React.FC = () => (
    <section className="premium-section bg-premium-bg-secondary">
        <div className="premium-container">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-12">Industries We Empower</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {['Manufacturing', 'Healthcare', 'Retail', 'Education', 'Hospitality', 'Professional Services'].map((industry) => (
                    <div key={industry} className="premium-glass p-6 rounded-2xl">
                        <h3 className="text-xl font-bold mb-2">{industry}</h3>
                        <p className="text-premium-fg-muted">Precision automation for {industry}.</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);
