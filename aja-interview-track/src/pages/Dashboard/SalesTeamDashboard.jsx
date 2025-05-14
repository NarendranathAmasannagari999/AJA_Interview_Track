import React, { useState, useEffect } from 'react';
import { 
  FiUsers, FiCalendar, FiFileText, FiCheck, FiX, FiSend, 
  FiDollarSign, FiFilter, FiSearch, FiChevronDown, FiChevronUp,
  FiBarChart2, FiPieChart, FiUpload, FiDownload, FiMessageSquare,
  FiMail, FiUserPlus, FiBriefcase, FiAward, FiClock, FiLayers,
  FiBook, FiUserCheck, FiUserX, FiShare2, FiToggleLeft, FiToggleRight
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import styles from './sales.module.css';

const SalesTeamDashboard = () => {
  // Main state
  const [activeTab, setActiveTab] = useState('jds');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedJD, setSelectedJD] = useState(null);
  const [sendFeedback, setSendFeedback] = useState(false);
  
  // Filter states
  const [filterTech, setFilterTech] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterResourceType, setFilterResourceType] = useState('all');
  const [filterInterviewLevel, setFilterInterviewLevel] = useState('all');
  
  // Data states
  const [candidates, setCandidates] = useState([]);
  const [clientInterviews, setClientInterviews] = useState([]);
  const [clients, setClients] = useState([]);
  const [jobDescriptions, setJobDescriptions] = useState([]);
  const [resumePool, setResumePool] = useState([]);
  const [shortlistedCandidates, setShortlistedCandidates] = useState([]);
  
  // Deployment statistics
  const [deploymentStats, setDeploymentStats] = useState({
    profilesSent: 0,
    resumesSent: 0,
    interviewsScheduled: 0,
    deployed: 0,
    rejected: 0
  });

  // New state for interview scheduling
  const [showInterviewScheduler, setShowInterviewScheduler] = useState(false);
  const [selectedForInterview, setSelectedForInterview] = useState([]);
  const [interviewDetails, setInterviewDetails] = useState({
    level: 1,
    date: '',
    time: '',
    mode: 'virtual',
    link: '',
    location: '',
    notes: ''
  });

  // Initialize with sample data
  useEffect(() => {
    // Candidates with mock interview scores and contact info
    setCandidates([
      { 
        id: 1, 
        name: 'John Doe', 
        technology: 'Java', 
        level: 'Intermediate', 
        resourceType: 'TT',
        mockTechScore: 8,
        mockCommScore: 7,
        status: 'profile_received',
        resume: 'John_Doe_Java.pdf',
        lastUpdated: '2023-05-20',
        jdsReceived: [101],
        resumeSent: false,
        email: 'john.doe@example.com',
        phone: '555-123-4567'
      },
      { 
        id: 2, 
        name: 'Jane Smith', 
        technology: 'Python', 
        level: 'Senior',
        resourceType: 'TT',
        mockTechScore: 9,
        mockCommScore: 8,
        status: 'resume_sent',
        resume: 'Jane_Smith_Python.pdf',
        lastUpdated: '2023-05-18',
        jdsReceived: [102],
        resumeSent: true,
        email: 'jane.smith@example.com',
        phone: '555-987-6543'
      },
      { 
        id: 3, 
        name: 'Mike Johnson', 
        technology: '.NET', 
        level: 'Senior',
        resourceType: 'TT',
        mockTechScore: 7,
        mockCommScore: 6,
        status: 'resume_sent',
        resume: 'Mike_Johnson_NET.pdf',
        lastUpdated: '2023-05-19',
        jdsReceived: [103],
        resumeSent: true,
        email: 'mike.johnson@example.com',
        phone: '555-456-7890'
      }
    ]);

    // Client interviews with detailed level information
    setClientInterviews([
      { 
        id: 1, 
        candidateId: 1, 
        candidateName: 'John Doe', 
        client: 'Tech Corp', 
        jdId: 101,
        levels: [
          {
            number: 1,
            date: '2023-05-25',
            time: '14:00',
            mode: 'virtual',
            link: 'https://meet.techcorp.com/jd-interview',
            status: 'scheduled',
            techScore: null,
            commScore: null,
            feedback: '',
            notified: false
          }
        ],
        overallStatus: 'in_process',
        jd: 'Java Developer Position'
      },
      { 
        id: 2, 
        candidateId: 3, 
        candidateName: 'Mike Johnson', 
        client: 'Data Systems', 
        jdId: 103,
        levels: [
          {
            number: 1,
            date: '2023-05-20',
            time: '10:00',
            mode: 'virtual',
            link: 'https://meet.datasystems.com/interview',
            status: 'completed',
            techScore: 7,
            commScore: 6,
            feedback: 'Good technical knowledge but needs improvement in communication',
            notified: true
          },
          {
            number: 2,
            date: '2023-05-28',
            time: '15:00',
            mode: 'virtual',
            link: 'https://meet.datasystems.com/interview2',
            status: 'scheduled',
            techScore: null,
            commScore: null,
            feedback: '',
            notified: false
          }
        ],
        overallStatus: 'in_process',
        jd: '.NET Engineer'
      }
    ]);

    // Clients data
    setClients([
      { 
        id: 1, 
        name: 'Tech Corp', 
        contact: 'hr@techcorp.com', 
        activePositions: 5, 
        technologies: ['Java', 'Python', 'DevOps'],
        interviewProcess: {
          levels: 3,
          requirements: 'Technical and communication assessment at each level'
        }
      },
      { 
        id: 2, 
        name: 'Data Systems', 
        contact: 'hr@datasystems.com', 
        activePositions: 3, 
        technologies: ['.NET', 'Azure'],
        interviewProcess: {
          levels: 2,
          requirements: 'Technical assessment and client presentation'
        }
      }
    ]);

    // Job Descriptions
    setJobDescriptions([
      {
        id: 101,
        clientId: 1,
        clientName: 'Tech Corp',
        title: 'Java Developer Position',
        technology: 'Java',
        resourceType: 'TT',
        description: 'Looking for Java developer with Spring Boot experience...',
        receivedDate: '2023-05-15',
        status: 'active'
      },
      {
        id: 103,
        clientId: 2,
        clientName: 'Data Systems',
        title: '.NET Engineer',
        technology: '.NET',
        resourceType: 'TT',
        description: 'Looking for .NET developer with Azure experience...',
        receivedDate: '2023-05-16',
        status: 'active'
      }
    ]);

    // Resume pool
    setResumePool([
      {
        id: 1,
        candidateId: 1,
        candidateName: 'John Doe',
        technology: 'Java',
        resourceType: 'TT',
        fileName: 'John_Doe_Java.pdf',
        receivedDate: '2023-05-18',
        status: 'received'
      },
      {
        id: 2,
        candidateId: 3,
        candidateName: 'Mike Johnson',
        technology: '.NET',
        resourceType: 'TT',
        fileName: 'Mike_Johnson_NET.pdf',
        receivedDate: '2023-05-19',
        status: 'received'
      }
    ]);

    // Shortlisted candidates
    setShortlistedCandidates([
      {
        id: 1,
        candidateId: 1,
        candidateName: 'John Doe',
        technology: 'Java',
        resourceType: 'TT',
        status: 'shortlisted',
        jdId: 101,
        clientId: 1,
        clientName: 'Tech Corp',
        jdTitle: 'Java Developer Position'
      },
      {
        id: 2,
        candidateId: 3,
        candidateName: 'Mike Johnson',
        technology: '.NET',
        resourceType: 'TT',
        status: 'shortlisted',
        jdId: 103,
        clientId: 2,
        clientName: 'Data Systems',
        jdTitle: '.NET Engineer'
      }
    ]);

    // Deployment stats
    setDeploymentStats({
      profilesSent: 24,
      resumesSent: 18,
      interviewsScheduled: 12,
      deployed: 8,
      rejected: 4
    });
  }, []);

  // New function to handle shortlisted resumes notification
  const notifyShortlistedCandidates = (candidateIds, interviewDetails) => {
    // Update the interview status for these candidates
    const updatedInterviews = clientInterviews.map(interview => {
      if (candidateIds.includes(interview.candidateId)) {
        const updatedLevels = interview.levels.map(level => {
          if (level.number === interviewDetails.level) {
            return {
              ...level,
              date: interviewDetails.date,
              time: interviewDetails.time,
              mode: interviewDetails.mode,
              link: interviewDetails.link,
              location: interviewDetails.location,
              notified: true
            };
          }
          return level;
        });
        
        return {
          ...interview,
          levels: updatedLevels
        };
      }
      return interview;
    });

    setClientInterviews(updatedInterviews);

    // Send notification to candidates (in a real app, this would be an API call)
    candidateIds.forEach(id => {
      const candidate = candidates.find(c => c.id === id);
      if (candidate) {
        console.log(`Notification sent to ${candidate.name} at ${candidate.email}`);
        // This would be replaced with actual email/sms sending logic
      }
    });

    // Close the scheduler
    setShowInterviewScheduler(false);
    setSelectedForInterview([]);
    setInterviewDetails({
      level: 1,
      date: '',
      time: '',
      mode: 'virtual',
      link: '',
      location: '',
      notes: ''
    });
  };

  // New function to open the interview scheduler
  const openInterviewScheduler = (candidateIds) => {
    setSelectedForInterview(candidateIds);
    setShowInterviewScheduler(true);
  };

  // Filter functions
  const filterCandidates = (candidates) => {
    return candidates.filter(candidate => {
      const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          candidate.technology.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTech = filterTech === 'all' || candidate.technology === filterTech;
      const matchesStatus = filterStatus === 'all' || candidate.status === filterStatus;
      const matchesResourceType = filterResourceType === 'all' || candidate.resourceType === filterResourceType;
      
      return matchesSearch && matchesTech && matchesStatus && matchesResourceType;
    });
  };

  const filterInterviews = (interviews) => {
    return interviews.filter(interview => {
      const matchesSearch = interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          interview.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          interview.jd.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = filterInterviewLevel === 'all' || 
                         interview.levels.some(level => level.number.toString() === filterInterviewLevel);
      
      return matchesSearch && matchesLevel;
    });
  };

  // Tab components
  const JDTab = () => {
    const filteredJDs = jobDescriptions.filter(jd => 
      jd.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jd.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={styles.contentSection}
      >
        <div className={styles.filterSection}>
          <div className={styles.searchBox}>
            <FiSearch className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search JDs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <button 
            className={`${styles.button} ${styles.primary}`}
            onClick={() => setSelectedJD('new')}
          >
            <FiFileText /> Add New JD
          </button>
        </div>

        {filteredJDs.length > 0 ? (
          <div className={styles.cardGrid}>
            {filteredJDs.map(jd => (
              <motion.div
                key={jd.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={styles.jdCard}
                onClick={() => setSelectedJD(jd)}
              >
                <div className={styles.jdHeader}>
                  <h3 className={styles.jdTitle}>{jd.title}</h3>
                  <span className={styles.jdClient}>{jd.clientName}</span>
                </div>

                <div className={styles.jdDetails}>
                  <p>
                    <strong>Technology:</strong> 
                    <span className={`${styles.techBadge} ${styles[jd.technology.toLowerCase()]}`}>
                      {jd.technology}
                    </span>
                    <span className={`${styles.resourceBadge} ${styles[jd.resourceType.toLowerCase()]}`}>
                      {jd.resourceType}
                    </span>
                  </p>
                  <p><strong>Received:</strong> {jd.receivedDate}</p>
                  <p><strong>Status:</strong> 
                    <span className={`${styles.statusBadge} ${styles[jd.status]}`}>
                      {jd.status}
                    </span>
                  </p>
                </div>

                <div className={styles.jdActions}>
                  <button 
                    className={`${styles.button} ${styles.primary}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Open JD sharing modal
                    }}
                  >
                    <FiShare2 /> Share JD
                  </button>
                  <button className={`${styles.button} ${styles.secondary}`}>
                    <FiUsers /> View Candidates
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <FiBook size={48} />
            <h4>No Job Descriptions found</h4>
            <p>Add new JDs received from clients or adjust your search.</p>
          </div>
        )}
      </motion.div>
    );
  };

  const ResumePoolTab = () => {
    const filteredResumes = resumePool.filter(resume => 
      resume.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.technology.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={styles.contentSection}
      >
        <div className={styles.filterSection}>
          <div className={styles.searchBox}>
            <FiSearch className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search resumes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <button 
            className={`${styles.button} ${styles.primary}`}
            onClick={() => {/* Open bulk upload modal */}}
          >
            <FiUpload /> Bulk Upload
          </button>
        </div>

        {filteredResumes.length > 0 ? (
          <div className={styles.tableContainer}>
            <table className={styles.resumeTable}>
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Technology</th>
                  <th>Resource Type</th>
                  <th>Received</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResumes.map(resume => (
                  <tr key={resume.id}>
                    <td>{resume.candidateName}</td>
                    <td>
                      <span className={`${styles.techBadge} ${styles[resume.technology.toLowerCase()]}`}>
                        {resume.technology}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.resourceBadge} ${styles[resume.resourceType.toLowerCase()]}`}>
                        {resume.resourceType}
                      </span>
                    </td>
                    <td>{resume.receivedDate}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[resume.status]}`}>
                        {resume.status}
                      </span>
                    </td>
                    <td>
                      <button className={`${styles.button} ${styles.small}`}>
                        <FiDownload /> Download
                      </button>
                      <button className={`${styles.button} ${styles.small} ${styles.primary}`}>
                        <FiCheck /> Shortlist
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <FiUpload size={48} />
            <h4>No resumes in pool</h4>
            <p>Upload resumes received from candidates or adjust your search.</p>
          </div>
        )}
      </motion.div>
    );
  };

  const ShortlistedTab = () => {
    const filteredShortlisted = shortlistedCandidates.filter(candidate => 
      candidate.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.technology.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={styles.contentSection}
      >
        <div className={styles.filterSection}>
          <div className={styles.searchBox}>
            <FiSearch className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search shortlisted..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        {filteredShortlisted.length > 0 ? (
          <div className={styles.cardGrid}>
            {filteredShortlisted.map(candidate => (
              <motion.div
                key={candidate.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={styles.profileCard}
              >
                <div className={styles.profileHeader}>
                  <h3 className={styles.profileName}>{candidate.candidateName}</h3>
                  <span className={`${styles.statusBadge} ${styles.shortlisted}`}>
                    Shortlisted
                  </span>
                </div>

                <div className={styles.profileDetails}>
                  <p>
                    <strong>Technology:</strong> 
                    <span className={`${styles.techBadge} ${styles[candidate.technology.toLowerCase()]}`}>
                      {candidate.technology}
                    </span>
                    <span className={`${styles.resourceBadge} ${styles[candidate.resourceType.toLowerCase()]}`}>
                      {candidate.resourceType}
                    </span>
                  </p>
                  <p><strong>For JD:</strong> {candidate.jdTitle}</p>
                </div>

                <div className={styles.profileActions}>
                  <button className={`${styles.button} ${styles.secondary}`}>
                    <FiFileText /> View Resume
                  </button>
                  <button 
                    className={`${styles.button} ${styles.primary}`}
                    onClick={() => openInterviewScheduler([candidate.candidateId])}
                  >
                    <FiCalendar /> Schedule Interview
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <FiUserCheck size={48} />
            <h4>No shortlisted candidates</h4>
            <p>Shortlist candidates from the resume pool to proceed with client submission.</p>
          </div>
        )}
      </motion.div>
    );
  };

  const InterviewsTab = () => {
    const filteredInterviews = filterInterviews(clientInterviews);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={styles.contentSection}
      >
        <div className={styles.filterSection}>
          <div className={styles.searchBox}>
            <FiSearch className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search interviews..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.filterGroup}>
            <label>Interview Level</label>
            <select 
              value={filterInterviewLevel} 
              onChange={(e) => setFilterInterviewLevel(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Levels</option>
              <option value="1">Level 1</option>
              <option value="2">Level 2</option>
              <option value="3">Level 3</option>
            </select>
          </div>
        </div>

        {filteredInterviews.length > 0 ? (
          <div>
            {filteredInterviews.map(interview => (
              <motion.div
                key={interview.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={styles.interviewCard}
              >
                <div className={styles.interviewHeader}>
                  <div>
                    <h4 className={styles.interviewTitle}>
                      {interview.client} - {interview.candidateName}
                    </h4>
                    <div className={styles.interviewMeta}>
                      <span><FiFileText /> {interview.jd}</span>
                      <span className={`${styles.statusBadge} ${styles[interview.overallStatus]}`}>
                        {interview.overallStatus.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.interviewLevels}>
                  {interview.levels.map(level => (
                    <div 
                      key={level.number} 
                      className={`${styles.level} ${styles[level.status]}`}
                    >
                      <div className={styles.levelHeader}>
                        <span className={styles.levelNumber}>Level {level.number}</span>
                        <span className={styles.levelDate}>{level.date} at {level.time}</span>
                        <span className={styles.levelStatus}>
                          {level.status}
                          {level.notified && <FiCheck className={styles.notifiedIcon} title="Candidate notified" />}
                        </span>
                      </div>
                      
                      {level.status === 'scheduled' && (
                        <div className={styles.levelDetails}>
                          <p><strong>Mode:</strong> {level.mode}</p>
                          {level.mode === 'virtual' && (
                            <p><strong>Link:</strong> <a href={level.link} target="_blank" rel="noopener noreferrer">{level.link}</a></p>
                          )}
                          {level.mode === 'in-person' && (
                            <p><strong>Location:</strong> {level.location}</p>
                          )}
                          {!level.notified && (
                            <button 
                              className={`${styles.button} ${styles.small} ${styles.primary}`}
                              onClick={() => openInterviewScheduler([interview.candidateId])}
                            >
                              <FiMail /> Send Schedule to Candidate
                            </button>
                          )}
                        </div>
                      )}
                      
                      {level.status === 'completed' && (
                        <div className={styles.levelDetails}>
                          <div className={styles.scoreMeter}>
                            <span>Technical: {level.techScore}/10</span>
                            <div className={styles.scoreBar}>
                              <div 
                                className={styles.scoreFill}
                                style={{ width: `${level.techScore * 10}%` }}
                              />
                            </div>
                          </div>
                          <div className={styles.scoreMeter}>
                            <span>Communication: {level.commScore}/10</span>
                            <div className={styles.scoreBar}>
                              <div 
                                className={styles.scoreFill}
                                style={{ width: `${level.commScore * 10}%` }}
                              />
                            </div>
                          </div>
                          {level.feedback && (
                            <div className={styles.feedback}>
                              <strong>Feedback:</strong> {level.feedback}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {interview.overallStatus === 'completed' && (
                  <div className={styles.interviewOutcome}>
                    <h5>Final Outcome</h5>
                    {interview.result === 'hired' ? (
                      <div className={styles.outcomeHired}>
                        <FiUserCheck /> Candidate Hired
                      </div>
                    ) : (
                      <div className={styles.outcomeRejected}>
                        <FiUserX /> Candidate Rejected
                        <FeedbackSection 
                          candidate={interview.candidateName} 
                          interview={interview} 
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className={styles.interviewActions}>
                  {interview.levels.some(l => l.status === 'scheduled') && (
                    <>
                      <button className={`${styles.button} ${styles.primary}`}>
                        Confirm Interview
                      </button>
                      <button className={`${styles.button} ${styles.secondary}`}>
                        Reschedule
                      </button>
                    </>
                  )}
                  
                  {interview.overallStatus === 'in_process' && (
                    <button className={`${styles.button} ${styles.success}`}>
                      Mark as Completed
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <FiCalendar size={48} />
            <h4>No interviews scheduled</h4>
            <p>When candidates are sent to clients, their interviews will appear here.</p>
          </div>
        )}

        {/* Interview Scheduler Modal */}
        {showInterviewScheduler && (
          <div className={styles.modalOverlay}>
            <motion.div 
              className={styles.modal}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <div className={styles.modalHeader}>
                <h3>Schedule Client Interview</h3>
                <button 
                  className={styles.closeButton}
                  onClick={() => setShowInterviewScheduler(false)}
                >
                  <FiX />
                </button>
              </div>
              
              <div className={styles.modalContent}>
                <div className={styles.formGroup}>
                  <label>Interview Level</label>
                  <select
                    value={interviewDetails.level}
                    onChange={(e) => setInterviewDetails({
                      ...interviewDetails,
                      level: parseInt(e.target.value)
                    })}
                  >
                    <option value={1}>Level 1</option>
                    <option value={2}>Level 2</option>
                    <option value={3}>Level 3</option>
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label>Date</label>
                  <input
                    type="date"
                    value={interviewDetails.date}
                    onChange={(e) => setInterviewDetails({
                      ...interviewDetails,
                      date: e.target.value
                    })}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Time</label>
                  <input
                    type="time"
                    value={interviewDetails.time}
                    onChange={(e) => setInterviewDetails({
                      ...interviewDetails,
                      time: e.target.value
                    })}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Mode</label>
                  <select
                    value={interviewDetails.mode}
                    onChange={(e) => setInterviewDetails({
                      ...interviewDetails,
                      mode: e.target.value
                    })}
                  >
                    <option value="virtual">Virtual</option>
                    <option value="in-person">In-Person</option>
                  </select>
                </div>
                
                {interviewDetails.mode === 'virtual' && (
                  <div className={styles.formGroup}>
                    <label>Meeting Link</label>
                    <input
                      type="text"
                      placeholder="https://meet.example.com/interview"
                      value={interviewDetails.link}
                      onChange={(e) => setInterviewDetails({
                        ...interviewDetails,
                        link: e.target.value
                      })}
                    />
                  </div>
                )}
                
                {interviewDetails.mode === 'in-person' && (
                  <div className={styles.formGroup}>
                    <label>Location</label>
                    <input
                      type="text"
                      placeholder="Company Address"
                      value={interviewDetails.location}
                      onChange={(e) => setInterviewDetails({
                        ...interviewDetails,
                        location: e.target.value
                      })}
                    />
                  </div>
                )}
                
                <div className={styles.formGroup}>
                  <label>Additional Notes</label>
                  <textarea
                    placeholder="Any special instructions for the candidate..."
                    value={interviewDetails.notes}
                    onChange={(e) => setInterviewDetails({
                      ...interviewDetails,
                      notes: e.target.value
                    })}
                  />
                </div>
                
                <div className={styles.modalFooter}>
                  <button 
                    className={`${styles.button} ${styles.secondary}`}
                    onClick={() => setShowInterviewScheduler(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className={`${styles.button} ${styles.primary}`}
                    onClick={() => notifyShortlistedCandidates(selectedForInterview, interviewDetails)}
                  >
                    <FiSend /> Send Schedule to Candidates
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    );
  };

  const DeploymentsTab = () => {
    const deploymentData = [
      { name: 'Profiles Sent', value: deploymentStats.profilesSent, color: '#6366F1' },
      { name: 'Resumes Sent', value: deploymentStats.resumesSent, color: '#8B5CF6' },
      { name: 'Interviews', value: deploymentStats.interviewsScheduled, color: '#EC4899' },
      { name: 'Deployed', value: deploymentStats.deployed, color: '#10B981' },
      { name: 'Rejected', value: deploymentStats.rejected, color: '#EF4444' }
    ];

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={styles.contentSection}
      >
        <div className={styles.deploymentOverview}>
          <h3>Deployment Pipeline</h3>
          
          <div className={styles.pipeline}>
            {deploymentData.map((stage, index) => (
              <motion.div 
                key={stage.name}
                className={styles.pipelineStage}
                whileHover={{ scale: 1.05 }}
              >
                <div 
                  className={styles.stageIndicator}
                  style={{ backgroundColor: stage.color }}
                />
                <div className={styles.stageContent}>
                  <div className={styles.stageName}>{stage.name}</div>
                  <div className={styles.stageValue}>{stage.value}</div>
                </div>
                {index < deploymentData.length - 1 && (
                  <div className={styles.stageConnector} />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className={styles.chartGrid}>
          <div className={styles.chartContainer}>
            <h4>Deployment Conversion</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deploymentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {deploymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.chartContainer}>
            <h4>Monthly Placements</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { name: 'Jan', deployed: 5, rejected: 2 },
                  { name: 'Feb', deployed: 8, rejected: 3 },
                  { name: 'Mar', deployed: 12, rejected: 4 },
                  { name: 'Apr', deployed: 10, rejected: 3 },
                  { name: 'May', deployed: 7, rejected: 1 }
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="deployed" fill="#10B981" name="Deployed" />
                <Bar dataKey="rejected" fill="#EF4444" name="Rejected" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.techPlacementContainer}>
          <h4>Placements by Technology</h4>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={[
                { name: 'Java', deployed: 15, rejected: 5 },
                { name: 'Python', deployed: 12, rejected: 4 },
                { name: '.NET', deployed: 8, rejected: 3 },
                { name: 'DevOps', deployed: 10, rejected: 2 },
                { name: 'SalesForce', deployed: 5, rejected: 2 },
                { name: 'UI', deployed: 7, rejected: 3 },
                { name: 'Testing', deployed: 3, rejected: 1 }
              ]}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Legend />
              <Bar dataKey="deployed" fill="#10B981" name="Deployed" />
              <Bar dataKey="rejected" fill="#EF4444" name="Rejected" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    );
  };

  const FeedbackSection = ({ candidate, interview }) => {
    const [techScore, setTechScore] = useState(0);
    const [commScore, setCommScore] = useState(0);
    const [feedback, setFeedback] = useState('');

    return (
      <div className={styles.feedbackForm}>
        <div className={styles.feedbackToggle}>
          <span>Send feedback to candidate</span>
          <label className={styles.toggleSwitch}>
            <input 
              type="checkbox" 
              checked={sendFeedback}
              onChange={() => setSendFeedback(!sendFeedback)}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        {sendFeedback && (
          <div className={styles.feedbackFields}>
            <div className={styles.scoreInput}>
              <label>Technical Score (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={techScore}
                onChange={(e) => setTechScore(e.target.value)}
              />
            </div>
            
            <div className={styles.scoreInput}>
              <label>Communication Score (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={commScore}
                onChange={(e) => setCommScore(e.target.value)}
              />
            </div>
            
            <div className={styles.feedbackInput}>
              <label>Detailed Feedback</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide constructive feedback for the candidate..."
              />
            </div>
            
            <button 
              className={`${styles.button} ${styles.primary}`}
              onClick={() => {
                // Save feedback
                alert(`Feedback sent to ${candidate}`);
                setSendFeedback(false);
              }}
            >
              Send Feedback
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'jds':
        return <JDTab />;
      case 'resumePool':
        return <ResumePoolTab />;
      case 'shortlisted':
        return <ShortlistedTab />;
      case 'interviews':
        return <InterviewsTab />;
      case 'deployments':
        return <DeploymentsTab />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.headerTitle}>
          <FiBriefcase /> AJA Sales Team Dashboard
        </h1>
        <div className={styles.headerStats}>
          <div className={styles.statBadge}>
            <FiUsers /> <span>{candidates.length}</span> Candidates
          </div>
          <div className={styles.statBadge}>
            <FiCheck /> <span>{deploymentStats.deployed}</span> Deployed
          </div>
          <div className={styles.statBadge}>
            <FiDollarSign /> <span>$125K</span> Revenue
          </div>
        </div>
      </div>
      
      <div className={styles.tabsContainer}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'jds' ? styles.active : ''}`}
          onClick={() => setActiveTab('jds')}
        >
          <FiFileText /> Job Descriptions
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'resumePool' ? styles.active : ''}`}
          onClick={() => setActiveTab('resumePool')}
        >
          <FiUpload /> Resume Pool
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'shortlisted' ? styles.active : ''}`}
          onClick={() => setActiveTab('shortlisted')}
        >
          <FiCheck /> Shortlisted
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'interviews' ? styles.active : ''}`}
          onClick={() => setActiveTab('interviews')}
        >
          <FiCalendar /> Client Interviews
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'deployments' ? styles.active : ''}`}
          onClick={() => setActiveTab('deployments')}
        >
          <FiSend /> Deployments
        </button>
      </div>
      
      <div className={styles.contentContainer}>
        {renderTabContent()}
      </div>
      
      {/* Modals would go here */}
    </div>
  );
};

export default SalesTeamDashboard;