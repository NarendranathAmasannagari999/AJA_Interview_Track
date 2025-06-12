import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiFileText, FiUpload, FiClock, FiCheckCircle, FiXCircle, FiUser, 
  FiBarChart2, FiMail, FiCalendar, FiAward, FiBook, FiUsers, FiFilter,
  FiSearch, FiShare2, FiDownload, FiMessageSquare, FiHelpCircle, FiRefreshCw,
  FiPlus, FiChevronUp, FiChevronDown
} from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import styles from './EmployeeDashboard.module.css';
import axiosInstance from '../../API/axiosConfig';
import {
  getMockInterviews,
  getClientInterviews,
  getJobDescriptions,
  uploadResume,
  downloadResume,
  deleteResume,
  addInterviewQuestion,
  getInterviewQuestions,
  updateEmployeeDetails,
  getDeployedEmployees,
  updateProfilePicture,
  getProfilePicture
} from '../../API/employee';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState(null);
  const [employeeData, setEmployeeData] = useState({
    empId: '',
    technology: '',
    resourceType: '',
    level: '',
    status: '',
    name: '',
    userEmail: ''
  });
  const [mockInterviews, setMockInterviews] = useState([]);
  const [clientInterviews, setClientInterviews] = useState([]);
  const [jobDescriptions, setJobDescriptions] = useState([]);
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [profilePic, setProfilePic] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedJd, setSelectedJd] = useState('');
  const [newQuestion, setNewQuestion] = useState({
    technology: '',
    question: '',
    user: ''
  });
  const [interviewForm, setInterviewForm] = useState({
    interviewType: 'mock',
    date: '',
    time: '',
    client: '',
    interviewerId: '',
    level: '',
    jobDescriptionTitle: '',
    meetingLink: ''
  });
  const [filters, setFilters] = useState({
    technology: 'all',
    resourceType: 'all'
  });
  const [activeTab, setActiveTab] = useState('jd');
  const [activeInterviewTab, setActiveInterviewTab] = useState('mock');
  const [loading, setLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [technologyFilter, setTechnologyFilter] = useState('all');
  const [resourceTypeFilter, setResourceTypeFilter] = useState('all');
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [deployedEmployees, setDeployedEmployees] = useState([]);
  const [resumeStatus, setResumeStatus] = useState('pending');
  const [openAccordionPanel, setOpenAccordionPanel] = useState('mock');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedInterviewDetails, setSelectedInterviewDetails] = useState(null);

  const dashboardTabs = [
    { id: 'jd', label: 'Job Descriptions', icon: <FiFileText /> },
    { id: 'resume', label: 'Resume Preparation', icon: <FiUpload /> },
    { id: 'interviews', label: 'Client Interviews', icon: <FiMessageSquare /> },
    { id: 'performance', label: 'Performance', icon: <FiBarChart2 /> },
    { id: 'profile', label: 'My Profile', icon: <FiUser /> }
  ];

  useEffect(() => {
    if (employeeData.technology && employeeData.name) {
      setNewQuestion(prev => ({
        ...prev,
        technology: employeeData.technology,
        user: employeeData.name
      }));
    }
  }, [employeeData.technology, employeeData.name]);

  // Mock data for performance charts (since backend doesn't provide this)
  const mockInterviewData = mockInterviews.map((interview, index) => ({
    name: `Interview ${index + 1}`,
    technical: interview.ratings?.technical || 0,
    communication: interview.ratings?.communication || 0
  }));

  const deploymentStatusData = [
    { name: 'Selected', value: clientInterviews.filter(i => i.status === 'completed' && i.result === 'selected').length },
    { name: 'Rejected', value: clientInterviews.filter(i => i.status === 'completed' && i.result === 'rejected').length },
    { name: 'Pending', value: clientInterviews.filter(i => i.status === 'scheduled').length }
  ];

  const COLORS = ['#0088FE', '#FF8042', '#00C49F'];

  const performanceData = [
    { name: 'Technical Skills', score: mockInterviews.reduce((sum, i) => sum + (i.ratings?.technical || 0), 0) / (mockInterviews.length || 1) },
    { name: 'Communication', score: mockInterviews.reduce((sum, i) => sum + (i.ratings?.communication || 0), 0) / (mockInterviews.length || 1) }
  ];

  // Load initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('jwt_token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Get employee ID from auth context or local storage
        const empId = localStorage.getItem('employeeId') || 1; // Fallback to 1 for testing
        setEmployeeId(empId);

        // Fetch employee data
        const employeeResponse = await updateEmployeeDetails(empId);
        setEmployeeData({
          empId: employeeResponse.empId,
          technology: employeeResponse.technology || '',
          resourceType: employeeResponse.resourceType || '',
          level: employeeResponse.level || '',
          status: employeeResponse.status || '',
          name: employeeResponse.user?.fullName || 'Employee',
          userEmail: employeeResponse.user?.email || 'n.amasannagari@ajacs.in'
        });

        // Fetch profile picture
        try {
          const picBlob = await getProfilePicture(empId);
          const picUrl = URL.createObjectURL(picBlob);
          setProfilePic(picUrl);
        } catch (picError) {
          console.warn('Could not load profile picture:', picError.message);
        }

        // Fetch other data
        await Promise.all([
          fetchMockInterviews(empId),
          fetchClientInterviews(empId),
          fetchJobDescriptions(),
          fetchInterviewQuestions(),
          fetchDeployedEmployees()
        ]);
      } catch (err) {
        if (err.message.includes('Unauthorized')) {
          localStorage.removeItem('jwt_token');
          navigate('/login');
        }
        toast.error(err.message);
      } finally {
        setLoading(false);
        setIsDataLoading(false);
      }
    };

    fetchInitialData();
  }, [navigate]);

  const fetchMockInterviews = async (empId) => {
    try {
      const data = await getMockInterviews(empId, technologyFilter, resourceTypeFilter);
      setMockInterviews(data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchClientInterviews = async (empId) => {
    try {
      const data = await getClientInterviews(empId, technologyFilter, resourceTypeFilter);
      setClientInterviews(data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchJobDescriptions = async () => {
    try {
      const data = await getJobDescriptions(searchTerm, technologyFilter, resourceTypeFilter);
      setJobDescriptions(data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchInterviewQuestions = async () => {
    try {
      const data = await getInterviewQuestions(technologyFilter);
      setInterviewQuestions(data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchDeployedEmployees = async () => {
    try {
      setLoading(true);
      const data = await getDeployedEmployees();
      setDeployedEmployees(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };


  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axiosInstance.post('/api/employee/schedule-interview', {
        empId: employeeData.empId,
        ...interviewForm
      });
      if (interviewForm.interviewType === 'mock') {
        setMockInterviews([...mockInterviews, response.data]);
        toast.success('Mock interview scheduled successfully');
      } else {
        setClientInterviews([...clientInterviews, response.data]);
        toast.success('Client interview scheduled successfully');
      }
      setShowInterviewModal(false);
      setInterviewForm({
        interviewType: 'mock',
        date: '',
        time: '',
        client: '',
        interviewerId: '',
        level: '',
        jobDescriptionTitle: '',
        meetingLink: ''
      });
    } catch (err) {
      toast.error(err.response?.data || 'Failed to schedule interview');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData(prev => ({ ...prev, [name]: value }));
  };

  const handleInterviewFormChange = (e) => {
    const { name, value } = e.target;
    setInterviewForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    if (name === 'technology') setTechnologyFilter(value);
    else if (name === 'resourceType') setResourceTypeFilter(value);
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleJdChange = (e) => {
    setSelectedJd(e.target.value);
  };

  const handleSubmitEmployeeDetails = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updatedEmployee = await updateEmployeeDetails(
        employeeId,
        employeeData.technology,
        employeeData.empId
      );
      setEmployeeData({
        empId: updatedEmployee.empId,
        technology: updatedEmployee.technology,
        resourceType: updatedEmployee.resourceType,
        level: updatedEmployee.level,
        status: updatedEmployee.status,
        name: updatedEmployee.user?.fullName,
        userEmail: updatedEmployee.user?.email
      });
      toast.success('Employee details updated successfully!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadResume = async (e) => {
    e.preventDefault();
    if (!selectedFile || !selectedJd) {
      toast.error('Please select both a file and a job description');
      return;
    }
    try {
      setLoading(true);
      const resume = await uploadResume(employeeId, selectedJd, selectedFile);
      setResumeStatus('pending');
      toast.success('Resume uploaded successfully!');
      setSelectedFile(null);
      setSelectedJd('');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadResume = async (resumeId) => {
    try {
      setLoading(true);
      const blob = await downloadResume(resumeId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume_${resumeId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Resume downloaded successfully!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResume = async (resumeId) => {
    try {
      setLoading(true);
      await deleteResume(resumeId);
      toast.success('Resume deleted successfully!');
      fetchMockInterviews(employeeId);
      fetchClientInterviews(employeeId);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const question = await addInterviewQuestion(
        newQuestion.technology,
        newQuestion.question,
        newQuestion.user
      );
      setInterviewQuestions([...interviewQuestions, question]);
      setNewQuestion({ technology: '', question: '', user: '' });
      setShowQuestionModal(false);
      toast.success('Interview question added successfully!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setLoading(true);
      await updateProfilePicture(employeeId, file);
      const picBlob = await getProfilePicture(employeeId);
      const picUrl = URL.createObjectURL(picBlob);
      setProfilePic(picUrl);
      toast.success('Profile picture updated successfully!');
      setSelectedFile(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : 'N/A';
  };

  const filteredInterviewQuestions = interviewQuestions.filter(
    q => technologyFilter === 'all' || q.technology.toLowerCase() === technologyFilter
  );

  const filteredDeployedEmployees = () => deployedEmployees.filter(
    e => (technologyFilter === 'all' || (e.technology && e.technology.toLowerCase() === technologyFilter.toLowerCase())) 
      && (resourceTypeFilter === 'all' || (e.resourceType && e.resourceType.toLowerCase() === resourceTypeFilter.toLowerCase()))
  );

  const renderPerformanceSection = () => {
    if (!mockInterviews?.length && !clientInterviews?.length) {
      return (
        <div className={styles.emptyState}>
          <FiHelpCircle size={48} />
          <p>Complete some interviews to see your performance metrics</p>
        </div>
      );
    }

    return (
      <div className={styles.sectionContainer}>
        <div className={styles.performanceGrid}>
          <div className={styles.chartContainer}>
            <h4>Mock Interview Scores</h4>
            {mockInterviewData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockInterviewData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="technical" fill="#8884d8" name="Technical" />
                  <Bar dataKey="communication" fill="#82ca9d" name="Communication" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className={styles.emptyChart}>
                <p>No mock interview data available</p>
              </div>
            )}
          </div>

          <div className={styles.chartContainer}>
            <h4>Deployment Status</h4>
            {deploymentStatusData.some(item => item.value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={deploymentStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {deploymentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className={styles.emptyChart}>
                <p>No deployment data available</p>
              </div>
            )}
          </div>
        </div>

        <div className={styles.statsGrid}>
          {[
            { title: 'Mock Interviews', value: mockInterviews?.length || 0, label: 'Completed' },
            { title: 'Avg. Technical Score', value: performanceData[0]?.score?.toFixed(1) || '0.0', label: '/ 10.0' },
            { title: 'Avg. Communication', value: performanceData[1]?.score?.toFixed(1) || '0.0', label: '/ 10.0' },
            { 
              title: 'Conversion Rate', 
              value: clientInterviews?.length ? 
                `${((clientInterviews.filter(i => i?.status === 'completed' && i?.result === 'selected').length / clientInterviews.length) * 100).toFixed(0)}%` : 
                '0%',
              label: 'Success'
            }
          ].map((stat, index) => (
            <motion.div key={index} className={styles.statCard} whileHover={{ scale: 1.05 }}>
              <h5>{stat.title}</h5>
              <p className={styles.statValue}>{stat.value}</p>
              <p className={styles.statLabel}>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'jd':
        return (
          <div className={styles.sectionContainer}>
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
              <div className={styles.filterControls}>
                <div className={styles.filterGroup}>
                  <label htmlFor="technology-filter"><FiFilter /> Technology:</label>
                  <select 
                    id="technology-filter" 
                    value={technologyFilter}
                    onChange={handleFilterChange}
                    name="technology"
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
                  <label htmlFor="resource-filter"><FiUsers /> Resource Type:</label>
                  <select 
                    id="resource-filter" 
                    value={resourceTypeFilter}
                    onChange={handleFilterChange}
                    name="resourceType"
                  >
                    <option value="all">All Types</option>
                    <option value="TCT1">TCT1</option>
                    <option value="OM">OM</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={styles.cardGrid}>
              <AnimatePresence>
                {jobDescriptions.length > 0 ? (
                  jobDescriptions.map(jd => (
                    <motion.div 
                      key={jd.id} 
                      className={styles.card}
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <div className={styles.cardHeader}>
                        <h3>{jd.title}</h3>
                        <div className={styles.techBadge}>{jd.technology}</div>
                        <div className={styles.resourceBadge}>{jd.resourceType}</div>
                      </div>
                      <p className={styles.clientName}><strong>Client:</strong> {jd.client}</p>
                      <div className={styles.cardActions}>
                        <button 
                          className={styles.primaryButton}
                          onClick={() => {
                            setSelectedJd(jd.id);
                            setActiveTab('resume');
                          }}
                        >
                          <FiFileText /> Prepare Resume
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    className={styles.emptyState}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <FiHelpCircle size={48} />
                    <p>No Job Descriptions Found</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );

      case 'resume':
        return (
          <div className={styles.sectionContainer}>
            <h3 className={styles.sectionTitle}><FiFileText /> Resume Preparation</h3>
            <motion.div className={styles.statusCard}>
              <div className={`${styles.statusIndicator} ${styles[resumeStatus]}`}>
                {resumeStatus === 'pending' && <FiClock size={24} />}
                {resumeStatus === 'submitted' && <FiCheckCircle size={24} />}
                {resumeStatus === 'rejected' && <FiXCircle size={24} />}
                <span>{resumeStatus.charAt(0).toUpperCase() + resumeStatus.slice(1)}</span>
              </div>

              {resumeStatus === 'pending' && (
                <motion.div className={styles.uploadArea}>
                  <FiFileText size={48} />
                  <select value={selectedJd} onChange={handleJdChange} className={styles.select}>
                    <option value="">Select Job Description</option>
                    {jobDescriptions.map(jd => (
                      <option key={jd.id} value={jd.id}>{jd.title}</option>
                    ))}
                  </select>
                  <input 
                    type="file" 
                    id="resumeUpload" 
                    onChange={handleFileChange} 
                    accept=".pdf" 
                    className={styles.fileInput}
                  />
                  <label htmlFor="resumeUpload" className={styles.uploadButton}>
                    <FiUpload /> Select Resume
                  </label>
                  <button 
                    onClick={handleUploadResume}
                    disabled={loading || !selectedFile || !selectedJd}
                    className={styles.primaryButton}
                  >
                    {loading ? 'Uploading...' : 'Upload Resume'}
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        );

      case 'interviews':
        return (
          <div className={styles.sectionContainer}>
            <div className={styles.filterSection}>
              <div className={styles.filterControls}>
                <div className={styles.filterGroup}>
                  <label htmlFor="interview-tech-filter"><FiFilter /> Technology:</label>
                  <select 
                    id="interview-tech-filter" 
                    value={technologyFilter}
                    onChange={handleFilterChange}
                    name="technology"
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
                  <label htmlFor="interview-resource-filter"><FiUsers /> Resource Type:</label>
                  <select 
                    id="interview-resource-filter" 
                    value={resourceTypeFilter}
                    onChange={handleFilterChange}
                    name="resourceType"
                  >
                    <option value="all">All Types</option>
                    <option value="TCT1">TCT1</option>
                    <option value="OM">OM</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mock Interviews Accordion Panel */}
            <div className={styles.accordionPanel}>
              <div 
                className={styles.accordionHeader}
                onClick={() => setOpenAccordionPanel(openAccordionPanel === 'mock' ? null : 'mock')}
              >
                <h4><FiMessageSquare /> Mock Interviews</h4>
                {openAccordionPanel === 'mock' ? <FiChevronUp /> : <FiChevronDown />}
              </div>
              <AnimatePresence>
                {openAccordionPanel === 'mock' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className={styles.accordionContent}
                  >
                    {mockInterviews.length > 0 ? (
                      mockInterviews.map(interview => (
                        <motion.div 
                          key={interview.id} 
                          className={styles.interviewCard}
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className={styles.interviewHeader}>
                            <div>
                              <h4>Interview with {interview.interviewer?.name || 'TBD'}</h4>
                              <div className={styles.interviewMeta}>
                                <span className={styles.techBadge}>{interview.employee?.technology}</span>
                                <span className={styles.resourceBadge}>{interview.employee?.resourceType}</span>
                                <span><FiCalendar /> {formatDate(interview.date)}</span>
                              </div>
                            </div>
                            <span className={`${styles.status} ${styles[interview.status]}`}>
                              {interview.status}
                            </span>
                          </div>
                          {interview.resume && (
                            <div className={styles.interviewActions}>
                              <button 
                                onClick={() => handleDownloadResume(interview.resume.id)}
                                className={styles.primaryButton}
                              >
                                <FiDownload /> Resume
                              </button>
                              <button 
                                onClick={() => handleDeleteResume(interview.resume.id)}
                                className={styles.secondaryButton}
                              >
                                Delete Resume
                              </button>
                            </div>
                          )}
                        </motion.div>
                      ))
                    ) : (
                      <motion.div className={styles.emptyState}>
                        <FiHelpCircle size={48} />
                        <p>No Mock Interviews Found</p>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Client Interviews Accordion Panel */}
            <div className={styles.accordionPanel}>
              <div 
                className={styles.accordionHeader}
                onClick={() => setOpenAccordionPanel(openAccordionPanel === 'client' ? null : 'client')}
              >
                <h4><FiUsers /> Client Interviews</h4>
                {openAccordionPanel === 'client' ? <FiChevronUp /> : <FiChevronDown />}
              </div>
              <AnimatePresence>
                {openAccordionPanel === 'client' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className={styles.accordionContent}
                  >
                    {clientInterviews.length > 0 ? (
                      clientInterviews.map(interview => (
                        <motion.div 
                          key={interview.id} 
                          className={styles.interviewCard}
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className={styles.interviewHeader}>
                            <div>
                              <h4>{interview.client} - Level {interview.level}</h4>
                              <div className={styles.interviewMeta}>
                                <span className={styles.techBadge}>{interview.employee?.technology}</span>
                                <span className={styles.resourceBadge}>{interview.employee?.resourceType}</span>
                                <span><FiCalendar /> {formatDate(interview.date)}</span>
                                <span>For JD: {interview.jobDescriptionTitle}</span>
                              </div>
                            </div>
                            <span className={`${styles.status} ${styles[interview.status]}`}>
                              {interview.status}
                            </span>
                          </div>
                            <div className={styles.interviewActions}>
                            <button 
                                className={styles.primaryButton}
                              onClick={() => {
                                console.log('Technology from employeeData:', employeeData.technology);
                                console.log('User name from employeeData:', employeeData.name);
                                setNewQuestion(prev => ({
                                  ...prev,
                                  technology: interview.employee?.technology || employeeData.technology,
                                  user: employeeData.name
                                }));
                                setShowQuestionModal(true);
                              }}
                            >
                              <FiShare2 /> Share a Question
                            </button>
                          </div>
                          {(interview.status === 'scheduled' || interview.result) && (
                            <div className={styles.interviewActions}>
                              <button 
                                onClick={() => {
                                  setSelectedInterviewDetails(interview);
                                  setShowDetailsModal(true);
                                }}
                                className={styles.primaryButton}
                              >
                                Details
                              </button>
                            </div>
                          )}
                          {interview.resume && (
                            <div className={styles.interviewActions}>
                              <button 
                                onClick={() => handleDownloadResume(interview.resume.id)}
                                className={styles.primaryButton}
                              >
                                <FiDownload /> Resume
                              </button>
                              <button 
                                onClick={() => handleDeleteResume(interview.resume.id)}
                                className={styles.secondaryButton}
                              >
                                Delete Resume
                              </button>
                            </div>
                          )}
                        </motion.div>
                      ))
                    ) : (
                      <motion.div className={styles.emptyState}>
                        <FiHelpCircle size={48} />
                        <p>No Client Interviews Found</p>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Deployed Colleagues Accordion Panel */}
            <div className={styles.accordionPanel}>
              <div 
                className={styles.accordionHeader}
                onClick={() => setOpenAccordionPanel(openAccordionPanel === 'deployed' ? null : 'deployed')}
              >
                <h4><FiAward /> Deployed Colleagues</h4>
                <div className={styles.accordionActions}>
                  <button 
                    className={styles.iconButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      fetchDeployedEmployees();
                      toast.info('Refreshing deployed colleagues list...');
                    }}
                  >
                    <FiRefreshCw />
                  </button>
                  {openAccordionPanel === 'deployed' ? <FiChevronUp /> : <FiChevronDown />}
                </div>
              </div>
              <AnimatePresence>
                {openAccordionPanel === 'deployed' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className={styles.accordionContent}
                  >
                    <div className={styles.deployedGrid}>
                      {loading ? (
                        <motion.div className={styles.loadingContainer}>
                          <div className={styles.loadingSpinner}></div>
                          <p>Loading deployed colleagues...</p>
                        </motion.div>
                      ) : filteredDeployedEmployees().length > 0 ? (
                        filteredDeployedEmployees().map(employee => (
                          <motion.div 
                            key={employee.id} 
                            className={styles.deployedCard}
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className={styles.deployedHeader}>
                              <div className={styles.avatar}>
                                {employee.user?.fullName?.charAt(0) || 'E'}
                              </div>
                              <div>
                                <h5>{employee.user?.fullName || 'Employee'}</h5>
                                <div className={styles.deployedMeta}>
                                  <span className={styles.techBadge}>{employee.technology || 'N/A'}</span>
                                  <span className={styles.resourceBadge}>{employee.resourceType || 'N/A'}</span>
                                </div>
                              </div>
                            </div>
                            <div className={styles.deployedDetails}>
                              <p><strong>Employee ID:</strong> {employee.empId || 'N/A'}</p>
                              <p><strong>Level:</strong> {employee.level || 'N/A'}</p>
                              <p><strong>Status:</strong> <span className={styles.statusBadge}>Deployed</span></p>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <motion.div className={styles.emptyState}>
                          <FiHelpCircle size={48} />
                          <p>No Deployed Colleagues Found</p>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );

      case 'performance':
        return renderPerformanceSection();
        
      case 'profile':
        return (
          <div className={styles.sectionContainer}>
            <h3 className={styles.sectionTitle}>My Profile</h3>
            <div className={styles.profileSection}>
              <div className={styles.profileCard}>
                <div className={styles.profileHeader}>
                  <div className={styles.profilePictureContainer}>
                    {loading ? (
                      <div className={styles.loadingSpinner} />
                    ) : profilePic ? (
                      <img src={profilePic} alt="Profile" className={styles.profilePicture} />
                    ) : (
                      <div className={styles.noProfilePic}>
                        <FiUser size={48} />
                      </div>
                    )}
                    <input
                      type="file"
                      id="profilePictureUpload"
                      accept="image/jpeg,image/png"
                      onChange={handleProfilePictureChange}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="profilePictureUpload" className={styles.profilePictureUpload}>
                      <FiUpload size={18} /> Update Photo
                    </label>
                  </div>
                  <div className={styles.profileInfo}>
                    <h2>{employeeData.name}</h2>
                    <p className={styles.profileRole}>{employeeData.technology} Developer</p>
                    <p className={styles.profileEmail}>{employeeData.userEmail}</p>
                    <p className={styles.profileId}>Employee ID: {employeeData.empId}</p>
                  </div>
                </div>
                
                <div className={styles.profileDetails}>
                  <h4>Employee Details</h4>
                  <form onSubmit={handleSubmitEmployeeDetails} className={styles.profileForm}>
                    <div className={styles.formGroup}>
                      <label htmlFor="empId">Employee ID</label>
                      <input
                        type="text"
                        id="empId"
                        name="empId"
                        value={employeeData.empId}
                        onChange={handleInputChange}
                        className={styles.formControl}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="technology">Technology</label>
                      <input
                        type="text"
                        id="technology"
                        name="technology"
                        value={employeeData.technology}
                        onChange={handleInputChange}
                        className={styles.formControl}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Resource Type</label>
                      <p className={styles.staticField}>{employeeData.resourceType || 'Not specified'}</p>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Level</label>
                      <p className={styles.staticField}>{employeeData.level || 'Not specified'}</p>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Status</label>
                      <p className={styles.staticField}>{employeeData.status || 'Not specified'}</p>
                    </div>
                    <div className={styles.formActions}>
                      <button 
                        type="submit" 
                        className={styles.primaryButton}
                        disabled={loading}
                      >
                        {loading ? 'Updating...' : 'Update Profile'}
                      </button>
                    </div>
                  </form>
                </div>
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
      <ToastContainer />
      <div className={styles.dashboardHeader}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h2>Employee Dashboard</h2>
          <p className={styles.dashboardSubtitle}>Your personalized interview preparation platform</p>
        </motion.div>
        <div className={styles.userProfile}>
          <div className={styles.avatar}>
            {loading ? (
              <div className={styles.loadingSpinner} />
            ) : profilePic ? (
              <img src={profilePic} alt="Profile" />
            ) : (
              <FiUser size={18} />
            )}
            <input
              type="file"
              id="profilePicture"
              accept="image/jpeg,image/png"
              onChange={handleProfilePictureChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="profilePicture" className={styles.avatarUpload}>
              <FiUpload size={14} />
            </label>
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{employeeData.name}</span>
            <span className={styles.userRole}>{employeeData.technology} Developer ({employeeData.resourceType})</span>
            <span className={styles.userRole}>{employeeData.userEmail || 'n.amasannagari@ajacs.in'}</span>
          </div>
        </div>
      </div>

      <div className={styles.tabs}>
        {dashboardTabs.map(tab => (
          <motion.button 
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => handleTabChange(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab.icon} {tab.label}
          </motion.button>
        ))}
      </div>

      <motion.div 
        className={styles.tabContent}
        key={activeTab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {isDataLoading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Loading dashboard data...</p>
          </div>
        ) : (
          renderTabContent()
        )}
      </motion.div>

      {/* Question Sharing Modal */}
      {showQuestionModal && (
        <motion.div 
          className={styles.modalOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowQuestionModal(false)}
        >
          <motion.div 
            className={styles.modalContent}
            onClick={e => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3>Share an Interview Question</h3>
            <form onSubmit={handleAddQuestion}>
              <div className={styles.formGroup}>
                <label>Technology:</label>
                <input
                  type="text"
                  value={newQuestion.technology}
                  className={styles.input}
                  readOnly
                />
              </div>
              <div className={styles.formGroup}>
                <label>Question:</label>
                <textarea
                  name="question"
                  value={newQuestion.question}
                  onChange={handleQuestionChange}
                  placeholder="Enter the interview question..."
                  rows={4}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>User:</label>
                <input
                  type="text"
                  value={newQuestion.user}
                  className={styles.input}
                  readOnly
                />
              </div>
              <div className={styles.modalActions}>
                <button 
                  type="button" 
                  className={styles.secondaryButton}
                  onClick={() => setShowQuestionModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={styles.primaryButton}
                  disabled={loading}
                >
                  {loading ? 'Sharing...' : 'Share Question'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Interview Scheduling Modal */}
      {showInterviewModal && (
        <motion.div 
          className={styles.modalOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowInterviewModal(false)}
        >
          <motion.div 
            className={styles.modalContent}
            onClick={e => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3>Schedule Interview</h3>
            <form onSubmit={handleScheduleInterview}>
              <div className={styles.formGroup}>
                <label>Interview Type:</label>
                <select
                  name="interviewType"
                  value={interviewForm.interviewType}
                  onChange={handleInterviewFormChange}
                  required
                >
                  <option value="mock">Mock Interview</option>
                  <option value="client">Client Interview</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Date:</label>
                <input
                  type="date"
                  name="date"
                  value={interviewForm.date}
                  onChange={handleInterviewFormChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Time:</label>
                <input
                  type="time"
                  name="time"
                  value={interviewForm.time}
                  onChange={handleInterviewFormChange}
                  required
                />
              </div>
              {interviewForm.interviewType === 'mock' && (
                <div className={styles.formGroup}>
                  <label>Interviewer ID:</label>
                  <input
                    type="number"
                    name="interviewerId"
                    value={interviewForm.interviewerId}
                    onChange={handleInterviewFormChange}
                    required
                  />
                </div>
              )}
              {interviewForm.interviewType === 'client' && (
                <>
                  <div className={styles.formGroup}>
                    <label>Client:</label>
                    <input
                      type="text"
                      name="client"
                      value={interviewForm.client}
                      onChange={handleInterviewFormChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Level:</label>
                    <input
                      type="number"
                      name="level"
                      value={interviewForm.level}
                      onChange={handleInterviewFormChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Job Description Title:</label>
                    <select
                      name="jobDescriptionTitle"
                      value={interviewForm.jobDescriptionTitle}
                      onChange={handleInterviewFormChange}
                      required
                    >
                      <option value="">Select JD</option>
                      {jobDescriptions.map(jd => (
                        <option key={jd.id} value={jd.title}>{jd.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Meeting Link:</label>
                    <input
                      type="url"
                      name="meetingLink"
                      value={interviewForm.meetingLink}
                      onChange={handleInterviewFormChange}
                      required
                    />
                  </div>
                </>
              )}
              <div className={styles.modalActions}>
                <button 
                  type="button" 
                  className={styles.secondaryButton}
                  onClick={() => setShowInterviewModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={styles.primaryButton}
                  disabled={loading}
                >
                  {loading ? 'Scheduling...' : 'Schedule Interview'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Interview Details Modal */}
      {showDetailsModal && (
        <motion.div 
          className={styles.modalOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowDetailsModal(false)}
        >
          <motion.div 
            className={styles.modalContent}
            onClick={e => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3>Interview Details</h3>
            {selectedInterviewDetails && (
              <>
                <p><strong>Technology:</strong> {selectedInterviewDetails.employee?.technology}</p>
                <p><strong>Resource Type:</strong> {selectedInterviewDetails.employee?.resourceType}</p>
                <p><strong>Date:</strong> {formatDate(selectedInterviewDetails.date)}</p>
                <p><strong>Status:</strong> {selectedInterviewDetails.status}</p>
                {selectedInterviewDetails.result && (
                  <p><strong>Result:</strong> {selectedInterviewDetails.result}</p>
                )}
                {selectedInterviewDetails.meetingLink && (
                  <p><strong>Meeting Link:</strong> <a href={selectedInterviewDetails.meetingLink} target="_blank" rel="noopener noreferrer">{selectedInterviewDetails.meetingLink}</a></p>
                )}
              </>
            )}
            <div className={styles.modalActions}>
              <button 
                type="button" 
                className={styles.secondaryButton}
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default EmployeeDashboard;