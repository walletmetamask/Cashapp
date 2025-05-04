// Check if user is logged in
function checkAuth() {
  const token = localStorage.getItem("token")
  if (!token) {
    window.location.href = "/index.html"
    return false
  }
  return true
}

// Login user
async function loginUser(email, password) {
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
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      return { success: true }
    } else {
      return { success: false, message: data.message }
    }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, message: "Network error. Please try again." }
  }
}

// Register user
async function registerUser(name, email, password) {
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
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      return { success: true, accountNumber: data.user.accountNumber }
    } else {
      return { success: false, message: data.message }
    }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, message: "Network error. Please try again." }
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Check if we're on the login page
  const loginForm = document.getElementById("login-form")
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      const email = document.getElementById("email").value
      const password = document.getElementById("password").value

      const result = await loginUser(email, password)

      if (result.success) {
        window.location.href = "/dashboard.html"
      } else {
        alert(result.message || "Login failed. Please try again.")
      }
    })
  }

  // Check if we're on the register page
  const registerForm = document.getElementById("register-form")
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
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
        // Show account created modal
        const accountCreated = document.getElementById("account-created")
        const accountNumber = document.getElementById("account-number")
        const countdown = document.getElementById("countdown")

        accountNumber.textContent = result.accountNumber
        accountCreated.style.display = "flex"

        // Countdown and redirect
        let seconds = 5
        const timer = setInterval(() => {
          seconds--
          countdown.textContent = seconds

          if (seconds <= 0) {
            clearInterval(timer)
            window.location.href = "/dashboard.html"
          }
        }, 1000)
      } else {
        alert(result.message || "Registration failed. Please try again.")
      }
    })
  }

  // Check if we need to redirect to login
  if (window.location.pathname !== "/index.html" && window.location.pathname !== "/register.html" && !checkAuth()) {
    window.location.href = "/index.html"
  }
})
