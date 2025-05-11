// AJA_Interview_Track\aja-interview-track\src\components\LandingPage\LandingPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaMicrophone, 
  FaUserCheck, 
  FaHandshake, 
  FaRocket,
  FaQuoteLeft,
  FaJava,
  FaPython,
  FaMicrosoft,
  FaServer,
  FaSalesforce,
  FaPalette,
  FaVial
} from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';
import styles from './LandingPage.module.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const techStack = [
    { name: 'Java', icon: <FaJava size={32} />, color: '#5382a1' },
    { name: 'Python', icon: <FaPython size={32} />, color: '#3776ab' },
    { name: '.NET', icon: <FaMicrosoft size={32} />, color: '#512bd4' },
    { name: 'DevOps', icon: <FaServer size={32} />, color: '#2496ed' },
    { name: 'SalesForce', icon: <FaSalesforce size={32} />, color: '#00a1e0' },
    { name: 'UI Development', icon: <FaPalette size={32} />, color: '#6f42c1' },
    { name: 'Testing', icon: <FaVial size={32} />, color: '#e83e8c' }
  ];

  const processSteps = [
    {
      title: "Mock Interviews",
      description: "Delivery team conducts assessments to evaluate your readiness",
      icon: <FaMicrophone size={24} />,
      color: '#4361ee'
    },
    {
      title: "Profile Shortlisting",
      description: "Top performers are forwarded to sales team for client matching",
      icon: <FaUserCheck size={24} />,
      color: '#3a0ca3'
    },
    {
      title: "Client Interviews",
      description: "Multiple interview levels tailored to client requirements",
      icon: <FaHandshake size={24} />,
      color: '#7209b7'
    },
    {
      title: "Deployment",
      description: "FTE, Contract, or Hybrid placement based on client needs",
      icon: <FaRocket size={24} />,
      color: '#f72585'
    }
  ];

  const testimonials = [
    {
      quote: "The AJA preparation track helped me transition from mock interviews to FTE placement in just 3 months!",
      author: "Sarah Johnson",
      role: "Java Developer at TechCorp",
      avatar: "/images/avatar1.jpg"
    },
    {
      quote: "I went through 5 client interviews before landing my dream job. The AJA team supported me through every step.",
      author: "Michael Chen",
      role: "Python Developer at DataSystems",
      avatar: "/images/avatar2.jpg"
    },
    {
      quote: "The technical training and mock interviews were exactly what I needed to boost my confidence.",
      author: "Priya Patel",
      role: ".NET Developer at FinTech Solutions",
      avatar: "/images/avatar3.jpg"
    }
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <motion.div 
      className={styles.container}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Section */}
      <section id="home" className={styles.hero}>
        <motion.div className={styles.heroContent} variants={itemVariants}>
          <motion.p 
            className={styles.heroBadge}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <span>🚀</span> Transform Your Career
          </motion.p>
          <h1 className={styles.heroTitle}>
            Ace Your <span className={styles.highlight}>Technical</span> Interviews
          </h1>
          <p className={styles.heroSubtitle}>
            AJA's comprehensive preparation track bridges the gap between your skills 
            and client requirements with personalized coaching and real-world practice.
          </p>
          <div className={styles.ctaButtons}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={styles.primaryButton}
              onClick={() => navigate('/login', { state: { from: 'landing' } })}
            >
              Get Started <FiArrowRight />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={styles.secondaryButton}
              onClick={() => scrollToSection('process')}
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>
        <motion.div 
          className={styles.heroImage}
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <img src="/images/interview.png" alt="Interview Preparation" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.statsContainer}>
          <motion.div 
            className={styles.statCard}
            whileHover={{ y: -5 }}
          >
            <h3>150+</h3>
            <p>Professionals Trained</p>
          </motion.div>
          <motion.div 
            className={styles.statCard}
            whileHover={{ y: -5 }}
          >
            <h3>95%</h3>
            <p>Success Rate</p>
          </motion.div>
          <motion.div 
            className={styles.statCard}
            whileHover={{ y: -5 }}
          >
            <h3>50+</h3>
            <p>Client Companies</p>
          </motion.div>
          <motion.div 
            className={styles.statCard}
            whileHover={{ y: -5 }}
          >
            <h3>3.5</h3>
            <p>Avg. Months to Placement</p>
          </motion.div>
        </div>
      </section>

      {/* Process Overview */}
      <section id="process" className={styles.section}>
        <div className={styles.sectionInner}>
          <motion.div className={styles.sectionHeader} variants={fadeIn}>
            <p className={styles.sectionSubtitle}>Our Proven Process</p>
            <motion.h2 className={styles.sectionTitle}>
              From <span className={styles.highlight}>Preparation</span> to Placement
            </motion.h2>
          </motion.div>
          <div className={styles.processContainer}>
            {processSteps.map((step, index) => (
              <motion.div 
                key={index}
                className={styles.processCard}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                style={{ borderTop: `4px solid ${step.color}` }}
              >
                <div className={styles.processIcon} style={{ color: step.color }}>
                  {step.icon}
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <span className={styles.stepNumber}>0{index + 1}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section id="technologies" className={styles.sectionDark}>
        <div className={styles.sectionInner}>
          <motion.div className={styles.sectionHeader} variants={fadeIn}>
            <p className={styles.sectionSubtitleLight}>Our Expertise</p>
            <motion.h2 className={styles.sectionTitleLight}>
              Technology <span className={styles.highlightLight}>Specializations</span>
            </motion.h2>
          </motion.div>
          <div className={styles.techGrid}>
            {techStack.map((tech, index) => (
              <motion.div 
                key={tech.name}
                className={styles.techCard}
                variants={itemVariants}
                whileHover={{ 
                  y: -5,
                  boxShadow: `0 10px 20px rgba(${hexToRgb(tech.color)}, 0.2)`
                }}
                style={{ borderTop: `3px solid ${tech.color}` }}
              >
                <div className={styles.techIcon} style={{ color: tech.color }}>
                  {tech.icon}
                </div>
                <h3>{tech.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className={styles.section}>
        <div className={styles.sectionInner}>
          <motion.div className={styles.sectionHeader} variants={fadeIn}>
            <p className={styles.sectionSubtitle}>Success Stories</p>
            <motion.h2 className={styles.sectionTitle}>
              What Our <span className={styles.highlight}>Candidates</span> Say
            </motion.h2>
          </motion.div>
          <div className={styles.testimonialWrapper}>
            <AnimatePresence mode="wait">
              {testimonials.map((testimonial, index) => (
                <motion.div 
                  key={index}
                  className={styles.testimonialCard}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <FaQuoteLeft className={styles.quoteIcon} />
                  <p className={styles.testimonialText}>{testimonial.quote}</p>
                  <div className={styles.testimonialAuthor}>
                    <div className={styles.authorAvatar}>
                      <img src={testimonial.avatar} alt={testimonial.author} />
                    </div>
                    <div className={styles.authorInfo}>
                      <h4>{testimonial.author}</h4>
                      <p>{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <motion.h2 
            className={styles.ctaTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Ready to <span>Accelerate</span> Your Career?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join 150+ AJA professionals in their journey to client placements
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={styles.ctaButton}
            onClick={() => navigate('/register')}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Register Now <FiArrowRight />
          </motion.button>
        </div>
      </section>
    </motion.div>
  );
};

// Helper function to convert hex to rgb
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

export default LandingPage;