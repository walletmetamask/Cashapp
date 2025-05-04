let transferAmount = 0

// Update amount display
function updateAmountDisplay() {
  const amountDisplay = document.getElementById("amount-display")
  amountDisplay.textContent = transferAmount.toString()
}

// Handle numpad button click
function handleNumpadClick(value) {
  if (value === "backspace") {
    // Remove last digit
    transferAmount = Math.floor(transferAmount * 10) / 100
  } else if (value === ".") {
    // Add decimal point if not already present
    if (!transferAmount.toString().includes(".")) {
      transferAmount = Number.parseFloat(transferAmount.toString() + ".")
    }
  } else {
    // Add digit
    if (transferAmount.toString().includes(".")) {
      const parts = transferAmount.toString().split(".")
      if (parts[1].length < 2) {
        transferAmount = Number.parseFloat(transferAmount.toString() + value)
      }
    } else {
      transferAmount = Number.parseFloat(transferAmount.toString() + value)
    }
  }

  updateAmountDisplay()
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Back button
  const backBtn = document.getElementById("back-btn")
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "/dashboard.html"
    })
  }

  // Numpad buttons
  const numpadBtns = document.querySelectorAll(".numpad-btn")
  numpadBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.getAttribute("data-value")
      handleNumpadClick(value)
    })
  })

  // Next button
  const nextBtn = document.getElementById("next-btn")
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (transferAmount > 0) {
        // Store amount in session storage
        sessionStorage.setItem("transferAmount", transferAmount)
        window.location.href = "/recipient.html"
      } else {
        alert("Please enter an amount greater than 0")
      }
    })
  }
})
