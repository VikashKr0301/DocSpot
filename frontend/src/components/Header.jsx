import React, { useEffect, useRef, useState } from 'react';
import { motion, animate, useTransform, useMotionValue } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { FaPlus, FaStethoscope, FaHeartbeat, FaCapsules } from 'react-icons/fa';
import { assets } from '../assets/assets';

const AnimatedNumber = ({ to, suffix = "" }) => {
    const nodeRef = useRef(null);
    useEffect(() => {
        const node = nodeRef.current;
        if (!node) return;
        const controls = animate(0, to, {
            duration: 2,
            ease: "easeOut",
            onUpdate(value) {
                node.textContent = Math.round(value).toLocaleString('en-US');
            },
        });
        return () => controls.stop();
    }, [to]);
    return (
        <p className='text-3xl lg:text-4xl font-bold text-slate-800'>
            <span ref={nodeRef}>0</span>{suffix}
        </p>
    );
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};
const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};
const imageVariants = {
    hidden: { x: 50, opacity: 0, scale: 0.9 },
    visible: { x: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 80, duration: 1 } },
};
const blobVariants = {
    animate: {
        scale: [1, 1.1, 1.05, 1.15, 1],
        rotate: [0, 10, -5, 5, 0],
        transition: { duration: 20, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }
    }
};

const Header = () => {
    const targetRef = useRef(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [componentDimensions, setComponentDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (targetRef.current) {
            setComponentDimensions({
                width: targetRef.current.offsetWidth,
                height: targetRef.current.offsetHeight
            });
        }
    }, []);

    const handleMouseMove = (e) => {
        if (!targetRef.current) return;
        const { left, top } = targetRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
    };

    const parallaxX = useTransform(mouseX, [0, componentDimensions.width], [-20, 20]);
    const parallaxY = useTransform(mouseY, [0, componentDimensions.height], [-20, 20]);

    return (
        <motion.div
            ref={targetRef}
            onMouseMove={handleMouseMove}
            className='relative flex flex-col md:flex-row items-center bg-gradient-to-br from-white to-blue-50/50 rounded-2xl overflow-hidden mt-2 sm:mt-4 md:mt-6 lg:mt-8 mx-auto max-w-7xl'
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
        >
            {/* --- Floating Icons --- */}
            <motion.svg className="absolute w-full h-auto bottom-10 left-0 z-0 text-primary/10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 50" preserveAspectRatio="none">
                <motion.path d="M0,25 h40 l10,-15 l10,30 l10,-30 l10,15 h120" fill="none" stroke="currentColor" strokeWidth="2" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 2, ease: "easeInOut", delay: 1, repeat: Infinity, repeatDelay: 3, repeatType: 'reverse' }} />
            </motion.svg>

            <motion.div style={{ x: parallaxX, y: parallaxY }} className="absolute top-[10%] left-[5%] text-primary/30 z-0" animate={{ y: [0, -15, 0] }} transition={{ duration: 8, repeat: Infinity, repeatType: 'mirror' }}>
                <FaPlus size={30} />
            </motion.div>
            <motion.div style={{ x: parallaxX, y: parallaxY }} className="absolute top-[20%] right-[10%] text-primary/40 z-0" animate={{ y: [0, 20, 0] }} transition={{ duration: 10, repeat: Infinity, repeatType: 'mirror' }}>
                <FaPlus size={50} />
            </motion.div>
            <motion.div style={{ x: parallaxX, y: parallaxY }} className="absolute bottom-[15%] left-[40%] text-primary/20 z-0" animate={{ y: [0, -20, 0], rotate: [0, 15, 0] }} transition={{ duration: 12, repeat: Infinity, repeatType: 'mirror' }}>
                <FaStethoscope size={40} />
            </motion.div>

            <motion.div style={{ x: parallaxX, y: parallaxY }} className="absolute top-[50%] left-[15%] text-primary/20 z-0" animate={{ y: [0, 25, 0] }} transition={{ duration: 15, repeat: Infinity, repeatType: 'mirror', delay: 1 }}>
                <FaHeartbeat size={35} />
            </motion.div>
            <motion.div style={{ x: parallaxX, y: parallaxY }} className="absolute bottom-[25%] right-[20%] text-primary/30 z-0" animate={{ y: [0, -20, 0], rotate: [0, -10, 0] }} transition={{ duration: 9, repeat: Infinity, repeatType: 'mirror', delay: 0.5 }}>
                <FaCapsules size={30} />
            </motion.div>

            {/* --------- Header Left: Text Content --------- */}
            <div className='w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left justify-center gap-4 sm:gap-5 md:gap-6 p-6 sm:p-8 md:p-10 lg:p-12 z-10'>
                <motion.h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight' variants={itemVariants}>
                    Your Health, <br /> Our Priority.
                </motion.h1>
                <motion.p className='text-slate-600 max-w-md text-sm sm:text-base lg:text-lg' variants={itemVariants}>
                    Instantly book appointments with the best doctors in India. Quality healthcare is now at your fingertips.
                </motion.p>
                <motion.a href='#speciality' className='group inline-flex items-center gap-3 bg-primary text-white font-bold px-6 sm:px-8 py-3 sm:py-3.5 rounded-full mt-1 sm:mt-2 shadow-lg shadow-primary/30 text-sm sm:text-base' variants={itemVariants} whileHover={{ scale: 1.05, boxShadow: "0px 15px 30px -10px rgba(66, 153, 225, 0.5)" }} whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
                    Find a Doctor
                    <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </motion.a>
                <motion.div className='flex flex-col sm:flex-row items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 pt-4 sm:pt-6 md:pt-8' variants={itemVariants}>
                    <motion.div className='text-center' whileHover={{ scale: 1.05, y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
                        <AnimatedNumber to={100} suffix="+" />
                        <p className='text-sm text-slate-500 tracking-wide mt-1'>Expert Doctors</p>
                    </motion.div>
                    <motion.div className='text-center' whileHover={{ scale: 1.05, y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
                        <AnimatedNumber to={20000} suffix="+" />
                        <p className='text-sm text-slate-500 tracking-wide mt-1'>Happy Patients</p>
                    </motion.div>
                </motion.div>
            </div>

            {/* --------- Header Right: Image & Shape --------- */}
            <motion.div
                className='w-full md:w-1/2 h-[350px] sm:h-[400px] md:h-[500px] lg:h-[550px] xl:min-h-[600px] self-end flex items-end justify-center mt-4 md:mt-0'
                variants={imageVariants}
            >
                <motion.div
                    className='absolute top-1/2 left-3/4 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] bg-primary/20 rounded-full blur-3xl'
                    variants={blobVariants}
                    animate="animate"
                    style={{ x: parallaxX, y: parallaxY }}
                ></motion.div>
                <img
                    className='relative z-10 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-none h-full object-contain object-bottom'
                    src={assets.header_img}
                    alt="A friendly doctor holding a clipboard"
                />
            </motion.div>
        </motion.div>
    );
};

export default Header;