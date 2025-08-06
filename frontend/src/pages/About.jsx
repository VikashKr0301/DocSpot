import React from 'react';
import { assets } from '../assets/assets';
import { motion, useInView } from 'framer-motion';
import { FiZap, FiCheckCircle, FiUser, FiShield, FiClock, FiMapPin } from 'react-icons/fi';

const About = () => {

  const features = [
    {
      icon: <FiZap className="w-10 h-10" />,
      title: "Instant Booking",
      description: "Book appointments in seconds. Our streamlined process eliminates waiting and phone calls."
    },
    {
      icon: <FiCheckCircle className="w-10 h-10" />,
      title: "Verified Professionals",
      description: "Every doctor on our platform is verified for their qualifications and expertise, ensuring you receive quality care."
    },
    {
      icon: <FiClock className="w-10 h-10" />,
      title: "24/7 Access",
      description: "Your health doesn't follow a 9-to-5 schedule. Find and book doctors anytime, day or night."
    },
    {
      icon: <FiMapPin className="w-10 h-10" />,
      title: "Convenient Location",
      description: "Easily find top-rated healthcare professionals and specialists located in your immediate area."
    },
    {
      icon: <FiUser className="w-10 h-10" />,
      title: "Personalized Care",
      description: "Get tailored recommendations and manage your health history all in one secure place."
    },
    {
      icon: <FiShield className="w-10 h-10" />,
      title: "Secure & Private",
      description: "Your health data is encrypted and protected with the highest standards of privacy and security."
    }
  ];

  // Refs for in-view detection
  const aboutSectionRef = React.useRef(null);
  const chooseUsSectionRef = React.useRef(null);
  const isInViewAbout = useInView(aboutSectionRef, { once: true, amount: 0.2 });
  const isInViewChooseUs = useInView(chooseUsSectionRef, { once: true, amount: 0.2 });

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  const imageVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 80, damping: 15 } }
  };

  const contentVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 80, damping: 15 } }
  };

  const cardVariants = {
    hover: {
      y: -10,
      boxShadow: "0px 20px 40px -10px rgba(66, 153, 225, 0.3)",
      transition: { type: 'spring', stiffness: 300 }
    }
  };


  return (
    <div className='bg-slate-50 py-16 md:py-24 overflow-x-hidden'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>

        {/* ABOUT US */}
        <motion.div
          ref={aboutSectionRef}
          className='text-center'
          variants={sectionVariants}
          initial="hidden"
          animate={isInViewAbout ? "visible" : "hidden"}
        >
          <motion.h1 variants={textVariants} className='text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight'>
            ABOUT <span className='text-primary'>US</span>
          </motion.h1>
          <motion.p variants={textVariants} className='mt-2 text-lg text-slate-500'>Your trusted partner in healthcare management.</motion.p>
        </motion.div>

        <motion.div
          className='mt-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-16'
          variants={sectionVariants}
          initial="hidden"
          animate={isInViewAbout ? "visible" : "hidden"}
        >
          <motion.div variants={imageVariants} whileHover={{ scale: 1.03 }} className="flex-shrink-0">
            <img
              className='w-full max-w-md rounded-xl object-cover'
              src={assets.about_image}
              alt="DocSpot img"
            />
          </motion.div>
          <motion.div variants={contentVariants} className='flex flex-col justify-center gap-6 text-slate-700'>
            <p className='text-base leading-relaxed'>
              Welcome to <strong>DocSpot</strong>, your trusted partner in managing your healthcare needs conveniently and efficiently. At DocSpot, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.
            </p>
            <p className='text-base leading-relaxed'>
              <strong>DocSpot</strong> is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, DocSpot is here to support you every step of the way.
            </p>
            <h3 className='text-2xl font-bold text-slate-900 mt-4'>
              Our Vision
            </h3>
            <p className='text-base leading-relaxed'>
              Our vision at <strong>DocSpot</strong> is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.
            </p>
          </motion.div>
        </motion.div>

        {/* WHY CHOOSE US */}
        <motion.div
          ref={chooseUsSectionRef}
          className='mt-24 text-center'
          initial="hidden"
          animate={isInViewChooseUs ? "visible" : "hidden"}
          variants={sectionVariants}
        >
          <motion.h2 variants={textVariants} className='text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight'>
            WHY <span className='text-primary'>CHOOSE US</span>
          </motion.h2>
          <motion.div className="mt-4 w-24 h-1 bg-primary mx-auto" initial={{ scaleX: 0 }} animate={isInViewChooseUs ? { scaleX: 1 } : { scaleX: 0 }} transition={{ duration: 0.5, delay: 0.3 }} />
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          className='mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'
          variants={sectionVariants}
          initial="hidden"
          animate={isInViewChooseUs ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={{ ...textVariants, ...cardVariants }}
              whileHover="hover"
              className='group bg-white rounded-xl p-8 text-center shadow-lg cursor-pointer'
            >
              <div className='flex justify-center text-primary mb-6'>
                {feature.icon}
              </div>
              <h4 className='text-lg font-bold text-slate-800 mb-3'>
                {feature.title}
              </h4>
              <p className='text-slate-600'>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}

export default About;