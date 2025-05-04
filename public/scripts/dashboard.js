// Dashboard related functions
const fetchUserBalance = async () => {
  try {
    const token = localStorage.getItem("token")
    const response = await fetch("/api/user/balance", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (response.ok) {
      return data.balance
    } else {
      console.error("Error fetching balance:", data.message)
      return 0
    }
  } catch (error) {
    console.error("Network error:", error)
    return 0
  }
}

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Mock functions (replace with actual implementations or imports)
const getCurrentUser = () => {
  // Replace with actual user retrieval logic (e.g., from localStorage)
  return JSON.parse(localStorage.getItem("user")) || null
}

const renderLoginForm = () => {
  // Replace with actual login form rendering logic
  console.warn("renderLoginForm is not implemented. Redirecting to login page.")
  window.location.href = "/login" // Or your login page URL
}

const renderTransferPage = () => {
  // Replace with actual transfer page rendering logic
  alert("Transfer functionality will be implemented later")
}

// Render dashboard
const renderDashboard = async () => {
  const user = getCurrentUser()
  if (!user) {
    renderLoginForm()
    return
  }

  const balance = await fetchUserBalance()

  const appDiv = document.getElementById("app")
  appDiv.innerHTML = `
    <div class="dashboard-container">
      <div class="status-bar">
        <div class="time">1:58 ★</div>
        <div class="status-icons">
          <span class="signal">●●●</span>
          <span class="wifi">●●●</span>
          <span class="battery">12%</span>
        </div>
      </div>
      
      <div class="header">
        <h1>Money</h1>
        <div class="profile-pic">
          <img src="/placeholder.svg?height=40&width=40" alt="Profile">
        </div>
      </div>
      
      <div class="container">
        <div class="card balance-card">
          <div class="balance-label">Cash balance</div>
          <div class="balance-amount">$${formatCurrency(balance)}</div>
          <div class="account-info">
            <span>Account•${user.accountNumber}</span>
            <span>Routing•${user.routingNumber}</span>
          </div>
          <div class="action-buttons">
            <button class="action-btn" id="add-money-btn">Add money</button>
            <button class="action-btn" id="withdraw-btn">Withdraw</button>
          </div>
        </div>
        
        <div class="card feature-card">
          <div class="feature-icon">
            <i class="fas fa-money-bill-transfer"></i>
          </div>
          <div class="feature-content">
            <div class="feature-title">Paychecks</div>
            <div class="feature-subtitle">Get benefits with direct deposit</div>
          </div>
          <i class="fas fa-chevron-right"></i>
        </div>
        
        <div class="section-title">Explore</div>
        
        <div class="feature-grid">
          <div class="grid-card">
            <div class="grid-icon savings-icon">
              <i class="fas fa-dollar-sign"></i>
            </div>
            <div class="grid-title">Savings</div>
            <div class="grid-subtitle">Up to 4% interest</div>
            <i class="fas fa-chevron-right"></i>
          </div>
          
          <div class="grid-card">
            <div class="grid-icon bitcoin-icon">
              <i class="fab fa-bitcoin"></i>
            </div>
            <div class="grid-title">Bitcoin</div>
            <div class="grid-subtitle">Learn and invest</div>
            <i class="fas fa-chevron-right"></i>
          </div>
          
          <div class="grid-card">
            <div class="grid-icon stocks-icon">
              <i class="fas fa-chart-line"></i>
            </div>
            <div class="grid-title">Stocks</div>
            <div class="grid-subtitle"></div>
            <i class="fas fa-chevron-right"></i>
          </div>
          
          <div class="grid-card">
            <div class="grid-icon taxes-icon">
              <i class="fas fa-landmark"></i>
            </div>
            <div class="grid-title">Taxes</div>
            <div class="grid-subtitle"></div>
            <i class="fas fa-chevron-right"></i>
          </div>
        </div>
      </div>
      
      <div class="nav-bar">
        <a href="#" class="nav-item">
          <span>$${formatCurrency(balance).split(".")[0]}K</span>
        </a>
        <a href="#" class="nav-item">
          <i class="far fa-credit-card"></i>
        </a>
        <a href="#" class="nav-item money-btn">
          <div class="money-circle">
            <i class="fas fa-dollar-sign"></i>
          </div>
        </a>
        <a href="#" class="nav-item">
          <i class="fas fa-search"></i>
        </a>
        <a href="#" class="nav-item">
          <i class="far fa-clock"></i>
          <span>30</span>
        </a>
      </div>
    </div>
  `

  // Add event listeners
  document.getElementById("add-money-btn").addEventListener("click", () => {
    renderAddMoneyPage()
  })

  document.getElementById("withdraw-btn").addEventListener("click", () => {
    // Will be implemented later
    alert("Withdraw functionality will be implemented later")
  })

  document.querySelector(".money-btn").addEventListener("click", () => {
    renderTransferPage()
  })
}

// Render 404 page for Add Money
const renderAddMoneyPage = () => {
  const appDiv = document.getElementById("app")
  appDiv.innerHTML = `
    <div class="not-found">
      <h1>404</h1>
      <p>Adding funds is carried out by admin only. Please contact admin for more information.</p>
      <button class="btn" id="back-to-dashboard">Back to Dashboard</button>
    </div>
  `

  document.getElementById("back-to-dashboard").addEventListener("click", () => {
    renderDashboard()
  })
}
