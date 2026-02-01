import { useState, useEffect } from "react";
import { Link } from "wouter";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "About", id: "about" },
        { name: "Education", id: "education" },
        { name: "Projects", id: "projects" },
        { name: "Skills", id: "skills" },
        { name: "Achievements", id: "certifications" },
        { name: "Contact", id: "contact" },
    ];

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        } else {
            // If we are not on the home page (which contains these sections), user might need navigation logic if we had multiple pages.
            // For now, since everything is in Home, this is fine. 
            // If we had routing, we might check if window.location.pathname !== '/' and navigate first.
            window.scrollTo({ top: 0, behavior: "smooth" }); // Fallback to top if hero
        }
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-black/80 backdrop-blur-md border-b border-white/10 py-4"
                : "bg-transparent py-6"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <div
                    className="font-mono text-xl font-bold tracking-tighter text-white cursor-pointer"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                    PARINITH <span className="text-cyan-400">C M</span>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <button
                            key={link.name}
                            onClick={() => scrollToSection(link.id)}
                            className="text-sm font-medium text-white/70 hover:text-cyan-400 hover:scale-105 transition-all uppercase tracking-widest relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-cyan-400 transition-all duration-300 group-hover:w-full" />
                        </button>
                    ))}

                    <button
                        onClick={() => window.open("/Parinith_CM_One_Resume.pdf", "_blank")}
                        className="px-5 py-2 text-xs font-bold uppercase tracking-widest text-black bg-cyan-400 rounded-full hover:bg-cyan-300 transition-colors shadow-[0_0_15px_rgba(0,243,255,0.4)]"
                    >
                        View Resume
                    </button>
                </div>

                {/* Mobile Menu Button - simplified for now */}
                <button className="md:hidden text-white" onClick={() => scrollToSection('about')}>
                    <span className="sr-only">Menu</span>
                    <div className="space-y-1.5">
                        <div className="w-6 h-0.5 bg-white"></div>
                        <div className="w-6 h-0.5 bg-white"></div>
                        <div className="w-6 h-0.5 bg-white"></div>
                    </div>
                </button>
            </div>
        </nav>
    );
}
