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
  getDeployedEmployees,
  updateProfilePicture,
  getProfilePicture,
  getClientInterviewFeedback,
} from "../../API/sales";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    try {
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
      if (!interviewDetails.meetingLink?.trim()) {
        throw new Error("Meeting link is required");
      }

      onSubmit(
        selectedCandidates[0].empId,
        interviewDetails
      );
      onClose();
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

            <div className={styles.formGroup}>
              <label>Candidate(s)</label>
              <input
                type="text"
                value={candidateNames}
                className={styles.input}
                readOnly
              />
            </div>

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

            <div className={styles.formGroup}>
              <label>Level *</label>
              <select
                value={interviewDetails.level || ""}
                onChange={(e) =>
                  setInterviewDetails({
                    ...interviewDetails,
                    level: parseInt(e.target.value),
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

            <div className={styles.formGroup}>
              <label>Meeting Link *</label>
              <input
                type="url"
                value={interviewDetails.meetingLink || ""}
                onChange={(e) =>
                  setInterviewDetails({
                    ...interviewDetails,
                    meetingLink: e.target.value,
                  })
                }
                className={styles.input}
                required
                placeholder="Enter meeting link"
              />
            </div>

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

const FeedbackModal = ({ show, onClose, interview, onSubmit }) => {
  const [techScore, setTechScore] = useState(interview.technicalScore || 0);
  const [commScore, setCommScore] = useState(interview.communicationScore || 0);
  const [feedback, setFeedback] = useState(interview.feedback || "");
  const [deployedStatus, setDeployedStatus] = useState(
    interview.deployedStatus || false
  );
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

    onSubmit(
      interview.id,
      "completed",
      feedback,
      techScore,
      commScore,
      deployedStatus
    );
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
  const [deployedEmployees, setDeployedEmployees] = useState([]);

  // Modal states
  const [showClientModal, setShowClientModal] = useState(false);
  const [showInterviewScheduler, setShowInterviewScheduler] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedInterviewForFeedback, setSelectedInterviewForFeedback] =
    useState(null);

  // Form states
  const [clientModalFields, setClientModalFields] = useState({
    name: "",
    contactEmail: "",
    activePositions: 0,
    technologies: [],
  });
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
  const initialInterviewDetails = {
    level: 1,
    date: "",
    time: "",
    client: "",
    jobDescriptionTitle: "",
    meetingLink: "",
    deployedStatus: false,
  };
  const [interviewDetails, setInterviewDetails] = useState(
    initialInterviewDetails
  );

  // Selection states
  const [selectedForInterview, setSelectedForInterview] = useState([]);
  const [bulkSelectedCandidates, setBulkSelectedCandidates] = useState([]);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeploymentLoading, setIsDeploymentLoading] = useState(false);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientModalError, setClientModalError] = useState("");
  const [clientModalSuccess, setClientModalSuccess] = useState("");
  const [clientModalLoading, setClientModalLoading] = useState(false);
  const [jdModalError, setJDModalError] = useState("");
  const [jdModalSuccess, setJDModalSuccess] = useState("");
  const [jdModalLoading, setJDModalLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // User data
  const [salesUserData, setSalesUserData] = useState({
    fullName: "",
    email: "",
    role: "ROLE_SALES_TEAM",
    empId: "",
    id: "",
    technology: "",
    resourceType: "",
    level: "",
    status: "Active",
  });
  const [profilePic, setProfilePic] = useState(null);

  // Fetch all data on component mount
  useEffect(() => {
    fetchData();
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      if (token) {
        const decoded = jwtDecode(token);
        const email =
          decoded.sub ||
          decoded.email ||
          localStorage.getItem("userEmail") ||
          "N/A";
        const role = decoded.role || localStorage.getItem("userRole") || "N/A";
        const fullName = email !== "N/A" ? email.split("@")[0] : "N/A";

        setSalesUserData({
          fullName,
          email,
          role,
          empId: decoded.empId || "",
          id: decoded.id || "",
          technology: decoded.technology || "",
          resourceType: decoded.resourceType || "",
          level: decoded.level || "",
          status: decoded.status || "Active",
        });

        // Fetch profile picture if empId exists
        if (decoded.empId) {
          try {
            const pictureBlob = await getProfilePicture(decoded.empId);
            setProfilePic(URL.createObjectURL(pictureBlob));
          } catch (pictureError) {
            console.log("No profile picture found, using default");
          }
        }
      }
    } catch (err) {
      console.error("Error decoding token:", err);
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [
        candidatesData,
        interviewsData,
        clientsData,
        jobDescriptionsData,
        deployedEmployeesData,
      ] = await Promise.all([
        getCandidates(filterTech, filterStatus, filterResourceType),
        getClientInterviews(searchTerm),
        getClients(searchTerm),
        getAllJobDescriptions(),
        getDeployedEmployees(),
      ]);

      setCandidates(candidatesData);
      setClientInterviews(interviewsData);
      setClients(clientsData);
      setJobDescriptions(jobDescriptionsData);
      setDeployedEmployees(deployedEmployeesData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data. Please try again later.");
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchData();
      toast.success("Data refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh data");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png"];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG and PNG images are allowed");
      return;
    }

    if (file.size > maxSize) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    try {
      setIsSubmitting(true);
      await updateProfilePicture(salesUserData.id, file);
      setProfilePic(URL.createObjectURL(file));
      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error("Error updating profile picture:", error);
      toast.error(error.message || "Failed to update profile picture");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScheduleInterview = async (empId, details) => {
    setIsSubmitting(true);
    setError(null);
    try {
      // Format time to HH:mm:ss
      const formattedTime = details.time.includes(':') 
        ? details.time.split(':').length === 2 
          ? `${details.time}:00` 
          : details.time
        : details.time;

      const response = await scheduleClientInterview(
        empId,
        details.client,
        details.date,
        formattedTime,
        details.level,
        details.jobDescriptionTitle,
        details.meetingLink,
        details.deployedStatus
      );

      if (response) {
        setClientInterviews((prev) => [...prev, response]);
        setShowInterviewScheduler(false);
        setSelectedForInterview([]);
        toast.success("Interview scheduled successfully!");
        await fetchData();
      }
    } catch (error) {
      console.error("Error scheduling interview:", error);
      toast.error(error.message || "Failed to schedule interview");
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
    setIsFeedbackLoading(true);
    setError(null);

    try {
      const updatedInterview = await updateClientInterview(
        interviewId,
        result,
        feedback,
        technicalScore,
        communicationScore,
        deployedStatus
      );

      setClientInterviews((prev) =>
        prev.map((interview) =>
          interview.id === interviewId ? updatedInterview : interview
        )
      );

      setShowFeedbackModal(false);
      setSelectedInterviewForFeedback(null);
      toast.success("Feedback updated successfully!");
      await fetchData();

      return updatedInterview;
    } catch (error) {
      console.error("Error updating feedback:", error);
      toast.error(error.message || "Failed to update feedback");
      throw error;
    } finally {
      setIsFeedbackLoading(false);
    }
  };

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
      toast.success("Job description downloaded successfully");
    } catch (error) {
      console.error("Error downloading job description:", error);
      toast.error(error.message || "Failed to download job description");
    }
  };

  const handleDeleteJD = async (jdId) => {
    try {
      await deleteJobDescription(jdId);
      setJobDescriptions((prev) => prev.filter((jd) => jd.id !== jdId));
      toast.success("Job description deleted successfully");
    } catch (error) {
      console.error("Error deleting job description:", error);
      toast.error(error.message || "Failed to delete job description");
    }
  };

  const handleClientModalSubmit = async (e) => {
    e.preventDefault();
    setClientModalError("");
    setClientModalSuccess("");

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
        setShowClientModal(false);
        setClientModalFields({
          name: "",
          contactEmail: "",
          activePositions: 0,
          technologies: [],
        });
      }, 1500);
    } catch (error) {
      console.error("Error adding client:", error);
      setClientModalError(error.message || "Failed to add client");
    } finally {
      setClientModalLoading(false);
    }
  };

  const handleJDModalSubmit = async (e) => {
    e.preventDefault();
    setJDModalError("");
    setJDModalSuccess("");

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

      setTimeout(() => {
        setSelectedJD(null);
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
      }, 1500);
    } catch (error) {
      console.error("Error uploading job description:", error);
      setJDModalError(error.message || "Failed to upload job description");
    } finally {
      setJDModalLoading(false);
    }
  };

  const handleDeploymentStatusChange = async (
    employeeId,
    readyForDeployment
  ) => {
    try {
      setIsDeploymentLoading(true);
      // In a real implementation, you would call an API to update the status
      // await updateReadyForDeployment(employeeId, readyForDeployment);
      toast.success(
        `Employee ${
          readyForDeployment ? "marked as" : "unmarked from"
        } ready for deployment`
      );
      await fetchData();
    } catch (error) {
      console.error("Error updating deployment status:", error);
      toast.error(error.message || "Failed to update deployment status");
    } finally {
      setIsDeploymentLoading(false);
    }
  };

  const handleFilterChange = (type, value) => {
    switch (type) {
      case "technology":
        setFilterTech(value);
        break;
      case "status":
        setFilterStatus(value);
        break;
      case "resourceType":
        setFilterResourceType(value);
        break;
      case "level":
        setFilterInterviewLevel(value);
        break;
      default:
        break;
    }
    fetchData();
  };

  const filterCandidates = (candidates) => {
    return candidates.filter((candidate) => {
      const matchesTech =
        filterTech === "all" || candidate.technology === filterTech;
      const matchesStatus =
        filterStatus === "all" || candidate.status === filterStatus;
      const matchesResourceType =
        filterResourceType === "all" ||
        candidate.resourceType === filterResourceType;
      return matchesTech && matchesStatus && matchesResourceType;
    });
  };

  const filterInterviews = (interviews) => {
    return interviews.filter((interview) => {
      const matchesLevel =
        filterInterviewLevel === "all" ||
        interview.level === filterInterviewLevel;
      return matchesLevel;
    });
  };

  const ClientsTab = () => {
    const filteredClients = clients.filter(
      (client) =>
        client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.contactEmail?.toLowerCase().includes(searchTerm.toLowerCase())
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
            {filteredClients.map((client) => (
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
                  <span className={styles.clientEmail}>
                    {client.contactEmail}
                  </span>
                </div>

                <div className={styles.clientDetails}>
                  <p>
                    <strong>Active Positions:</strong> {client.activePositions}
                  </p>
                  <div className={styles.technologyTags}>
                    {client.technologies?.map((tech) => (
                      <span
                        key={tech}
                        className={`${styles.techBadge} ${
                          styles[tech.toLowerCase()]
                        }`}
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
                        styles[jd.technology?.toLowerCase()]
                      }`}
                    >
                      {jd.technology}
                    </span>
                    <span
                      className={`${styles.resourceBadge} ${
                        styles[jd.resourceType?.toLowerCase()]
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
                      handleDownloadJD(jd.id);
                    }}
                  >
                    <FiDownload /> Download
                  </button>
                  <button
                    className={`${styles.button} ${styles.danger}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (
                        window.confirm(
                          "Are you sure you want to delete this JD?"
                        )
                      ) {
                        handleDeleteJD(jd.id);
                      }
                    }}
                  >
                    <FiX /> Delete
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
    const filteredResumes = filterCandidates(candidates);

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
              onChange={(e) => handleFilterChange("technology", e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Technologies</option>
              {Array.from(new Set(candidates.map((c) => c.technology))).map(
                (tech) => (
                  <option key={tech} value={tech}>
                    {tech}
                  </option>
                )
              )}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>Resource Type</label>
            <select
              value={filterResourceType}
              onChange={(e) => handleFilterChange("resourceType", e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Types</option>
              {Array.from(new Set(candidates.map((c) => c.resourceType))).map(
                (type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                )
              )}
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
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResumes.map((candidate) => (
                  <tr key={candidate.id}>
                    <td>{candidate.user?.fullName || "N/A"}</td>
                    <td>
                      <span
                        className={`${styles.techBadge} ${
                          styles[candidate.technology?.toLowerCase()]
                        }`}
                      >
                        {candidate.technology}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`${styles.resourceBadge} ${
                          styles[candidate.resourceType?.toLowerCase()]
                        }`}
                      >
                        {candidate.resourceType}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${
                          styles[candidate.status?.toLowerCase()]
                        }`}
                      >
                        {candidate.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`${styles.button} ${styles.small}`}
                        onClick={() => {
                          // Handle view resume
                        }}
                      >
                        <FiDownload /> Resume
                      </button>
                      <button
                        className={`${styles.button} ${styles.small} ${styles.primary}`}
                        onClick={() => {
                          setSelectedForInterview([candidate.id]);
                          setShowInterviewScheduler(true);
                        }}
                      >
                        <FiCalendar /> Schedule
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
              <p>No candidates have been sent to sales team yet.</p>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const InterviewsTab = () => {
    const filteredInterviews = filterInterviews(clientInterviews);

    const handleMarkAsCompleted = async (interviewId) => {
      setIsLoading(true);
      setError(null);
      try {
        const interview = await getClientInterviewFeedback(interviewId);
        setSelectedInterviewForFeedback(interview);
        setShowFeedbackModal(true);
      } catch (error) {
        console.error("Error marking interview as completed:", error);
        toast.error(error.message || "Failed to mark interview as completed");
      } finally {
        setIsLoading(false);
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
              onChange={(e) => handleFilterChange("level", e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Levels</option>
              {Array.from(new Set(clientInterviews.map((i) => i.level))).map(
                (level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                )
              )}
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
                        onClick={() => handleMarkAsCompleted(interview.id)}
                      >
                        <FiMessageSquare /> Give Feedback
                      </button>
                    )}

                    {interview.overallStatus === "completed" && (
                      <button
                        className={`${styles.button} ${styles.secondary}`}
                        onClick={() => handleMarkAsCompleted(interview.id)}
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
                        <p>{interview.feedback}</p>
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
        </div>

        {filteredDeployedEmployees.length > 0 ? (
          <div className={styles.cardGrid}>
            {filteredDeployedEmployees.map((employee) => (
              <motion.div
                key={employee.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={styles.profileCard}
              >
                <div className={styles.profileHeader}>
                  <h3 className={styles.profileName}>
                    {employee.user?.fullName || "N/A"}
                  </h3>
                  <span
                    className={`${styles.statusBadge} ${
                      styles[employee.status?.toLowerCase()]
                    }`}
                  >
                    {employee.status || "N/A"}
                  </span>
                </div>

                <div className={styles.profileDetails}>
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

  const ProfileTab = () => (
    <div className={styles.sectionContainer}>
      <h3 className={styles.sectionTitle}>My Profile</h3>
      <div className={styles.profileSection}>
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.profilePictureContainer}>
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  className={styles.profilePicture}
                />
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
                style={{ display: "none" }}
              />
              <label
                htmlFor="profilePictureUpload"
                className={styles.profilePictureUpload}
              >
                <FiUpload size={18} /> Update Photo
              </label>
            </div>
            <div className={styles.profileInfo}>
              <h2>{salesUserData.fullName}</h2>
              <p className={styles.profileRole}>{salesUserData.role}</p>
              <p className={styles.profileEmail}>{salesUserData.email}</p>
              <p className={styles.profileId}>
                Employee ID: {salesUserData.empId || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    if (isLoading && isInitialLoading) {
      return <LoadingState />;
    }

    if (error) {
      return <ErrorState error={error} />;
    }

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
              totalItems={candidates.length}
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
              totalItems={deployedEmployees.length}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </>
        );
      case "profile":
        return <ProfileTab />;
      default:
        return null;
    }
  };

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
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{salesUserData.fullName}</span>
            <span className={styles.userRole}>
              Sales Team ({salesUserData.email})
            </span>
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
        <button
          className={`${styles.tabButton} ${
            activeTab === "profile" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("profile")}
        >
          <FiUser /> My Profile
        </button>
      </div>
      <div className={styles.contentContainer}>{renderTabContent()}</div>

      {/* Modals */}
      <ClientModal
        show={showClientModal}
        onClose={() => setShowClientModal(false)}
        onSubmit={handleClientModalSubmit}
        fields={clientModalFields}
        onFieldChange={(field, value) =>
          setClientModalFields((prev) => ({ ...prev, [field]: value }))
        }
        onTechChange={(tech) => {
          setClientModalFields((prev) => ({
            ...prev,
            technologies: prev.technologies.includes(tech)
              ? prev.technologies.filter((t) => t !== tech)
              : [...prev.technologies, tech],
          }));
        }}
        error={clientModalError}
        success={clientModalSuccess}
        loading={clientModalLoading}
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
                  onClick={() => setSelectedJD(null)}
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
                      setJDModalFields({
                        ...jdModalFields,
                        title: e.target.value,
                      })
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
                      setJDModalFields({
                        ...jdModalFields,
                        client: e.target.value,
                      })
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
                      setJDModalFields({
                        ...jdModalFields,
                        technology: e.target.value,
                      })
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
                      setJDModalFields({
                        ...jdModalFields,
                        resourceType: e.target.value,
                      })
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
                      setJDModalFields({
                        ...jdModalFields,
                        description: e.target.value,
                      })
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
                      setJDModalFields({
                        ...jdModalFields,
                        receivedDate: e.target.value,
                      })
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
                      setJDModalFields({
                        ...jdModalFields,
                        deadline: e.target.value,
                      })
                    }
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Upload JD File *</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setJDModalFile(e.target.files[0])}
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
                    onClick={() => setSelectedJD(null)}
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

      <ScheduleInterviewModal
        show={showInterviewScheduler}
        onClose={() => {
          setShowInterviewScheduler(false);
          setSelectedForInterview([]);
          setInterviewDetails({
            level: 1,
            date: "",
            time: "",
            client: "",
            jobDescriptionTitle: "",
            meetingLink: "",
            deployedStatus: false,
          });
        }}
        onSubmit={(empId, details) => handleScheduleInterview(empId, details)}
        selectedCandidates={candidates.filter((c) =>
          selectedForInterview.includes(c.id)
        )}
        interviewDetails={interviewDetails}
        setInterviewDetails={setInterviewDetails}
        clients={clients}
        jobDescriptions={jobDescriptions}
      />

      <AnimatePresence>
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

export default SalesTeamDashboard;