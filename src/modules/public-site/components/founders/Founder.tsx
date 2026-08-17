import React from 'react';
import { founder } from '../../data/founder';

export const Founder: React.FC = () => (
    <section className="premium-section bg-premium-bg-secondary">
        <div className="premium-container">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-12">Leadership</h2>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="aspect-square bg-premium-glass rounded-3xl" />
                <div>
                    <h3 className="text-3xl font-bold mb-4">{founder.name}</h3>
                    <p className="text-xl text-premium-fg-muted mb-8">{founder.story}</p>
                </div>
            </div>
        </div>
    </section>
);
