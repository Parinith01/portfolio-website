import { motion } from 'framer-motion';
import { ArrowRight, Mail, Layers } from 'lucide-react';

import profileImg from '../assets/profile.jpg';

export default function IdentitySection() {
    return (
        <section className="min-h-screen pt-32 pb-12 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 relative overflow-hidden">

            {/* Background elements specific to Hero */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-[100px] animate-pulse-slow" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse-slow delay-1000" />
            </div>

            {/* Left: Profile Image (Circular with Neon Border) */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative group order-1 lg:order-last z-10"
            >
                <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
                    {/* Animated Neon Border Ring */}
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-75 blur-md group-hover:opacity-100 group-hover:blur-lg transition-all duration-500 animate-spin-slow" />

                    {/* Inner Rotating Ring */}
                    <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-cyan-400 border-l-purple-500 opacity-80 animate-spin-reverse-slower" />

                    {/* Image Container */}
                    <div className="absolute inset-2 rounded-full overflow-hidden border-2 border-white/10 bg-black shadow-2xl relative z-10">
                        <img
                            src={profileImg}
                            alt="Parinith C M"
                            className="w-full h-full object-cover scale-105 group-hover:scale-110 group-hover:rotate-2 transition-all duration-700 ease-out filter brightness-110 contrast-110"
                        />
                        {/* Glass Overlay on Image */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                    </div>
                </div>
            </motion.div>

            {/* Right: Content */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0, x: -50 },
                    visible: {
                        opacity: 1,
                        x: 0,
                        transition: { staggerChildren: 0.15, delayChildren: 0.3 }
                    }
                }}
                className="flex-1 text-center lg:text-left space-y-8 z-10"
            >
                {/* Header Section */}
                <div className="space-y-4">
                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-400 drop-shadow-[0_0_30px_rgba(6,182,212,0.5)] filter">
                                PARINITH
                            </span>
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-white to-cyan-300 drop-shadow-[0_0_30px_rgba(168,85,247,0.5)] filter">
                                C M
                            </span>
                        </h1>
                    </motion.div>

                    <motion.h2
                        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                        className="text-lg md:text-2xl font-bold text-white/80 tracking-[0.2em] uppercase flex flex-col md:flex-row items-center justify-center lg:justify-start gap-3 md:gap-6"
                    >
                        <span className="hover:text-cyan-300 transition-colors duration-300">Computer Science Engineer</span>
                        <span className="hidden md:inline text-white/20">|</span>
                        <span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">FULL STACK DEVELOPER</span>
                    </motion.h2>
                </div>

                {/* Description */}
                <motion.p
                    variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                    className="text-lg md:text-xl text-gray-300/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light tracking-wide"
                >
                    Passionate about building <span className="text-white font-medium drop-shadow-md">scalable solutions</span>. Skilled in <span className="text-cyan-300 font-semibold drop-shadow-sm">HTML, CSS, JavaScript</span> for crafting responsive UIs, and <span className="text-purple-400 font-semibold drop-shadow-sm">Python, Java</span> for robust backend engineering.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start pt-6"
                >
                    <button
                        onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                        className="group relative px-8 py-4 bg-transparent overflow-hidden rounded-xl transition-all hover:-translate-y-1"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-90 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <span className="relative font-bold text-white uppercase tracking-widest flex items-center gap-3">
                            <Layers size={20} className="group-hover:rotate-12 transition-transform" /> View Projects
                        </span>
                        <div className="absolute inset-0 rounded-xl ring-2 ring-white/20 group-hover:ring-white/40 group-hover:scale-105 transition-all duration-500" />
                    </button>

                    <button
                        onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                        className="group relative px-8 py-4 bg-white/5 overflow-hidden rounded-xl transition-all hover:-translate-y-1 backdrop-blur-md"
                    >
                        <div className="absolute inset-0 border border-white/10 group-hover:border-fuchsia-400/50 rounded-xl transition-colors duration-300" />
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative font-bold text-white uppercase tracking-widest flex items-center gap-3 group-hover:text-fuchsia-300 transition-colors">
                            <Mail size={20} className="group-hover:scale-110 transition-transform" /> Contact Me
                        </span>
                    </button>
                </motion.div>
            </motion.div>
        </section>
    );
}
