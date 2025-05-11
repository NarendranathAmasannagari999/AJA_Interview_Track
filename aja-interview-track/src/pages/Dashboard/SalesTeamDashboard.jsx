import React, { useState, useEffect } from 'react';
import { FiUsers, FiCalendar, FiFileText, FiCheck, FiX, FiSend, FiDollarSign } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import styles from './Dashboard.module.css';

const SalesTeamDashboard = () => {
  const [activeTab, setActiveTab] = useState('profiles');
  const [candidates, setCandidates] = useState([]);
  const [clientInterviews, setClientInterviews] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedClient, setSelectedClient] = useState('');
  const [jd, setJd] = useState('');

  useEffect(() => {
    // Mock data - in real app, this would come from API
    setCandidates([
      { 
        id: 1, 
        name: 'John Doe', 
        skill: 'Java', 
        level: 'Intermediate', 
        mockScore: 4.2,
        status: 'profile_received',
        resume: 'John_Doe_Java.pdf'
      },
      { 
        id: 2, 
        name: 'Jane Smith', 
        skill: 'Python', 
        level: 'Senior', 
        mockScore: 4.5,
        status: 'resume_sent',
        resume: 'Jane_Smith_Python.pdf'
      },
      { 
        id: 3, 
        name: 'Mike Johnson', 
        skill: '.NET', 
        level: 'Junior', 
        mockScore: 3.8,
        status: 'interview_scheduled',
        resume: 'Mike_Johnson_NET.pdf'
      },
      { 
        id: 4, 
        name: 'Sarah Williams', 
        skill: 'DevOps', 
        level: 'Intermediate', 
        mockScore: 4.0,
        status: 'hired',
        resume: 'Sarah_Williams_DevOps.pdf'
      }
    ]);

    setClientInterviews([
      { 
        id: 1, 
        candidateId: 1, 
        candidateName: 'John Doe', 
        client: 'Tech Corp', 
        date: '2023-05-25', 
        level: 1, 
        status: 'scheduled',
        jd: 'Java Developer Position'
      },
      { 
        id: 2, 
        candidateId: 3, 
        candidateName: 'Mike Johnson', 
        client: 'Data Systems', 
        date: '2023-05-28', 
        level: 2, 
        status: 'completed',
        result: 'passed',
        jd: '.NET Engineer'
      }
    ]);

    setClients([
      { id: 1, name: 'Tech Corp', contact: 'hr@techcorp.com', activePositions: 5 },
      { id: 2, name: 'Data Systems', contact: 'recruiting@datasystems.com', activePositions: 3 },
      { id: 3, name: 'Cloud Solutions', contact: 'hiring@cloudsolutions.com', activePositions: 2 }
    ]);
  }, []);

  const conversionData = [
    { name: 'Hired', value: 65 },
    { name: 'In Process', value: 20 },
    { name: 'Rejected', value: 15 }
  ];

  const revenueData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Apr', revenue: 6000 },
    { name: 'May', revenue: 4500 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profiles':
        return (
          <div className={styles.profilesSection}>
            <div className={styles.profileFilters}>
              <select>
                <option>All Skills</option>
                <option>Java</option>
                <option>Python</option>
                <option>.NET</option>
                <option>DevOps</option>
              </select>
              <select>
                <option>All Statuses</option>
                <option>Profile Received</option>
                <option>Resume Sent</option>
                <option>Interview Scheduled</option>
                <option>Hired</option>
              </select>
            </div>
            
            <div className={styles.profileList}>
              {candidates.map(candidate => (
                <motion.div 
                  key={candidate.id} 
                  className={styles.profileCard}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setSelectedCandidate(candidate)}
                >
                  <div className={styles.profileHeader}>
                    <h4>{candidate.name}</h4>
                    <span className={`${styles.status} ${styles[candidate.status]}`}>
                      {candidate.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p><strong>Skill:</strong> {candidate.skill} ({candidate.level})</p>
                  <p><strong>Mock Score:</strong> {candidate.mockScore}/5.0</p>
                  <div className={styles.profileActions}>
                    <button className={styles.iconButton}>
                      <FiFileText /> Resume
                    </button>
                    {candidate.status === 'profile_received' && (
                      <button 
                        className={styles.successButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          // In real app, this would update status
                          alert(`Resume of ${candidate.name} sent to clients`);
                        }}
                      >
                        <FiSend /> Send to Client
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      case 'interviews':
        return (
          <div className={styles.interviewsSection}>
            <h3>Client Interviews</h3>
            <div className={styles.interviewList}>
              {clientInterviews.map(interview => (
                <motion.div 
                  key={interview.id} 
                  className={styles.interviewCard}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className={styles.interviewHeader}>
                    <h4>{interview.client} - {interview.candidateName}</h4>
                    <span className={`${styles.status} ${styles[interview.status]}`}>
                      {interview.status}
                    </span>
                  </div>
                  <p><strong>Date:</strong> {interview.date}</p>
                  <p><strong>Level:</strong> {interview.level}</p>
                  <p><strong>For JD:</strong> {interview.jd}</p>
                  
                  {interview.result && (
                    <p className={styles[interview.result]}>
                      <strong>Result:</strong> {interview.result}
                    </p>
                  )}
                  
                  <div className={styles.interviewActions}>
                    {interview.status === 'scheduled' && (
                      <>
                        <button className={styles.primaryButton}>
                          Confirm
                        </button>
                        <button className={styles.secondaryButton}>
                          Reschedule
                        </button>
                      </>
                    )}
                    
                    {interview.status === 'completed' && (
                      <button 
                        className={interview.result === 'passed' ? styles.successButton : styles.dangerButton}
                        onClick={() => {
                          // In real app, this would update candidate status
                          alert(`Candidate ${interview.candidateName} marked as hired`);
                        }}
                      >
                        {interview.result === 'passed' ? 'Mark as Hired' : 'Rejected'}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      case 'clients':
        return (
          <div className={styles.clientsSection}>
            <div className={styles.clientList}>
              {clients.map(client => (
                <motion.div 
                  key={client.id} 
                  className={styles.clientCard}
                  whileHover={{ scale: 1.02 }}
                >
                  <h4>{client.name}</h4>
                  <p><strong>Contact:</strong> {client.contact}</p>
                  <p><strong>Active Positions:</strong> {client.activePositions}</p>
                  <div className={styles.clientActions}>
                    <button 
                      className={styles.primaryButton}
                      onClick={() => {
                        setSelectedClient(client.name);
                        setJd('');
                      }}
                    >
                      Add JD
                    </button>
                    <button className={styles.secondaryButton}>
                      View Positions
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className={styles.reportsSection}>
            <div className={styles.chartRow}>
              <div className={styles.chartContainer}>
                <h4>Conversion Rate</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={conversionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {conversionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className={styles.chartContainer}>
                <h4>Monthly Revenue</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#8884d8" name="Revenue ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <h5>Total Placements</h5>
                <p className={styles.statValue}>42</p>
                <p className={styles.statLabel}>This Year</p>
              </div>
              <div className={styles.statCard}>
                <h5>Active Clients</h5>
                <p className={styles.statValue}>15</p>
                <p className={styles.statLabel}>Companies</p>
              </div>
              <div className={styles.statCard}>
                <h5>Revenue</h5>
                <p className={styles.statValue}>$125,000</p>
                <p className={styles.statLabel}>YTD</p>
              </div>
              <div className={styles.statCard}>
                <h5>Conversion Rate</h5>
                <p className={styles.statValue}>65%</p>
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
        <h2>Sales Team Dashboard</h2>
        <div className={styles.teamStats}>
          <span><FiUsers /> {candidates.length} Candidates</span>
          <span><FiCheck /> {candidates.filter(c => c.status === 'hired').length} Hired</span>
          <span><FiDollarSign /> $125K Revenue</span>
        </div>
      </div>
      
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'profiles' ? styles.active : ''}`}
          onClick={() => setActiveTab('profiles')}
        >
          Candidate Profiles
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'interviews' ? styles.active : ''}`}
          onClick={() => setActiveTab('interviews')}
        >
          Client Interviews
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'clients' ? styles.active : ''}`}
          onClick={() => setActiveTab('clients')}
        >
          Clients
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'reports' ? styles.active : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          Reports
        </button>
      </div>
      
      <div className={styles.tabContent}>
        {renderTabContent()}
      </div>
      
      {selectedCandidate && (
        <div className={styles.modal}>
          <motion.div 
            className={styles.modalContent}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <h3>{selectedCandidate.name}'s Profile</h3>
            <div className={styles.profileDetails}>
              <p><strong>Skill:</strong> {selectedCandidate.skill}</p>
              <p><strong>Level:</strong> {selectedCandidate.level}</p>
              <p><strong>Mock Interview Score:</strong> {selectedCandidate.mockScore}/5.0</p>
              <p><strong>Status:</strong> <span className={styles[selectedCandidate.status]}>{selectedCandidate.status.replace('_', ' ')}</span></p>
              
              <div className={styles.resumeSection}>
                <h4>Resume</h4>
                <div className={styles.resumePreview}>
                  <FiFileText size={48} />
                  <p>{selectedCandidate.resume}</p>
                  <button className={styles.primaryButton}>
                    Download Resume
                  </button>
                </div>
              </div>
              
              <div className={styles.clientSelection}>
                <h4>Send to Client</h4>
                <select 
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                >
                  <option value="">Select Client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.name}>{client.name}</option>
                  ))}
                </select>
                
                {selectedClient && (
                  <div className={styles.jdSection}>
                    <h5>Job Description</h5>
                    <textarea 
                      placeholder="Paste job description here..."
                      value={jd}
                      onChange={(e) => setJd(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className={styles.modalActions}>
              <button 
                className={styles.successButton}
                disabled={!selectedClient || !jd}
                onClick={() => {
                  // In real app, this would send to client
                  alert(`Profile of ${selectedCandidate.name} sent to ${selectedClient}`);
                  setSelectedCandidate(null);
                  setSelectedClient('');
                  setJd('');
                }}
              >
                <FiSend /> Send to Client
              </button>
              <button 
                className={styles.secondaryButton}
                onClick={() => setSelectedCandidate(null)}
              >
                <FiX /> Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {selectedClient && !selectedCandidate && (
        <div className={styles.modal}>
          <motion.div 
            className={styles.modalContent}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <h3>Add Job Description for {selectedClient}</h3>
            <div className={styles.jdForm}>
              <div className={styles.formGroup}>
                <label>Job Title</label>
                <input type="text" placeholder="e.g., Senior Java Developer" />
              </div>
              
              <div className={styles.formGroup}>
                <label>Required Skills</label>
                <input type="text" placeholder="e.g., Java, Spring Boot, Microservices" />
              </div>
              
              <div className={styles.formGroup}>
                <label>Experience Level</label>
                <select>
                  <option>Junior</option>
                  <option>Intermediate</option>
                  <option>Senior</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label>Job Description</label>
                <textarea 
                  placeholder="Detailed job description..."
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                />
              </div>
            </div>
            
            <div className={styles.modalActions}>
              <button 
                className={styles.primaryButton}
                disabled={!jd}
                onClick={() => {
                  // In real app, this would save JD
                  alert(`Job description added for ${selectedClient}`);
                  setSelectedClient('');
                  setJd('');
                }}
              >
                Save JD
              </button>
              <button 
                className={styles.secondaryButton}
                onClick={() => setSelectedClient('')}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SalesTeamDashboard;