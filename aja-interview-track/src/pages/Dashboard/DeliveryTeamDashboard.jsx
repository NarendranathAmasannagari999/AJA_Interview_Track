import React, { useState, useEffect } from 'react';
import { 
  FiUsers, FiCalendar, FiCheckCircle, FiClock, FiFileText, 
  FiSend, FiEdit, FiPlus, FiFilter, FiSearch, FiBarChart2,
  FiChevronDown, FiChevronUp, FiExternalLink, FiMail, FiUser, FiX
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, RadarChart, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line
} from 'recharts';
import styles from './DeliveryTeamDashboard.module.css';
import { 
  getEmployees, 
  scheduleInterview,
  updateMockInterviewFeedback,
  getUpcomingInterviews,
  getCompletedInterviews 
} from '../../API/delivery';
import ScheduleInterviewModal from './ScheduleInterviewModal';

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [interviewType, setInterviewType] = useState('mock');
  const [client, setClient] = useState('');
  const [level, setLevel] = useState('');
  const [jobDescriptionTitle, setJobDescriptionTitle] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isEmployeesLoading, setIsEmployeesLoading] = useState(false);
  const [isInterviewsLoading, setIsInterviewsLoading] = useState(false);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [showInterviewScheduler, setShowInterviewScheduler] = useState(false);
  const [selectedEmployeeForScheduling, setSelectedEmployeeForScheduling] = useState(null);
  const [interviewDetails, setInterviewDetails] = useState({
    level: 1,
    date: '',
    time: '',
    mode: 'virtual',
    link: '',
    location: '',
    notes: ''
  });
  const [selectedInterview, setSelectedInterview] = useState(null);

  const technologies = ['Java', 'Python', '.NET', 'DevOps', 'SalesForce', 'UI Development', 'Testing'];
  const resourceTypes = ['OM', 'TCT1', 'TCT2'];

  const LoadingSpinner = () => (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p>Loading dashboard data...</p>
    </div>
  );

  const ErrorMessage = ({ message, onRetry }) => (
    <div className={styles.errorContainer}>
      <h3>Error</h3>
      <p>{message}</p>
      <button 
        className={styles.primaryButton}
        onClick={onRetry}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Try Again'}
      </button>
    </div>
  );

  const validateEmployeeData = (employee) => {
    return employee && typeof employee === 'object' && 
           typeof employee.id === 'string' &&
           typeof employee.name === 'string' &&
           typeof employee.technology === 'string' &&
           typeof employee.resourceType === 'string';
  };

  const validateInterviewData = (interview) => {
    return interview && typeof interview === 'object' &&
           typeof interview.id === 'string' &&
           typeof interview.employeeId === 'string' &&
           typeof interview.status === 'string' &&
           (!interview.ratings || (
             typeof interview.ratings === 'object' &&
             typeof interview.ratings.technical === 'number' &&
             typeof interview.ratings.communication === 'number'
           ));
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch employees with filters
      const employeesData = await getEmployees(technologyFilter, resourceTypeFilter);
      if (Array.isArray(employeesData)) {
        setEmployees(employeesData);
      } else {
        console.error('Invalid employees data received:', employeesData);
        setEmployees([]);
      }

      // Fetch upcoming interviews
      let upcomingData = [];
      try {
        upcomingData = await getUpcomingInterviews();
        if (!Array.isArray(upcomingData)) {
          console.error('Invalid upcoming interviews data received:', upcomingData);
          upcomingData = [];
        }
      } catch (error) {
        console.error('Error fetching upcoming interviews:', error);
        setError(error.message || 'Failed to load upcoming interviews');
      }

      // Fetch completed interviews
      let completedData = [];
      try {
        completedData = await getCompletedInterviews();
        if (!Array.isArray(completedData)) {
          console.error('Invalid completed interviews data received:', completedData);
          completedData = [];
        }
      } catch (error) {
        console.error('Error fetching completed interviews:', error);
        setError(error.message || 'Failed to load completed interviews');
      }

      // Combine and set all interviews
      const allInterviews = [
        ...upcomingData,
        ...completedData,
      ].map(interview => {
        // Find the employee and get their full name from the user object
        const employee = employeesData.find(e => e && e.id === interview.employeeId);
        return {
          ...interview,
          employeeName: employee?.user?.fullName || 'Unknown Employee'
        };
      });
      setMockInterviews(allInterviews);

      // Update profiles sent to sales and deployed employees
      const sentToSales = completedData
        .filter(i => i && i.sentToSales)
        .map(i => i.employeeId);
      setProfilesSentToSales(sentToSales);

      const deployed = completedData
        .filter(i => i && i.deployed)
        .map(i => i.employeeId);
      setDeployedEmployees(deployed);

    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message || 'Failed to load dashboard data');
      
      // Set empty arrays for all data
      setEmployees([]);
      setMockInterviews([]);
      setProfilesSentToSales([]);
      setDeployedEmployees([]);
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredEmployees = Array.isArray(employees) ?
    employees.filter(employee => {
      if (!employee || !employee.user) return false;

      const matchesSearch = employee.user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
      const matchesTechnology = technologyFilter === 'all' || (employee.technology?.toLowerCase() === technologyFilter.toLowerCase());
      const matchesResourceType = resourceTypeFilter === 'all' || (employee.resourceType?.toLowerCase() === resourceTypeFilter.toLowerCase());

      return matchesSearch && matchesTechnology && matchesResourceType;
    })
    : [];

  const upcomingInterviews = Array.isArray(mockInterviews) 
    ? mockInterviews.filter(i => i && i.status === 'scheduled')
    : [];

  const completedInterviews = Array.isArray(mockInterviews)
    ? mockInterviews.filter(i => i && i.status === 'completed')
    : [];

  // Calculate average ratings by technology
  const techPerformanceData = technologies.map(tech => {
    const techInterviews = completedInterviews.filter(i => {
      const emp = (employees || []).find(e => e && e.id === i.employeeId);
      return emp && emp.technology === tech;
    });
    
    const avgTechnical = techInterviews.length > 0 
      ? techInterviews.reduce((sum, i) => sum + (i.ratings?.technical || 0), 0) / techInterviews.length
      : 0;
      
    const avgCommunication = techInterviews.length > 0 
      ? techInterviews.reduce((sum, i) => sum + (i.ratings?.communication || 0), 0) / techInterviews.length
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
      const emp = (employees || []).find(e => e && e.id === i.employeeId);
      return emp && emp.resourceType === type;
    });
    
    const avgTechnical = typeInterviews.length > 0 
      ? typeInterviews.reduce((sum, i) => sum + (i.ratings?.technical || 0), 0) / typeInterviews.length
      : 0;
      
    const avgCommunication = typeInterviews.length > 0 
      ? typeInterviews.reduce((sum, i) => sum + (i.ratings?.communication || 0), 0) / typeInterviews.length
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
    .filter(i => i && i.ratings && ((i.ratings.technical + i.ratings.communication) / 2 >= 8))
    .map(i => {
      const emp = (employees || []).find(e => e && e.id === i.employeeId);
      return {
        ...i,
        technology: emp?.technology || '',
        resourceType: emp?.resourceType || '',
        employeeName: emp?.user?.fullName || 'Unknown Employee'
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

  const handleScheduleInterviewSubmit = async (interviewData) => {
    setIsLoading(true);
    setIsInterviewsLoading(true);
    setError(null);
    try {
      const response = await scheduleInterview({
        empId: interviewData.empId,
        date: interviewData.date,
        time: interviewData.time,
        interviewerId: interviewData.interviewerId
      });
      
      if (response) {
        // Update mock interviews state with the new interview
        setMockInterviews(prev => {
          const newInterview = {
            ...response,
            employeeName: employees.find(e => e.id === response.employeeId)?.user?.fullName || 'Unknown Employee'
          };
          return [...prev, newInterview];
        });
        
        // Close the modal and reset state
        setShowInterviewScheduler(false);
        setSelectedEmployeeForScheduling(null);
        
        // Show success message
        setError({ type: 'success', message: 'Interview scheduled successfully!' });
        
        // Refresh the data to ensure consistency
        await fetchData();
      }
    } catch (error) {
      console.error('Error scheduling interview:', error);
      setError({ 
        type: 'error', 
        message: error.message || 'Failed to schedule interview. Please try again.' 
      });
    } finally {
      setIsLoading(false);
      setIsInterviewsLoading(false);
    }
  };

  const handleUpdateFeedback = async () => {
    if (!selectedInterview) return;

    try {
        // Validate input
        if (!feedback.technical || !feedback.communication) {
            setError('Please provide both technical and communication feedback');
            return;
        }

        if (ratings.technical < 0 || ratings.technical > 10 || ratings.communication < 0 || ratings.communication > 10) {
            setError('Scores must be between 0 and 10');
            return;
        }

    setIsSubmitting(true);
    setIsFeedbackLoading(true);
    setError(null);

        // Combine feedback
        const combinedFeedback = `Technical Feedback: ${feedback.technical} | Communication Feedback: ${feedback.communication}`;

        // Update feedback using the API
      const updatedInterview = await updateMockInterviewFeedback(
            selectedInterview.id,
        combinedFeedback,
            ratings.technical,
            ratings.communication
      );
      
      if (updatedInterview) {
        // Update the interviews list with the new feedback
        setMockInterviews(prev => 
          prev.map(interview => 
                    interview.id === selectedInterview.id ? {
                        ...interview,
              ...updatedInterview,
                        employeeName: employees.find(e => e.id === updatedInterview.employeeId)?.user?.fullName || 'Unknown Employee'
            } : interview
          )
        );
        
        // Show success message
            setError('Feedback updated successfully!');
        
            // Close the modal and reset state
            setSelectedInterview(null);
            setFeedback({ technical: '', communication: '' });
            setRatings({ technical: 0, communication: 0 });
      }
    } catch (error) {
      console.error('Error updating feedback:', error);
        setError(error.message || 'Failed to update feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
      setIsFeedbackLoading(false);
    }
  };

  const handleCloseFeedbackModal = () => {
    setSelectedInterview(null);
    setFeedback({ technical: '', communication: '' });
    setRatings({ technical: 0, communication: 0 });
    setError(null);
  };

  const sendToSales = async (employeeId) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await sendToSales(employeeId);
      setProfilesSentToSales(prev => [...prev, employeeId]);
    } catch (error) {
      console.error('Error sending to sales:', error);
      setError('Failed to send profile to sales. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTabContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return <ErrorMessage message={error} onRetry={fetchData} />;
    }

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
                onClick={() => setShowInterviewScheduler(true)}
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
                      <h3>{employee.user?.fullName || 'Unknown Employee'}</h3>
                      <div className={styles.cardMeta}>
                        <span className={`${styles.techBadge} ${styles[employee.technology?.replace(' ', '')]}`}>
                          {employee.technology || 'Unknown'}
                        </span>
                        <span className={`${styles.resourceBadge} ${styles[employee.resourceType]}`}>
                          {employee.resourceType || 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.cardDetails}>
                    <p><strong>Employee ID:</strong> {employee.empId || 'N/A'}</p>
                    <p><strong>Status:</strong> {employee.status || 'N/A'}</p>
                  </div>
                  <div className={styles.cardFooter}>
                    <button 
                      className={styles.secondaryButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEmployeeForScheduling(employee);
                        setShowInterviewScheduler(true);
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
                Upcoming Interviews
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
                <div className={styles.employeeList}>
                  {employees.map(employee => (
                    <motion.div
                      key={employee.id}
                      className={styles.interviewCard}
                      whileHover={{ scale: 1.01 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={styles.interviewHeader}>
                        <div>
                          <h4>{employee.user?.fullName || 'Unknown Employee'}</h4>
                          <div className={styles.interviewMeta}>
                            <span className={`${styles.techBadge} ${styles[employee.technology?.replace(' ', '')]}`}>
                              {employee.technology || 'Unknown'}
                            </span>
                            <span className={`${styles.resourceBadge} ${styles[employee.resourceType]}`}>
                              {employee.resourceType || 'Unknown'}
                            </span>
                          </div>
                        </div>
                        <div className={styles.employeeId}>
                          <FiUser /> {employee.empId || 'N/A'}
                        </div>
                      </div>
                      <div className={styles.interviewDetails}>
                        <p><strong>Status:</strong> {employee.status || 'N/A'}</p>
                      </div>
                      <div className={styles.interviewActions}>
                        <button 
                          className={styles.primaryButton}
                          onClick={() => {
                            setSelectedEmployeeForScheduling(employee);
                            setShowInterviewScheduler(true);
                          }}
                        >
                          Schedule Interview
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                upcomingInterviews.map(interview => {
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
                          <h4>{interview.employee?.user?.fullName || 'Unknown Employee'}</h4>
                          <div className={styles.interviewMeta}>
                            <span className={`${styles.techBadge} ${styles[interview.employee?.technology?.replace(' ', '')]}`}>
                              {interview.employee?.technology || 'Unknown'}
                            </span>
                            <span className={`${styles.resourceBadge} ${styles[interview.employee?.resourceType]}`}>
                              {interview.employee?.resourceType || 'Unknown'}
                            </span>
                          </div>
                        </div>
                        <div className={styles.interviewDate}>
                          <FiCalendar /> {interview.date} at {interview.time}
                        </div>
                      </div>
                      <div className={styles.interviewDetails}>
                        <p><strong>Employee ID:</strong> {interview.employee?.empId || 'N/A'}</p>
                        <p><strong>Status:</strong> {interview.status || 'N/A'}</p>
                        <p><strong>Interviewer:</strong> {interview.interviewer?.fullName || 'N/A'}</p>
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
            </div>
          </div>
        );
      case 'completed':
        return (
          <div className={styles.sectionContainer}>
            <div className={styles.interviewTabs}>
              <button 
                className={`${styles.interviewTabButton} ${styles.active}`}
              >
                Completed Interviews
              </button>
            </div>
            
            <div className={styles.interviewList}>
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
                          <h4>{interview.employee?.user?.fullName || 'Unknown Employee'}</h4>
                          <div className={styles.interviewMeta}>
                            <span className={`${styles.techBadge} ${styles[interview.employee?.technology?.replace(' ', '')]}`}>
                              {interview.employee?.technology || 'Unknown'}
                            </span>
                            <span className={`${styles.resourceBadge} ${styles[interview.employee?.resourceType]}`}>
                              {interview.employee?.resourceType || 'Unknown'}
                            </span>
                            <span className={styles.status}>
                              {interview.status}
                            </span>
                          </div>
                        </div>
                        <div className={styles.interviewDate}>
                          <FiCalendar /> {interview.date} at {interview.time}
                        </div>
                      </div>
                      
                      <div className={styles.interviewDetails}>
                        <p><strong>Employee ID:</strong> {interview.employee?.empId || 'N/A'}</p>
                        <p><strong>Interviewer:</strong> {interview.interviewer?.fullName || 'N/A'}</p>
                      </div>
                      
                      <div className={styles.interviewScores}>
                        <div className={styles.scoreMeter}>
                          <div className={styles.scoreLabel}>
                            Technical: {interview.technicalRating || 'N/A'}/10
                          </div>
                          <div className={styles.scoreBar}>
                            <div 
                              className={styles.scoreFill} 
                              style={{
                                width: `${(interview.technicalRating || 0) * 10}%`,
                                backgroundColor: getScoreColor(interview.technicalRating || 0)
                              }}
                            />
                          </div>
                        </div>
                        <div className={styles.scoreMeter}>
                          <div className={styles.scoreLabel}>
                            Communication: {interview.communicationRating || 'N/A'}/10
                          </div>
                          <div className={styles.scoreBar}>
                            <div 
                              className={styles.scoreFill} 
                              style={{
                                width: `${(interview.communicationRating || 0) * 10}%`,
                                backgroundColor: getScoreColor(interview.communicationRating || 0)
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className={styles.feedback}>
                        <h5>Technical Feedback</h5>
                        <p>{interview.technicalFeedback?.split(' | ')[0]?.replace('Technical Feedback: ', '') || 'N/A'}</p>
                        
                        <h5>Communication Feedback</h5>
                        <p>{interview.technicalFeedback?.split(' | ')[1]?.replace('Communication Feedback: ', '') || 'N/A'}</p>
                      </div>
                      
                      <div className={styles.interviewActions}>
                        <button 
                          className={styles.secondaryButton}
                          onClick={() => {
                            setSelectedInterview(interview);
                            setRatings({
                              technical: interview.technicalRating || 0,
                              communication: interview.communicationRating || 0
                            });
                            const feedbackParts = interview.technicalFeedback?.split(' | ');
                            const techFeedback = feedbackParts && feedbackParts[0]?.replace('Technical Feedback: ', '');
                            const commFeedback = feedbackParts && feedbackParts[1]?.replace('Communication Feedback: ', '');
                            setFeedback({
                              technical: techFeedback || '',
                              communication: commFeedback || ''
                            });
                          }}
                        >
                          <FiEdit /> Edit Feedback
                        </button>
                        
                        {interview.deployed ? (
                          <span className={styles.deployedBadge}>
                            <FiCheckCircle /> Deployed to Client
                          </span>
                        ) : interview.sentToSales ? (
                          <span className={styles.sentBadge}>
                            <FiSend /> Sent to Sales
                          </span>
                        ) : (
                          <button
                            className={styles.successButton}
                            onClick={() => sendToSales(interview.employee.id)}
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
                    ? (completedInterviews.reduce((sum, i) => sum + (i.ratings?.technical || 0), 0) / completedInterviews.length).toFixed(1)
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
                <h5>Avg Communication Score</h5>
                <p className={styles.statValue}>
                  {completedInterviews.length > 0 
                    ? (completedInterviews.reduce((sum, i) => sum + (i.ratings?.communication || 0), 0) / completedInterviews.length).toFixed(1)
                    : '0.0'}
                </p>
                <p className={styles.statLabel}>/ 10.0</p>
              </motion.div>
              <motion.div 
                className={styles.statCard}
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
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
                transition={{ duration: 0.3, delay: 0.5 }}
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

  const renderModalActions = () => (
    <div className={styles.modalActions}>
      <button 
        className={styles.primaryButton}
        disabled={isSubmitting || isFeedbackLoading || !feedback.technical || !feedback.communication}
        onClick={handleUpdateFeedback}
      >
        {isSubmitting || isFeedbackLoading ? (
          <>
            <div className={styles.spinner} style={{ width: '20px', height: '20px', margin: '0' }} />
            Saving...
          </>
        ) : (
          'Save Evaluation'
        )}
      </button>
      <button 
        className={styles.secondaryButton}
        disabled={isSubmitting || isFeedbackLoading}
        onClick={() => {
          setSelectedInterview(null);
          setFeedback({ technical: '', communication: '' });
          setRatings({ technical: 0, communication: 0 });
          setError(null);
        }}
      >
        Close
      </button>
    </div>
  );

  // Add error boundary component
  const ErrorBoundary = ({ children }) => {
    const [hasError, setHasError] = useState(false);
    const [errorInfo, setErrorInfo] = useState(null);

    if (hasError) {
      return (
        <div className={styles.errorContainer}>
          <h3>Something went wrong</h3>
          <p>Please try refreshing the page or contact support if the problem persists.</p>
          <button 
            className={styles.primaryButton}
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return children;
  };

  // Add loading component
  const LoadingState = () => (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p>{isInitialLoading ? 'Loading dashboard...' : 'Updating data...'}</p>
    </div>
  );

  // Wrap the main content with error boundary
  return (
    <ErrorBoundary>
    <div className={styles.dashboardContainer}>
        {isInitialLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchData} />
        ) : (
          <>
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
            <span className={styles.userName}>Anil Choppari</span>
            <span className={styles.userName}>Delivery Manager ({'anil.choppari3@gmail.com'})</span>
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
          <FiCalendar /> Upcoming Interviews
        </motion.button>
        <motion.button
          className={`${styles.tab} ${activeTab === 'completed' ? styles.active : ''}`}
          onClick={() => setActiveTab('completed')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiCheckCircle /> Completed Interviews
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
        {isLoading ? <LoadingState /> : renderTabContent()}
      </motion.div>
      
      <AnimatePresence>
        {selectedInterview && (
          <motion.div 
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedInterview(null)}
          >
            <motion.div 
              className={styles.modalContent}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h3>{selectedInterview.employee?.user?.fullName || 'Unknown Employee'}'s Evaluation</h3>
                <button 
                  className={styles.closeButton}
                  onClick={() => setSelectedInterview(null)}
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
                      <h4>{selectedInterview.employee?.user?.fullName || 'Unknown Employee'}</h4>
                      <div className={styles.profileMeta}>
                        <span className={`${styles.techBadge} ${styles[selectedInterview.employee?.technology?.replace(' ', '')]}`}>
                          {selectedInterview.employee?.technology || 'Unknown'}
                        </span>
                        <span className={`${styles.resourceBadge} ${styles[selectedInterview.employee?.resourceType]}`}>
                          {selectedInterview.employee?.resourceType || 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.profileStats}>
                    <div className={styles.statItem}>
                      <span>Mock Interviews</span>
                      <strong>
                        {mockInterviews.filter(i => i.employeeId === selectedInterview.employee?.id).length}
                      </strong>
                    </div>
                    <div className={styles.statItem}>
                      <span>Avg Technical</span>
                      <strong>
                        {mockInterviews.filter(i => i.employeeId === selectedInterview.employee?.id && i.ratings)
                          .reduce((sum, i) => sum + i.ratings.technical, 0) / 
                          mockInterviews.filter(i => i.employeeId === selectedInterview.employee?.id && i.ratings).length || 'N/A'}
                      </strong>
                    </div>
                    <div className={styles.statItem}>
                      <span>Avg Communication</span>
                      <strong>
                        {mockInterviews.filter(i => i.employeeId === selectedInterview.employee?.id && i.ratings)
                          .reduce((sum, i) => sum + i.ratings.communication, 0) / 
                          mockInterviews.filter(i => i.employeeId === selectedInterview.employee?.id && i.ratings).length || 'N/A'}
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
              
              {renderModalActions()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showInterviewScheduler && (
          <ScheduleInterviewModal
            show={showInterviewScheduler}
            onClose={() => {
              setShowInterviewScheduler(false);
              setSelectedEmployeeForScheduling(null);
            }}
            onSubmit={handleScheduleInterviewSubmit}
            employees={employees}
            selectedEmployee={selectedEmployeeForScheduling}
          />
        )}
      </AnimatePresence>
          </>
        )}
    </div>
    </ErrorBoundary>
  );
};

export default DeliveryTeamDashboard;