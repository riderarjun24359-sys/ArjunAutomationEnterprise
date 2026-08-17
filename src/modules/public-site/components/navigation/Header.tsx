"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: 'Solutions', href: '/solutions' },
        { name: 'Industries', href: '/industries' },
        { name: 'Portfolio', href: '/portfolio' },
        { name: 'Help', href: '/help' },
        { name: 'Resources', href: '/resources' },
    ];

    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-premium-bg/80 backdrop-blur-md border-b border-premium-border' : 'bg-transparent'}`}>
            <div className="premium-container py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 flex-shrink-0 z-50">
                    <img src="/brand/logos/monogram.svg" alt="Arjun Automation" className="h-8 w-8" />
                    <span className="text-xl font-bold tracking-tight">Arjun Automation</span>
                </Link>
                
                {/* Desktop Nav - Adaptive Breakpoints */}
                <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
                    {navItems.map((item) => (
                        <Link key={item.name} href={item.href} className="hover:text-premium-accent transition whitespace-nowrap">
                            {item.name}
                        </Link>
                    ))}
                    <Link href="/contact" className="bg-premium-accent text-white px-5 py-2 rounded-full hover:opacity-90 transition whitespace-nowrap">
                        Get Started
                    </Link>
                </nav>

                {/* Mobile/Tablet Toggle */}
                <button className="lg:hidden p-2 z-50" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile/Tablet Nav Drawer */}
            {isOpen && (
                <div className="lg:hidden absolute top-0 left-0 w-full h-screen bg-premium-bg flex flex-col items-center justify-center gap-8 p-6 z-40">
                    {navItems.map((item) => (
                        <Link key={item.name} href={item.href} className="text-2xl font-medium" onClick={() => setIsOpen(false)}>
                            {item.name}
                        </Link>
                    ))}
                    <Link href="/contact" className="bg-premium-accent text-white px-8 py-3 rounded-full text-center hover:opacity-90 transition" onClick={() => setIsOpen(false)}>
                        Get Started
                    </Link>
                </div>
            )}
        </header>
    );
};
