// Get transfer amount from session storage
const transferAmount = sessionStorage.getItem("transferAmount") || 0

// Find user by account number
async function findUserByAccountNumber(accountNumber) {
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
    console.error("Error finding user:", error)
    return { success: false, message: "Network error. Please try again." }
  }
}

// Transfer funds
async function transferFunds(amount, recipientAccountNumber, note) {
  try {
    const token = localStorage.getItem("token")
    const user = JSON.parse(localStorage.getItem("user"))

    const response = await fetch("/api/transfer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount,
        recipientAccountNumber,
        senderEmail: user.email,
        note: note || "Transfer",
      }),
    })

    const data = await response.json()

    if (response.ok) {
      // Update user balance in localStorage
      user.balance = data.senderBalance
      localStorage.setItem("user", JSON.stringify(user))

      return { success: true, transaction: data.transaction }
    } else {
      return { success: false, message: data.message }
    }
  } catch (error) {
    console.error("Transfer error:", error)
    return { success: false, message: "Network error. Please try again." }
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Update transfer title with amount
  const transferTitle = document.getElementById("transfer-title")
  if (transferTitle) {
    transferTitle.textContent = `Send $${transferAmount}`
  }

  // Back button
  const backBtn = document.getElementById("back-btn")
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "/send.html"
    })
  }

  // Account number input
  const accountInput = document.getElementById("account-number")
  const accountName = document.getElementById("account-name")
  const sendBtn = document.getElementById("send-btn")
  let selectedAccountNumber = ""

  if (accountInput) {
    accountInput.addEventListener("input", async () => {
      const accountNumber = accountInput.value.trim()

      if (accountNumber.length === 10) {
        const result = await findUserByAccountNumber(accountNumber)

        if (result.success) {
          // Store recipient info in session storage
          selectedAccountNumber = accountNumber
          sessionStorage.setItem("recipientAccountNumber", accountNumber)
          sessionStorage.setItem("recipientName", result.user.name)

          // Update UI
          accountName.textContent = result.user.name
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
  }

  // Contact items
  const contactItems = document.querySelectorAll(".contact-item")
  contactItems.forEach((item) => {
    item.addEventListener("click", async () => {
      const accountNumber = item.getAttribute("data-account")
      const name = item.querySelector(".contact-name").textContent

      // Update input field
      accountInput.value = accountNumber

      // Update account name
      accountName.textContent = name

      // Store recipient info
      selectedAccountNumber = accountNumber
      sessionStorage.setItem("recipientAccountNumber", accountNumber)
      sessionStorage.setItem("recipientName", name)

      // Enable send button
      sendBtn.disabled = false
    })
  })

  // Send button
  if (sendBtn) {
    sendBtn.addEventListener("click", async () => {
      const recipientAccountNumber = sessionStorage.getItem("recipientAccountNumber") || selectedAccountNumber
      const note = document.getElementById("note").value.trim()

      if (recipientAccountNumber && transferAmount > 0) {
        const result = await transferFunds(transferAmount, recipientAccountNumber, note)

        if (result.success) {
          // Store note for success page
          if (note) {
            sessionStorage.setItem("transferNote", note)
          }

          window.location.href = "/success.html"
        } else {
          alert(result.message || "Transfer failed. Please try again.")
        }
      }
    })
  }

  // Send type buttons
  const sendTypeBtns = document.querySelectorAll(".send-type-btn")
  sendTypeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active class from all buttons
      sendTypeBtns.forEach((b) => b.classList.remove("active"))
      // Add active class to clicked button
      btn.classList.add("active")
    })
  })
})
