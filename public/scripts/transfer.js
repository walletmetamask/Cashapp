// Transfer related functions
let transferAmount = 0
let recipientAccountNumber = ""
let recipientName = ""

// Fetch user by account number
const fetchUserByAccountNumber = async (accountNumber) => {
  try {
    const token = localStorage.getItem("token")
    const response = await fetch(`/api/user/account/${accountNumber}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (response.ok) {
      return { success: true, user: data.user }
    } else {
      return { success: false, message: data.message }
    }
  } catch (error) {
    console.error("Network error:", error)
    return { success: false, message: "Network error. Please try again." }
  }
}

// Transfer funds
const transferFunds = async (amount, recipientAccountNumber) => {
  try {
    const token = localStorage.getItem("token")
    const response = await fetch("/api/transfer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount, recipientAccountNumber }),
    })

    const data = await response.json()

    if (response.ok) {
      return { success: true, transaction: data.transaction }
    } else {
      return { success: false, message: data.message }
    }
  } catch (error) {
    console.error("Transfer error:", error)
    return { success: false, message: "Network error. Please try again." }
  }
}

// Render transfer amount page
const renderTransferPage = () => {
  transferAmount = 0

  const appDiv = document.getElementById("app")
  appDiv.innerHTML = `
    <div class="transfer-container">
      <div class="transfer-header">
        <button class="back-btn" id="back-btn">
          <i class="fas fa-times"></i>
        </button>
        <h2 class="transfer-title">Add Cash</h2>
      </div>
      
      <div class="amount-display">0</div>
      
      <div class="numpad">
        <button class="numpad-btn" data-value="1">1</button>
        <button class="numpad-btn" data-value="2">2</button>
        <button class="numpad-btn" data-value="3">3</button>
        <button class="numpad-btn" data-value="4">4</button>
        <button class="numpad-btn" data-value="5">5</button>
        <button class="numpad-btn" data-value="6">6</button>
        <button class="numpad-btn" data-value="7">7</button>
        <button class="numpad-btn" data-value="8">8</button>
        <button class="numpad-btn" data-value="9">9</button>
        <button class="numpad-btn" data-value=".">.</button>
        <button class="numpad-btn" data-value="0">0</button>
        <button class="numpad-btn" data-value="backspace">
          <i class="fas fa-backspace"></i>
        </button>
      </div>
      
      <button class="transfer-action" id="next-btn">Add</button>
      
      <div class="transfer-progress">
        <span>0:12</span>
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
        <span>0:33</span>
        <i class="fas fa-volume-up"></i>
        <i class="fas fa-arrow-down"></i>
      </div>
    </div>
  `

  // Add event listeners
  document.getElementById("back-btn").addEventListener("click", () => {
    renderDashboard()
  })

  document.querySelectorAll(".numpad-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.getAttribute("data-value")
      const amountDisplay = document.querySelector(".amount-display")

      if (value === "backspace") {
        transferAmount = Math.floor(transferAmount / 10)
      } else if (value === ".") {
        if (!transferAmount.toString().includes(".")) {
          transferAmount = Number.parseFloat(transferAmount.toString() + ".")
        }
      } else {
        if (transferAmount.toString().includes(".")) {
          const parts = transferAmount.toString().split(".")
          if (parts[1].length < 2) {
            transferAmount = Number.parseFloat(transferAmount.toString() + value)
          }
        } else {
          transferAmount = Number.parseFloat(transferAmount.toString() + value)
        }
      }

      amountDisplay.textContent = transferAmount.toString()
    })
  })

  document.getElementById("next-btn").addEventListener("click", () => {
    if (transferAmount > 0) {
      renderRecipientPage()
    } else {
      alert("Please enter an amount greater than 0")
    }
  })
}

// Render recipient account number input page
const renderRecipientPage = () => {
  const appDiv = document.getElementById("app")
  appDiv.innerHTML = `
    <div class="transfer-container">
      <div class="transfer-header">
        <button class="back-btn" id="back-btn">
          <i class="fas fa-arrow-left"></i>
        </button>
        <h2 class="transfer-title">Send $${transferAmount}</h2>
      </div>
      
      <div class="account-input">
        <label for="account-number">Recipient Account Number</label>
        <input type="text" id="account-number" placeholder="Enter account number">
        <div class="account-name" id="account-name"></div>
      </div>
      
      <button class="transfer-action" id="send-btn" disabled>Send</button>
    </div>
  `

  // Add event listeners
  document.getElementById("back-btn").addEventListener("click", () => {
    renderTransferPage()
  })

  const accountInput = document.getElementById("account-number")
  const accountName = document.getElementById("account-name")
  const sendBtn = document.getElementById("send-btn")

  accountInput.addEventListener("input", async () => {
    const accountNumber = accountInput.value.trim()

    if (accountNumber.length === 4) {
      const result = await fetchUserByAccountNumber(accountNumber)

      if (result.success) {
        recipientAccountNumber = accountNumber
        recipientName = result.user.name
        accountName.textContent = recipientName
        sendBtn.disabled = false
      } else {
        accountName.textContent = "Account not found"
        sendBtn.disabled = true
      }
    } else {
      accountName.textContent = ""
      sendBtn.disabled = true
    }
  })

  document.getElementById("send-btn").addEventListener("click", async () => {
    if (recipientAccountNumber && transferAmount > 0) {
      const result = await transferFunds(transferAmount, recipientAccountNumber)

      if (result.success) {
        renderSuccessPage()
      } else {
        alert(result.message)
      }
    }
  })
}

// Render success page
const renderSuccessPage = () => {
  const appDiv = document.getElementById("app")
  appDiv.innerHTML = `
    <div class="success-container">
      <div class="success-icon">
        <i class="fas fa-check"></i>
      </div>
      <div class="success-title">You sent</div>
      <div class="success-message">$${transferAmount} to ${recipientName}</div>
      
      <button class="btn success-btn" id="done-btn">Done</button>
    </div>
  `

  document.getElementById("done-btn").addEventListener("click", () => {
    renderDashboard()
  })
}
