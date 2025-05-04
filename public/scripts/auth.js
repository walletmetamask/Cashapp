// Authentication related functions
const generateAccountNumber = () => {
  return Math.floor(1000 + Math.random() * 9000) // 4-digit account number
}

const generateRoutingNumber = () => {
  return Math.floor(100 + Math.random() * 900) // 3-digit routing number
}

// Register a new user
const registerUser = async (name, email, password) => {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await response.json()

    if (response.ok) {
      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(data.user))
      localStorage.setItem("token", data.token)
      return { success: true, user: data.user }
    } else {
      return { success: false, message: data.message }
    }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, message: "Network error. Please try again." }
  }
}

// Login user
const loginUser = async (email, password) => {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (response.ok) {
      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(data.user))
      localStorage.setItem("token", data.token)
      return { success: true, user: data.user }
    } else {
      return { success: false, message: data.message }
    }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, message: "Network error. Please try again." }
  }
}

// Logout user
const logoutUser = () => {
  localStorage.removeItem("user")
  localStorage.removeItem("token")
  window.location.href = "/"
}

// Check if user is logged in
const isLoggedIn = () => {
  return localStorage.getItem("token") !== null
}

// Get current user
const getCurrentUser = () => {
  const user = localStorage.getItem("user")
  return user ? JSON.parse(user) : null
}

// Mock renderDashboard function for demonstration.  Replace with actual implementation.
const renderDashboard = () => {
  const appDiv = document.getElementById("app")
  appDiv.innerHTML = `<h1>Welcome to the Dashboard!</h1><button id="logout-button">Logout</button>`

  document.getElementById("logout-button").addEventListener("click", () => {
    logoutUser()
  })
}

// Render login form
const renderLoginForm = () => {
  const appDiv = document.getElementById("app")
  appDiv.innerHTML = `
    <div class="auth-container">
      <div class="auth-form">
        <h2>Login to Your Account</h2>
        <form id="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" required>
          </div>
          <button type="submit" class="btn">Login</button>
        </form>
        <div class="auth-switch">
          <p>Don't have an account? <a href="#" id="switch-to-register">Register</a></p>
        </div>
      </div>
    </div>
  `

  // Add event listeners
  document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault()
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    const result = await loginUser(email, password)

    if (result.success) {
      renderDashboard()
    } else {
      alert(result.message)
    }
  })

  document.getElementById("switch-to-register").addEventListener("click", (e) => {
    e.preventDefault()
    renderRegisterForm()
  })
}

// Render register form
const renderRegisterForm = () => {
  const appDiv = document.getElementById("app")
  appDiv.innerHTML = `
    <div class="auth-container">
      <div class="auth-form">
        <h2>Create an Account</h2>
        <form id="register-form">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input type="text" id="name" required>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" required>
          </div>
          <div class="form-group">
            <label for="confirm-password">Confirm Password</label>
            <input type="password" id="confirm-password" required>
          </div>
          <button type="submit" class="btn">Register</button>
        </form>
        <div class="auth-switch">
          <p>Already have an account? <a href="#" id="switch-to-login">Login</a></p>
        </div>
      </div>
    </div>
  `

  // Add event listeners
  document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault()
    const name = document.getElementById("name").value
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const confirmPassword = document.getElementById("confirm-password").value

    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    const result = await registerUser(name, email, password)

    if (result.success) {
      renderDashboard()
    } else {
      alert(result.message)
    }
  })

  document.getElementById("switch-to-login").addEventListener("click", (e) => {
    e.preventDefault()
    renderLoginForm()
  })
}
