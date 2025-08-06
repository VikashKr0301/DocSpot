import React from 'react';
import { assets } from '../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { motion, useInView } from 'framer-motion';

// --- This component to handle scrolling to top on navigation ---
const ScrollToTopLink = ({ to, children, className }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    window.scrollTo(0, 0);
    navigate(to);
  };

  // If 'to' is not provided, fallback to a regular link
  if (!to) {
    return <a href={children} className={className}>{children}</a>;
  }

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
};


const Footer = () => {
  const navigate = useNavigate();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const linkVariants = {
    hover: { x: 3, transition: { type: 'spring', stiffness: 400 } }
  };

  const socialIconVariants = {
    hover: { scale: 1.15, rotate: -10, transition: { type: 'spring', stiffness: 300 } }
  };

  const contactIconVariants = {
    pulse: {
      scale: [1, 1.1, 1],
      transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
    }
  };

  return (
    <div ref={ref} className='bg-slate-50 text-slate-600 px-4 md:px-10 py-12 mt-24 overflow-hidden'>
      <motion.div
        className='max-w-7xl mx-auto'
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8'>

          {/* --- Column 1: Brand & Socials --- */}
          <motion.div variants={itemVariants} className='flex flex-col gap-4 items-start'>
            <div className='flex items-center gap-2 cursor-pointer' onClick={() => { window.scrollTo(0, 0); navigate('/') }}>
              <img className='w-10' src={assets.logo} alt="DocSpot Logo" />
              <span className='font-bold text-xl text-slate-800'>DocSpot</span>
            </div>
            <p className='text-sm leading-6'>
              Your trusted partner in health. Easily book appointments with top doctors near you from our extensive network.
            </p>
            <div className='flex gap-3 mt-2'>
              <motion.a variants={socialIconVariants} whileHover="hover" href="https://www.linkedin.com/in/vikaxkr" target="_blank" rel="noopener noreferrer" className='p-2 bg-slate-200 rounded-full text-slate-800 hover:bg-primary hover:text-white transition-colors'>
                <FaFacebookF />
              </motion.a>
              <motion.a variants={socialIconVariants} whileHover="hover" href="https://www.linkedin.com/in/vikaxkr" target="_blank" rel="noopener noreferrer" className='p-2 bg-slate-200 rounded-full text-slate-800 hover:bg-primary hover:text-white transition-colors'>
                <FaTwitter />
              </motion.a>
              <motion.a variants={socialIconVariants} whileHover="hover" href="https://www.linkedin.com/in/vikaxkr" className='p-2 bg-slate-200 rounded-full text-slate-800 hover:bg-primary hover:text-white transition-colors'>
                <FaLinkedinIn />
              </motion.a>
            </div>
          </motion.div>

          {/* --- Column 2: Company Links --- */}
          <motion.div variants={itemVariants}>
            <h3 className='text-lg font-semibold text-slate-800 mb-4'>COMPANY</h3>
            <ul className='flex flex-col gap-3 text-sm'>
              <li><motion.div variants={linkVariants} whileHover="hover"><ScrollToTopLink to='/' className='hover:text-primary transition-colors text-left w-full'>Home</ScrollToTopLink></motion.div></li>
              <li><motion.div variants={linkVariants} whileHover="hover"><ScrollToTopLink to='/about' className='hover:text-primary transition-colors text-left w-full'>About us</ScrollToTopLink></motion.div></li>
              <li><motion.div variants={linkVariants} whileHover="hover"><ScrollToTopLink to='/doctors' className='hover:text-primary transition-colors text-left w-full'>All Doctors</ScrollToTopLink></motion.div></li>
              <li><motion.div variants={linkVariants} whileHover="hover"><ScrollToTopLink to='/contact' className='hover:text-primary transition-colors text-left w-full'>Contact</ScrollToTopLink></motion.div></li>
            </ul>
          </motion.div>

          {/* --- Column 3: For Patients --- */}
          <motion.div variants={itemVariants}>
            <h3 className='text-lg font-semibold text-slate-800 mb-4'>FOR PATIENTS</h3>
            <ul className='flex flex-col gap-3 text-sm'>
              <li><motion.div variants={linkVariants} whileHover="hover"><ScrollToTopLink to='/my-profile' className='hover:text-primary transition-colors text-left w-full'>My Profile</ScrollToTopLink></motion.div></li>
              <li><motion.div variants={linkVariants} whileHover="hover"><ScrollToTopLink to='/my-appointments' className='hover:text-primary transition-colors text-left w-full'>My Appointments</ScrollToTopLink></motion.div></li>
              <li><motion.div variants={linkVariants} whileHover="hover"><ScrollToTopLink to='/doctors' className='hover:text-primary transition-colors text-left w-full'>Find by Speciality</ScrollToTopLink></motion.div></li>
              <li><motion.div variants={linkVariants} whileHover="hover"><ScrollToTopLink to='/login' className='hover:text-primary transition-colors text-left w-full'>Login / Register</ScrollToTopLink></motion.div></li>
            </ul>
          </motion.div>

          {/* --- Column 4: Get in Touch --- */}
          <motion.div variants={itemVariants}>
            <h3 className='text-lg font-semibold text-slate-800 mb-4'>GET IN TOUCH</h3>
            <ul className='flex flex-col gap-3 text-sm'>
              <li className='flex items-start gap-3'>
                <motion.div variants={contactIconVariants} animate="pulse"><FaMapMarkerAlt className='text-slate-800 text-lg mt-1' /></motion.div>
                <p>123 Health St, Bihar, India</p>
              </li>
              <li className='flex items-center gap-3'>
                <motion.div variants={contactIconVariants} animate="pulse"><FaPhoneAlt className='text-slate-800 text-base' /></motion.div>
                <a href="tel:+910000000000" className='hover:text-primary transition-colors'>+91-000-000-0000</a>
              </li>
              <li className='flex items-center gap-3'>
                <motion.div variants={contactIconVariants} animate="pulse"><FaEnvelope className='text-slate-800 text-base' /></motion.div>
                <a href="mailto:contactdocspot@gamil.com" className='hover:text-primary transition-colors'>contactdocspot@gamil.com</a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* --- Copyright Section --- */}
        <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1, transition: { delay: 0.8 } } : { opacity: 0 }}>
          <hr className='my-8 border-slate-200' />
          <p className='text-center text-sm text-slate-500'>
            Copyright {new Date().getFullYear()} @ DocSpot - All Rights Reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Footer;