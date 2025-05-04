document.addEventListener("DOMContentLoaded", () => {
  // Get transfer details from session storage
  const transferAmount = sessionStorage.getItem("transferAmount") || 0
  const recipientName = sessionStorage.getItem("recipientName") || "recipient"
  const transferNote = sessionStorage.getItem("transferNote") || ""

  // Update success message
  const successMessage = document.getElementById("success-message")
  if (successMessage) {
    successMessage.textContent = `$${transferAmount} to ${recipientName}`
  }

  // Add note if available
  if (transferNote && document.getElementById("success-note")) {
    document.getElementById("success-note").textContent = `For: ${transferNote}`
    document.getElementById("success-note").style.display = "block"
  }

  // Done button
  const doneBtn = document.getElementById("done-btn")
  if (doneBtn) {
    doneBtn.addEventListener("click", () => {
      // Clear session storage
      sessionStorage.removeItem("transferAmount")
      sessionStorage.removeItem("recipientAccountNumber")
      sessionStorage.removeItem("recipientName")
      sessionStorage.removeItem("transferNote")

      // Redirect to dashboard
      window.location.href = "/dashboard.html"
    })
  }
})
