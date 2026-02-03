import { motion } from 'framer-motion';
import { Award, ArrowRight, Mail, Code, Terminal, Layers } from 'lucide-react';

import profileImg from '@/assets/profile.jpg';

export default function IdentitySection() {
    return (
        <section className="min-h-screen pt-32 pb-12 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 relative overflow-hidden">

            {/* Background elements specific to Hero */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]" />
            </div>

            {/* Left: Profile Image (Circular with Neon Border) */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative group order-1 lg:order-last z-10"
            >
                <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
                    {/* Animated Neon Border */}
                    <div className="absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] animate-spin-slow opacity-80 group-hover:opacity-100 transition-opacity" />

                    {/* Inner Glow */}
                    <div className="absolute inset-4 rounded-full bg-cyan-400/10 blur-2xl group-hover:bg-cyan-400/20 transition-all duration-500" />

                    {/* Image Container */}
                    <div className="absolute inset-2 rounded-full overflow-hidden border-4 border-black box-border shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                        <img
                            src={profileImg}
                            alt="Parinith C M"
                            className="w-full h-full object-cover scale-105 group-hover:scale-110 group-hover:rotate-2 transition-all duration-700 ease-out"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Right: Content */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex-1 text-center lg:text-left space-y-6 z-10"
            >
                {/* Header Section */}
                <div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none mb-2">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 filter drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                            PARINITH C M
                        </span>
                    </h1>
                    <h2 className="text-xl md:text-2xl font-bold text-white/90 tracking-wide uppercase flex flex-col md:flex-row items-center justify-center lg:justify-start gap-2 md:gap-4">
                        <span>Computer Science Engineer</span>
                        <span className="hidden md:inline text-cyan-500">|</span>
                        <span className="text-cyan-400 text-shadow-glow">FULL STACK DEVELOPER</span>
                    </h2>
                </div>

                {/* Description & Skills */}
                <p className="text-lg text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                    Passionate about building scalable solutions. Skilled in <span className="text-cyan-300 font-semibold">HTML, CSS, JavaScript</span> for crafting responsive UIs, and <span className="text-purple-400 font-semibold">Python, Java</span> for robust backend engineering.
                </p>

                {/* Academic Excellence Card */}
                <div className="inline-flex items-center gap-4 p-4 pl-5 pr-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-cyan-400/30 transition-all group cursor-default mx-auto lg:mx-0 shadow-lg">
                    <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl text-black shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                        <Award size={24} strokeWidth={2.5} />
                    </div>
                    <div className="text-left">
                        <div className="text-2xl font-bold text-white leading-none mb-1">8.56 / 10 CGPA</div>
                        <div className="text-xs font-bold text-cyan-300 uppercase tracking-widest">Academic Excellence</div>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                    <button
                        onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                        className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold uppercase tracking-widest rounded-xl hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                    >
                        <Layers size={20} /> View Projects
                    </button>

                    <button
                        onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                        className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 hover:border-fuchsia-400/50 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
                    >
                        <Mail size={20} /> Contact Me
                    </button>
                </div>
            </motion.div>
        </section>
    );
}
