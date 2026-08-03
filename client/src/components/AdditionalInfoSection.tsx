import { motion } from "framer-motion";
import { Users, Award, Code, Globe, Music, Book, Monitor } from "lucide-react";

export default function AdditionalInfoSection() {
    const categories = [
        {
            title: "Clubs & Communities",
            icon: <Users className="w-8 h-8 text-cyan-400" />,
            items: ["Member of College Coding Club - Stack Forge"]
        },
        {
            title: "Achievements",
            icon: <Award className="w-8 h-8 text-purple-400" />,
            items: ["Secured 1st place at Cyber Sense - Cyber Security Quiz"]
        },
        {
            title: "Events",
            icon: <Code className="w-8 h-8 text-pink-400" />,
            items: ["Participated in Multiple Hackathons"]
        },
        {
            title: "Languages",
            icon: <Globe className="w-8 h-8 text-blue-400" />,
            items: ["English", "Kannada"]
        },
        {
            title: "Interests",
            icon: <Music className="w-8 h-8 text-green-400" />,
            items: ["Listening to Music", "Reading Books", "Watching Movies"]
        }
    ];

    return (
        <section id="additional-info" className="mx-auto w-full max-w-7xl px-6 py-10">
            <div className="glass rounded-2xl p-8 border border-purple-400/20 bg-purple-900/5 relative overflow-hidden">
                {/* Background Gradients inside the card */}
                <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                    <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-purple-400/10 blur-3xl" />
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h2 className="text-neon text-3xl font-semibold tracking-tight text-white mb-2">
                            Additional Information
                        </h2>
                        <p className="text-white/70 max-w-xl">
                            Extracurriculars, interests, and other achievements.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-purple-400/30 transition-all duration-300 group hover:-translate-y-1"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-white/5 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    {category.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white tracking-wide">
                                    {category.title}
                                </h3>
                            </div>
                            <ul className="space-y-2">
                                {category.items.map((item, idx) => (
                                    <li key={idx} className="text-gray-300 flex items-start gap-2">
                                        <span className="mt-1.5 w-1.5 h-1.5 bg-purple-500 rounded-full" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
