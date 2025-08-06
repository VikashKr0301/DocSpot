// import React, { useState, useEffect, useRef } from 'react';
// import { motion, useInView } from 'framer-motion';
// import { FiMapPin, FiPhone, FiMail, FiClock, FiFacebook, FiTwitter, FiLinkedin } from 'react-icons/fi';

// // Function to format time from total minutes to HH:MM AM/PM
// const formatTime = (totalMinutes) => {
//   const hours = Math.floor(totalMinutes / 60);
//   const minutes = totalMinutes % 60;
//   const ampm = hours >= 12 ? 'PM' : 'AM';
//   const formattedHours = hours % 12 || 12; // Converts "0" hour to "12"
//   const formattedMinutes = minutes.toString().padStart(2, '0');
//   return `${formattedHours}:${formattedMinutes} ${ampm}`;
// };

// const Contact = () => {
//   const [supportStatus, setSupportStatus] = useState({ isOpen: false, message: '', nextOpenTime: '' });
//   const ref = useRef(null);
//   const intervalRef = useRef(null);
//   const isInView = useInView(ref, { once: true, amount: 0.1 });

//   const checkSupportAvailability = () => {
//     const now = new Date();
//     const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
//     const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to total minutes for easier comparison

//     const workingHours = {
//       1: { start: 9 * 60, end: 18 * 60 },  // Monday
//       2: { start: 9 * 60, end: 18 * 60 },  // Tuesday
//       3: { start: 9 * 60, end: 18 * 60 },  // Wednesday
//       4: { start: 9 * 60, end: 18 * 60 },  // Thursday
//       5: { start: 9 * 60, end: 18 * 60 },  // Friday
//       6: { start: 10 * 60, end: 16 * 60 }, // Saturday
//       0: null, // Sunday
//     };

//     const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//     const todayHours = workingHours[currentDay];

//     if (todayHours && currentTime >= todayHours.start && currentTime < todayHours.end) {
//       setSupportStatus({
//         isOpen: true,
//         message: `We're currently open! Closing at ${formatTime(todayHours.end)}`,
//         nextOpenTime: ''
//       });
//     } else {
//       let nextOpenDayIndex = currentDay;
//       let daysChecked = 0;
//       // Find the next open day
//       while (daysChecked < 7) {
//         if (todayHours && currentTime < todayHours.start) {
//           // If today is a working day and we're before opening time
//           break;
//         }
//         // Move to the next day
//         nextOpenDayIndex = (nextOpenDayIndex + 1) % 7;
//         if (workingHours[nextOpenDayIndex]) {
//           break;
//         }
//         daysChecked++;
//       }

//       const nextDayHours = workingHours[nextOpenDayIndex];
//       const nextDayName = dayNames[nextOpenDayIndex];
//       const openTime = formatTime(nextDayHours.start);

//       let nextOpenMessage = `We'll be back on ${nextDayName} at ${openTime}`;
//       if (nextOpenDayIndex === currentDay) {
//         nextOpenMessage = `We'll be back today at ${openTime}`;
//       } else if (nextOpenDayIndex === (new Date().getDay() + 1) % 7) {
//         nextOpenMessage = `We'll be back tomorrow at ${openTime}`;
//       }

//       setSupportStatus({
//         isOpen: false,
//         message: "We're currently closed.",
//         nextOpenTime: nextOpenMessage,
//       });
//     }
//   };

//   useEffect(() => {
//     checkSupportAvailability();
//     const interval = setInterval(checkSupportAvailability, 60000); // Update every minute
//     return () => clearInterval(interval);
//   }, []);

//   // --- Animation Variants ---
//   const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
//   const headerVariants = { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } } };
//   const itemVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } } };
//   const socialIconVariants = { hover: { scale: 1.15, y: -3, transition: { type: 'spring', stiffness: 300 } } };

//   return (
//     <div ref={ref} className='bg-slate-50 py-16 md:py-24 overflow-hidden'>
//       <motion.div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' variants={containerVariants} initial="hidden" animate={isInView ? "visible" : "hidden"}>
//         {/* --- Page Header --- */}
//         <motion.div variants={headerVariants} className='text-center mb-16'>
//           <h1 className='text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight'>
//             GET IN <span className='text-primary'>TOUCH</span>
//           </h1>
//           <p className='mt-2 text-lg text-slate-500'>We're here to help. Reach out to us with any questions.</p>
//         </motion.div>

//         {/* --- Main Content Grid --- */}
//         <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-start'>
//           {/* --- Left Side: Contact Info --- */}
//           <motion.div variants={itemVariants} className='space-y-10'>
//             {/* Office Info, Contact Info, Working Hours...  */}
//             <div>
//               <div className="flex items-center gap-4 mb-3">
//                 <FiMapPin className="w-6 h-6 text-primary" />
//                 <h3 className='text-xl font-bold text-slate-800'>Our Office</h3>
//               </div>
//               <p className='pl-10 text-slate-600 leading-relaxed'>
//                 123 Health St, Bihar<br />India
//               </p>
//             </div>
//             <div>
//               <div className="flex items-center gap-4 mb-3">
//                 <FiPhone className="w-6 h-6 text-primary" />
//                 <h3 className='text-xl font-bold text-slate-800'>Contact Details</h3>
//               </div>
//               <div className='pl-10 space-y-2 text-slate-600'>
//                 <p><strong>Phone:</strong> <a href="tel:+910000000000" className='text-primary hover:underline'>+91-000-000-0000</a></p>
//                 <p><strong>Email:</strong> <a href="mailto:contactdocspot@gmail.com" className='text-primary hover:underline'>contactdocspot@gmail.com</a></p>
//               </div>
//             </div>
//             <div>
//               <div className="flex items-center gap-4 mb-3">
//                 <FiClock className="w-6 h-6 text-primary" />
//                 <h3 className='text-xl font-bold text-slate-800'>Working Hours</h3>
//               </div>
//               <div className='pl-10 space-y-1 text-slate-600'>
//                 <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
//                 <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM</p>
//                 <p><strong>Sunday:</strong> Closed</p>
//               </div>
//             </div>

//             {/* --- Support Availability Status --- */}
//             <div>
//               <div className="flex items-center gap-4 mb-3">
//                 <div className="relative flex items-center justify-center">
//                   <span className={`absolute w-6 h-6 ${supportStatus.isOpen ? 'bg-green-500/30' : 'bg-red-500/30'} rounded-full animate-ping`}></span>
//                   <span className={`relative w-3 h-3 ${supportStatus.isOpen ? 'bg-green-500' : 'bg-red-500'} rounded-full`}></span>
//                 </div>
//                 <h3 className='text-xl font-bold text-slate-800'>Support Availability</h3>
//               </div>
//               <div className='pl-10 space-y-1 text-slate-600'>
//                 <p className={`font-semibold ${supportStatus.isOpen ? 'text-green-600' : 'text-red-600'}`}>
//                   {supportStatus.message}
//                 </p>
//                 {supportStatus.nextOpenTime && (
//                   <p className="text-sm">{supportStatus.nextOpenTime}</p>
//                 )}
//               </div>
//             </div>
//           </motion.div>

//           {/* --- Right Side: Interactive Map & Socials --- */}
//           <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }} className="bg-white p-6 rounded-xl shadow-lg space-y-8">
//             <div>
//               <h3 className="text-2xl font-bold text-slate-800 mb-4 text-center">Our Location</h3>
//               <div className="aspect-video rounded-lg overflow-hidden border-2 border-slate-200">
//                 {/* Google Map */}
//                 <iframe
//                   src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3689.851963950105!2d85.3239!3d25.5941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed5854ab35ab0d%3A0x2523234b54f8569!2sPatna%2C%20Bihar!5e0!3m2!1sen!2sin!4v1678886555555!5m2!1sen!2sin"
//                   width="100%"
//                   height="100%"
//                   style={{ border: 0 }}
//                   allowFullScreen=""
//                   loading="lazy"
//                   referrerPolicy="no-referrer-when-downgrade">
//                 </iframe>
//               </div>
//             </div>
//             <div className="text-center">
//               <h3 className="text-2xl font-bold text-slate-800 mb-4">Follow Us</h3>
//               <div className="flex justify-center gap-6">
//                 <motion.a href="https://www.linkedin.com/in/vikaxkr" variants={socialIconVariants} whileHover="hover" className="p-3 bg-slate-100 rounded-full text-slate-700 hover:bg-primary hover:text-white transition-colors duration-300">
//                   <FiFacebook size={24} />
//                 </motion.a>
//                 <motion.a href="https://www.linkedin.com/in/vikaxkr" variants={socialIconVariants} whileHover="hover" className="p-3 bg-slate-100 rounded-full text-slate-700 hover:bg-primary hover:text-white transition-colors duration-300">
//                   <FiTwitter size={24} />
//                 </motion.a>
//                 <motion.a href="https://www.linkedin.com/in/vikaxkr" variants={socialIconVariants} whileHover="hover" className="p-3 bg-slate-100 rounded-full text-slate-700 hover:bg-primary hover:text-white transition-colors duration-300">
//                   <FiLinkedin size={24} />
//                 </motion.a>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Contact;

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiMapPin, FiPhone, FiMail, FiClock, FiFacebook, FiTwitter, FiLinkedin } from 'react-icons/fi';

// Function to format time from total minutes to HH:MM AM/PM
const formatTime = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12; // Converts "0" hour to "12"
  const formattedMinutes = minutes.toString().padStart(2, '0');
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

const Contact = () => {
  const [supportStatus, setSupportStatus] = useState({ isOpen: false, message: '', nextOpenTime: '' });
  const ref = useRef(null);
  const intervalRef = useRef(null);
  const isMountedRef = useRef(true);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const checkSupportAvailability = useCallback(() => {
    // Check if component is still mounted
    if (!isMountedRef.current) return;

    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to total minutes for easier comparison

    const workingHours = {
      1: { start: 9 * 60, end: 18 * 60 },  // Monday
      2: { start: 9 * 60, end: 18 * 60 },  // Tuesday
      3: { start: 9 * 60, end: 18 * 60 },  // Wednesday
      4: { start: 9 * 60, end: 18 * 60 },  // Thursday
      5: { start: 9 * 60, end: 18 * 60 },  // Friday
      6: { start: 10 * 60, end: 16 * 60 }, // Saturday
      0: null, // Sunday
    };

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayHours = workingHours[currentDay];

    if (todayHours && currentTime >= todayHours.start && currentTime < todayHours.end) {
      if (isMountedRef.current) {
        setSupportStatus({
          isOpen: true,
          message: `We're currently open! Closing at ${formatTime(todayHours.end)}`,
          nextOpenTime: ''
        });
      }
    } else {
      let nextOpenDayIndex = currentDay;
      let daysChecked = 0;
      // Find the next open day
      while (daysChecked < 7) {
        if (todayHours && currentTime < todayHours.start) {
          // If today is a working day and we're before opening time
          break;
        }
        // Move to the next day
        nextOpenDayIndex = (nextOpenDayIndex + 1) % 7;
        if (workingHours[nextOpenDayIndex]) {
          break;
        }
        daysChecked++;
      }

      const nextDayHours = workingHours[nextOpenDayIndex];
      const nextDayName = dayNames[nextOpenDayIndex];
      const openTime = formatTime(nextDayHours.start);

      let nextOpenMessage = `We'll be back on ${nextDayName} at ${openTime}`;
      if (nextOpenDayIndex === currentDay) {
        nextOpenMessage = `We'll be back today at ${openTime}`;
      } else if (nextOpenDayIndex === (new Date().getDay() + 1) % 7) {
        nextOpenMessage = `We'll be back tomorrow at ${openTime}`;
      }

      if (isMountedRef.current) {
        setSupportStatus({
          isOpen: false,
          message: "We're currently closed.",
          nextOpenTime: nextOpenMessage,
        });
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    checkSupportAvailability();

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Set up new interval with mounted check
    intervalRef.current = setInterval(() => {
      if (isMountedRef.current) {
        checkSupportAvailability();
      }
    }, 60000);

    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [checkSupportAvailability]);

  // --- Animation Variants ---
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
  const headerVariants = { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } } };
  const itemVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } } };
  const socialIconVariants = { hover: { scale: 1.15, y: -3, transition: { type: 'spring', stiffness: 300 } } };

  return (
    <div ref={ref} className='bg-slate-50 py-16 md:py-24 overflow-hidden'>
      <motion.div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' variants={containerVariants} initial="hidden" animate={isInView ? "visible" : "hidden"}>
        {/* --- Page Header --- */}
        <motion.div variants={headerVariants} className='text-center mb-16'>
          <h1 className='text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight'>
            GET IN <span className='text-primary'>TOUCH</span>
          </h1>
          <p className='mt-2 text-lg text-slate-500'>We're here to help. Reach out to us with any questions.</p>
        </motion.div>

        {/* --- Main Content Grid --- */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-start'>
          {/* --- Left Side: Contact Info --- */}
          <motion.div variants={itemVariants} className='space-y-10'>
            {/* Office Info, Contact Info, Working Hours...  */}
            <div>
              <div className="flex items-center gap-4 mb-3">
                <FiMapPin className="w-6 h-6 text-primary" />
                <h3 className='text-xl font-bold text-slate-800'>Our Office</h3>
              </div>
              <p className='pl-10 text-slate-600 leading-relaxed'>
                123 Health St, Bihar<br />India
              </p>
            </div>
            <div>
              <div className="flex items-center gap-4 mb-3">
                <FiPhone className="w-6 h-6 text-primary" />
                <h3 className='text-xl font-bold text-slate-800'>Contact Details</h3>
              </div>
              <div className='pl-10 space-y-2 text-slate-600'>
                <p><strong>Phone:</strong> <a href="tel:+910000000000" className='text-primary hover:underline'>+91-000-000-0000</a></p>
                <p><strong>Email:</strong> <a href="mailto:contactdocspot@gmail.com" className='text-primary hover:underline'>contactdocspot@gmail.com</a></p>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-4 mb-3">
                <FiClock className="w-6 h-6 text-primary" />
                <h3 className='text-xl font-bold text-slate-800'>Working Hours</h3>
              </div>
              <div className='pl-10 space-y-1 text-slate-600'>
                <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
                <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM</p>
                <p><strong>Sunday:</strong> Closed</p>
              </div>
            </div>

            {/* --- Support Availability Status --- */}
            <div>
              <div className="flex items-center gap-4 mb-3">
                <div className="relative flex items-center justify-center">
                  <span className={`absolute w-6 h-6 ${supportStatus.isOpen ? 'bg-green-500/30' : 'bg-red-500/30'} rounded-full animate-ping`}></span>
                  <span className={`relative w-3 h-3 ${supportStatus.isOpen ? 'bg-green-500' : 'bg-red-500'} rounded-full`}></span>
                </div>
                <h3 className='text-xl font-bold text-slate-800'>Support Availability</h3>
              </div>
              <div className='pl-10 space-y-1 text-slate-600'>
                <p className={`font-semibold ${supportStatus.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                  {supportStatus.message}
                </p>
                {supportStatus.nextOpenTime && (
                  <p className="text-sm">{supportStatus.nextOpenTime}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* --- Right Side: Interactive Map & Socials --- */}
          <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }} className="bg-white p-6 rounded-xl shadow-lg space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4 text-center">Our Location</h3>
              <div className="aspect-video rounded-lg overflow-hidden border-2 border-slate-200">
                {/* Google Map */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3689.851963950105!2d85.3239!3d25.5941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed5854ab35ab0d%3A0x2523234b54f8569!2sPatna%2C%20Bihar!5e0!3m2!1sen!2sin!4v1678886555555!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade">
                </iframe>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Follow Us</h3>
              <div className="flex justify-center gap-6">
                <motion.a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={socialIconVariants}
                  whileHover="hover"
                  className="p-3 bg-slate-100 rounded-full text-slate-700 hover:bg-primary hover:text-white transition-colors duration-300"
                >
                  <FiFacebook size={24} />
                </motion.a>
                <motion.a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={socialIconVariants}
                  whileHover="hover"
                  className="p-3 bg-slate-100 rounded-full text-slate-700 hover:bg-primary hover:text-white transition-colors duration-300"
                >
                  <FiTwitter size={24} />
                </motion.a>
                <motion.a
                  href="https://www.linkedin.com/in/vikaxkr"
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={socialIconVariants}
                  whileHover="hover"
                  className="p-3 bg-slate-100 rounded-full text-slate-700 hover:bg-primary hover:text-white transition-colors duration-300"
                >
                  <FiLinkedin size={24} />
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;