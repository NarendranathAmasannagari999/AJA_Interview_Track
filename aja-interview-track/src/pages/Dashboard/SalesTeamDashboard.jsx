import React, { useState, useEffect, useMemo } from "react";
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
  FiClock,
  FiLayers,
  FiBook,
  FiUserCheck,
  FiUserX,
  FiShare2,
  FiToggleLeft,
  FiToggleRight,
  FiRefreshCw,
  FiUser,
  FiEdit,
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import styles from "./Sales.module.css";
import {
  getCandidates,
  scheduleClientInterview,
  updateClientInterview,
  getClientInterviews,
  addClient,
  getClients,
  addJobDescription,
  downloadJobDescription,
  deleteJobDescription,
  getAllJobDescriptions,
  getReadyForDeploymentEmployees,
  updateReadyForDeployment,
  getFilteredResumes,
  getClientInterviewFeedback,
  getDeployedEmployees, // Import the new API
} from "../../API/sales";
import ScheduleClientInterviewModal from "./ScheduleClientInterviewModal";

const ClientModal = ({
  show,
  onClose,
  onSubmit,
  fields,
  onFieldChange,
  error,
  success,
  loading,
  onTechChange,
}) => {
  if (!show) return null;
  return (
    <div className={styles.modalOverlay}>
      <motion.div
        className={styles.modal}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <form onSubmit={onSubmit}>
          <div className={styles.modalHeader}>
            <h3>Add New Client</h3>
            <button
              className={styles.closeButton}
              type="button"
              onClick={onClose}
            >
              <FiX />
            </button>
          </div>
          <div className={styles.modalContent}>
            {error && <div className={styles.errorMessage}>{error}</div>}
            {success && <div className={styles.successMessage}>{success}</div>}
            <div className={styles.formGroup}>
              <label>Client Name *</label>
              <input
                type="text"
                value={fields.name}
                onChange={(e) => onFieldChange("name", e.target.value)}
                placeholder="Enter client name"
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Contact Email *</label>
              <input
                type="email"
                value={fields.contactEmail}
                onChange={(e) => onFieldChange("contactEmail", e.target.value)}
                placeholder="Enter contact email"
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Active Positions</label>
              <input
                type="number"
                min="0"
                value={fields.activePositions}
                onChange={(e) =>
                  onFieldChange(
                    "activePositions",
                    parseInt(e.target.value) || 0
                  )
                }
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Technologies *</label>
              <div className={styles.technologyGrid}>
                {[
                  "Java",
                  "Python",
                  ".NET",
                  "DevOps",
                  "SalesForce",
                  "UI",
                  "Testing",
                ].map((tech) => (
                  <label key={tech} className={styles.technologyCheckbox}>
                    <input
                      type="checkbox"
                      checked={fields.technologies.includes(tech)}
                      onChange={() => onTechChange(tech)}
                    />
                    <span>{tech}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={`${styles.button} ${styles.secondary}`}
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className={`${styles.button} ${styles.primary}`}
                type="submit"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Client"}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Add the ScheduleInterviewModal component definition here, adapted for Sales Team context
const ScheduleInterviewModal = ({
  show,
  onClose,
  onSubmit,
  selectedCandidates,
  interviewDetails,
  setInterviewDetails,
  clients,
  jobDescriptions,
}) => {
  if (!show) return null;

  const candidateNames = selectedCandidates
    .map((c) => c.user?.fullName || "N/A")
    .join(", ");
  const [error, setError] = useState(""); // Local error state for the modal

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      // Validate required fields
      if (!interviewDetails.client?.trim()) {
        throw new Error("Client name is required");
      }
      if (!interviewDetails.date) {
        throw new Error("Interview date is required");
      }
      if (!interviewDetails.time) {
        throw new Error("Interview time is required");
      }
      if (!interviewDetails.level) {
        throw new Error("Interview level is required");
      }
      if (!interviewDetails.jobDescriptionTitle?.trim()) {
        throw new Error("Job description title is required");
      }
      if (
        interviewDetails.mode === "virtual" &&
        !interviewDetails.link?.trim()
      ) {
        throw new Error("Meeting link is required for virtual interviews");
      }
      if (
        interviewDetails.mode === "in-person" &&
        !interviewDetails.location?.trim()
      ) {
        throw new Error("Location is required for in-person interviews");
      }

      onSubmit(
        selectedCandidates.map((c) => c.id),
        interviewDetails
      ); // Pass candidate IDs and details
      onClose(); // Close the modal on successful submission
    } catch (err) {
      setError(err.message || "An unknown error occurred. Please try again.");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <motion.div
        className={styles.modal}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <form onSubmit={handleSubmit}>
          <div className={styles.modalHeader}>
            <h3>Schedule Client Interview</h3>
            <button
              className={styles.closeButton}
              type="button"
              onClick={onClose}
            >
              <FiX />
            </button>
          </div>
          <div className={styles.modalContent}>
            {error && <div className={styles.errorMessage}>{error}</div>}

            {/* Display selected candidates */}
            <div className={styles.formGroup}>
              <label>Candidate(s)</label>
              <input
                type="text"
                value={candidateNames}
                className={styles.input}
                readOnly
              />
            </div>

            {/* Client dropdown */}
            <div className={styles.formGroup}>
              <label>Client *</label>
              <select
                value={interviewDetails.client || ""}
                onChange={(e) =>
                  setInterviewDetails({
                    ...interviewDetails,
                    client: e.target.value,
                  })
                }
                className={styles.input}
                required
              >
                <option value="">Select Client</option>
                {clients &&
                  clients.map((client) => (
                    <option key={client.id} value={client.name}>
                      {client.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Job Description dropdown */}
            <div className={styles.formGroup}>
              <label>Job Description *</label>
              <select
                value={interviewDetails.jobDescriptionTitle || ""}
                onChange={(e) =>
                  setInterviewDetails({
                    ...interviewDetails,
                    jobDescriptionTitle: e.target.value,
                  })
                }
                className={styles.input}
                required
              >
                <option value="">Select JD</option>
                {jobDescriptions &&
                  jobDescriptions.map((jd) => (
                    <option key={jd.id} value={jd.title}>
                      {jd.title} ({jd.clientName})
                    </option>
                  ))}
              </select>
            </div>

            {/* Date & Time */}
            <div className={styles.formGroup}>
              <label>Date *</label>
              <input
                type="date"
                value={interviewDetails.date || ""}
                onChange={(e) =>
                  setInterviewDetails({
                    ...interviewDetails,
                    date: e.target.value,
                  })
                }
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Time *</label>
              <input
                type="time"
                value={interviewDetails.time || ""}
                onChange={(e) =>
                  setInterviewDetails({
                    ...interviewDetails,
                    time: e.target.value,
                  })
                }
                className={styles.input}
                required
              />
            </div>

            {/* Level */}
            <div className={styles.formGroup}>
              <label>Level *</label>
              <select
                value={interviewDetails.level || ""}
                onChange={(e) =>
                  setInterviewDetails({
                    ...interviewDetails,
                    level: e.target.value,
                  })
                }
                className={styles.input}
                required
              >
                <option value="">Select Level</option>
                <option value="1">Level 1</option>
                <option value="2">Level 2</option>
                <option value="3">Level 3</option>
                <option value="4">Level 4</option>
              </select>
            </div>

            {/* Interview Mode */}
            <div className={styles.formGroup}>
              <label>Mode *</label>
              <select
                value={interviewDetails.mode || "virtual"}
                onChange={(e) =>
                  setInterviewDetails({
                    ...interviewDetails,
                    mode: e.target.value,
                    link: "",
                    location: "",
                  })
                }
                className={styles.input}
                required
              >
                <option value="virtual">Virtual</option>
                <option value="in-person">In-Person</option>
              </select>
            </div>

            {/* Meeting Link or Location based on mode */}
            {interviewDetails.mode === "virtual" ? (
              <div className={styles.formGroup}>
                <label>Meeting Link *</label>
                <input
                  type="url"
                  value={interviewDetails.link || ""}
                  onChange={(e) =>
                    setInterviewDetails({
                      ...interviewDetails,
                      link: e.target.value,
                    })
                  }
                  className={styles.input}
                  required
                  placeholder="Enter meeting link"
                />
              </div>
            ) : (
              <div className={styles.formGroup}>
                <label>Location *</label>
                <input
                  type="text"
                  value={interviewDetails.location || ""}
                  onChange={(e) =>
                    setInterviewDetails({
                      ...interviewDetails,
                      location: e.target.value,
                    })
                  }
                  className={styles.input}
                  required
                  placeholder="Enter interview location"
                />
              </div>
            )}

            {/* Deployed Status Checkbox */}
            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={interviewDetails.deployedStatus}
                  onChange={(e) =>
                    setInterviewDetails({
                      ...interviewDetails,
                      deployedStatus: e.target.checked,
                    })
                  }
                />
                <span>Mark as Deployed</span>
              </label>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={`${styles.button} ${styles.secondary}`}
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className={`${styles.button} ${styles.primary}`}
                type="submit"
              >
                Schedule Interview
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const ITEMS_PER_PAGE = 10;

const LoadingState = () => (
  <div className={styles.loadingState}>
    <div className={styles.spinner}></div>
    <p>Loading...</p>
  </div>
);

const ErrorState = ({ error }) => {
  if (!error) return null;

  const message =
    typeof error === "object" && error !== null && "message" in error
      ? error.message
      : String(error);
  const type =
    typeof error === "object" && error !== null && "type" in error
      ? error.type
      : "error";
  const detailedError =
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    "data" in error.response
      ? error.response.data
      : null;

  return (
    <div className={`${styles.errorContainer} ${styles[type]}`}>
      <p>{message}</p>
      {detailedError && (
        <p className={styles.detailedErrorMessage}>{detailedError}</p>
      )}
    </div>
  );
};

const Pagination = ({ totalItems, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  if (totalPages <= 1) return null;

  return (
    <div className={styles.pagination}>
      <button
        className={`${styles.button} ${styles.secondary}`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <FiChevronLeft /> Previous
      </button>

      <div className={styles.pageNumbers}>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            className={`${styles.pageButton} ${
              currentPage === index + 1 ? styles.active : ""
            }`}
            onClick={() => onPageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <button
        className={`${styles.button} ${styles.secondary}`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next <FiChevronRight />
      </button>
    </div>
  );
};

const SalesTeamDashboard = () => {
  // Main state
  const [activeTab, setActiveTab] = useState("jds");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedJD, setSelectedJD] = useState(null);
  const [sendFeedback, setSendFeedback] = useState(false);

  // Filter states
  const [filterTech, setFilterTech] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterResourceType, setFilterResourceType] = useState("all");
  const [filterInterviewLevel, setFilterInterviewLevel] = useState("all");

  // Data states
  const [candidates, setCandidates] = useState([]);
  const [clientInterviews, setClientInterviews] = useState([]);
  const [clients, setClients] = useState([]);
  const [jobDescriptions, setJobDescriptions] = useState([]);
  const [resumePool, setResumePool] = useState([]);
  const [shortlistedCandidates, setShortlistedCandidates] = useState([]);

  // New state for deployed employees
  const [deployedEmployees, setDeployedEmployees] = useState([]);

  // Deployment statistics
  const [deploymentStats, setDeploymentStats] = useState({
    profilesSent: 0,
    resumesSent: 0,
    interviewsScheduled: 0,
    deployed: 0,
    rejected: 0,
  });

  // New state for interview scheduling
  const [showInterviewScheduler, setShowInterviewScheduler] = useState(false);
  const [selectedForInterview, setSelectedForInterview] = useState([]);
  const initialInterviewDetails = {
    level: 1,
    date: "",
    time: "",
    mode: "virtual",
    link: "",
    location: "",
    notes: "",
    client: "",
    jobDescriptionTitle: "",
    interviewerName: "",
    deployedStatus: false,
  };
  const [interviewDetails, setInterviewDetails] = useState(
    initialInterviewDetails
  );

  // Add loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add new state for pagination and search
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Add new state for client management
  const [showClientModal, setShowClientModal] = useState(false);
  const [clientModalFields, setClientModalFields] = useState({
    name: "",
    contactEmail: "",
    activePositions: 0,
    technologies: [],
  });
  const [clientModalError, setClientModalError] = useState("");
  const [clientModalSuccess, setClientModalSuccess] = useState("");
  const [clientModalLoading, setClientModalLoading] = useState(false);

  // Add new state for JD modal
  const [jdModalFields, setJDModalFields] = useState({
    title: "",
    client: "",
    technology: "",
    resourceType: "",
    description: "",
    receivedDate: "",
    deadline: "",
  });
  const [jdModalFile, setJDModalFile] = useState(null);
  const [jdModalError, setJDModalError] = useState("");
  const [jdModalSuccess, setJDModalSuccess] = useState("");
  const [jdModalLoading, setJDModalLoading] = useState(false);

  // Add new state for selected candidates for bulk scheduling
  const [bulkSelectedCandidates, setBulkSelectedCandidates] = useState([]);

  // New state for sales team user profile
  const [salesUserData, setSalesUserData] = useState({
    fullName: "Ravi",
    email: "ravi@gmail.com",
    role: "ROLE_SALES_TEAM",
  });
  const [profilePic, setProfilePic] = useState(null); // Placeholder for profile picture

  // Add debounced search function
  const handleSearch = (value) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    setSearchTimeout(
      setTimeout(() => {
        setSearchTerm(value);
        setCurrentPage(1); // Reset to first page on new search
      }, 500)
    );
  };

  // Add refresh function
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchData();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Placeholder for profile picture change (similar to EmployeeDashboard)
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you'd upload this file and update the profilePic URL
      setProfilePic(URL.createObjectURL(file));
      // Optionally, add toast for success/error
    }
  };

  // Fetch all data on component mount
  useEffect(() => {
    fetchData();
    // In a real app, you would fetch user data from an auth context or API here
    // For now, it's mocked in the state initialization
  }, []);

  const fetchData = async (retryCount = 0) => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch all data in parallel with proper error handling
      const [
        candidatesData,
        interviewsData,
        clientsData,
        jobDescriptionsData,
        deployedEmployeesData,
      ] = await Promise.all([
        getCandidates(filterTech, filterStatus, filterResourceType).catch(
          (error) => {
            console.error("Error fetching candidates:", error);
            if (error.response?.status === 401) {
              throw new Error("Please log in to view candidates");
            }
            if (error.response?.status === 400) {
              throw new Error("Invalid filter parameters");
            }
            return [];
          }
        ),
        getClientInterviews().catch((error) => {
          console.error("Error fetching interviews:", error);
          if (error.response?.status === 401) {
            throw new Error("Please log in to view interviews");
          }
          if (error.response?.status === 400) {
            throw new Error("Invalid search parameters");
          }
          return [];
        }),
        getClients().catch((error) => {
          console.error("Error fetching clients:", error);
          if (error.response?.status === 401) {
            throw new Error("Please log in to view clients");
          }
          if (error.response?.status === 400) {
            throw new Error("Invalid search parameters");
          }
          return [];
        }),
        getAllJobDescriptions().catch((error) => {
          console.error("Error fetching job descriptions:", error);
          if (error.response?.status === 401) {
            throw new Error("Please log in to view job descriptions");
          }
          if (error.response?.status === 403) {
            throw new Error(
              "Access denied: Only sales team members can view all job descriptions"
            );
          }
          return [];
        }),
        getDeployedEmployees().catch((error) => {
          // Fetch deployed employees
          console.error("Error fetching deployed employees:", error);
          if (error.response?.status === 401) {
            throw new Error("Please log in to view deployed employees");
          }
          return [];
        }),
      ]);

      // Validate and transform data
      const validatedCandidates = candidatesData.map((candidate) => ({
        ...candidate,
        status: candidate.status || "pending",
        technology: candidate.technology || "Unknown",
        resourceType: candidate.resourceType || "TT",
      }));

      const validatedInterviews = interviewsData.map((interview) => ({
        ...interview,
        overallStatus: interview.overallStatus || "pending",
        levels: interview.levels || [],
      }));

      // Update state with validated data
      setCandidates(validatedCandidates);
      setClientInterviews(validatedInterviews);
      setClients(clientsData);
      setJobDescriptions(jobDescriptionsData);
      setDeployedEmployees(deployedEmployeesData); // Set deployed employees state

      // Calculate deployment stats
      const stats = {
        profilesSent: validatedCandidates.filter(
          (c) => c.status === "profile_sent"
        ).length,
        resumesSent: validatedCandidates.filter(
          (c) => c.status === "resume_sent"
        ).length,
        interviewsScheduled: validatedInterviews.filter(
          (i) => i.overallStatus === "in_process"
        ).length,
        deployed: validatedInterviews.filter((i) => i.result === "hired")
          .length,
        rejected: validatedInterviews.filter((i) => i.result === "rejected")
          .length,
      };
      setDeploymentStats(stats);
    } catch (error) {
      console.error("Error in fetchData:", error);
      if (retryCount < 3) {
        // Retry with exponential backoff
        setTimeout(() => {
          fetchData(retryCount + 1);
        }, Math.pow(2, retryCount) * 1000);
      } else {
        setError(error.message || "Failed to load dashboard data");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Refactor handleFileChange to accept form values
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Please upload a PDF or Word document.");
      return;
    }

    if (file.size > maxSize) {
      setError("File size too large. Maximum size is 5MB.");
      return;
    }

    // Note: This function is intended for handling file selection,
    //       the actual JD upload happens in handleJDModalSubmit
    // setIsSubmitting(true);
    // setError(null);
    // try {
    //   const formData = new FormData();
    //   formData.append('file', file);
    //   formData.append('title', jdFormValues.title || 'New Job Description');
    //   formData.append('client', jdFormValues.client || '');
    //   formData.append('technology', jdFormValues.technology || '');
    //   formData.append('resourceType', jdFormValues.resourceType || '');
    //   formData.append('description', jdFormValues.description || 'Job description details...');
    //   formData.append('receivedDate', jdFormValues.receivedDate || new Date().toISOString().split('T')[0]);
    //   formData.append('deadline', jdFormValues.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

    //   const response = await addJobDescription(
    //     formData.get('title'),
    //     formData.get('client'),
    //     formData.get('receivedDate'),
    //     formData.get('deadline'),
    //     formData.get('technology'),
    //     formData.get('resourceType'),
    //     formData.get('description'),
    //     file
    //   );

    //   setJobDescriptions(prev => [...prev, response]);
    //   setResumeStatus('submitted');

    //   // Show success message
    //   alert('Job description uploaded successfully!');
    // } catch (error) {
    //   console.error('Error uploading file:', error);
    //   setError(error.message || 'Failed to upload file');
    //   setResumeStatus('rejected');
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  // Enhanced interview scheduling with validation
  const notifyShortlistedCandidates = async (
    candidateIds,
    interviewDetails
  ) => {
    // Validate interview details
    if (!interviewDetails.date || !interviewDetails.time) {
      // Use the general error state for display
      setError("Please select both date and time for the interview.");
      return;
    }

    // Ensure client and JD are selected for client interviews
    if (!interviewDetails.client) {
      setError("Please select a client for the interview.");
      return;
    }
    if (!interviewDetails.jobDescriptionTitle) {
      setError("Please select a job description for the interview.");
      return;
    }

    if (interviewDetails.mode === "virtual" && !interviewDetails.link) {
      setError("Please provide a meeting link for virtual interviews.");
      return;
    }

    if (interviewDetails.mode === "in-person" && !interviewDetails.location) {
      setError("Please provide a location for in-person interviews.");
      return;
    }

    setIsSubmitting(true);
    setError(null); // Clear previous errors

    try {
      const interviewPromises = candidateIds.map((id) => {
        const candidate = readyForDeploymentEmployees.find(
          (emp) => emp.id === id
        );

        if (!candidate) {
          throw new Error(`Employee not found for ID: ${id}`);
        }

        return scheduleClientInterview(
          candidate.empId, // Use candidate.empId here
          interviewDetails.client?.trim(), // client
          interviewDetails.date, // date
          interviewDetails.time, // time
          parseInt(interviewDetails.level), // level
          interviewDetails.jobDescriptionTitle?.trim(), // jobDescriptionTitle
          interviewDetails.mode === "virtual"
            ? interviewDetails.link?.trim()
            : interviewDetails.location?.trim(), // meetingLink or location
          interviewDetails.deployedStatus // Pass the value from the checkbox
        );
      });

      const results = await Promise.all(interviewPromises);

      // Filter out any potential null or undefined results from the API calls
      const successfulResults = results.filter((result) => result);

      // Update the interviews state with the new interviews
      setClientInterviews((prev) => [...prev, ...successfulResults]);

      // Update the status of scheduled candidates to 'interview_scheduled'
      setCandidates((prev) =>
        prev.map((c) =>
          candidateIds.includes(c.id)
            ? { ...c, status: "interview_scheduled" }
            : c
        )
      );

      // Show success message
      setError({
        type: "success",
        message: `Successfully scheduled ${successfulResults.length} interview(s)!`,
      });

      // Close the scheduler
      setShowInterviewScheduler(false);
      setSelectedForInterview([]);
      setInterviewDetails({
        // Reset interview details on close
        level: 1,
        date: "",
        time: "",
        mode: "virtual",
        link: "",
        location: "",
        notes: "",
        client: "",
        jobDescriptionTitle: "",
        interviewerName: "",
        deployedStatus: false, // Reset deployedStatus
      });
      setBulkSelectedCandidates([]); // Clear bulk selections
    } catch (error) {
      console.error("Error scheduling interviews:", error);
      // Use the general error state for display
      setError({
        type: "error",
        message:
          error.message || "Failed to schedule interviews. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add function to handle interview feedback submission
  const handleInterviewFeedback = async (
    interviewId,
    result,
    feedback,
    technicalScore,
    communicationScore
  ) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const updatedInterview = await updateClientInterview(
        interviewId,
        result,
        feedback,
        technicalScore,
        communicationScore
      );

      // Update the interviews state with the updated interview
      setClientInterviews((prev) =>
        prev.map((interview) =>
          interview.id === interviewId ? updatedInterview : interview
        )
      );
    } catch (error) {
      console.error("Error updating interview feedback:", error);
      setError(error.message || "Failed to update interview feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add function to handle job description download
  const handleDownloadJD = async (jdId) => {
    try {
      const blob = await downloadJobDescription(jdId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `job_description_${jdId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading job description:", error);
      if (error.response?.status === 401) {
        setError("Please log in to download job descriptions");
      } else if (error.response?.status === 400) {
        setError("Job description not found or invalid ID");
      } else {
        setError(error.message || "Failed to download job description");
      }
    }
  };

  // Add function to handle job description deletion
  const handleDeleteJD = async (jdId) => {
    try {
      await deleteJobDescription(jdId);
      setJobDescriptions((prev) => prev.filter((jd) => jd.id !== jdId));
      setError({
        type: "success",
        message: "Job description deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting job description:", error);
      if (error.response?.status === 401) {
        setError("Please log in to delete job descriptions");
      } else if (error.response?.status === 400) {
        setError("Job description not found or invalid ID");
      } else {
        setError(error.message || "Failed to delete job description");
      }
    }
  };

  // New function to open the interview scheduler
  const openInterviewScheduler = (candidateIds) => {
    setSelectedForInterview(candidateIds);
    setShowInterviewScheduler(true);
  };

  // Filter functions
  const filterCandidates = (candidates) => {
    return candidates.filter((candidate) => {
      const matchesSearch =
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.technology.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTech =
        filterTech === "all" || candidate.technology === filterTech;
      const matchesStatus =
        filterStatus === "all" || candidate.status === filterStatus;
      const matchesResourceType =
        filterResourceType === "all" ||
        candidate.resourceType === filterResourceType;

      return (
        matchesSearch && matchesTech && matchesStatus && matchesResourceType
      );
    });
  };

  const filterInterviews = (interviews) => {
    return interviews.filter((interview) => {
      if (!interview) return false;

      const candidateName = interview.candidateName || "";
      const client = interview.client || "";
      const jd = interview.jd || "";
      const levels = interview.levels || [];

      const searchMatch =
        candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jd.toLowerCase().includes(searchTerm.toLowerCase());

      const levelMatch =
        filterInterviewLevel === "all" ||
        levels.some(
          (level) =>
            level &&
            level.number &&
            level.number.toString() === filterInterviewLevel
        );

      return searchMatch && levelMatch;
    });
  };

  // Add client management tab
  const ClientsTab = () => {
    const filteredClients = clients.filter(client => 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactEmail.toLowerCase().includes(searchTerm.toLowerCase())
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
              placeholder="Search clients..." 
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <button 
            className={`${styles.button} ${styles.primary}`}
            onClick={() => setShowClientModal(true)}
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
              >
                <div className={styles.clientHeader}>
                  <h3 className={styles.clientName}>{client.name}</h3>
                  <span className={styles.clientEmail}>{client.contactEmail}</span>
                </div>

                <div className={styles.clientDetails}>
                  <p>
                    <strong>Active Positions:</strong> {client.activePositions}
                  </p>
                  <div className={styles.technologyTags}>
                    {client.technologies.map(tech => (
                      <span 
                        key={tech} 
                        className={`${styles.techBadge} ${styles[tech.toLowerCase()]}`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.clientActions}>
                  <button className={`${styles.button} ${styles.secondary}`}>
                    <FiMail /> Contact
                  </button>
                  <button className={`${styles.button} ${styles.primary}`}>
                    <FiFileText /> View JDs
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <FiUsers size={48} />
            <h4>No clients found</h4>
            <p>Add new clients or adjust your search.</p>
          </div>
        )}
      </motion.div>
    );
  };

  // Tab components
  const JDTab = () => {
    const filteredJDs = jobDescriptions.filter(
      (jd) =>
        (jd.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (jd.clientName?.toLowerCase() || "").includes(searchTerm.toLowerCase())
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
            onClick={() => setSelectedJD("new")}
          >
            <FiFileText /> Add New JD
          </button>
        </div>

        {filteredJDs.length > 0 ? (
          <div className={styles.cardGrid}>
            {filteredJDs.map((jd) => (
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
                    <span
                      className={`${styles.techBadge} ${
                        styles[jd.technology.toLowerCase()]
                      }`}
                    >
                      {jd.technology}
                    </span>
                    <span
                      className={`${styles.resourceBadge} ${
                        styles[jd.resourceType.toLowerCase()]
                      }`}
                    >
                      {jd.resourceType}
                    </span>
                  </p>
                  <p>
                    <strong>Received:</strong> {jd.receivedDate}
                  </p>
                  <p>
                    <strong>Status:</strong>
                    <span
                      className={`${styles.statusBadge} ${styles[jd.status]}`}
                    >
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
    const [filteredResumes, setFilteredResumes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      fetchFilteredResumes();
    }, [filterTech, filterResourceType, searchTerm]);

    const fetchFilteredResumes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const resumes = await getFilteredResumes(
          filterTech,
          filterResourceType
        );
        // Apply search filter locally
        const searchFilteredResumes = resumes.filter(
          (resume) =>
            resume.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resume.technology?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredResumes(searchFilteredResumes);
      } catch (error) {
        console.error("Error fetching filtered resumes:", error);
        setError(error.message || "Failed to fetch resumes");
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoading) {
      return (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading resumes...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className={styles.errorContainer}>
          <h3>Error</h3>
          <p>{error}</p>
          <button
            className={`${styles.button} ${styles.primary}`}
            onClick={fetchFilteredResumes}
          >
            Try Again
          </button>
        </div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={styles.tabContent}
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
          <div className={styles.filterGroup}>
            <label>Technology</label>
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
            <label>Resource Type</label>
            <select
              value={filterResourceType}
              onChange={(e) => setFilterResourceType(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Types</option>
              <option value="OM">OM</option>
              <option value="TCT1">TCT1</option>
            </select>
          </div>
        </div>

        <div className={styles.tableContainer}>
          {filteredResumes.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Technology</th>
                  <th>Resource Type</th>
                  <th>Received Date</th>
                  <th>Status</th>
                  <th>Ready for Deployment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResumes.map((resume) => (
                  <tr key={resume.id}>
                    <td>{resume.user?.fullName || "N/A"}</td>
                    <td>
                      <span
                        className={`${styles.techBadge} ${
                          styles[resume.technology?.toLowerCase()]
                        }`}
                      >
                        {resume.technology}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`${styles.resourceBadge} ${
                          styles[resume.resourceType?.toLowerCase()]
                        }`}
                      >
                        {resume.resourceType}
                      </span>
                    </td>
                    <td>
                      {new Date(resume.receivedDate).toLocaleDateString()}
                    </td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${
                          styles[resume.status?.toLowerCase()]
                        }`}
                      >
                        {resume.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`${styles.button} ${styles.small} ${
                          resume.readyForDeployment
                            ? styles.success
                            : styles.secondary
                        }`}
                        onClick={() =>
                          handleDeploymentStatusChange(
                            resume.id,
                            !resume.readyForDeployment
                          )
                        }
                        disabled={isDeploymentLoading}
                      >
                        {resume.readyForDeployment ? <FiCheck /> : <FiX />}
                        {resume.readyForDeployment ? "Ready" : "Not Ready"}
                      </button>
                    </td>
                    <td>
                      <button
                        className={`${styles.button} ${styles.small}`}
                        onClick={() => handleDownloadResume(resume.id)}
                      >
                        <FiDownload /> Download
                      </button>
                      <button
                        className={`${styles.button} ${styles.small} ${styles.primary}`}
                        onClick={() => handleShortlistResume(resume.id)}
                      >
                        <FiCheck /> Shortlist
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className={styles.emptyState}>
              <FiUpload size={48} />
              <h4>No resumes found</h4>
              <p>Upload resumes or adjust your search filters.</p>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // Add these new handler functions
  const handleDownloadResume = async (resumeId) => {
    try {
      // Implement resume download functionality
      console.log("Downloading resume:", resumeId);
    } catch (error) {
      console.error("Error downloading resume:", error);
      setError("Failed to download resume");
    }
  };

  const handleShortlistResume = async (resumeId) => {
    try {
      // Implement resume shortlisting functionality
      console.log("Shortlisting resume:", resumeId);
    } catch (error) {
      console.error("Error shortlisting resume:", error);
      setError("Failed to shortlist resume");
    }
  };

  const handleSelectCandidateForBulkScheduling = (candidateId, isSelected) => {
    setBulkSelectedCandidates((prev) =>
      isSelected
        ? [...prev, candidateId]
        : prev.filter((id) => id !== candidateId)
    );
  };

  // This function will handle opening the interview scheduler for selected candidates
  const openBulkInterviewScheduler = () => {
    if (bulkSelectedCandidates.length === 0) {
      setError({
        type: "error",
        message:
          "Please select at least one candidate to schedule an interview.",
      });
      return;
    }
    setSelectedForInterview(bulkSelectedCandidates); // Set the selected IDs from bulk selection
    setShowInterviewScheduler(true); // Open the modal
  };

  const ShortlistedTab = () => {
    // Filter shortlisted candidates (which are now specifically 'ready for deployment' employees)
    // based on search term and other filters
    const filteredShortlisted = readyForDeploymentEmployees
      .filter(
        (employee) =>
          (employee.user?.fullName?.toLowerCase() || "").includes(
            searchTerm.toLowerCase()
          ) ||
          (employee.technology?.toLowerCase() || "").includes(
            searchTerm.toLowerCase()
          )
      )
      .filter(
        (employee) =>
          (filterTech === "all" || employee.technology === filterTech) &&
          (filterResourceType === "all" ||
            employee.resourceType === filterResourceType)
      );

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={styles.tabContent}
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
          <div className={styles.filterGroup}>
            <label>Technology</label>
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
            <label>Resource Type</label>
            <select
              value={filterResourceType}
              onChange={(e) => setFilterResourceType(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Types</option>
              <option value="OM">OM</option>
              <option value="TCT1">TCT1</option>
            </select>
          </div>
        </div>

        {bulkSelectedCandidates.length > 0 && (
          <div className={styles.bulkActions}>
            <button
              className={`${styles.button} ${styles.primary}`}
              onClick={openBulkInterviewScheduler} // This will open the modal for selected candidates
            >
              <FiCalendar /> Schedule Selected Interviews (
              {bulkSelectedCandidates.length})
            </button>
            <button
              className={`${styles.button} ${styles.secondary}`}
              onClick={() => setBulkSelectedCandidates([])}
            >
              <FiX /> Clear Selection
            </button>
          </div>
        )}

        <div className={styles.tableContainer}>
          {filteredShortlisted.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={
                        bulkSelectedCandidates.length ===
                          filteredShortlisted.length &&
                        filteredShortlisted.length > 0
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setBulkSelectedCandidates(
                            filteredShortlisted.map((emp) => emp.id)
                          );
                        } else {
                          setBulkSelectedCandidates([]);
                        }
                      }}
                    />
                  </th>
                  <th>Name</th>
                  <th>Technology</th>
                  <th>Resource Type</th>
                  <th>Received Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredShortlisted.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={bulkSelectedCandidates.includes(employee.id)}
                        onChange={(e) =>
                          handleSelectCandidateForBulkScheduling(
                            employee.id,
                            e.target.checked
                          )
                        }
                      />
                    </td>
                    <td>{employee.user?.fullName || "N/A"}</td>
                    <td>
                      <span
                        className={`${styles.techBadge} ${
                          styles[employee.technology?.toLowerCase()]
                        }`}
                      >
                        {employee.technology}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`${styles.resourceBadge} ${
                          styles[employee.resourceType?.toLowerCase()]
                        }`}
                      >
                        {employee.resourceType}
                      </span>
                    </td>
                    <td>
                      {new Date(employee.receivedDate).toLocaleDateString()}
                    </td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${
                          styles[employee.status?.toLowerCase()]
                        }`}
                      >
                        {employee.status}
                      </span>
                    </td>
                    <td>
                      {/* Actions for individual shortlisted candidates, excluding schedule/feedback buttons */}
                      <button
                        className={`${styles.button} ${styles.small}`}
                        onClick={() => handleDownloadResume(employee.id)}
                      >
                        <FiDownload /> Resume
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className={styles.emptyState}>
              <FiUsers size={48} />
              <h4>No ready for deployment employees found</h4>
              <p>
                No employees are currently marked as ready for deployment or
                match the current filters.
              </p>
            </div>
          )}
        </div>

        {/* Interview Scheduler Modal - now controlled by the top-level state */}
        <AnimatePresence>
          {showInterviewScheduler && (
            <ScheduleClientInterviewModal
              show={showInterviewScheduler}
              onClose={() => {
                setShowInterviewScheduler(false);
                setSelectedForInterview([]);
              }}
              onSubmit={handleScheduleInterview}
              selectedCandidates={readyForDeploymentEmployees.filter((c) =>
                selectedForInterview.includes(c.id)
              )}
              clients={clients}
              jobDescriptions={jobDescriptions}
            />
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const InterviewsTab = () => {
    const filteredInterviews = filterInterviews(clientInterviews);

    const handleMarkAsCompleted = async (interviewId) => {
      setIsLoading(true); // Indicate loading
      setError(null);
      try {
        const updatedInterview = await updateClientInterview(
          interviewId,
          "N/A", // result - can be 'N/A' or 'pending' as it will be updated later with actual feedback
          "Interview marked as completed.", // feedback - provide a default feedback
          0, // technicalScore
          0 // communicationScore
        );

        // Update the interviews state with the updated interview, specifically overallStatus
        setClientInterviews((prev) =>
          prev.map((interview) =>
            interview.id === interviewId
              ? {
                  ...interview,
                  overallStatus: "completed",
                  result: updatedInterview.result,
                  feedback: updatedInterview.feedback,
                } // Ensure result and feedback are also updated from backend response
              : interview
          )
        );
        setError({
          type: "success",
          message: "Interview marked as completed successfully!",
        });
      } catch (error) {
        console.error("Error marking interview as completed:", error);
        setError({
          type: "error",
          message: error.message || "Failed to mark interview as completed",
        });
      } finally {
        setIsLoading(false); // End loading
      }
    };

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
            {filteredInterviews.map((interview) => (
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
                      {interview.client}
                    </h4>
                    <span
                      className={`${styles.statusBadge} ${
                        styles[interview.overallStatus?.toLowerCase()]
                      }`}
                    >
                      {interview.overallStatus?.replace("_", " ")}
                    </span>
                  </div>
                  <div className={styles.interviewActions}>
                    {(interview.overallStatus?.toLowerCase() === "scheduled" ||
                      interview.overallStatus?.toLowerCase() === "pending") && (
                      <button
                        className={`${styles.button} ${styles.primary}`}
                        onClick={async () => {
                          // Before opening the modal, fetch the latest feedback details
                          setIsLoading(true); // Show loading state
                          setError(null); // Clear previous errors
                          try {
                            const latestFeedback =
                              await getClientInterviewFeedback(interview.id);
                            setSelectedInterviewForFeedback(latestFeedback);
                            setShowFeedbackModal(true);
                          } catch (err) {
                            console.error(
                              "Error fetching interview feedback:",
                              err
                            );
                            setError({
                              type: "error",
                              message:
                                err.message ||
                                "Failed to load feedback details.",
                            });
                          } finally {
                            setIsLoading(false); // Hide loading state
                          }
                        }}
                      >
                        <FiMessageSquare /> Give Feedback
                      </button>
                    )}

                    {interview.overallStatus === "completed" && (
                      <button
                        className={`${styles.button} ${styles.secondary}`}
                        onClick={async () => {
                          // Before opening the modal, fetch the latest feedback details
                          setIsLoading(true); // Show loading state
                          setError(null); // Clear previous errors
                          try {
                            const latestFeedback =
                              await getClientInterviewFeedback(interview.id);
                            setSelectedInterviewForFeedback(latestFeedback);
                            setShowFeedbackModal(true);
                          } catch (err) {
                            console.error(
                              "Error fetching interview feedback:",
                              err
                            );
                            setError({
                              type: "error",
                              message:
                                err.message ||
                                "Failed to load feedback details for update.",
                            });
                          } finally {
                            setIsLoading(false); // Hide loading state
                          }
                        }}
                      >
                        <FiMessageSquare /> Update Interview
                      </button>
                    )}
                  </div>
                </div>
                <div className={styles.interviewDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Date:</span>
                    <span>{new Date(interview.date).toLocaleDateString()}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Time:</span>
                    <span>{interview.time}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Level:</span>
                    <span>{interview.level}</span>
                  </div>
                  {interview.meetingLink && (
                    <div className={styles.detailItem}>
                      <span className={styles.label}>Meeting Link:</span>
                      <a
                        href={interview.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Join Meeting
                      </a>
                    </div>
                  )}
                  {/* Display Employee Details */}
                  {interview.employee && (
                    <div className={styles.employeeDetailsSection}>
                      <strong>Employee Details:</strong>
                      <div className={styles.detailItem}>
                        <span className={styles.label}>Full Name:</span>
                        <span>
                          {interview.employee.user?.fullName || "N/A"}
                        </span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.label}>Email:</span>
                        <span>{interview.employee.user?.email || "N/A"}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.label}>Employee ID:</span>
                        <span>{interview.employee.empId || "N/A"}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.label}>Technology:</span>
                        <span>{interview.employee.technology || "N/A"}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.label}>Resource Type:</span>
                        <span>{interview.employee.resourceType || "N/A"}</span>
                      </div>
                    </div>
                  )}
                  {/* Display Feedback details if available and interview is completed */}
                  {interview.overallStatus?.toLowerCase() === "completed" &&
                    interview.feedback && (
                      <div className={styles.feedbackDetailsSection}>
                        <strong>Feedback:</strong>
                        <div className={styles.detailItem}>
                          <span className={styles.label}>Technical:</span>
                          <span>
                            {interview.technicalScore !== undefined
                              ? `${interview.technicalScore}/10`
                              : "N/A"}
                          </span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.label}>Communication:</span>
                          <span>
                            {interview.communicationScore !== undefined
                              ? `${interview.communicationScore}/10`
                              : "N/A"}
                          </span>
                        </div>
                        <p>
                          <strong>Technical Feedback</strong>
                        </p>
                        <p>{interview.feedback}</p>{" "}
                        {/* Assuming 'feedback' field contains both technical and communication feedback combined or is general feedback */}
                        {/* If backend provides separate technical and communication feedback fields, use them here */}
                        <p>
                          <strong>Communication Feedback</strong>
                        </p>
                        <p>{interview.feedback}</p>
                      </div>
                    )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <FiCalendar size={48} />
            <h4>No interviews scheduled</h4>
            <p>
              When candidates are sent to clients, their interviews will appear
              here.
            </p>
          </div>
        )}
      </motion.div>
    );
  };

  const DeploymentsTab = () => {
    const filteredDeployedEmployees = deployedEmployees.filter(
      (employee) =>
        (employee.user?.fullName?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        ) ||
        (employee.technology?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        ) ||
        (employee.empId?.toLowerCase() || "").includes(searchTerm.toLowerCase())
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
              placeholder="Search deployed employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          {/* Add more filters here if needed */}
        </div>

        {filteredDeployedEmployees.length > 0 ? (
          <div className={styles.cardGrid}>
            {" "}
            {/* Changed to cardGrid */}
            {filteredDeployedEmployees.map((employee) => (
              <motion.div
                key={employee.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={
                  styles.profileCard
                } /* Reusing profileCard style or similar */
              >
                <div className={styles.profileHeader}>
                  {" "}
                  {/* Reusing profileHeader style or similar */}
                  <h3 className={styles.profileName}>
                    {" "}
                    {/* Reusing profileName style or similar */}
                    {employee.user?.fullName || "N/A"}
                  </h3>
                  <span
                    className={`${styles.statusBadge} ${
                      styles[employee.status?.toLowerCase()]
                    }`}
                  >
                    {" "}
                    {/* Status badge */}
                    {employee.status || "N/A"}
                  </span>
                </div>

                <div className={styles.profileDetails}>
                  {" "}
                  {/* Reusing profileDetails style or similar */}
                  <p>
                    <strong>Employee ID:</strong> {employee.empId || "N/A"}
                  </p>
                  <p>
                    <strong>Email:</strong> {employee.user?.email || "N/A"}
                  </p>
                  <p>
                    <strong>Technology:</strong>
                    <span
                      className={`${styles.techBadge} ${
                        styles[employee.technology?.toLowerCase()]
                      }`}
                    >
                      {employee.technology || "N/A"}
                    </span>
                  </p>
                  <p>
                    <strong>Resource Type:</strong>
                    <span
                      className={`${styles.resourceBadge} ${
                        styles[employee.resourceType?.toLowerCase()]
                      }`}
                    >
                      {employee.resourceType || "N/A"}
                    </span>
                  </p>
                  <p>
                    <strong>Level:</strong> {employee.level || "N/A"}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <FiUserCheck size={48} />
            <h4>No employees currently deployed</h4>
            <p>Employees marked as deployed will appear here.</p>
          </div>
        )}
      </motion.div>
    );
  };

  // Update renderTabContent to include clients tab
  const renderTabContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (error) {
      return <ErrorState error={error} />;
    }

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    switch (activeTab) {
      case "clients":
        return (
          <>
            <ClientsTab />
            <Pagination
              totalItems={clients.length}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </>
        );
      case "jds":
        return (
          <>
            <JDTab />
            <Pagination
              totalItems={jobDescriptions.length}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </>
        );
      case "resumePool":
        return (
          <>
            <ResumePoolTab />
            <Pagination
              totalItems={resumePool.length}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </>
        );
      case "shortlisted":
        return (
          <>
            <ShortlistedTab />
            <Pagination
              totalItems={shortlistedCandidates.length}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </>
        );
      case "interviews":
        return (
          <>
            <InterviewsTab />
            <Pagination
              totalItems={clientInterviews.length}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </>
        );
      case "deployments":
        return (
          <>
            <DeploymentsTab />
            <Pagination
              totalItems={deployedEmployees.length} // Use deployedEmployees for pagination
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </>
        );
      default:
        return null;
    }
  };

  // Add reset function for JD modal
  const resetJDModal = () => {
    setJDModalFields({
      title: "",
      client: "",
      technology: "",
      resourceType: "",
      description: "",
      receivedDate: "",
      deadline: "",
    });
    setJDModalFile(null);
    setJDModalError("");
    setJDModalSuccess("");
    setJDModalLoading(false);
    setSelectedJD(null);
    setSelectedClient("");
    setFilterTech("all");
    setFilterResourceType("all");
  };

  // Add handleJDModalFieldChange function
  const handleJDModalFieldChange = (field, value) => {
    setJDModalFields((prev) => ({ ...prev, [field]: value }));
    if (field === "client") setSelectedClient(value);
    if (field === "technology") setFilterTech(value);
    if (field === "resourceType") setFilterResourceType(value);
  };

  // Add handleJDModalFileChange function
  const handleJDModalFileChange = (e) => {
    const file = e.target.files[0];
    setJDModalFile(file);
  };

  // Add handleJDModalSubmit function
  const handleJDModalSubmit = async (e) => {
    e.preventDefault();
    setJDModalError("");
    setJDModalSuccess("");

    // Validation
    if (
      !jdModalFields.title.trim() ||
      !jdModalFields.client ||
      !jdModalFields.technology ||
      !jdModalFields.resourceType ||
      !jdModalFile
    ) {
      setJDModalError("Please fill all required fields and select a file.");
      return;
    }

    // File validation
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(jdModalFile.type)) {
      setJDModalError(
        "Invalid file type. Please upload a PDF or Word document."
      );
      return;
    }

    if (jdModalFile.size > maxSize) {
      setJDModalError("File size too large. Maximum size is 5MB.");
      return;
    }

    setJDModalLoading(true);
    try {
      const response = await addJobDescription(
        jdModalFields.title,
        jdModalFields.client,
        jdModalFields.receivedDate || new Date().toISOString().split("T")[0],
        jdModalFields.deadline ||
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        jdModalFields.technology,
        jdModalFields.resourceType,
        jdModalFields.description,
        jdModalFile
      );

      setJobDescriptions((prev) => [...prev, response]);
      setJDModalSuccess("Job description uploaded successfully!");

      // Reset form after success
      setTimeout(() => {
        resetJDModal();
      }, 1500);
    } catch (error) {
      console.error("Error uploading job description:", error);
      if (error.response?.status === 401) {
        setJDModalError("Please log in to upload job descriptions");
      } else if (error.response?.status === 400) {
        setJDModalError(error.response.data || "Invalid job description data");
      } else {
        setJDModalError(error.message || "Failed to upload job description");
      }
    } finally {
      setJDModalLoading(false);
    }
  };

  // Add reset function for client modal
  const resetClientModal = () => {
    setClientModalFields({
      name: "",
      contactEmail: "",
      activePositions: 0,
      technologies: [],
    });
    setClientModalError("");
    setClientModalSuccess("");
    setClientModalLoading(false);
    setShowClientModal(false);
  };

  // Add handleClientModalFieldChange function
  const handleClientModalFieldChange = (field, value) => {
    setClientModalFields((prev) => ({ ...prev, [field]: value }));
  };

  // Add handleClientModalTechChange function
  const handleClientModalTechChange = (tech) => {
    setClientModalFields((prev) => ({
      ...prev,
      technologies: prev.technologies.includes(tech)
        ? prev.technologies.filter((t) => t !== tech)
        : [...prev.technologies, tech],
    }));
  };

  // Add handleClientModalSubmit function
  const handleClientModalSubmit = async (e) => {
    e.preventDefault();
    setClientModalError("");
    setClientModalSuccess("");

    // Validation
    if (!clientModalFields.name.trim()) {
      setClientModalError("Client name is required");
      return;
    }
    if (!clientModalFields.contactEmail.trim()) {
      setClientModalError("Contact email is required");
      return;
    }
    if (!clientModalFields.contactEmail.includes("@")) {
      setClientModalError("Invalid email format");
      return;
    }
    if (clientModalFields.technologies.length === 0) {
      setClientModalError("At least one technology must be selected");
      return;
    }

    setClientModalLoading(true);
    try {
      const response = await addClient(
        clientModalFields.name,
        clientModalFields.contactEmail,
        clientModalFields.activePositions,
        clientModalFields.technologies
      );
      setClients((prev) => [...prev, response]);
      setClientModalSuccess("Client added successfully!");
      setTimeout(() => {
        resetClientModal();
      }, 1500);
    } catch (error) {
      console.error("Error adding client:", error);
      if (error.response?.status === 401) {
        setClientModalError("Please log in to add clients");
      } else if (error.response?.status === 400) {
        setClientModalError(error.response.data || "Invalid client data");
      } else {
        setClientModalError(error.message || "Failed to add client");
      }
    } finally {
      setClientModalLoading(false);
    }
  };

  // Update handleScheduleInterview with better error handling
  const handleScheduleInterview = async (candidateIds, interviewDetails) => {
    if (
      !candidateIds ||
      !Array.isArray(candidateIds) ||
      candidateIds.length === 0
    ) {
      setError({
        type: "error",
        message: "No candidates selected for interview",
      });
      return;
    }

    if (!interviewDetails) {
      setError({ type: "error", message: "Interview details are required" });
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (!interviewDetails.client?.trim()) {
        throw new Error("Client name is required");
      }
      if (!interviewDetails.date) {
        throw new Error("Interview date is required");
      }
      if (!interviewDetails.time) {
        throw new Error("Interview time is required");
      }
      if (!interviewDetails.level) {
        throw new Error("Interview level is required");
      }
      if (!interviewDetails.jobDescriptionTitle?.trim()) {
        throw new Error("Job description title is required");
      }
      if (
        interviewDetails.mode === "virtual" &&
        !interviewDetails.link?.trim()
      ) {
        throw new Error("Meeting link is required for virtual interviews");
      }
      if (
        interviewDetails.mode === "in-person" &&
        !interviewDetails.location?.trim()
      ) {
        throw new Error("Location is required for in-person interviews");
      }

      console.log(
        "handleScheduleInterview: interviewDetails before API call:",
        interviewDetails
      );

      const interviewPromises = candidateIds.map((id) => {
        const candidate = readyForDeploymentEmployees.find(
          (emp) => emp.id === id
        );

        if (!candidate) {
          throw new Error(`Employee not found for ID: ${id}`);
        }
        console.log(
          "handleScheduleInterview: Candidate being processed:",
          candidate
        );

        return scheduleClientInterview(
          candidate.empId, // Use candidate.empId here
          interviewDetails.client?.trim(), // client
          interviewDetails.date, // date
          interviewDetails.time, // time
          parseInt(interviewDetails.level), // level
          interviewDetails.jobDescriptionTitle?.trim(), // jobDescriptionTitle
          interviewDetails.mode === "virtual"
            ? interviewDetails.link?.trim()
            : interviewDetails.location?.trim(), // meetingLink or location
          interviewDetails.deployedStatus // Pass the value from the checkbox
        );
      });

      const results = await Promise.all(interviewPromises);

      // Filter out any potential null or undefined results from the API calls
      const successfulResults = results.filter((result) => result);

      // Update the interviews state with the new interviews
      setClientInterviews((prev) => [...prev, ...successfulResults]);

      // Update the status of scheduled candidates to 'interview_scheduled'
      setCandidates((prev) =>
        prev.map((c) =>
          candidateIds.includes(c.id)
            ? { ...c, status: "interview_scheduled" }
            : c
        )
      );

      // Show success message
      setError({
        type: "success",
        message: `Successfully scheduled ${successfulResults.length} interview(s)!`,
      });

      // Close the scheduler
      setShowInterviewScheduler(false);
      setSelectedForInterview([]);
      setInterviewDetails({
        // Reset interview details on close
        level: 1,
        date: "",
        time: "",
        mode: "virtual",
        link: "",
        location: "",
        notes: "",
        client: "",
        jobDescriptionTitle: "",
        interviewerName: "",
        deployedStatus: false, // Reset deployedStatus
      });
      setBulkSelectedCandidates([]); // Clear bulk selections
    } catch (error) {
      console.error("Error scheduling interviews:", error);
      setError({
        type: "error",
        message:
          error.message || "Failed to schedule interviews. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateFeedback = async (
    interviewId,
    result,
    feedback,
    technicalScore,
    communicationScore,
    deployedStatus
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await updateClientInterview(
        interviewId,
        result,
        feedback,
        technicalScore,
        communicationScore,
        deployedStatus // Pass deployedStatus to the API
      );

      if (response) {
        // After updating, fetch the latest feedback details using the new API
        const latestFeedbackDetails = await getClientInterviewFeedback(
          interviewId
        );

        // Update interview status and feedback details with the data from the new API
        setClientInterviews((prev) =>
          prev.map((i) =>
            i.id === interviewId
              ? {
                  ...i,
                  feedback: latestFeedbackDetails.feedback,
                  result: latestFeedbackDetails.result,
                  overallStatus: latestFeedbackDetails.overallStatus,
                  technicalScore: latestFeedbackDetails.technicalScore,
                  communicationScore: latestFeedbackDetails.communicationScore,
                  deployedStatus: latestFeedbackDetails.deployedStatus, // Update deployedStatus in state
                }
              : i
          )
        );
        // Refresh data (if needed, but direct state update should suffice)
        // fetchData();
        setError({ type: "success", message: "Feedback updated successfully" });
      }
    } catch (error) {
      console.error("Error updating feedback:", error);
      if (error.response?.status === 401) {
        setError("Please log in to update feedback");
      } else if (error.response?.status === 400) {
        setError("Invalid feedback data. Please check your input.");
      } else {
        setError(error.message || "Failed to update feedback");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const [readyForDeploymentEmployees, setReadyForDeploymentEmployees] =
    useState([]);
  const [isDeploymentLoading, setIsDeploymentLoading] = useState(false);

  // Get unique technologies and resource types from the data
  const technologies = useMemo(() => {
    const techSet = new Set(
      readyForDeploymentEmployees.map((emp) => emp.technology)
    );
    return ["all", ...Array.from(techSet)];
  }, [readyForDeploymentEmployees]);

  const resourceTypes = useMemo(() => {
    const typeSet = new Set(
      readyForDeploymentEmployees.map((emp) => emp.resourceType)
    );
    return ["all", ...Array.from(typeSet)];
  }, [readyForDeploymentEmployees]);

  // Filter employees based on search and filters
  // const filteredEmployees = useMemo(() => {
  //   return readyForDeploymentEmployees.filter(employee => {
  //     const matchesSearch = employee.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //                         employee.empId.toLowerCase().includes(searchTerm.toLowerCase());
  //     const matchesTechnology = technologyFilter === 'all' || employee.technology === technologyFilter;
  //     const matchesResourceType = resourceTypeFilter === 'all' || employee.resourceType === resourceTypeFilter;

  //     return matchesSearch && matchesTechnology && matchesResourceType;
  //   });
  // }, [readyForDeploymentEmployees, searchTerm, technologyFilter, resourceTypeFilter]);

  // Add this to your fetchData function
  const fetchReadyForDeploymentEmployees = async () => {
    try {
      setIsDeploymentLoading(true);
      const employees = await getReadyForDeploymentEmployees();
      setReadyForDeploymentEmployees(employees);
    } catch (error) {
      console.error("Error fetching ready for deployment employees:", error);
      toast.error(
        error.message || "Failed to fetch ready for deployment employees"
      );
    } finally {
      setIsDeploymentLoading(false);
    }
  };

  // Add this to your useEffect or where you fetch initial data
  useEffect(() => {
    fetchReadyForDeploymentEmployees();
  }, [filterTech, filterResourceType]);

  // Add this function to handle deployment status updates
  const handleDeploymentStatusChange = async (
    employeeId,
    readyForDeployment
  ) => {
    try {
      await updateReadyForDeployment(employeeId, readyForDeployment);
      toast.success(
        `Employee ${
          readyForDeployment ? "marked as" : "unmarked from"
        } ready for deployment`
      );
      fetchReadyForDeploymentEmployees(); // Refresh the list
    } catch (error) {
      console.error("Error updating deployment status:", error);
      toast.error(error.message || "Failed to update deployment status");
    }
  };

  // Add new state for interview feedback modal
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedInterviewForFeedback, setSelectedInterviewForFeedback] =
    useState(null);

  const renderHeader = () => (
    <div className={styles.dashboardHeader}>
      <div className={styles.headerTitleContainer}>
        <h1 className={styles.headerTitle}>Sales Team Dashboard</h1>
        <p className={styles.headerSubtitle}>
          Client Engagement & Resume Management
        </p>
      </div>
      <div className={styles.headerActions}>
        <button
          className={`${styles.button} ${styles.secondary}`}
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <FiRefreshCw className={isRefreshing ? styles.spinning : ""} />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>
        <div className={styles.userProfile}>
          <div className={styles.userAvatar}>
            {profilePic ? (
              <img src={profilePic} alt="Profile" />
            ) : (
              <FiUser size={18} />
            )}
            <input
              type="file"
              id="salesProfilePicture"
              accept="image/jpeg,image/png"
              onChange={handleProfilePictureChange}
              style={{ display: "none" }}
            />
            <label
              htmlFor="salesProfilePicture"
              className={styles.avatarUpload}
            >
              <FiUpload size={14} />
            </label>
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{salesUserData.fullName}</span>
            <span className={styles.userRole}>
              Sales Manager ({salesUserData.email})
            </span>
            <span className={styles.userRole}>Sales Team</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.dashboardContainer}>
      {renderHeader()}
      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tabButton} ${
            activeTab === "clients" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("clients")}
        >
          <FiUsers /> Clients
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "jds" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("jds")}
        >
          <FiFileText /> Job Descriptions
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "resumePool" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("resumePool")}
        >
          <FiUpload /> Resume Pool
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "shortlisted" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("shortlisted")}
        >
          <FiCheck /> Shortlisted
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "interviews" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("interviews")}
        >
          <FiCalendar /> Client Interviews
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "deployments" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("deployments")}
        >
          <FiSend /> Deployments
        </button>
      </div>
      <div className={styles.contentContainer}>{renderTabContent()}</div>
      <ClientModal
        show={showClientModal}
        onClose={() => {
          setShowClientModal(false);
          setClientModalError("");
          setClientModalSuccess("");
        }}
        onSubmit={handleClientModalSubmit}
        fields={clientModalFields}
        onFieldChange={handleClientModalFieldChange}
        error={clientModalError}
        success={clientModalSuccess}
        loading={clientModalLoading}
        onTechChange={handleClientModalTechChange}
      />
      {selectedJD === "new" && (
        <div className={styles.modalOverlay}>
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <form onSubmit={handleJDModalSubmit}>
              <div className={styles.modalHeader}>
                <h3>Add New Job Description</h3>
                <button
                  className={styles.closeButton}
                  type="button"
                  onClick={resetJDModal}
                >
                  <FiX />
                </button>
              </div>
              <div className={styles.modalContent}>
                {jdModalError && (
                  <div className={styles.errorMessage}>{jdModalError}</div>
                )}
                {jdModalSuccess && (
                  <div className={styles.successMessage}>{jdModalSuccess}</div>
                )}
                <div className={styles.formGroup}>
                  <label>Title *</label>
                  <input
                    type="text"
                    value={jdModalFields.title}
                    onChange={(e) =>
                      handleJDModalFieldChange("title", e.target.value)
                    }
                    placeholder="Enter JD title"
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Client *</label>
                  <select
                    value={jdModalFields.client}
                    onChange={(e) =>
                      handleJDModalFieldChange("client", e.target.value)
                    }
                    className={styles.input}
                  >
                    <option value="">Select client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.name}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Technology *</label>
                  <select
                    value={jdModalFields.technology}
                    onChange={(e) =>
                      handleJDModalFieldChange("technology", e.target.value)
                    }
                    className={styles.input}
                  >
                    <option value="">Select technology</option>
                    <option value="Java">Java</option>
                    <option value="Python">Python</option>
                    <option value=".NET">.NET</option>
                    <option value="DevOps">DevOps</option>
                    <option value="SalesForce">SalesForce</option>
                    <option value="UI">UI</option>
                    <option value="Testing">Testing</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Resource Type *</label>
                  <select
                    value={jdModalFields.resourceType}
                    onChange={(e) =>
                      handleJDModalFieldChange("resourceType", e.target.value)
                    }
                    className={styles.input}
                  >
                    <option value="">Select type</option>
                    <option value="OM">OM</option>
                    <option value="TCT1">TCT1</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Description</label>
                  <textarea
                    value={jdModalFields.description}
                    onChange={(e) =>
                      handleJDModalFieldChange("description", e.target.value)
                    }
                    placeholder="Enter JD description"
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Received Date</label>
                  <input
                    type="date"
                    value={jdModalFields.receivedDate}
                    onChange={(e) =>
                      handleJDModalFieldChange("receivedDate", e.target.value)
                    }
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Deadline</label>
                  <input
                    type="date"
                    value={jdModalFields.deadline}
                    onChange={(e) =>
                      handleJDModalFieldChange("deadline", e.target.value)
                    }
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Upload JD File *</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleJDModalFileChange}
                    className={styles.input}
                  />
                  {jdModalFile && (
                    <span style={{ fontSize: "0.9em" }}>
                      {jdModalFile.name}
                    </span>
                  )}
                </div>
                <div className={styles.modalFooter}>
                  <button
                    className={`${styles.button} ${styles.secondary}`}
                    type="button"
                    onClick={resetJDModal}
                    disabled={jdModalLoading}
                  >
                    Cancel
                  </button>
                  <button
                    className={`${styles.button} ${styles.primary}`}
                    type="submit"
                    disabled={jdModalLoading}
                  >
                    {jdModalLoading ? "Uploading..." : "Submit"}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      {/* Feedback Modal */}
      <AnimatePresence>
        {console.log(
          "Rendering FeedbackModal? showFeedbackModal:",
          showFeedbackModal,
          "selectedInterviewForFeedback:",
          selectedInterviewForFeedback
        )}
        {showFeedbackModal && selectedInterviewForFeedback && (
          <FeedbackModal
            show={showFeedbackModal}
            onClose={() => {
              setShowFeedbackModal(false);
              setSelectedInterviewForFeedback(null);
            }}
            interview={selectedInterviewForFeedback}
            onSubmit={handleUpdateFeedback}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const FeedbackModal = ({ show, onClose, interview, onSubmit }) => {
  const [techScore, setTechScore] = useState(interview.technicalScore || 0);
  const [commScore, setCommScore] = useState(interview.communicationScore || 0);
  const [feedback, setFeedback] = useState(interview.feedback || "");
  const [deployedStatus, setDeployedStatus] = useState(
    interview.deployedStatus || false
  ); // Add state for deployedStatus
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (techScore < 0 || techScore > 10) {
      setError("Technical score must be between 0 and 10.");
      return;
    }
    if (commScore < 0 || commScore > 10) {
      setError("Communication score must be between 0 and 10.");
      return;
    }
    if (!feedback.trim()) {
      setError("Feedback cannot be empty.");
      return;
    }

    // Pass the relevant parameters to the onSubmit function (handleUpdateFeedback)
    onSubmit(
      interview.id,
      "completed",
      feedback,
      techScore,
      commScore,
      deployedStatus
    ); // Pass deployedStatus here
    onClose();
  };

  if (!show) return null;

  return (
    <div className={styles.modalOverlay}>
      <motion.div
        className={styles.modal}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <form onSubmit={handleSubmit}>
          <div className={styles.modalHeader}>
            <h3>Update Feedback for {interview.candidateName}</h3>
            <button
              className={styles.closeButton}
              type="button"
              onClick={onClose}
            >
              <FiX />
            </button>
          </div>
          <div className={styles.modalContent}>
            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.formGroup}>
              <label>Technical Score (0-10) *</label>
              <input
                type="number"
                min="0"
                max="10"
                value={techScore}
                onChange={(e) => setTechScore(parseInt(e.target.value) || 0)}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Communication Score (0-10) *</label>
              <input
                type="number"
                min="0"
                max="10"
                value={commScore}
                onChange={(e) => setCommScore(parseInt(e.target.value) || 0)}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Detailed Feedback *</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Enter detailed feedback here..."
                className={styles.textarea}
                rows="5"
                required
              />
            </div>

            {/* Deployed Status Checkbox in Feedback Modal */}
            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={deployedStatus}
                  onChange={(e) => setDeployedStatus(e.target.checked)}
                />
                <span>Mark as Deployed</span>
              </label>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={`${styles.button} ${styles.secondary}`}
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className={`${styles.button} ${styles.primary}`}
                type="submit"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SalesTeamDashboard;
