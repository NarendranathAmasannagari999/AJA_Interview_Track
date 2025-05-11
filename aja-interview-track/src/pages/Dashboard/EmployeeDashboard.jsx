import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFileText, FiUpload, FiClock, FiCheckCircle, FiXCircle, FiUser } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './Dashboard.module.css';

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState('jd');
  const [jobDescriptions, setJobDescriptions] = useState([]);
  const [mockInterviews, setMockInterviews] = useState([]);
  const [clientInterviews, setClientInterviews] = useState([]);
  const [resumeStatus, setResumeStatus] = useState('pending');
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  // Mock data - in real app, this would come from API
  useEffect(() => {
    setJobDescriptions([
      { id: 1, title: 'Java Developer', client: 'Tech Corp', received: '2023-05-10', deadline: '2023-05-20' },
      { id: 2, title: 'Senior Python Engineer', client: 'Data Systems', received: '2023-05-12', deadline: '2023-05-22' }
    ]);

    setMockInterviews([
      { id: 1, date: '2023-05-15', interviewer: 'John Doe', score: 4.2, status: 'completed', feedback: 'Good technical skills but need improvement in system design' },
      { id: 2, date: '2023-05-18', interviewer: 'Jane Smith', score: 3.8, status: 'scheduled' }
    ]);

    setClientInterviews([
      { id: 1, client: 'Tech Corp', date: '2023-05-25', level: 1, status: 'scheduled', jd: 'Java Developer' },
      { id: 2, client: 'Data Systems', date: '2023-05-28', level: 2, status: 'pending', jd: 'Senior Python Engineer' }
    ]);
  }, []);

  const performanceData = [
    { name: 'Technical', score: 85 },
    { name: 'Communication', score: 75 },
    { name: 'Problem Solving', score: 90 },
    { name: 'System Design', score: 70 }
  ];

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    // In real app, upload to server
    setTimeout(() => setResumeStatus('submitted'), 1000);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'jd':
        return (
          <div className={styles.cardGrid}>
            {jobDescriptions.map(jd => (
              <motion.div 
                key={jd.id} 
                className={styles.card}
                whileHover={{ scale: 1.02 }}
              >
                <h3>{jd.title}</h3>
                <p><strong>Client:</strong> {jd.client}</p>
                <p><strong>Received:</strong> {jd.received}</p>
                <p><strong>Deadline:</strong> {jd.deadline}</p>
                <button 
                  className={styles.primaryButton}
                  onClick={() => setActiveTab('resume')}
                >
                  Prepare Resume
                </button>
              </motion.div>
            ))}
          </div>
        );
      case 'resume':
        return (
          <div className={styles.resumeSection}>
            <h3>Resume Preparation</h3>
            <div className={styles.statusCard}>
              <div className={`${styles.statusIndicator} ${styles[resumeStatus]}`}>
                {resumeStatus === 'pending' && <FiClock size={24} />}
                {resumeStatus === 'submitted' && <FiCheckCircle size={24} />}
                {resumeStatus === 'rejected' && <FiXCircle size={24} />}
                <span>{resumeStatus.charAt(0).toUpperCase() + resumeStatus.slice(1)}</span>
              </div>
              
              {resumeStatus === 'pending' && (
                <div className={styles.uploadArea}>
                  <FiFileText size={48} />
                  <p>Upload your resume tailored to the job description</p>
                  <input 
                    type="file" 
                    id="resumeUpload" 
                    onChange={handleFileChange} 
                    accept=".pdf,.doc,.docx" 
                  />
                  <label htmlFor="resumeUpload" className={styles.uploadButton}>
                    <FiUpload /> Select File
                  </label>
                </div>
              )}
              
              {resumeStatus === 'submitted' && (
                <div className={styles.submissionDetails}>
                  <p>Your resume has been submitted to the sales team for review.</p>
                  <p>You will be notified when it's sent to clients.</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'interviews':
        return (
          <div className={styles.interviewSection}>
            <div className={styles.interviewTabs}>
              <button 
                className={`${styles.tabButton} ${activeTab === 'mock' ? styles.active : ''}`}
                onClick={() => setActiveTab('mock')}
              >
                Mock Interviews
              </button>
              <button 
                className={`${styles.tabButton} ${activeTab === 'client' ? styles.active : ''}`}
                onClick={() => setActiveTab('client')}
              >
                Client Interviews
              </button>
            </div>
            
            {activeTab === 'mock' ? (
              <div className={styles.interviewList}>
                {mockInterviews.map(interview => (
                  <motion.div 
                    key={interview.id} 
                    className={styles.interviewCard}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className={styles.interviewHeader}>
                      <h4>Interview with {interview.interviewer}</h4>
                      <span className={`${styles.status} ${styles[interview.status]}`}>
                        {interview.status}
                      </span>
                    </div>
                    <p><strong>Date:</strong> {interview.date}</p>
                    {interview.score && <p><strong>Score:</strong> {interview.score}/5</p>}
                    {interview.feedback && (
                      <div className={styles.feedback}>
                        <strong>Feedback:</strong>
                        <p>{interview.feedback}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className={styles.interviewList}>
                {clientInterviews.map(interview => (
                  <motion.div 
                    key={interview.id} 
                    className={styles.interviewCard}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className={styles.interviewHeader}>
                      <h4>{interview.client} - Level {interview.level}</h4>
                      <span className={`${styles.status} ${styles[interview.status]}`}>
                        {interview.status}
                      </span>
                    </div>
                    <p><strong>Date:</strong> {interview.date}</p>
                    <p><strong>For JD:</strong> {interview.jd}</p>
                    {interview.status === 'scheduled' && (
                      <button className={styles.primaryButton}>
                        Join Interview
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        );
      case 'performance':
        return (
          <div className={styles.performanceSection}>
            <div className={styles.chartContainer}>
              <h4>Skills Assessment</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="#8884d8" name="Score (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <h5>Mock Interviews</h5>
                <p className={styles.statValue}>8</p>
                <p className={styles.statLabel}>Completed</p>
              </div>
              <div className={styles.statCard}>
                <h5>Average Score</h5>
                <p className={styles.statValue}>4.1</p>
                <p className={styles.statLabel}>/ 5.0</p>
              </div>
              <div className={styles.statCard}>
                <h5>Client Interviews</h5>
                <p className={styles.statValue}>5</p>
                <p className={styles.statLabel}>Attended</p>
              </div>
              <div className={styles.statCard}>
                <h5>Conversion Rate</h5>
                <p className={styles.statValue}>60%</p>
                <p className={styles.statLabel}>Success</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h2>Employee Dashboard</h2>
        <div className={styles.userProfile}>
          <FiUser size={20} />
          <span>John Doe (Java Developer)</span>
        </div>
      </div>
      
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'jd' ? styles.active : ''}`}
          onClick={() => setActiveTab('jd')}
        >
          Job Descriptions
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'resume' ? styles.active : ''}`}
          onClick={() => setActiveTab('resume')}
        >
          Resume Preparation
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'interviews' ? styles.active : ''}`}
          onClick={() => setActiveTab('interviews')}
        >
          Interviews
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'performance' ? styles.active : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          Performance
        </button>
      </div>
      
      <div className={styles.tabContent}>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default EmployeeDashboard;