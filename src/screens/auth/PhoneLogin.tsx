import { useState } from "react";
import Icon from "../../components/Icon";
import Logo from "../../components/Logo";
import Button from "../../components/Button";
import { useNav } from "../../navigation/Navigation";
import { useApp } from "../../state/AppState";
import { isValidIndianMobile, normalisePhone, prettyPhone } from "../../lib/format";

export default function PhoneLogin() {
  const { push, back } = useNav();
  const { showToast } = useApp();
  const [phone, setPhone] = useState("98765 43210");
  const [error, setError] = useState("");

  const handlePhoneChange = (val: string) => {
    const raw = normalisePhone(val);
    setPhone(prettyPhone(raw));
    if (error) setError("");
  };

  const handleSendOtp = () => {
    const raw = normalisePhone(phone);
    if (!raw) {
      setError("Please enter your mobile number.");
      return;
    }
    if (!isValidIndianMobile(raw)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    push({ name: "otp", phone: raw });
  };

  const handleSocial = (provider: string) => {
    showToast(`${provider} login is not configured in this demo build. Please use mobile number.`);
  };

  return (
    <main className="auth-page">
      <button className="auth-back" onClick={back} aria-label="Go back">
        <Icon name="back" />
      </button>
      <Logo />
      <p className="auth-tag">MOVE · EAT · SHOP · DELIVER</p>

      <div className="auth-illustration">
        <div className="illustration-phone">
          <Icon name="pin" size={30} />
          <i />
          <i />
        </div>
        <span className="illustration-road" />
        <span className="illustration-rider">
          <Icon name="box" size={24} />
        </span>
      </div>

      <section className="auth-copy">
        <p className="eyebrow">WELCOME TO ROADRIDER</p>
        <h1>Let's get started</h1>
        <p>Enter your mobile number to continue</p>
      </section>

      <label className="phone-input" style={error ? { borderColor: "#c84b31" } : undefined}>
        <span>+91</span>
        <input
          value={phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          inputMode="tel"
          aria-label="Mobile number"
          placeholder="98765 43210"
        />
      </label>
      {error && (
        <p style={{ color: "#c84b31", fontSize: 11, margin: "-6px 0 10px 4px", fontWeight: 600 }}>
          {error}
        </p>
      )}

      <Button onClick={handleSendOtp}>
        Send OTP <Icon name="arrow" size={19} />
      </Button>

      <div className="auth-divider">
        <span />
        or continue with
        <span />
      </div>

      <div className="social-row">
        <button type="button" onClick={() => handleSocial("Google")}>
          G
        </button>
        <button type="button" onClick={() => handleSocial("Apple")}>
          Apple
        </button>
        <button type="button" onClick={() => handleSocial("Email")}>
          <span>@</span> Email
        </button>
      </div>

      <p className="legal">
        By continuing, you agree to our <b>Terms of Service</b>
        <br />
        and <b>Privacy Policy</b>.
      </p>
    </main>
  );
}
