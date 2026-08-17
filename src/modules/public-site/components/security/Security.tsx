import React from 'react';

export const Security: React.FC = () => (
    <section className="premium-section">
        <div className="premium-container">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-12">Enterprise-Grade Security</h2>
            <div className="grid md:grid-cols-3 gap-8">
                {['Authentication', 'Tenant Isolation', 'RBAC'].map((feature) => (
                    <div key={feature} className="border border-premium-border p-8 rounded-2xl">
                        <h3 className="text-xl font-bold mb-4">{feature}</h3>
                        <p className="text-premium-fg-muted">Built on trusted, proven security architecture.</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);
