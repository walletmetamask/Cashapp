// Format date
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Load transactions
async function loadTransactions() {
  // Check if user is logged in
  const userJson = localStorage.getItem("user")
  if (!userJson) {
    window.location.href = "/index.html"
    return
  }

  const user = JSON.parse(userJson)
  const token = localStorage.getItem("token")

  try {
    const response = await fetch(`/api/transactions?email=${encodeURIComponent(user.email)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      const data = await response.json()
      displayTransactions(data.transactions, user.email)
    } else {
      throw new Error("Failed to load transactions")
    }
  } catch (error) {
    console.error("Error loading transactions:", error)
    document.getElementById("transactions").innerHTML = `
      <div class="no-transactions">
        <p>Failed to load transactions. Please try again.</p>
      </div>
    `
  }
}

// Display transactions
function displayTransactions(transactions, userEmail) {
  const transactionsContainer = document.getElementById("transactions")

  if (!transactions || transactions.length === 0) {
    transactionsContainer.innerHTML = `
      <div class="no-transactions">
        <p>No transactions yet</p>
      </div>
    `
    return
  }

  // Sort transactions by date (newest first)
  transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

  let html = ""

  transactions.forEach((transaction) => {
    const isCredit = transaction.recipientEmail === userEmail
    const transactionType = isCredit ? "credit" : "debit"
    const icon = isCredit ? "arrow-down" : "arrow-up"
    const title = isCredit ? `Received from ${transaction.senderName}` : `Sent to ${transaction.recipientName}`

    html += `
      <div class="transaction">
        <div class="transaction-icon ${transactionType}">
          <i class="fas fa-${icon}"></i>
        </div>
        <div class="transaction-details">
          <div class="transaction-title">${title}</div>
          <div class="transaction-date">${formatDate(transaction.timestamp)}</div>
        </div>
        <div class="transaction-amount ${transactionType}">
          ${isCredit ? "+" : "-"}$${formatCurrency(transaction.amount)}
        </div>
      </div>
    `
  })

  transactionsContainer.innerHTML = html
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Load transactions
  loadTransactions()

  // Back button
  const backBtn = document.getElementById("back-btn")
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "/dashboard.html"
    })
  }
})
