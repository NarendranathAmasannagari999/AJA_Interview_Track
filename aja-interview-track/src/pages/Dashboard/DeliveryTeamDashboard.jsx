import React, { useState, useEffect } from 'react';
import { 
  FiUsers, FiCalendar, FiCheckCircle, FiClock, FiFileText, 
  FiSend, FiEdit, FiPlus, FiFilter, FiSearch, FiBarChart2,
  FiChevronDown, FiChevronUp, FiExternalLink, FiMail, FiUser
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, RadarChart, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line
} from 'recharts';
import styles from './DeliveryTeamDashboard.module.css';

const DeliveryTeamDashboard = () => {
  const [activeTab, setActiveTab] = useState('employees');
  const [employees, setEmployees] = useState([]);
  const [mockInterviews, setMockInterviews] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [feedback, setFeedback] = useState({ technical: '', communication: '' });
  const [ratings, setRatings] = useState({ technical: 0, communication: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [technologyFilter, setTechnologyFilter] = useState('all');
  const [resourceTypeFilter, setResourceTypeFilter] = useState('all');
  const [isScheduling, setIsScheduling] = useState(false);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewer, setInterviewer] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [profilesSentToSales, setProfilesSentToSales] = useState([]);
  const [deployedEmployees, setDeployedEmployees] = useState([]);

  const technologies = ['Java', 'Python', '.NET', 'DevOps', 'SalesForce', 'UI Development', 'Testing'];
  const resourceTypes = ['TCT', 'TT'];

  useEffect(() => {
    // Mock data - in real app, this would come from API
    const mockEmployees = [
      { id: 1, name: 'John Doe', technology: 'Java', resourceType: 'TCT', level: 'Intermediate', status: 'active' },
      { id: 2, name: 'Jane Smith', technology: 'Python', resourceType: 'TT', level: 'Senior', status: 'active' },
      { id: 3, name: 'Mike Johnson', technology: '.NET', resourceType: 'TCT', level: 'Junior', status: 'active' },
      { id: 4, name: 'Sarah Williams', technology: 'DevOps', resourceType: 'TT', level: 'Intermediate', status: 'active' },
      { id: 5, name: 'David Brown', technology: 'SalesForce', resourceType: 'TT', level: 'Senior', status: 'active' },
      { id: 6, name: 'Emily Davis', technology: 'UI Development', resourceType: 'TCT', level: 'Intermediate', status: 'active' },
      { id: 7, name: 'Robert Wilson', technology: 'Testing', resourceType: 'TT', level: 'Junior', status: 'active' },
      { id: 8, name: 'Lisa Ray', technology: 'Java', resourceType: 'TT', level: 'Senior', status: 'active' },
      { id: 9, name: 'Mark Taylor', technology: 'Python', resourceType: 'TCT', level: 'Intermediate', status: 'active' },
    ];

    const mockInterviewsData = [
      { 
        id: 1, 
        employeeId: 1, 
        employeeName: 'John Doe', 
        date: '2023-06-15', 
        interviewer: 'Alex Johnson', 
        status: 'completed', 
        ratings: { technical: 8, communication: 7 },
        feedback: { 
          technical: 'Strong core Java skills but needs improvement in Spring Boot', 
          communication: 'Good communication but could improve clarity in explanations' 
        },
        sentToSales: true,
        deployed: false
      },
      { 
        id: 2, 
        employeeId: 2, 
        employeeName: 'Jane Smith', 
        date: '2023-06-16', 
        interviewer: 'Alex Johnson', 
        status: 'completed', 
        ratings: { technical: 9, communication: 8 },
        feedback: { 
          technical: 'Excellent Python skills with strong problem-solving abilities', 
          communication: 'Clear and concise communicator' 
        },
        sentToSales: true,
        deployed: true
      },
      { 
        id: 3, 
        employeeId: 3, 
        employeeName: 'Mike Johnson', 
        date: '2023-06-10', 
        interviewer: 'Sam Wilson', 
        status: 'completed', 
        ratings: { technical: 7, communication: 6 },
        feedback: { 
          technical: 'Good understanding of .NET basics but needs more practice with Entity Framework', 
          communication: 'Needs to work on technical vocabulary' 
        },
        sentToSales: false,
        deployed: false
      },
      { 
        id: 4, 
        employeeId: 4, 
        employeeName: 'Sarah Williams', 
        date: '2023-06-17', 
        interviewer: 'Alex Johnson', 
        status: 'completed', 
        ratings: { technical: 9, communication: 8 },
        feedback: { 
          technical: 'Excellent DevOps knowledge, especially in CI/CD pipelines', 
          communication: 'Very good at explaining complex concepts' 
        },
        sentToSales: true,
        deployed: true
      },
      { 
        id: 5, 
        employeeId: 5, 
        employeeName: 'David Brown', 
        date: '2023-06-20', 
        interviewer: 'Sam Wilson', 
        status: 'completed', 
        ratings: { technical: 10, communication: 9 },
        feedback: { 
          technical: 'Exceptional Salesforce knowledge with practical implementation skills', 
          communication: 'Excellent client-facing communication skills' 
        },
        sentToSales: true,
        deployed: true
      },
      { 
        id: 6, 
        employeeId: 6, 
        employeeName: 'Emily Davis', 
        date: '2023-06-25', 
        interviewer: 'Sam Wilson', 
        status: 'scheduled' 
      },
      { 
        id: 7, 
        employeeId: 7, 
        employeeName: 'Robert Wilson', 
        date: '2023-06-28', 
        interviewer: 'Alex Johnson', 
        status: 'scheduled' 
      },
    ];

    setEmployees(mockEmployees);
    setMockInterviews(mockInterviewsData);
    setProfilesSentToSales(mockInterviewsData.filter(i => i.sentToSales).map(i => i.employeeId));
    setDeployedEmployees(mockInterviewsData.filter(i => i.deployed).map(i => i.employeeId));
  }, []);

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTechnology = technologyFilter === 'all' || employee.technology === technologyFilter;
    const matchesResourceType = resourceTypeFilter === 'all' || employee.resourceType === resourceTypeFilter;
    return matchesSearch && matchesTechnology && matchesResourceType;
  });

  const upcomingInterviews = mockInterviews.filter(i => i.status === 'scheduled');
  const completedInterviews = mockInterviews.filter(i => i.status === 'completed');

  // Calculate average ratings by technology
  const techPerformanceData = technologies.map(tech => {
    const techInterviews = completedInterviews.filter(i => {
      const emp = employees.find(e => e.id === i.employeeId);
      return emp && emp.technology === tech;
    });
    
    const avgTechnical = techInterviews.length > 0 
      ? techInterviews.reduce((sum, i) => sum + i.ratings.technical, 0) / techInterviews.length
      : 0;
      
    const avgCommunication = techInterviews.length > 0 
      ? techInterviews.reduce((sum, i) => sum + i.ratings.communication, 0) / techInterviews.length
      : 0;
      
    return { 
      name: tech, 
      technical: parseFloat(avgTechnical.toFixed(1)), 
      communication: parseFloat(avgCommunication.toFixed(1)),
      count: techInterviews.length
    };
  });

  // Calculate average ratings by resource type
  const resourcePerformanceData = resourceTypes.map(type => {
    const typeInterviews = completedInterviews.filter(i => {
      const emp = employees.find(e => e.id === i.employeeId);
      return emp && emp.resourceType === type;
    });
    
    const avgTechnical = typeInterviews.length > 0 
      ? typeInterviews.reduce((sum, i) => sum + i.ratings.technical, 0) / typeInterviews.length
      : 0;
      
    const avgCommunication = typeInterviews.length > 0 
      ? typeInterviews.reduce((sum, i) => sum + i.ratings.communication, 0) / typeInterviews.length
      : 0;
      
    return { 
      name: type, 
      technical: parseFloat(avgTechnical.toFixed(1)), 
      communication: parseFloat(avgCommunication.toFixed(1)),
      count: typeInterviews.length
    };
  });

  // Top performers (average of technical and communication >= 8)
  const topPerformers = completedInterviews
    .filter(i => (i.ratings.technical + i.ratings.communication) / 2 >= 8)
    .map(i => {
      const emp = employees.find(e => e.id === i.employeeId);
      return {
        ...i,
        technology: emp ? emp.technology : '',
        resourceType: emp ? emp.resourceType : ''
      };
    });

  // Conversion metrics
  const totalCompleted = completedInterviews.length;
  const totalSentToSales = completedInterviews.filter(i => i.sentToSales).length;
  const totalDeployed = completedInterviews.filter(i => i.deployed).length;

  const conversionData = [
    { name: 'Completed Interviews', value: totalCompleted },
    { name: 'Sent to Sales', value: totalSentToSales },
    { name: 'Deployed', value: totalDeployed }
  ];

  const employeeRadarData = selectedEmployee ? [
    { subject: 'Technical', A: 85, fullMark: 100 },
    { subject: 'Communication', A: 75, fullMark: 100 },
    { subject: 'Problem Solving', A: 90, fullMark: 100 },
    { subject: 'System Design', A: 70, fullMark: 100 },
    { subject: 'Client Fit', A: 80, fullMark: 100 }
  ] : [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const handleRatingChange = (type, value) => {
    setRatings(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleFeedbackChange = (type, value) => {
    setFeedback(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const sendToSales = (employeeId) => {
    if (!profilesSentToSales.includes(employeeId)) {
      setProfilesSentToSales([...profilesSentToSales, employeeId]);
      alert(`Profile sent to Sales Team`);
    } else {
      alert('Profile already sent to Sales Team');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'employees':
        return (
          <div className={styles.sectionContainer}>
            <div className={styles.filterControls}>
              <div className={styles.searchBox}>
                <FiSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <button 
                className={styles.filterToggle}
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? <FiChevronUp /> : <FiChevronDown />} Filters
              </button>
              
              <button 
                className={styles.primaryButton}
                onClick={() => setIsScheduling(true)}
              >
                <FiPlus /> Schedule Interview
              </button>
            </div>
            
            {showFilters && (
              <div className={styles.advancedFilters}>
                <div className={styles.filterGroup}>
                  <label>Technology</label>
                  <select
                    value={technologyFilter}
                    onChange={(e) => setTechnologyFilter(e.target.value)}
                  >
                    <option value="all">All Technologies</option>
                    {technologies.map(tech => (
                      <option key={tech} value={tech}>{tech}</option>
                    ))}
                  </select>
                </div>
                
                <div className={styles.filterGroup}>
                  <label>Resource Type</label>
                  <select
                    value={resourceTypeFilter}
                    onChange={(e) => setResourceTypeFilter(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    {resourceTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            
            <div className={styles.cardGrid}>
              {filteredEmployees.map(employee => (
                <motion.div
                  key={employee.id}
                  className={styles.card}
                  whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedEmployee(employee)}
                >
                  <div className={styles.cardHeader}>
                    <div className={styles.userAvatar}>
                      <FiUser />
                    </div>
                    <div>
                      <h3>{employee.name}</h3>
                      <div className={styles.cardMeta}>
                        <span className={`${styles.techBadge} ${styles[employee.technology.replace(' ', '')]}`}>
                          {employee.technology}
                        </span>
                        <span className={`${styles.resourceBadge} ${styles[employee.resourceType]}`}>
                          {employee.resourceType}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.cardDetails}>
                    <p><strong>Level:</strong> {employee.level}</p>
                    <p><strong>Status:</strong> {employee.status}</p>
                  </div>
                  <div className={styles.cardFooter}>
                    <button 
                      className={styles.secondaryButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEmployee(employee);
                        setIsScheduling(true);
                      }}
                    >
                      <FiCalendar /> Schedule
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      case 'interviews':
        return (
          <div className={styles.sectionContainer}>
            <div className={styles.interviewTabs}>
              <button 
                className={`${styles.interviewTabButton} ${styles.active}`}
              >
                All Interviews
              </button>
            </div>
            
            <div className={styles.interviewSummary}>
              <div className={styles.summaryCard}>
                <h4>Upcoming Interviews</h4>
                <p>{upcomingInterviews.length}</p>
              </div>
              <div className={styles.summaryCard}>
                <h4>Completed Interviews</h4>
                <p>{completedInterviews.length}</p>
              </div>
              <div className={styles.summaryCard}>
                <h4>Sent to Sales</h4>
                <p>{profilesSentToSales.length}</p>
              </div>
              <div className={styles.summaryCard}>
                <h4>Deployed</h4>
                <p>{deployedEmployees.length}</p>
              </div>
            </div>
            
            <div className={styles.interviewList}>
              <div className={styles.interviewListHeader}>
                <h4>Upcoming Mock Interviews</h4>
              </div>
              
              {upcomingInterviews.length === 0 ? (
                <div className={styles.emptyState}>
                  <FiCalendar size={48} />
                  <p>No upcoming interviews scheduled</p>
                </div>
              ) : (
                upcomingInterviews.map(interview => {
                  const employee = employees.find(e => e.id === interview.employeeId);
                  return (
                    <motion.div
                      key={interview.id}
                      className={styles.interviewCard}
                      whileHover={{ scale: 1.01 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={styles.interviewHeader}>
                        <div>
                          <h4>{interview.employeeName}</h4>
                          <div className={styles.interviewMeta}>
                            {employee && (
                              <>
                                <span className={`${styles.techBadge} ${styles[employee.technology.replace(' ', '')]}`}>
                                  {employee.technology}
                                </span>
                                <span className={`${styles.resourceBadge} ${styles[employee.resourceType]}`}>
                                  {employee.resourceType}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className={styles.interviewDate}>
                          <FiCalendar /> {interview.date}
                        </div>
                      </div>
                      <div className={styles.interviewDetails}>
                        <p><strong>Interviewer:</strong> {interview.interviewer}</p>
                      </div>
                      <div className={styles.interviewActions}>
                        <button className={styles.primaryButton}>
                          Start Interview
                        </button>
                        <button className={styles.secondaryButton}>
                          Reschedule
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
              
              <div className={styles.interviewListHeader}>
                <h4>Completed Mock Interviews</h4>
              </div>
              
              {completedInterviews.length === 0 ? (
                <div className={styles.emptyState}>
                  <FiCheckCircle size={48} />
                  <p>No interviews completed yet</p>
                </div>
              ) : (
                completedInterviews.map(interview => {
                  const employee = employees.find(e => e.id === interview.employeeId);
                  const isSentToSales = profilesSentToSales.includes(interview.employeeId);
                  const isDeployed = deployedEmployees.includes(interview.employeeId);
                  
                  return (
                    <motion.div
                      key={interview.id}
                      className={styles.interviewCard}
                      whileHover={{ scale: 1.01 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={styles.interviewHeader}>
                        <div>
                          <h4>{interview.employeeName}</h4>
                          <div className={styles.interviewMeta}>
                            {employee && (
                              <>
                                <span className={`${styles.techBadge} ${styles[employee.technology.replace(' ', '')]}`}>
                                  {employee.technology}
                                </span>
                                <span className={`${styles.resourceBadge} ${styles[employee.resourceType]}`}>
                                  {employee.resourceType}
                                </span>
                              </>
                            )}
                            <span className={styles.status}>
                              Completed
                            </span>
                          </div>
                        </div>
                        <div className={styles.interviewDate}>
                          <FiCalendar /> {interview.date}
                        </div>
                      </div>
                      
                      <div className={styles.interviewScores}>
                        <div className={styles.scoreMeter}>
                          <div className={styles.scoreLabel}>
                            Technical: {interview.ratings.technical}/10
                          </div>
                          <div className={styles.scoreBar}>
                            <div 
                              className={styles.scoreFill} 
                              style={{ 
                                width: `${interview.ratings.technical * 10}%`,
                                backgroundColor: getScoreColor(interview.ratings.technical)
                              }}
                            />
                          </div>
                        </div>
                        <div className={styles.scoreMeter}>
                          <div className={styles.scoreLabel}>
                            Communication: {interview.ratings.communication}/10
                          </div>
                          <div className={styles.scoreBar}>
                            <div 
                              className={styles.scoreFill} 
                              style={{ 
                                width: `${interview.ratings.communication * 10}%`,
                                backgroundColor: getScoreColor(interview.ratings.communication)
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className={styles.feedback}>
                        <h5>Technical Feedback</h5>
                        <p>{interview.feedback.technical}</p>
                        
                        <h5>Communication Feedback</h5>
                        <p>{interview.feedback.communication}</p>
                      </div>
                      
                      <div className={styles.interviewActions}>
                        <button 
                          className={styles.secondaryButton}
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setRatings(interview.ratings);
                            setFeedback(interview.feedback);
                          }}
                        >
                          <FiEdit /> Edit Feedback
                        </button>
                        
                        {isDeployed ? (
                          <span className={styles.deployedBadge}>
                            <FiCheckCircle /> Deployed to Client
                          </span>
                        ) : isSentToSales ? (
                          <span className={styles.sentBadge}>
                            <FiSend /> Sent to Sales
                          </span>
                        ) : (
                          <button
                            className={styles.successButton}
                            onClick={() => sendToSales(interview.employeeId)}
                          >
                            <FiSend /> Send to Sales
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className={styles.analyticsContainer}>
            <div className={styles.statsGrid}>
              <motion.div 
                className={styles.statCard}
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <h5>Interviews Conducted</h5>
                <p className={styles.statValue}>{completedInterviews.length}</p>
                <p className={styles.statLabel}>This Month</p>
              </motion.div>
              <motion.div 
                className={styles.statCard}
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <h5>Avg Technical Score</h5>
                <p className={styles.statValue}>
                  {completedInterviews.length > 0 
                    ? (completedInterviews.reduce((sum, i) => sum + i.ratings.technical, 0) / completedInterviews.length).toFixed(1)
                    : '0.0'}
                </p>
                <p className={styles.statLabel}>/ 10.0</p>
              </motion.div>
              <motion.div 
                className={styles.statCard}
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <h5>Profiles Sent</h5>
                <p className={styles.statValue}>
                  {profilesSentToSales.length}
                </p>
                <p className={styles.statLabel}>To Sales Team</p>
              </motion.div>
              <motion.div 
                className={styles.statCard}
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <h5>Deployment Rate</h5>
                <p className={styles.statValue}>
                  {profilesSentToSales.length > 0 
                    ? Math.round((deployedEmployees.length / profilesSentToSales.length) * 100)
                    : '0'}%
                </p>
                <p className={styles.statLabel}>Hired by Clients</p>
              </motion.div>
            </div>
            
            <div className={styles.chartRow}>
              <div className={styles.chartCard}>
                <h4>Performance by Technology</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={techPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="technical" fill="#8884d8" name="Technical" />
                    <Bar dataKey="communication" fill="#82ca9d" name="Communication" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className={styles.chartCard}>
                <h4>Performance by Resource Type</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={resourcePerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="technical" fill="#8884d8" name="Technical" />
                    <Bar dataKey="communication" fill="#82ca9d" name="Communication" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className={styles.chartRow}>
              <div className={styles.chartCard}>
                <h4>Interview Conversion</h4>
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
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {conversionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} interviews`, 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className={styles.chartCard}>
                <h4>Top Performers</h4>
                <div className={styles.topPerformersList}>
                  {topPerformers.length > 0 ? (
                    topPerformers.map((interview, index) => {
                      const employee = employees.find(e => e.id === interview.employeeId);
                      return (
                        <div key={index} className={styles.performerCard}>
                          <div className={styles.performerInfo}>
                            <div className={styles.userAvatarSmall}>
                              <FiUser />
                            </div>
                            <div>
                              <h5>{interview.employeeName}</h5>
                              {employee && (
                                <div className={styles.performerMeta}>
                                  <span className={`${styles.techBadge} ${styles[employee.technology.replace(' ', '')]}`}>
                                    {employee.technology}
                                  </span>
                                  <span className={`${styles.resourceBadge} ${styles[employee.resourceType]}`}>
                                    {employee.resourceType}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className={styles.performerScore}>
                            <span>{(interview.ratings.technical + interview.ratings.communication) / 2}</span>
                            /10
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className={styles.emptyState}>
                      <p>No top performers yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 9) return '#10b981';
    if (score >= 7) return '#3b82f6';
    if (score >= 5) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Delivery Team Dashboard</h2>
          <p className={styles.dashboardSubtitle}>Mock Interview Management & Employee Evaluation</p>
        </motion.div>
        <div className={styles.userProfile}>
          <div className={styles.userAvatar}>
            <FiUser />
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Delivery Manager</span>
            <span className={styles.userRole}>Delivery Team</span>
          </div>
        </div>
      </div>
      
      <div className={styles.tabs}>
        <motion.button
          className={`${styles.tab} ${activeTab === 'employees' ? styles.active : ''}`}
          onClick={() => setActiveTab('employees')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiUsers /> Employees
        </motion.button>
        <motion.button
          className={`${styles.tab} ${activeTab === 'interviews' ? styles.active : ''}`}
          onClick={() => setActiveTab('interviews')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiCalendar /> Interviews
        </motion.button>
        <motion.button
          className={`${styles.tab} ${activeTab === 'analytics' ? styles.active : ''}`}
          onClick={() => setActiveTab('analytics')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiBarChart2 /> Analytics
        </motion.button>
      </div>
      
      <motion.div
        className={styles.tabContent}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {renderTabContent()}
      </motion.div>
      
      <AnimatePresence>
        {selectedEmployee && !isScheduling && (
          <motion.div 
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEmployee(null)}
          >
            <motion.div 
              className={styles.modalContent}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h3>{selectedEmployee.name}'s Evaluation</h3>
                <button 
                  className={styles.closeButton}
                  onClick={() => setSelectedEmployee(null)}
                >
                  &times;
                </button>
              </div>
              
              <div className={styles.profileDetails}>
                <div className={styles.profileSummary}>
                  <div className={styles.profileBadge}>
                    <div className={styles.userAvatarLarge}>
                      <FiUser />
                    </div>
                    <div>
                      <h4>{selectedEmployee.name}</h4>
                      <div className={styles.profileMeta}>
                        <span className={`${styles.techBadge} ${styles[selectedEmployee.technology.replace(' ', '')]}`}>
                          {selectedEmployee.technology}
                        </span>
                        <span className={`${styles.resourceBadge} ${styles[selectedEmployee.resourceType]}`}>
                          {selectedEmployee.resourceType}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.profileStats}>
                    <div className={styles.statItem}>
                      <span>Mock Interviews</span>
                      <strong>
                        {mockInterviews.filter(i => i.employeeId === selectedEmployee.id).length}
                      </strong>
                    </div>
                    <div className={styles.statItem}>
                      <span>Avg Technical</span>
                      <strong>
                        {mockInterviews.filter(i => i.employeeId === selectedEmployee.id && i.ratings)
                          .reduce((sum, i) => sum + i.ratings.technical, 0) / 
                          mockInterviews.filter(i => i.employeeId === selectedEmployee.id && i.ratings).length || 'N/A'}
                      </strong>
                    </div>
                    <div className={styles.statItem}>
                      <span>Avg Communication</span>
                      <strong>
                        {mockInterviews.filter(i => i.employeeId === selectedEmployee.id && i.ratings)
                          .reduce((sum, i) => sum + i.ratings.communication, 0) / 
                          mockInterviews.filter(i => i.employeeId === selectedEmployee.id && i.ratings).length || 'N/A'}
                      </strong>
                    </div>
                  </div>
                </div>
                
                <div className={styles.feedbackSection}>
                  <h4>Interview Feedback</h4>
                  
                  <div className={styles.ratingSection}>
                    <div className={styles.ratingGroup}>
                      <label>Technical Rating:</label>
                      <div className={styles.starRating}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
                          <span
                            key={`tech-${star}`}
                            className={`${styles.star} ${star <= ratings.technical ? styles.filled : ''}`}
                            onClick={() => handleRatingChange('technical', star)}
                            style={{ color: getScoreColor(star) }}
                          >
                            ★
                          </span>
                        ))}
                        <span className={styles.ratingValue}>{ratings.technical}/10</span>
                      </div>
                    </div>
                    
                    <div className={styles.ratingGroup}>
                      <label>Communication Rating:</label>
                      <div className={styles.starRating}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
                          <span
                            key={`comm-${star}`}
                            className={`${styles.star} ${star <= ratings.communication ? styles.filled : ''}`}
                            onClick={() => handleRatingChange('communication', star)}
                            style={{ color: getScoreColor(star) }}
                          >
                            ★
                          </span>
                        ))}
                        <span className={styles.ratingValue}>{ratings.communication}/10</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.feedbackGroup}>
                    <label>Technical Feedback:</label>
                    <textarea
                      placeholder="Enter technical feedback..."
                      value={feedback.technical}
                      onChange={(e) => handleFeedbackChange('technical', e.target.value)}
                    />
                  </div>
                  
                  <div className={styles.feedbackGroup}>
                    <label>Communication Feedback:</label>
                    <textarea
                      placeholder="Enter communication feedback..."
                      value={feedback.communication}
                      onChange={(e) => handleFeedbackChange('communication', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className={styles.modalActions}>
                <button 
                  className={styles.primaryButton}
                  onClick={() => {
                    // Save feedback
                    alert(`Feedback saved for ${selectedEmployee.name}`);
                    setSelectedEmployee(null);
                    setFeedback({ technical: '', communication: '' });
                    setRatings({ technical: 0, communication: 0 });
                  }}
                >
                  Save Evaluation
                </button>
                <button 
                  className={styles.secondaryButton}
                  onClick={() => {
                    setSelectedEmployee(null);
                    setFeedback({ technical: '', communication: '' });
                    setRatings({ technical: 0, communication: 0 });
                  }}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {isScheduling && (
          <motion.div 
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsScheduling(false)}
          >
            <motion.div 
              className={styles.modalContent}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h3>Schedule Mock Interview</h3>
                <button 
                  className={styles.closeButton}
                  onClick={() => setIsScheduling(false)}
                >
                  &times;
                </button>
              </div>
              
              <div className={styles.scheduleForm}>
                {selectedEmployee ? (
                  <div className={styles.employeeInfo}>
                    <h4>Employee: {selectedEmployee.name}</h4>
                    <div className={styles.employeeMeta}>
                      <span className={`${styles.techBadge} ${styles[selectedEmployee.technology.replace(' ', '')]}`}>
                        {selectedEmployee.technology}
                      </span>
                      <span className={`${styles.resourceBadge} ${styles[selectedEmployee.resourceType]}`}>
                        {selectedEmployee.resourceType}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className={styles.formGroup}>
                    <label>Select Employee</label>
                    <select>
                      <option value="">Select an employee</option>
                      {employees.map(employee => (
                        <option key={employee.id} value={employee.id}>{employee.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div className={styles.formGroup}>
                  <label>Interview Date & Time</label>
                  <input
                    type="datetime-local"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Interviewer</label>
                  <input
                    type="text"
                    placeholder="Enter interviewer name"
                    value={interviewer}
                    onChange={(e) => setInterviewer(e.target.value)}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Interview Type</label>
                  <select>
                    <option value="technical">Technical Interview</option>
                    <option value="behavioral">Behavioral Interview</option>
                    <option value="system_design">System Design Interview</option>
                  </select>
                </div>
              </div>
              
              <div className={styles.modalActions}>
                <button 
                  className={styles.primaryButton}
                  disabled={!interviewDate || !interviewer}
                  onClick={() => {
                    // Schedule interview
                    alert(`Interview scheduled for ${selectedEmployee?.name || 'selected employee'}`);
                    setIsScheduling(false);
                    setInterviewDate('');
                    setInterviewer('');
                    setSelectedEmployee(null);
                  }}
                >
                  Schedule Interview
                </button>
                <button 
                  className={styles.secondaryButton}
                  onClick={() => {
                    setIsScheduling(false);
                    setInterviewDate('');
                    setInterviewer('');
                    setSelectedEmployee(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeliveryTeamDashboard;