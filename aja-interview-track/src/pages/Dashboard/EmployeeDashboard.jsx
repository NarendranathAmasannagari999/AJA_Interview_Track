import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiFileText, FiUpload, FiClock, FiCheckCircle, FiXCircle, FiUser, 
  FiBarChart2, FiMail, FiCalendar, FiAward, FiBook, FiUsers, FiFilter,
  FiSearch, FiShare2, FiDownload, FiMessageSquare, FiHelpCircle
} from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import styles from './Dashboard.module.css';

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState('jd');
  const [activeInterviewTab, setActiveInterviewTab] = useState('mock');
  const [jobDescriptions, setJobDescriptions] = useState([]);
  const [mockInterviews, setMockInterviews] = useState([]);
  const [clientInterviews, setClientInterviews] = useState([]);
  const [resumeStatus, setResumeStatus] = useState('pending');
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [technologyFilter, setTechnologyFilter] = useState('all');
  const [resourceTypeFilter, setResourceTypeFilter] = useState('all');
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [selectedTechnology, setSelectedTechnology] = useState('java');
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [deployedEmployees, setDeployedEmployees] = useState([]);
  const navigate = useNavigate();

  // Mock data - in real app, this would come from API
  useEffect(() => {
    // Job Descriptions
    setJobDescriptions([
      { 
        id: 1, 
        title: 'Java Developer', 
        client: 'Tech Corp', 
        received: '2023-05-10', 
        deadline: '2023-05-20',
        technology: 'java',
        resourceType: 'TT',
        description: 'Looking for a Java developer with 3+ years experience in Spring Boot and microservices architecture.'
      },
      { 
        id: 2, 
        title: 'Senior Python Engineer', 
        client: 'Data Systems', 
        received: '2023-05-12', 
        deadline: '2023-05-22',
        technology: 'python',
        resourceType: 'TT',
        description: 'Python developer needed for data processing pipelines and machine learning applications.'
      },
      { 
        id: 3, 
        title: '.NET Developer', 
        client: 'Enterprise Solutions', 
        received: '2023-05-15', 
        deadline: '2023-05-25',
        technology: 'dotnet',
        resourceType: 'TCT',
        description: '.NET Core developer with experience in Azure cloud services and API development.'
      }
    ]);

    // Mock Interviews
    setMockInterviews([
      { 
        id: 1, 
        date: '2023-05-15', 
        interviewer: 'John Doe', 
        technicalScore: 8, 
        communicationScore: 7,
        status: 'completed', 
        feedback: 'Good technical skills but need improvement in system design',
        technology: 'java',
        resourceType: 'TT',
        questions: [
          'Explain Java memory model',
          'Difference between ArrayList and LinkedList',
          'How would you design a URL shortening service?'
        ]
      },
      { 
        id: 2, 
        date: '2023-05-18', 
        interviewer: 'Jane Smith', 
        technicalScore: 7, 
        communicationScore: 9,
        status: 'completed',
        technology: 'python',
        resourceType: 'TT',
        feedback: 'Excellent communication skills and good problem solving approach'
      },
      { 
        id: 3, 
        date: '2023-05-20', 
        interviewer: 'Mike Johnson', 
        status: 'scheduled',
        technology: 'dotnet',
        resourceType: 'TCT'
      }
    ]);

    // Client Interviews
    setClientInterviews([
      { 
        id: 1, 
        client: 'Tech Corp', 
        date: '2023-05-25', 
        level: 1, 
        status: 'scheduled', 
        jd: 'Java Developer',
        technology: 'java',
        resourceType: 'TT',
        meetingLink: 'https://meet.techcorp.com/interview-123'
      },
      { 
        id: 2, 
        client: 'Data Systems', 
        date: '2023-05-28', 
        level: 2, 
        status: 'pending', 
        jd: 'Senior Python Engineer',
        technology: 'python',
        resourceType: 'TT'
      },
      { 
        id: 3, 
        client: 'Enterprise Solutions', 
        date: '2023-06-02', 
        level: 1, 
        status: 'completed', 
        jd: '.NET Developer',
        technology: 'dotnet',
        resourceType: 'TCT',
        result: 'selected',
        feedback: 'Strong technical skills and good cultural fit'
      }
    ]);

    // Interview Questions
    setInterviewQuestions([
      { id: 1, technology: 'java', question: 'Explain the Java memory model', date: '2023-05-15', user: 'John D' },
      { id: 2, technology: 'java', question: 'Difference between JDK, JRE and JVM', date: '2023-05-16', user: 'Alice M' },
      { id: 3, technology: 'python', question: 'How does Python handle memory management?', date: '2023-05-17', user: 'Bob S' },
      { id: 4, technology: 'dotnet', question: 'Explain ASP.NET Core middleware pipeline', date: '2023-05-18', user: 'Eve W' }
    ]);

    // Deployed Employees
    setDeployedEmployees([
      { id: 1, name: 'Alice Miller', technology: 'java', resourceType: 'TT', client: 'Tech Corp', date: '2023-05-01' },
      { id: 2, name: 'Bob Smith', technology: 'python', resourceType: 'TT', client: 'Data Systems', date: '2023-05-10' },
      { id: 3, name: 'Charlie Brown', technology: 'dotnet', resourceType: 'TCT', client: 'Enterprise Solutions', date: '2023-05-15' }
    ]);
  }, []);

  const performanceData = [
    { name: 'Technical', score: 85 },
    { name: 'Communication', score: 75 },
    { name: 'Problem Solving', score: 90 },
    { name: 'System Design', score: 70 }
  ];

  const mockInterviewData = [
    { name: 'Interview 1', technical: 8, communication: 7 },
    { name: 'Interview 2', technical: 7, communication: 9 },
    { name: 'Interview 3', technical: 9, communication: 8 }
  ];

  const deploymentStatusData = [
    { name: 'Selected', value: 3 },
    { name: 'Rejected', value: 2 },
    { name: 'Pending', value: 1 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    // In real app, upload to server
    setTimeout(() => setResumeStatus('submitted'), 1000);
  };

  const handleQuestionSubmit = (e) => {
    e.preventDefault();
    if (newQuestion.trim()) {
      const newQuestionObj = {
        id: interviewQuestions.length + 1,
        technology: selectedTechnology,
        question: newQuestion,
        date: new Date().toISOString().split('T')[0],
        user: 'You'
      };
      setInterviewQuestions([...interviewQuestions, newQuestionObj]);
      setNewQuestion('');
      setShowQuestionModal(false);
    }
  };

  const filteredJobDescriptions = jobDescriptions.filter(jd => {
    const matchesSearch = jd.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         jd.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTech = technologyFilter === 'all' || jd.technology === technologyFilter;
    const matchesResource = resourceTypeFilter === 'all' || jd.resourceType === resourceTypeFilter;
    return matchesSearch && matchesTech && matchesResource;
  });

  const filteredMockInterviews = mockInterviews.filter(interview => {
    const matchesTech = technologyFilter === 'all' || interview.technology === technologyFilter;
    const matchesResource = resourceTypeFilter === 'all' || interview.resourceType === resourceTypeFilter;
    return matchesTech && matchesResource;
  });

  const filteredClientInterviews = clientInterviews.filter(interview => {
    const matchesTech = technologyFilter === 'all' || interview.technology === technologyFilter;
    const matchesResource = resourceTypeFilter === 'all' || interview.resourceType === resourceTypeFilter;
    return matchesTech && matchesResource;
  });

  const filteredDeployedEmployees = deployedEmployees.filter(employee => {
    const matchesTech = technologyFilter === 'all' || employee.technology === technologyFilter;
    const matchesResource = resourceTypeFilter === 'all' || employee.resourceType === resourceTypeFilter;
    return matchesTech && matchesResource;
  });

  const filteredInterviewQuestions = interviewQuestions.filter(q => 
    technologyFilter === 'all' || q.technology === technologyFilter
  );

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
                />
              </div>
              <div className={styles.filterControls}>
                <div className={styles.filterGroup}>
                  <label htmlFor="technology-filter"><FiFilter /> Technology:</label>
                  <select 
                    id="technology-filter" 
                    value={technologyFilter}
                    onChange={(e) => setTechnologyFilter(e.target.value)}
                  >
                    <option value="all">All Technologies</option>
                    <option value="java">Java</option>
                    <option value="python">Python</option>
                    <option value="dotnet">.NET</option>
                    <option value="devops">DevOps</option>
                    <option value="salesforce">SalesForce</option>
                    <option value="ui">UI</option>
                    <option value="testing">Testing</option>
                  </select>
                </div>
                <div className={styles.filterGroup}>
                  <label htmlFor="resource-filter"><FiUsers /> Resource Type:</label>
                  <select 
                    id="resource-filter" 
                    value={resourceTypeFilter}
                    onChange={(e) => setResourceTypeFilter(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="TCT">TCT</option>
                    <option value="TT">TT</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className={styles.cardGrid}>
              <AnimatePresence>
                {filteredJobDescriptions.length > 0 ? (
                  filteredJobDescriptions.map(jd => (
                    <motion.div 
                      key={jd.id} 
                      className={styles.card}
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={styles.cardHeader}>
                        <h3>{jd.title}</h3>
                        <div className={styles.techBadge} data-tech={jd.technology}>
                          {jd.technology}
                        </div>
                        <div className={styles.resourceBadge} data-type={jd.resourceType}>
                          {jd.resourceType}
                        </div>
                      </div>
                      <p className={styles.clientName}><strong>Client:</strong> {jd.client}</p>
                      <div className={styles.dateInfo}>
                        <p><FiCalendar /> <strong>Received:</strong> {jd.received}</p>
                        <p><FiClock /> <strong>Deadline:</strong> {jd.deadline}</p>
                      </div>
                      <div className={styles.jdPreview}>
                        <p>{jd.description.substring(0, 100)}...</p>
                      </div>
                      <div className={styles.cardActions}>
                        <button 
                          className={styles.primaryButton}
                          onClick={() => setActiveTab('resume')}
                        >
                          <FiFileText /> Prepare Resume
                        </button>
                        <button className={styles.secondaryButton}>
                          <FiDownload /> Download JD
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
                    <h4>No Job Descriptions Found</h4>
                    <p>Try adjusting your filters or check back later</p>
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
            
            <motion.div 
              className={styles.statusCard}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className={`${styles.statusIndicator} ${styles[resumeStatus]}`}>
                {resumeStatus === 'pending' && <FiClock size={24} />}
                {resumeStatus === 'submitted' && <FiCheckCircle size={24} />}
                {resumeStatus === 'rejected' && <FiXCircle size={24} />}
                <span>{resumeStatus.charAt(0).toUpperCase() + resumeStatus.slice(1)}</span>
              </div>
              
              {resumeStatus === 'pending' && (
                <motion.div 
                  className={styles.uploadArea}
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.01 }}
                >
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
                  <div className={styles.uploadTips}>
                    <h5>Resume Tips:</h5>
                    <ul>
                      <li>Tailor your resume to match the job description</li>
                      <li>Highlight relevant technical skills</li>
                      <li>Keep it concise (1-2 pages max)</li>
                      <li>Include measurable achievements</li>
                    </ul>
                  </div>
                </motion.div>
              )}
              
              {resumeStatus === 'submitted' && (
                <motion.div 
                  className={styles.submissionDetails}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className={styles.successMessage}>
                    <FiCheckCircle size={32} />
                    <h4>Resume Submitted Successfully!</h4>
                  </div>
                  <p>Your resume has been submitted to the sales team for review.</p>
                  <p>You will be notified when it's sent to clients.</p>
                  
                  <div className={styles.resumeStats}>
                    <div className={styles.statItem}>
                      <span className={styles.statNumber}>3</span>
                      <span className={styles.statLabel}>JDs Applied For</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statNumber}>2</span>
                      <span className={styles.statLabel}>Resumes Sent to Clients</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statNumber}>1</span>
                      <span className={styles.statLabel}>Interview Calls</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        );
      case 'interviews':
        return (
          <div className={styles.sectionContainer}>
            <div className={styles.interviewTabs}>
              <button 
                className={`${styles.tabButton} ${activeInterviewTab === 'mock' ? styles.active : ''}`}
                onClick={() => setActiveInterviewTab('mock')}
              >
                <FiMessageSquare /> Mock Interviews
              </button>
              <button 
                className={`${styles.tabButton} ${activeInterviewTab === 'client' ? styles.active : ''}`}
                onClick={() => setActiveInterviewTab('client')}
              >
                <FiUsers /> Client Interviews
              </button>
              <button 
                className={`${styles.tabButton} ${activeInterviewTab === 'questions' ? styles.active : ''}`}
                onClick={() => setActiveInterviewTab('questions')}
              >
                <FiBook /> Interview Questions
              </button>
              <button 
                className={`${styles.tabButton} ${activeInterviewTab === 'deployed' ? styles.active : ''}`}
                onClick={() => setActiveInterviewTab('deployed')}
              >
                <FiAward /> Deployed Colleagues
              </button>
            </div>
            
            <div className={styles.filterSection}>
              <div className={styles.filterControls}>
                <div className={styles.filterGroup}>
                  <label htmlFor="interview-tech-filter"><FiFilter /> Technology:</label>
                  <select 
                    id="interview-tech-filter" 
                    value={technologyFilter}
                    onChange={(e) => setTechnologyFilter(e.target.value)}
                  >
                    <option value="all">All Technologies</option>
                    <option value="java">Java</option>
                    <option value="python">Python</option>
                    <option value="dotnet">.NET</option>
                    <option value="devops">DevOps</option>
                    <option value="salesforce">SalesForce</option>
                    <option value="ui">UI</option>
                    <option value="testing">Testing</option>
                  </select>
                </div>
                <div className={styles.filterGroup}>
                  <label htmlFor="interview-resource-filter"><FiUsers /> Resource Type:</label>
                  <select 
                    id="interview-resource-filter" 
                    value={resourceTypeFilter}
                    onChange={(e) => setResourceTypeFilter(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="TCT">TCT</option>
                    <option value="TT">TT</option>
                  </select>
                </div>
              </div>
            </div>
            
            {activeInterviewTab === 'mock' ? (
              <div className={styles.interviewList}>
                <AnimatePresence>
                  {filteredMockInterviews.length > 0 ? (
                    filteredMockInterviews.map(interview => (
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
                            <h4>Interview with {interview.interviewer}</h4>
                            <div className={styles.interviewMeta}>
                              <span className={styles.techBadge} data-tech={interview.technology}>
                                {interview.technology}
                              </span>
                              <span className={styles.resourceBadge} data-type={interview.resourceType}>
                                {interview.resourceType}
                              </span>
                              <span><FiCalendar /> {interview.date}</span>
                            </div>
                          </div>
                          <span className={`${styles.status} ${styles[interview.status]}`}>
                            {interview.status}
                          </span>
                        </div>
                        
                        {interview.status === 'completed' && (
                          <div className={styles.interviewScores}>
                            <div className={styles.scoreMeter}>
                              <div className={styles.scoreLabel}>Technical</div>
                              <div className={styles.scoreBar}>
                                <div 
                                  className={styles.scoreFill} 
                                  style={{ width: `${interview.technicalScore * 10}%` }}
                                  data-score={interview.technicalScore}
                                ></div>
                              </div>
                            </div>
                            <div className={styles.scoreMeter}>
                              <div className={styles.scoreLabel}>Communication</div>
                              <div className={styles.scoreBar}>
                                <div 
                                  className={styles.scoreFill} 
                                  style={{ width: `${interview.communicationScore * 10}%` }}
                                  data-score={interview.communicationScore}
                                ></div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {interview.feedback && (
                          <div className={styles.feedback}>
                            <h5>Feedback:</h5>
                            <p>{interview.feedback}</p>
                          </div>
                        )}
                        
                        {interview.questions && interview.questions.length > 0 && (
                          <div className={styles.questionsSection}>
                            <h5>Questions Asked:</h5>
                            <ul>
                              {interview.questions.map((q, idx) => (
                                <li key={idx}>{q}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <motion.div 
                      className={styles.emptyState}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <FiHelpCircle size={48} />
                      <h4>No Mock Interviews Found</h4>
                      <p>Try adjusting your filters or check back later</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : activeInterviewTab === 'client' ? (
              <div className={styles.interviewList}>
                <AnimatePresence>
                  {filteredClientInterviews.length > 0 ? (
                    filteredClientInterviews.map(interview => (
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
                            <h4>{interview.client} - Level {interview.level}</h4>
                            <div className={styles.interviewMeta}>
                              <span className={styles.techBadge} data-tech={interview.technology}>
                                {interview.technology}
                              </span>
                              <span className={styles.resourceBadge} data-type={interview.resourceType}>
                                {interview.resourceType}
                              </span>
                              <span><FiCalendar /> {interview.date}</span>
                              <span>For JD: {interview.jd}</span>
                            </div>
                          </div>
                          <span className={`${styles.status} ${styles[interview.status]}`}>
                            {interview.status}
                          </span>
                        </div>
                        
                        {interview.status === 'scheduled' && interview.meetingLink && (
                          <div className={styles.interviewActions}>
                            <a 
                              href={interview.meetingLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className={styles.primaryButton}
                            >
                              Join Interview
                            </a>
                            <button className={styles.secondaryButton}>
                              Reschedule
                            </button>
                          </div>
                        )}
                        
                        {interview.status === 'completed' && (
                          <div className={styles.interviewResult}>
                            <h5>Result: 
                              <span className={interview.result === 'selected' ? styles.resultSuccess : styles.resultFailure}>
                                {interview.result === 'selected' ? 'Selected' : 'Rejected'}
                              </span>
                            </h5>
                            {interview.feedback && (
                              <div className={styles.feedback}>
                                <p>{interview.feedback}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <motion.div 
                      className={styles.emptyState}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <FiHelpCircle size={48} />
                      <h4>No Client Interviews Found</h4>
                      <p>Try adjusting your filters or check back later</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : activeInterviewTab === 'questions' ? (
              <div className={styles.questionsContainer}>
                <div className={styles.questionsHeader}>
                  <h4>Interview Questions Bank</h4>
                  <button 
                    className={styles.primaryButton}
                    onClick={() => setShowQuestionModal(true)}
                  >
                    <FiShare2 /> Share a Question
                  </button>
                </div>
                
                <div className={styles.technologyTabs}>
                  {['all', 'java', 'python', 'dotnet', 'devops', 'salesforce', 'ui', 'testing'].map(tech => (
                    <button
                      key={tech}
                      className={`${styles.techTab} ${technologyFilter === tech ? styles.active : ''}`}
                      onClick={() => setTechnologyFilter(tech)}
                    >
                      {tech === 'all' ? 'All' : tech}
                    </button>
                  ))}
                </div>
                
                <div className={styles.questionsList}>
                  {filteredInterviewQuestions.length > 0 ? (
                    filteredInterviewQuestions.map(question => (
                      <motion.div 
                        key={question.id} 
                        className={styles.questionCard}
                        whileHover={{ scale: 1.01 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className={styles.questionMeta}>
                          <span className={styles.techBadge} data-tech={question.technology}>
                            {question.technology}
                          </span>
                          <span className={styles.questionDate}>{question.date}</span>
                          <span className={styles.questionUser}>by {question.user}</span>
                        </div>
                        <p className={styles.questionText}>{question.question}</p>
                        <div className={styles.questionActions}>
                          <button className={styles.smallButton}>Save</button>
                          <button className={styles.smallButton}>Answer</button>
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
                      <h4>No Questions Found</h4>
                      <p>Try adjusting your filters or be the first to share a question</p>
                    </motion.div>
                  )}
                </div>
              </div>
            ) : (
              <div className={styles.deployedContainer}>
                <h4>Recently Deployed Colleagues</h4>
                <div className={styles.deployedGrid}>
                  {filteredDeployedEmployees.length > 0 ? (
                    filteredDeployedEmployees.map(employee => (
                      <motion.div 
                        key={employee.id} 
                        className={styles.deployedCard}
                        whileHover={{ scale: 1.02 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className={styles.deployedHeader}>
                          <div className={styles.avatar}>
                            {employee.name.charAt(0)}
                          </div>
                          <div>
                            <h5>{employee.name}</h5>
                            <div className={styles.deployedMeta}>
                              <span className={styles.techBadge} data-tech={employee.technology}>
                                {employee.technology}
                              </span>
                              <span className={styles.resourceBadge} data-type={employee.resourceType}>
                                {employee.resourceType}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className={styles.deployedDetails}>
                          <p><strong>Client:</strong> {employee.client}</p>
                          <p><strong>Deployed on:</strong> {employee.date}</p>
                        </div>
                        <button className={styles.smallButton}>
                          <FiMail /> Congratulate
                        </button>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div 
                      className={styles.emptyState}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <FiHelpCircle size={48} />
                      <h4>No Deployed Colleagues Found</h4>
                      <p>Try adjusting your filters or check back later</p>
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      case 'performance':
        return (
          <div className={styles.sectionContainer}>
            <h3 className={styles.sectionTitle}><FiBarChart2 /> Performance Analytics</h3>
            
            <div className={styles.performanceGrid}>
              <div className={styles.chartContainer}>
                <h4>Mock Interview Scores</h4>
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
              </div>
              
              <div className={styles.chartContainer}>
                <h4>Deployment Status</h4>
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
              </div>
            </div>
            
            <div className={styles.statsGrid}>
              <motion.div 
                className={styles.statCard}
                whileHover={{ scale: 1.05 }}
              >
                <h5>Mock Interviews</h5>
                <p className={styles.statValue}>8</p>
                <p className={styles.statLabel}>Completed</p>
                <div className={styles.statTrend} data-trend="up">
                  +2 from last month
                </div>
              </motion.div>
              <motion.div 
                className={styles.statCard}
                whileHover={{ scale: 1.05 }}
              >
                <h5>Avg. Technical Score</h5>
                <p className={styles.statValue}>8.2</p>
                <p className={styles.statLabel}>/ 10.0</p>
                <div className={styles.statTrend} data-trend="up">
                  +0.5 from last month
                </div>
              </motion.div>
              <motion.div 
                className={styles.statCard}
                whileHover={{ scale: 1.05 }}
              >
                <h5>Avg. Communication</h5>
                <p className={styles.statValue}>7.5</p>
                <p className={styles.statLabel}>/ 10.0</p>
                <div className={styles.statTrend} data-trend="steady">
                  Same as last month
                </div>
              </motion.div>
              <motion.div 
                className={styles.statCard}
                whileHover={{ scale: 1.05 }}
              >
                <h5>Conversion Rate</h5>
                <p className={styles.statValue}>60%</p>
                <p className={styles.statLabel}>Success</p>
                <div className={styles.statTrend} data-trend="up">
                  +10% from last month
                </div>
              </motion.div>
            </div>
            
            <div className={styles.skillDevelopment}>
              <h4>Skill Development Areas</h4>
              <div className={styles.skillList}>
                <div className={styles.skillItem}>
                  <div className={styles.skillInfo}>
                    <h5>System Design</h5>
                    <p>Average score of 6.5 in mock interviews</p>
                  </div>
                  <div className={styles.skillProgress}>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: '65%' }}></div>
                    </div>
                    <button className={styles.smallButton}>Resources</button>
                  </div>
                </div>
                <div className={styles.skillItem}>
                  <div className={styles.skillInfo}>
                    <h5>Problem Solving</h5>
                    <p>Average score of 7.8 in mock interviews</p>
                  </div>
                  <div className={styles.skillProgress}>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: '78%' }}></div>
                    </div>
                    <button className={styles.smallButton}>Resources</button>
                  </div>
                </div>
                <div className={styles.skillItem}>
                  <div className={styles.skillInfo}>
                    <h5>Communication</h5>
                    <p>Average score of 7.5 in mock interviews</p>
                  </div>
                  <div className={styles.skillProgress}>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: '75%' }}></div>
                    </div>
                    <button className={styles.smallButton}>Resources</button>
                  </div>
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
      <div className={styles.dashboardHeader}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2>AJA Interview Preparation Track</h2>
          <p className={styles.dashboardSubtitle}>Your personalized dashboard for interview success</p>
        </motion.div>
        <div className={styles.userProfile}>
          <div className={styles.avatar}>
            <FiUser size={18} />
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>John Doe</span>
            <span className={styles.userRole}>Java Developer (TT)</span>
          </div>
        </div>
      </div>
      
      <div className={styles.tabs}>
        <motion.button 
          className={`${styles.tab} ${activeTab === 'jd' ? styles.active : ''}`}
          onClick={() => setActiveTab('jd')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiFileText /> Job Descriptions
        </motion.button>
        <motion.button 
          className={`${styles.tab} ${activeTab === 'resume' ? styles.active : ''}`}
          onClick={() => setActiveTab('resume')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiUpload /> Resume Preparation
        </motion.button>
        <motion.button 
          className={`${styles.tab} ${activeTab === 'interviews' ? styles.active : ''}`}
          onClick={() => setActiveTab('interviews')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiMessageSquare /> Interviews
        </motion.button>
        <motion.button 
          className={`${styles.tab} ${activeTab === 'performance' ? styles.active : ''}`}
          onClick={() => setActiveTab('performance')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiBarChart2 /> Performance
        </motion.button>
      </div>
      
      <motion.div 
        className={styles.tabContent}
        key={activeTab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {renderTabContent()}
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
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3>Share an Interview Question</h3>
            <form onSubmit={handleQuestionSubmit}>
              <div className={styles.formGroup}>
                <label>Technology:</label>
                <select
                  value={selectedTechnology}
                  onChange={(e) => setSelectedTechnology(e.target.value)}
                >
                  <option value="java">Java</option>
                  <option value="python">Python</option>
                  <option value="dotnet">.NET</option>
                  <option value="devops">DevOps</option>
                  <option value="salesforce">SalesForce</option>
                  <option value="ui">UI</option>
                  <option value="testing">Testing</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Question:</label>
                <textarea
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Enter the interview question you were asked..."
                  rows={4}
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
                >
                  Share Question
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default EmployeeDashboard;