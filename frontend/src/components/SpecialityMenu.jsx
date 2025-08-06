import React from 'react';
import { specialityData } from '../assets/assets';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';

const SpecialityMenu = () => {
    const ref = React.useRef(null);
    // Trigger animation when the component is 20% in view
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 100 }
        }
    };

    const listVariants = {
        visible: {
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        },
        hidden: {}
    };

    const specialityItemVariants = {
        visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 15 } },
        hidden: { opacity: 0, scale: 0.8 }
    };

    return (
        <motion.div
            ref={ref}
            id='speciality'
            className='flex flex-col items-center gap-5 py-16 px-4 md:px-8 overflow-hidden'
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
        >
            <motion.h1 variants={itemVariants} className='text-3xl font-bold text-slate-800'>
                Find by <span className='text-primary'>Speciality</span>
            </motion.h1>
            <motion.p variants={itemVariants} className='max-w-xl text-center text-slate-600'>
                Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
            </motion.p>

            <motion.div
                variants={listVariants}
                className='w-full max-w-7xl flex justify-start gap-4 md:gap-6 pt-8 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing'
                drag="x" // Enable horizontal dragging
                dragConstraints={{ left: -300, right: 0 }} // Constraints for dragging
                dragTransition={{ bounceStiffness: 200, bounceDamping: 20 }}
            >
                {specialityData.map((item, index) => (
                    <motion.div
                        key={index}
                        variants={specialityItemVariants}
                        whileHover={{ y: -12, transition: { type: 'spring', stiffness: 300 } }}
                    >
                        <Link
                            to={`/doctors/${item.speciality}`}
                            onClick={() => window.scrollTo(0, 0)}
                            className='flex flex-col items-center text-center group cursor-pointer flex-shrink-0 w-36' 
                        >
                            <motion.img
                                whileHover={{ scale: 1.05 }}
                                // Adjusted width and height for the image
                                className='w-36 h-36 object-contain p-5 bg-primary/10 rounded-full transition-colors group-hover:bg-primary/30'
                                src={item.image}
                                alt={`${item.speciality} icon`}
                            />
                            <p className='font-semibold text-slate-700 mt-4'>{item.speciality}</p>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
};

export default SpecialityMenu;