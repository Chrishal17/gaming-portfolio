// Initialize Firebase and handle all functionality
document.addEventListener("DOMContentLoaded", function () {
  // Firebase configuration
  const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  console.log("Firebase initialized");

  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const currentPage = window.location.pathname.split("/").pop();

  // Redirect based on login status
  if (isLoggedIn === "true" && currentPage === "index.html") {
    window.location.href = "admin.html";
  } else if (isLoggedIn !== "true" && currentPage === "admin.html") {
    window.location.href = "index.html";
  }

  // Login Page Functionality
  if (currentPage === "index.html" || currentPage === "") {
    initLoginPage();
  }

  // Admin Page Functionality
  if (currentPage === "admin.html") {
    initAdminPage();
  }
});

// Login Page Initialization
function initLoginPage() {
  console.log("Initializing login page");
  const loginForm = document.getElementById("loginForm");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const togglePassword = document.getElementById("togglePassword");
  const rememberMeCheckbox = document.getElementById("rememberMe");
  const loginStatus = document.getElementById("loginStatus");

  // Toggle password visibility
  if (togglePassword) {
    togglePassword.addEventListener("click", function () {
      const type =
        passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      this.classList.toggle("fa-eye");
      this.classList.toggle("fa-eye-slash");
    });
  }

  // Handle login form submission
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Reset previous errors
      resetFormErrors();

      // Get form values
      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();
      const rememberMe = rememberMeCheckbox.checked;

      // Validate form
      let isValid = true;

      if (!username) {
        showError(usernameInput, "usernameError", "Username is required");
        isValid = false;
      }

      if (!password) {
        showError(passwordInput, "passwordError", "Password is required");
        isValid = false;
      }

      if (isValid) {
        // Simulate login (in a real app, this would be an API call)
        if (username === "Chris Halden" && password === "Portfolio Admin") {
          // Login successful
          loginStatus.textContent = "Login successful! Redirecting...";
          loginStatus.className = "form-status success";

          // Store login state
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("username", username);

          if (rememberMe) {
            localStorage.setItem("rememberMe", "true");
          } else {
            localStorage.removeItem("rememberMe");
          }

          // Redirect to admin page after a short delay
          setTimeout(() => {
            window.location.href = "admin.html";
          }, 1500);
        } else {
          // Login failed
          loginStatus.textContent = "Invalid username or password";
          loginStatus.className = "form-status error";

          // Shake animation for the form
          loginForm.classList.add("shake");
          setTimeout(() => {
            loginForm.classList.remove("shake");
          }, 500);
        }
      }
    });
  }

  // Check if "Remember Me" was previously checked
  if (rememberMeCheckbox && localStorage.getItem("rememberMe") === "true") {
    rememberMeCheckbox.checked = true;
    if (usernameInput && localStorage.getItem("username")) {
      usernameInput.value = localStorage.getItem("username");
    }
  }
}

// Admin Page Initialization
function initAdminPage() {
  console.log("Initializing admin page");

  // Initialize Firebase data
  loadMessages();

  // Sidebar toggle
  const sidebarToggle = document.getElementById("sidebarToggle");
  const sidebar = document.querySelector(".sidebar");

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", function () {
      sidebar.classList.toggle("collapsed");

      // On mobile, toggle active class instead
      if (window.innerWidth < 992) {
        sidebar.classList.toggle("active");
      }
    });
  }

  // User dropdown
  const userDropdownBtn = document.querySelector(".user-dropdown-btn");
  const userDropdown = document.querySelector(".user-dropdown-content");

  if (userDropdownBtn && userDropdown) {
    userDropdownBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      userDropdown.classList.toggle("active");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function (e) {
      if (
        !userDropdownBtn.contains(e.target) &&
        !userDropdown.contains(e.target)
      ) {
        userDropdown.classList.remove("active");
      }
    });
  }

  // Sort dropdown
  const sortDropdownBtn = document.querySelector(".dropdown-btn");
  const sortDropdown = document.querySelector(".dropdown-content");

  if (sortDropdownBtn && sortDropdown) {
    sortDropdownBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      sortDropdown.classList.toggle("active");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function (e) {
      if (
        !sortDropdownBtn.contains(e.target) &&
        !sortDropdown.contains(e.target)
      ) {
        sortDropdown.classList.remove("active");
      }
    });
  }

  // Sort options
  const sortOptions = document.querySelectorAll(".dropdown-content a");
  const currentSortText = document.getElementById("currentSort");

  if (sortOptions.length > 0 && currentSortText) {
    sortOptions.forEach((option) => {
      option.addEventListener("click", function (e) {
        e.preventDefault();
        const sortBy = this.getAttribute("data-sort");
        currentSortText.textContent = sortBy === "newest" ? "Newest" : "Oldest";
        sortDropdown.classList.remove("active");

        // Re-sort messages
        sortMessages(sortBy);
      });
    });
  }

  // Refresh button
  const refreshBtn = document.getElementById("refreshBtn");

  if (refreshBtn) {
    refreshBtn.addEventListener("click", function () {
      this.classList.add("rotating");
      loadMessages();

      setTimeout(() => {
        this.classList.remove("rotating");
      }, 1000);
    });
  }

  // Search functionality
  const searchInput = document.getElementById("searchInput");

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase();
      filterMessages(searchTerm);
    });
  }

  // Logout functionality
  const logoutBtn = document.getElementById("logoutBtn");
  const dropdownLogout = document.getElementById("dropdownLogout");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }

  if (dropdownLogout) {
    dropdownLogout.addEventListener("click", handleLogout);
  }
}

// Load messages from Firebase
function loadMessages() {
  console.log("Loading messages from Firebase");
  const messagesTableBody = document.getElementById("messagesTableBody");
  const totalMessagesElement = document.getElementById("totalMessages");
  const messageBadge = document.getElementById("messageBadge");

  if (!messagesTableBody) {
    console.error("Messages table body element not found");
    return;
  }

  // Show loading state
  messagesTableBody.innerHTML = `
        <tr class="loading-row">
            <td colspan="5">
                <div class="loading-spinner"></div>
                <p>Loading messages...</p>
            </td>
        </tr>
    `;

  // Get messages from Firebase
  const database = firebase.database();
  const messagesRef = database.ref("messages");

  messagesRef
    .once("value")
    .then((snapshot) => {
      console.log("Firebase data received");
      const messages = [];

      snapshot.forEach((childSnapshot) => {
        const messageId = childSnapshot.key;
        const messageData = childSnapshot.val();

        // Ensure we have valid message data
        if (messageData && typeof messageData === "object") {
          // Convert Firebase timestamp to milliseconds if it's an object
          let timestamp = messageData.timestamp;
          if (
            timestamp &&
            typeof timestamp === "object" &&
            timestamp.hasOwnProperty("seconds")
          ) {
            timestamp = timestamp.seconds * 1000;
          } else if (typeof timestamp === "number") {
            // If it's already a number, assume it's milliseconds
            timestamp = timestamp;
          } else {
            // Fallback to current time if timestamp is invalid
            timestamp = Date.now();
          }

          messages.push({
            id: messageId,
            name: messageData.name || "Unknown",
            email: messageData.email || "No email",
            subject: messageData.subject || "No subject",
            message: messageData.message || "No message",
            timestamp: timestamp,
          });
        }
      });

      console.log(`Processed ${messages.length} messages`);

      if (messages.length === 0) {
        renderMessages(messages);
        return;
      }

      // Sort messages by timestamp (newest first)
      messages.sort((a, b) => b.timestamp - a.timestamp);

      // Store messages in a global variable for filtering/sorting
      window.allMessages = messages;

      // Update stats
      if (totalMessagesElement) {
        totalMessagesElement.textContent = messages.length;
      }

      if (messageBadge) {
        messageBadge.textContent = messages.length;
      }

      // Render messages
      renderMessages(messages);
    })
    .catch((error) => {
      console.error("Error loading messages:", error);
      messagesTableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 30px;">
                        <i class="fas fa-exclamation-circle" style="font-size: 2rem; color: var(--error-red); margin-bottom: 15px;"></i>
                        <p>Failed to load messages. Please try again later.</p>
                        <button class="btn-secondary" style="margin-top: 15px;" onclick="loadMessages()">
                            <i class="fas fa-sync-alt"></i> Retry
                        </button>
                    </td>
                </tr>
            `;
    });
}

// Render messages in the table
function renderMessages(messages) {
  console.log(`Rendering ${messages.length} messages`);
  const messagesTableBody = document.getElementById("messagesTableBody");

  if (!messagesTableBody) {
    console.error("Messages table body element not found");
    return;
  }

  if (messages.length === 0) {
    messagesTableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 30px;">
                    <i class="fas fa-inbox" style="font-size: 2rem; color: var(--lighter-gray); margin-bottom: 15px;"></i>
                    <p>No messages found.</p>
                </td>
            </tr>
        `;
    return;
  }

  let tableHTML = "";

  messages.forEach((message) => {
    const date = new Date(message.timestamp);
    const formattedDate =
      date.toLocaleDateString() + " " + date.toLocaleTimeString();

    tableHTML += `
            <tr data-id="${message.id}">
                <td>${message.name || "N/A"}</td>
                <td>${message.email || "N/A"}</td>
                <td class="subject-cell">${message.subject || "No Subject"}</td>
                <td class="message-cell">${message.message || "No Message"}</td>
                <td class="date-cell">${formattedDate}</td>
            </tr>
        `;
  });

  messagesTableBody.innerHTML = tableHTML;
}

// Filter messages based on search term
function filterMessages(searchTerm) {
  if (!window.allMessages) return;

  if (!searchTerm) {
    renderMessages(window.allMessages);
    return;
  }

  const filteredMessages = window.allMessages.filter((message) => {
    return (
      (message.name && message.name.toLowerCase().includes(searchTerm)) ||
      (message.email && message.email.toLowerCase().includes(searchTerm)) ||
      (message.subject && message.subject.toLowerCase().includes(searchTerm)) ||
      (message.message && message.message.toLowerCase().includes(searchTerm))
    );
  });

  renderMessages(filteredMessages);
}

// Sort messages
function sortMessages(sortBy) {
  if (!window.allMessages) return;

  const sortedMessages = [...window.allMessages];

  if (sortBy === "newest") {
    sortedMessages.sort((a, b) => b.timestamp - a.timestamp);
  } else {
    sortedMessages.sort((a, b) => a.timestamp - b.timestamp);
  }

  renderMessages(sortedMessages);
}

// Handle logout
function handleLogout(e) {
  e.preventDefault();

  // Clear login state
  localStorage.removeItem("isLoggedIn");

  // Redirect to login page
  window.location.href = "index.html";
}

// Show error message
function showError(inputElement, errorId, message) {
  inputElement.classList.add("error");
  const errorElement = document.getElementById(errorId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }
}

// Reset form errors
function resetFormErrors() {
  const errorMessages = document.querySelectorAll(".error-message");
  const formControls = document.querySelectorAll(".form-control");

  errorMessages.forEach((error) => {
    error.textContent = "";
    error.style.display = "none";
  });

  formControls.forEach((control) => {
    control.classList.remove("error");
  });
}
