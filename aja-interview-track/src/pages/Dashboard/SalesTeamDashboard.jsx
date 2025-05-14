import React, { useState, useEffect } from 'react';
import { 
  FiUsers, 
  FiCalendar, 
  FiFileText, 
  FiCheck, 
  FiX, 
  FiSend, 
  FiDollarSign,
  FiFilter,
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiBarChart2,
  FiPieChart,
  FiUpload,
  FiDownload,
  FiMessageSquare,
  FiMail,
  FiUserPlus,
  FiBriefcase,
  FiAward,
  FiClock
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import styles from './sales.module.css';

const SalesTeamDashboard = () => {
  const [activeTab, setActiveTab] = useState('profiles');
  const [candidates, setCandidates] = useState([]);
  const [clientInterviews, setClientInterviews] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedClient, setSelectedClient] = useState('');
  const [jd, setJd] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTech, setFilterTech] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterResourceType, setFilterResourceType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setCandidates([
      { 
        id: 1, 
        name: 'John Doe', 
        skill: 'Java', 
        level: 'Intermediate', 
        resourceType: 'TT',
        mockTechScore: 8,
        mockCommScore: 7,
        status: 'profile_received',
        resume: 'John_Doe_Java.pdf',
        lastUpdated: '2023-05-20'
      },
      { 
        id: 2, 
        name: 'Jane Smith', 
        skill: 'Python', 
        level: 'Senior',
        resourceType: 'TT',
        mockTechScore: 9,
        mockCommScore: 8,
        status: 'resume_sent',
        resume: 'Jane_Smith_Python.pdf',
        lastUpdated: '2023-05-18'
      },
      { 
        id: 3, 
        name: 'Mike Johnson', 
        skill: '.NET', 
        level: 'Junior',
        resourceType: 'TCT',
        mockTechScore: 7,
        mockCommScore: 6,
        status: 'interview_scheduled',
        resume: 'Mike_Johnson_NET.pdf',
        lastUpdated: '2023-05-15'
      },
      { 
        id: 4, 
        name: 'Sarah Williams', 
        skill: 'DevOps', 
        level: 'Intermediate',
        resourceType: 'TT',
        mockTechScore: 8,
        mockCommScore: 9,
        status: 'hired',
        resume: 'Sarah_Williams_DevOps.pdf',
        lastUpdated: '2023-05-10'
      },
      { 
        id: 5, 
        name: 'David Lee', 
        skill: 'SalesForce', 
        level: 'Senior',
        resourceType: 'TT',
        mockTechScore: 9,
        mockCommScore: 8,
        status: 'resume_sent',
        resume: 'David_Lee_SalesForce.pdf',
        lastUpdated: '2023-05-17'
      },
      { 
        id: 6, 
        name: 'Emma Wilson', 
        skill: 'UI', 
        level: 'Intermediate',
        resourceType: 'TCT',
        mockTechScore: 7,
        mockCommScore: 8,
        status: 'rejected',
        resume: 'Emma_Wilson_UI.pdf',
        lastUpdated: '2023-05-12'
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
        jd: 'Java Developer Position',
        feedback: 'Strong technical skills but needs improvement in communication',
        techScore: 8,
        commScore: 6
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
        jd: '.NET Engineer',
        feedback: 'Excellent problem-solving skills and good communication',
        techScore: 9,
        commScore: 8
      },
      { 
        id: 3, 
        candidateId: 5, 
        candidateName: 'David Lee', 
        client: 'Cloud Solutions', 
        date: '2023-06-02', 
        level: 1, 
        status: 'completed',
        result: 'rejected',
        jd: 'SalesForce Consultant',
        feedback: 'Technical knowledge good but lacked depth in some areas',
        techScore: 7,
        commScore: 7
      }
    ]);

    setClients([
      { id: 1, name: 'Tech Corp', contact: 'hr@techcorp.com', activePositions: 5, technologies: ['Java', 'Python', 'DevOps'] },
      { id: 2, name: 'Data Systems', contact: 'recruiting@datasystems.com', activePositions: 3, technologies: ['.NET', 'UI'] },
      { id: 3, name: 'Cloud Solutions', contact: 'hiring@cloudsolutions.com', activePositions: 2, technologies: ['SalesForce', 'DevOps'] },
      { id: 4, name: 'Digital Innovations', contact: 'talent@digitalinnov.com', activePositions: 4, technologies: ['Java', 'Python', 'UI'] },
      { id: 5, name: 'Global Tech', contact: 'careers@globaltech.com', activePositions: 3, technologies: ['.NET', 'Testing'] }
    ]);
  }, []);

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         candidate.skill.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTech = filterTech === 'all' || candidate.skill === filterTech;
    const matchesStatus = filterStatus === 'all' || candidate.status === filterStatus;
    const matchesResourceType = filterResourceType === 'all' || candidate.resourceType === filterResourceType;
    
    return matchesSearch && matchesTech && matchesStatus && matchesResourceType;
  });

  const filteredInterviews = clientInterviews.filter(interview => {
    return interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) || 
           interview.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
           interview.jd.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredClients = clients.filter(client => {
    return client.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

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

  const placementTrendData = [
    { name: 'Jan', placements: 5 },
    { name: 'Feb', placements: 8 },
    { name: 'Mar', placements: 12 },
    { name: 'Apr', placements: 10 },
    { name: 'May', placements: 7 }
  ];

  const techPlacementData = [
    { name: 'Java', placements: 15 },
    { name: 'Python', placements: 12 },
    { name: '.NET', placements: 8 },
    { name: 'DevOps', placements: 10 },
    { name: 'SalesForce', placements: 5 },
    { name: 'UI', placements: 7 },
    { name: 'Testing', placements: 3 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  const getTotalPlacements = () => {
    return candidates.filter(c => c.status === 'hired').length;
  };

  const getPlacementRate = () => {
    const totalInterviews = clientInterviews.length;
    const successfulInterviews = clientInterviews.filter(i => i.result === 'passed').length;
    return totalInterviews > 0 ? Math.round((successfulInterviews / totalInterviews) * 100) : 0;
  };

  const getAvgTimeToHire = () => {
    return '22 days';
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profiles':
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
                  placeholder="Search candidates..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
              <button 
                className={`${styles.button} ${styles.secondary}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <FiFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className={styles.filterControls}
                >
                  <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>Technology</label>
                    <select 
                      value={filterTech} 
                      onChange={(e) => setFilterTech(e.target.value)}
                      className={styles.filterSelect}
                    >
                      <option value="all">All Technologies</option>
                      <option value="Java">Java</option>
                      <option value="Python">Python</option>
                      <option value=".NET">.NET</option>
                      <option value="DevOps">DevOps</option>
                      <option value="SalesForce">SalesForce</option>
                      <option value="UI">UI</option>
                      <option value="Testing">Testing</option>
                    </select>
                  </div>

                  <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>Status</label>
                    <select 
                      value={filterStatus} 
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className={styles.filterSelect}
                    >
                      <option value="all">All Statuses</option>
                      <option value="profile_received">Profile Received</option>
                      <option value="resume_sent">Resume Sent</option>
                      <option value="interview_scheduled">Interview Scheduled</option>
                      <option value="hired">Hired</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>Resource Type</label>
                    <select 
                      value={filterResourceType} 
                      onChange={(e) => setFilterResourceType(e.target.value)}
                      className={styles.filterSelect}
                    >
                      <option value="all">All Types</option>
                      <option value="TCT">TCT</option>
                      <option value="TT">TT</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {filteredCandidates.length > 0 ? (
              <div className={styles.cardGrid}>
                {filteredCandidates.map(candidate => (
                  <motion.div
                    key={candidate.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={styles.profileCard}
                    onClick={() => setSelectedCandidate(candidate)}
                  >
                    <div className={styles.profileHeader}>
                      <h3 className={styles.profileName}>{candidate.name}</h3>
                      <span className={`${styles.statusBadge} ${styles[candidate.status]}`}>
                        {candidate.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className={styles.profileDetails}>
                      <p>
                        <strong>Technology:</strong> 
                        <span className={`${styles.techBadge} ${styles[candidate.skill.toLowerCase()]}`}>{candidate.skill}</span>
                        <span className={`${styles.resourceBadge} ${styles[candidate.resourceType.toLowerCase()]}`}>{candidate.resourceType}</span>
                      </p>
                      <p><strong>Level:</strong> {candidate.level}</p>
                      <p><strong>Mock Scores:</strong> Tech: {candidate.mockTechScore}/10, Comm: {candidate.mockCommScore}/10</p>
                      <p><strong>Last Updated:</strong> {candidate.lastUpdated}</p>
                    </div>

                    <div className={styles.profileActions}>
                      <button className={`${styles.button} ${styles.secondary}`}>
                        <FiFileText /> View Resume
                      </button>
                      {candidate.status === 'profile_received' && (
                        <button 
                          className={`${styles.button} ${styles.primary}`}
                          onClick={(e) => {
                            e.stopPropagation();
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
            ) : (
              <div className={styles.emptyState}>
                <FiUsers size={48} />
                <h4>No candidates found</h4>
                <p>Adjust your search or filters to find candidates for client placement.</p>
              </div>
            )}
          </motion.div>
        );
      case 'interviews':
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
                          <span><FiCalendar /> {interview.date}</span>
                          <span>Level: {interview.level}</span>
                          <span className={`${styles.statusBadge} ${styles[interview.status]}`}>
                            {interview.status}
                          </span>
                          {interview.result && (
                            <span className={interview.result === 'passed' ? styles.resultSuccess : styles.resultFailure}>
                              {interview.result === 'passed' ? 'Passed' : 'Rejected'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className={styles.interviewDetails}>
                      <p><strong>For JD:</strong> {interview.jd}</p>
                      
                      {interview.status === 'completed' && (
                        <div>
                          <div className={styles.scoreMeter}>
                            <div className={styles.scoreLabel}>
                              <span>Technical: {interview.techScore}/10</span>
                            </div>
                            <div className={styles.scoreBar}>
                              <div 
                                className={styles.scoreFill}
                                data-score={interview.techScore}
                                style={{ width: `${interview.techScore * 10}%` }}
                              />
                            </div>
                          </div>

                          <div className={styles.scoreMeter}>
                            <div className={styles.scoreLabel}>
                              <span>Communication: {interview.commScore}/10</span>
                            </div>
                            <div className={styles.scoreBar}>
                              <div 
                                className={styles.scoreFill}
                                data-score={interview.commScore}
                                style={{ width: `${interview.commScore * 10}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {interview.feedback && (
                      <div className={styles.feedbackSection}>
                        <h5>Client Feedback</h5>
                        <p>{interview.feedback}</p>
                      </div>
                    )}

                    <div className={styles.profileActions}>
                      {interview.status === 'scheduled' && (
                        <>
                          <button className={`${styles.button} ${styles.primary}`}>
                            Confirm
                          </button>
                          <button className={`${styles.button} ${styles.secondary}`}>
                            Reschedule
                          </button>
                        </>
                      )}
                      
                      {interview.status === 'completed' && (
                        <button 
                          className={`${styles.button} ${interview.result === 'passed' ? styles.success : styles.danger}`}
                          onClick={() => {
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
            ) : (
              <div className={styles.emptyState}>
                <FiCalendar size={48} />
                <h4>No interviews scheduled</h4>
                <p>When candidates are sent to clients, their interviews will appear here.</p>
              </div>
            )}
          </motion.div>
        );
      case 'clients':
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
                  placeholder="Search clients..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
              <button 
                className={`${styles.button} ${styles.primary}`}
                onClick={() => setSelectedClient('new')}
              >
                <FiUserPlus /> Add New Client
              </button>
            </div>

            {filteredClients.length > 0 ? (
              <div className={styles.cardGrid}>
                {filteredClients.map(client => (
                  <motion.div
                    key={client.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className={styles.clientCard}
                    onClick={() => setSelectedClient(client.name)}
                  >
                    <h4 className={styles.clientName}>{client.name}</h4>
                    <div className={styles.clientDetails}>
                      <p><strong>Contact:</strong> {client.contact}</p>
                      <p><strong>Active Positions:</strong> {client.activePositions}</p>
                      <p>
                        <strong>Technologies:</strong> 
                        {client.technologies.map(tech => (
                          <span key={tech} className={`${styles.techBadge} ${styles[tech.toLowerCase()]}`}>{tech}</span>
                        ))}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <FiBriefcase size={48} />
                <h4>No clients found</h4>
                <p>Add new clients or adjust your search to view client information.</p>
              </div>
            )}
          </motion.div>
        );
      case 'reports':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={styles.contentSection}
          >
            <div className={styles.statsGrid}>
              <motion.div whileHover={{ scale: 1.05 }} className={styles.statCard}>
                <h5><FiUsers /> Total Placements</h5>
                <div className={styles.statValue}>{getTotalPlacements()}</div>
                <div className={`${styles.statLabel} ${styles.up}`}>
                  <FiBarChart2 /> 12% increase from last month
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className={styles.statCard}>
                <h5><FiAward /> Placement Rate</h5>
                <div className={styles.statValue}>{getPlacementRate()}%</div>
                <div className={`${styles.statLabel} ${styles.up}`}>
                  <FiBarChart2 /> 5% increase from last quarter
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className={styles.statCard}>
                <h5><FiDollarSign /> Revenue</h5>
                <div className={styles.statValue}>$125K</div>
                <div className={`${styles.statLabel} ${styles.up}`}>
                  <FiBarChart2 /> 18% increase YTD
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className={styles.statCard}>
                <h5><FiClock /> Avg Time to Hire</h5>
                <div className={styles.statValue}>{getAvgTimeToHire()}</div>
                <div className={`${styles.statLabel} ${styles.down}`}>
                  <FiBarChart2 /> 3 days longer than last quarter
                </div>
              </motion.div>
            </div>

            <div className={styles.chartContainer}>
              <h4><FiBarChart2 /> Placement Trend</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={placementTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="placements" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }} 
                    name="Placements" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className={styles.chartGrid}>
              <div className={styles.chartContainer}>
                <h4><FiPieChart /> Placement by Technology</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={techPlacementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Bar 
                      dataKey="placements" 
                      name="Placements" 
                      fill="#8884d8" 
                      radius={[4, 4, 0, 0]}
                    >
                      {techPlacementData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className={styles.chartContainer}>
                <h4><FiPieChart /> Conversion Rate</h4>
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
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.headerTitle}>
          <FiBriefcase /> Sales Team Dashboard
        </h1>
        <div className={styles.headerStats}>
          <div className={styles.statBadge}>
            <FiUsers /> <span>{candidates.length}</span> Candidates
          </div>
          <div className={styles.statBadge}>
            <FiCheck /> <span>{candidates.filter(c => c.status === 'hired').length}</span> Hired
          </div>
          <div className={styles.statBadge}>
            <FiDollarSign /> <span>$125K</span> Revenue
          </div>
        </div>
      </div>
      
      <div className={styles.tabsContainer}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'profiles' ? styles.active : ''}`}
          onClick={() => setActiveTab('profiles')}
        >
          <FiUsers /> Candidate Profiles
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'interviews' ? styles.active : ''}`}
          onClick={() => setActiveTab('interviews')}
        >
          <FiCalendar /> Client Interviews
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'clients' ? styles.active : ''}`}
          onClick={() => setActiveTab('clients')}
        >
          <FiBriefcase /> Clients
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'reports' ? styles.active : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <FiBarChart2 /> Reports
        </button>
      </div>
      
      <div className={styles.contentContainer}>
        {renderTabContent()}
      </div>
      
      <AnimatePresence>
        {selectedCandidate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalOverlay}
            onClick={() => setSelectedCandidate(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>{selectedCandidate.name}'s Profile</h3>
              
              <div className={styles.formGroup}>
                <label>Candidate Information</label>
                <div className={styles.candidateInfo}>
                  <p><strong>Technology:</strong> 
                    <span className={`${styles.techBadge} ${styles[selectedCandidate.skill.toLowerCase()]}`}>
                      {selectedCandidate.skill}
                    </span>
                    <span className={`${styles.resourceBadge} ${styles[selectedCandidate.resourceType.toLowerCase()]}`}>
                      {selectedCandidate.resourceType}
                    </span>
                  </p>
                  <p><strong>Level:</strong> {selectedCandidate.level}</p>
                  <p><strong>Mock Interview Scores:</strong> Technical: {selectedCandidate.mockTechScore}/10, Communication: {selectedCandidate.mockCommScore}/10</p>
                  <p><strong>Status:</strong> 
                    <span className={`${styles.statusBadge} ${styles[selectedCandidate.status]}`}>
                      {selectedCandidate.status.replace('_', ' ')}
                    </span>
                  </p>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Resume</label>
                <div className={styles.resumeContainer}>
                  <FiFileText size={32} color="#94a3b8" />
                  <p>{selectedCandidate.resume}</p>
                  <button className={`${styles.button} ${styles.secondary}`}>
                    <FiDownload /> Download Resume
                  </button>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Send to Client</label>
                <select 
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className={styles.formSelect}
                >
                  <option value="">Select Client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.name}>{client.name}</option>
                  ))}
                </select>
                
                {selectedClient && (
                  <>
                    <label>Job Description</label>
                    <textarea 
                      placeholder="Paste job description here..."
                      value={jd}
                      onChange={(e) => setJd(e.target.value)}
                      className={styles.formTextarea}
                    />
                  </>
                )}
              </div>

              <div className={styles.modalActions}>
                <button 
                  className={`${styles.button} ${styles.primary}`}
                  disabled={!selectedClient || !jd}
                  onClick={() => {
                    alert(`Profile of ${selectedCandidate.name} sent to ${selectedClient}`);
                    setSelectedCandidate(null);
                    setSelectedClient('');
                    setJd('');
                  }}
                >
                  <FiSend /> Send to Client
                </button>
                <button 
                  className={`${styles.button} ${styles.secondary}`}
                  onClick={() => setSelectedCandidate(null)}
                >
                  <FiX /> Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedClient === 'new' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalOverlay}
            onClick={() => setSelectedClient('')}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Add New Client</h3>
              
              <div className={styles.formGroup}>
                <label>Client Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Tech Solutions Inc." 
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Contact Email</label>
                <input 
                  type="email" 
                  placeholder="e.g., hr@techsolutions.com" 
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Technologies Needed</label>
                <div className={styles.techBadgeContainer}>
                  {['Java', 'Python', '.NET', 'DevOps', 'SalesForce', 'UI', 'Testing'].map(tech => (
                    <span 
                      key={tech} 
                      className={`${styles.techBadge} ${styles[tech.toLowerCase()]}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label>Notes</label>
                <textarea 
                  placeholder="Any additional information about the client..." 
                  className={styles.formTextarea}
                />
              </div>

              <div className={styles.modalActions}>
                <button 
                  className={`${styles.button} ${styles.primary}`}
                  onClick={() => {
                    alert('New client added successfully');
                    setSelectedClient('');
                  }}
                >
                  <FiCheck /> Save Client
                </button>
                <button 
                  className={`${styles.button} ${styles.secondary}`}
                  onClick={() => setSelectedClient('')}
                >
                  <FiX /> Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SalesTeamDashboard;