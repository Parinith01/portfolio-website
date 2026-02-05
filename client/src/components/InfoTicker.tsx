import { motion } from "framer-motion";

export default function InfoTicker() {
    const items = [
        "Member of College Coding Club-Stack Forge",
        "Secured 1st place at Cyber Sense-Cyber Security Quiz",
        "Participated in Multiple Hackathons",
        "Language-English, Kannada",
        "Interests-Listening Music, Reading Book, Watching movies"
    ];

    // duplicate items to create seamless loop
    const tickerContent = [...items, ...items, ...items, ...items];

    return (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-black border-b border-cyan-500/30 text-white h-10 flex items-center overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

            <motion.div
                className="flex whitespace-nowrap gap-8"
                animate={{ x: [0, -1000] }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 30,
                        ease: "linear",
                    },
                }}
            >
                {tickerContent.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                        <span className="text-sm font-mono tracking-wide text-cyan-100/90 hover:text-cyan-400 transition-colors cursor-default">
                            {item}
                        </span>
                        <span className="text-cyan-500/40 text-xs">◆</span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
