import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, useMotionValue, useTransform } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

// Floating Orb Component for interactive parallax effect
const FloatingOrb = ({ x, y, size, delay }) => {
    return (
        <motion.div
            className="absolute rounded-full bg-primary/50 blur-md"
            style={{
                width: size,
                height: size,
                // Apply the parallax effect from the parent
                x: useTransform(x, (latest) => latest * 0.1),
                y: useTransform(y, (latest) => latest * 0.1),
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1.2, 0.5],
            }}
            transition={{
                duration: 5 + delay,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: delay,
            }}
        />
    );
};


const Banner = () => {
    const navigate = useNavigate();
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    // --- Mouse tracking for interactive parallax effect ---
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        // Set mouse position relative to the center of the component
        mouseX.set(e.clientX - left - width / 2);
        mouseY.set(e.clientY - top - height / 2);
    };

    const handleMouseLeave = () => {
        // Reset to center when mouse leaves
        mouseX.set(0);
        mouseY.set(0);
    };

    const waveX1 = useTransform(mouseX, [-200, 200], [-30, 30]);
    const waveX2 = useTransform(mouseX, [-200, 200], [30, -30]);

    const handleNavigate = () => {
        navigate('/login');
        window.scrollTo(0, 0);
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.2 }
        }
    };

    const textContentVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className='relative flex flex-col items-center justify-center bg-slate-50 rounded-lg my-20 md:mx-10 overflow-hidden shadow-sm text-center'
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
        >
            {/* --- Interactive Floating Orbs --- */}
            <FloatingOrb x={mouseX} y={mouseY} size={80} delay={0} />
            <FloatingOrb x={mouseX} y={mouseY} size={40} delay={1} />
            <FloatingOrb x={mouseX} y={mouseY} size={60} delay={2} />

            {/* --- Animated Wave Background --- */}
            <div className="absolute bottom-0 left-0 w-full h-full opacity-60">
                {/* Wave 1 */}
                <motion.svg style={{ x: waveX1 }} className="absolute bottom-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <motion.path
                        fill="currentColor"
                        className="text-primary/10"
                        initial={{
                            d: "M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,186.7C960,213,1056,235,1152,218.7C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        }}
                        animate={{
                            d: [
                                "M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,186.7C960,213,1056,235,1152,218.7C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                                "M0,224L48,208C96,192,192,160,288,170.7C384,181,480,235,576,240C672,245,768,203,864,192C960,181,1056,203,1152,202.7C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                                "M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,186.7C960,213,1056,235,1152,218.7C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                            ]
                        }}
                        transition={{ duration: 10, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
                    />
                </motion.svg>
                {/* Wave 2 */}
                <motion.svg style={{ x: waveX2 }} className="absolute bottom-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <motion.path
                        fill="currentColor"
                        className="text-primary/20"
                        initial={{
                            d: "M0,224L48,208C96,192,192,160,288,170.7C384,181,480,235,576,240C672,245,768,203,864,192C960,181,1056,203,1152,202.7C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        }}
                        animate={{
                            d: [
                                "M0,224L48,208C96,192,192,160,288,170.7C384,181,480,235,576,240C672,245,768,203,864,192C960,181,1056,203,1152,202.7C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                                "M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,186.7C960,213,1056,235,1152,218.7C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                                "M0,224L48,208C96,192,192,160,288,170.7C384,181,480,235,576,240C672,245,768,203,864,192C960,181,1056,203,1152,202.7C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                            ]
                        }}
                        transition={{ duration: 15, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
                    />
                </motion.svg>
            </div>

            {/* ------- Content ------- */}
            <div className='relative z-10 flex flex-col items-center p-8 sm:p-12 md:p-16'>
                <motion.div
                    variants={textContentVariants}
                    className='text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 tracking-tight'
                >
                    <p>Seamless Healthcare,</p>
                    <p className='mt-2 md:mt-3 text-primary'>Available 24/7.</p>
                </motion.div>
                <motion.p
                    variants={textContentVariants}
                    className='text-slate-600 mt-4 max-w-xl'
                >
                    Your health doesn't follow a schedule. Find and book appointments with top doctors whenever it's most convenient for you.
                </motion.p>

                <motion.button
                    variants={textContentVariants}
                    onClick={handleNavigate}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className='bg-primary text-white font-bold text-sm sm:text-base px-8 py-3 rounded-full mt-8 hover:shadow-lg hover:shadow-primary/30 transition-shadow flex items-center gap-2'
                >
                    Create Your Account
                    <FiArrowRight />
                </motion.button>
            </div>
        </motion.div>
    );
};

export default Banner;