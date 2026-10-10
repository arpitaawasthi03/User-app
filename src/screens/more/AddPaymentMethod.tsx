import { useState } from "react"
import FlowHeader from "../../components/FlowHeader"
import Button from "../../components/Button"
import Icon from "../../components/Icon"
import { useNav } from "../../navigation/Navigation"
import { useApp } from "../../state/AppState"

export default function AddPaymentMethod() {
  const { back } = useNav()
  const { showToast } = useApp()

  const [methodType, setMethodType] = useState<"upi" | "card">("upi")

  // UPI fields
  const [upiId, setUpiId] = useState("")
  const [upiError, setUpiError] = useState("")

  // Card fields
  const [cardNumber, setCardNumber] = useState("")
  const [cardHolder, setCardHolder] = useState("Arjun Khanna")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardError, setCardError] = useState("")

  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, "").slice(0, 16)
    const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ")
    setCardNumber(formatted)
    if (cardError) setCardError("")
  }

  const handleExpiryChange = (val: string) => {
    const raw = val.replace(/\D/g, "").slice(0, 4)
    if (raw.length >= 3) {
      setExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`)
    } else {
      setExpiry(raw)
    }
    if (cardError) setCardError("")
  }

  const handleSaveUpi = () => {
    if (!upiId.trim() || !upiId.includes("@")) {
      setUpiError(
        "Please enter a valid UPI ID (e.g. mobile@upi or username@okhdfcbank)",
      )
      return
    }
    showToast(`UPI ID ${upiId.trim()} added successfully!`)
    back()
  }

  const handleSaveCard = () => {
    const rawCard = cardNumber.replace(/\s/g, "")
    if (rawCard.length < 15) {
      setCardError("Please enter a valid 16-digit card number.")
      return
    }
    if (!expiry || expiry.length < 5) {
      setCardError("Please enter valid card expiry (MM/YY).")
      return
    }
    if (!cvv || cvv.length < 3) {
      setCardError("Please enter a valid 3-digit CVV.")
      return
    }
    const last4 = rawCard.slice(-4)
    showToast(`Card ending in ${last4} added successfully!`)
    back()
  }

  const popularUpiHandles = ["@okhdfcbank", "@okaxis", "@paytm", "@ybl"]

  return (
    <div className="more-page">
      <FlowHeader title="" onBack={back} showHelp={false} />

      <div className="more-hero">
        <span>
          <Icon name="card" size={28} />
        </span>
        <p>SECURE PAYMENTS</p>
        <h1>Add payment method</h1>
        <p>
          Save UPI ID or debit/credit card for instant 1-tap checkout across
          RoadRider.
        </p>
      </div>

      <div className="segment" style={{ marginBottom: 16 }}>
        <button
          type="button"
          className={methodType === "upi" ? "selected" : ""}
          onClick={() => setMethodType("upi")}
        >
          UPI ID
        </button>
        <button
          type="button"
          className={methodType === "card" ? "selected" : ""}
          onClick={() => setMethodType("card")}
        >
          Credit / Debit Card
        </button>
      </div>

      {methodType === "upi" ? (
        <div
          style={{
            background: "#fff",
            border: "1px solid var(--line)",
            borderRadius: 17,
            padding: 18,
          }}
        >
          <label style={{ display: "block", marginBottom: 12 }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "var(--muted)",
                textTransform: "uppercase",
              }}
            >
              Virtual Payment Address (UPI ID)
            </span>
            <input
              type="text"
              placeholder="e.g. 9876543210@paytm"
              value={upiId}
              onChange={(e) => {
                setUpiId(e.target.value)
                if (upiError) setUpiError("")
              }}
              style={{
                width: "100%",
                height: 46,
                marginTop: 6,
                padding: "0 12px",
                border: "1px solid var(--line)",
                borderRadius: 10,
                fontSize: 13,
                outline: "none",
              }}
            />
          </label>

          {upiError && (
            <p
              style={{
                color: "#c84b31",
                fontSize: 10,
                margin: "-4px 0 10px",
                fontWeight: 600,
              }}
            >
              {upiError}
            </p>
          )}

          <div style={{ marginTop: 12 }}>
            <small
              style={{
                fontSize: 9,
                color: "var(--muted)",
                display: "block",
                marginBottom: 6,
              }}
            >
              Quick handles:
            </small>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {popularUpiHandles.map((handle) => (
                <button
                  key={handle}
                  type="button"
                  onClick={() => {
                    const prefix = upiId.split("@")[0] || "9876543210"
                    setUpiId(`${prefix}${handle}`)
                  }}
                  style={{
                    padding: "4px 8px",
                    background: "var(--accent-soft)",
                    color: "var(--accent)",
                    borderRadius: 8,
                    fontSize: 9,
                    fontWeight: 700,
                  }}
                >
                  {handle}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              marginTop: 20,
              color: "var(--muted)",
              fontSize: 10,
            }}
          >
            <Icon name="shield" size={16} />
            <span>Secured via NPCI UPI autopay standards</span>
          </div>

          <div style={{ marginTop: 24 }}>
            <Button onClick={handleSaveUpi}>Save & Link UPI</Button>
          </div>
        </div>
      ) : (
        <div
          style={{
            background: "#fff",
            border: "1px solid var(--line)",
            borderRadius: 17,
            padding: 18,
          }}
        >
          <label style={{ display: "block", marginBottom: 12 }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "var(--muted)",
                textTransform: "uppercase",
              }}
            >
              Card Number
            </span>
            <input
              type="text"
              placeholder="4532 8921 7712 3456"
              value={cardNumber}
              onChange={(e) => handleCardNumberChange(e.target.value)}
              inputMode="numeric"
              style={{
                width: "100%",
                height: 46,
                marginTop: 6,
                padding: "0 12px",
                border: "1px solid var(--line)",
                borderRadius: 10,
                fontSize: 13,
                outline: "none",
                fontFamily: "monospace",
              }}
            />
          </label>

          <label style={{ display: "block", marginBottom: 12 }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "var(--muted)",
                textTransform: "uppercase",
              }}
            >
              Name on Card
            </span>
            <input
              type="text"
              placeholder="Arjun Khanna"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              style={{
                width: "100%",
                height: 46,
                marginTop: 6,
                padding: "0 12px",
                border: "1px solid var(--line)",
                borderRadius: 10,
                fontSize: 13,
                outline: "none",
              }}
            />
          </label>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginBottom: 12,
            }}
          >
            <label>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--muted)",
                  textTransform: "uppercase",
                }}
              >
                Expiry (MM/YY)
              </span>
              <input
                type="text"
                placeholder="08/29"
                value={expiry}
                onChange={(e) => handleExpiryChange(e.target.value)}
                style={{
                  width: "100%",
                  height: 46,
                  marginTop: 6,
                  padding: "0 12px",
                  border: "1px solid var(--line)",
                  borderRadius: 10,
                  fontSize: 13,
                  outline: "none",
                }}
              />
            </label>

            <label>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--muted)",
                  textTransform: "uppercase",
                }}
              >
                CVV
              </span>
              <input
                type="password"
                maxLength={4}
                placeholder="•••"
                value={cvv}
                onChange={(e) => {
                  setCvv(e.target.value.replace(/\D/g, ""))
                  if (cardError) setCardError("")
                }}
                inputMode="numeric"
                style={{
                  width: "100%",
                  height: 46,
                  marginTop: 6,
                  padding: "0 12px",
                  border: "1px solid var(--line)",
                  borderRadius: 10,
                  fontSize: 13,
                  outline: "none",
                }}
              />
            </label>
          </div>

          {cardError && (
            <p
              style={{
                color: "#c84b31",
                fontSize: 10,
                margin: "-4px 0 10px",
                fontWeight: 600,
              }}
            >
              {cardError}
            </p>
          )}

          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              marginTop: 14,
              color: "var(--muted)",
              fontSize: 10,
            }}
          >
            <Icon name="shield" size={16} />
            <span>Card information is tokenised per RBI guidelines</span>
          </div>

          <div style={{ marginTop: 20 }}>
            <Button onClick={handleSaveCard}>Save & Add Card</Button>
          </div>
        </div>
      )}
    </div>
  )
}
