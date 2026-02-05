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
        <section id="additional-info" className="py-20 bg-black relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                        ADDITIONAL INFORMATION
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-purple-600 mx-auto rounded-full" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 hover:bg-zinc-900/80 hover:border-cyan-500/30 transition-all duration-300 group hover:-translate-y-1"
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
                                    <li key={idx} className="text-gray-400 flex items-start gap-2">
                                        <span className="mt-1.5 w-1.5 h-1.5 bg-cyan-500 rounded-full" />
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
