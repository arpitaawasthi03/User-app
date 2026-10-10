import { useEffect, useState } from "react";
import Icon from "../../components/Icon";
import Logo from "../../components/Logo";
import Button from "../../components/Button";
import { useNav } from "../../navigation/Navigation";
import { useApp } from "../../state/AppState";
import { prettyPhone } from "../../lib/format";

interface OtpVerifyProps {
  phone: string;
}

export default function OtpVerify({ phone }: OtpVerifyProps) {
  const { back, reset } = useNav();
  const { signIn, showToast } = useApp();
  const [otp, setOtp] = useState("482");
  const [cooldown, setCooldown] = useState(30);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const pressKey = (key: number | string) => {
    if (key === "⌫") {
      setOtp((v) => v.slice(0, -1));
    } else if (typeof key === "number" && otp.length < 6) {
      setOtp((v) => `${v}${key}`);
    }
  };

  const handleResend = () => {
    if (cooldown > 0) return;
    setCooldown(30);
    setOtp("");
    showToast("A new demo OTP has been generated (use any 6 digits).");
  };

  const handleVerify = () => {
    if (otp.length < 6) {
      showToast("Please enter all 6 digits of the OTP.");
      return;
    }
    signIn(phone);
    showToast("Signed in successfully!");
    reset([{ name: "home" }]);
  };

  const formattedPhone = phone ? `+91 ${prettyPhone(phone)}` : "+91 98765 43210";

  return (
    <main className="auth-page otp-page">
      <button className="auth-back" onClick={back} aria-label="Go back">
        <Icon name="back" />
      </button>

      <Logo />
      <p className="auth-tag">MOVE · EAT · SHOP · DELIVER</p>

      <section className="auth-copy">
        <p className="eyebrow">ONE LAST STEP</p>
        <h1>Verify your number</h1>
        <p>
          We've sent a 6-digit code to <strong>{formattedPhone}</strong>
        </p>
      </section>

      <div className="otp-inputs">
        {Array.from({ length: 6 }, (_, index) => (
          <span className={index === otp.length ? "focused" : ""} key={index}>
            {otp[index] || ""}
          </span>
        ))}
      </div>

      <button
        type="button"
        className="resend"
        onClick={handleResend}
        style={{ cursor: cooldown > 0 ? "default" : "pointer" }}
      >
        {cooldown > 0 ? `Resend code in ${cooldown}s` : <strong>Resend code</strong>}
      </button>

      <Button onClick={handleVerify}>
        Verify & continue <Icon name="arrow" size={19} />
      </Button>

      <div className="keypad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "⌫"].map((key, index) => (
          <button
            type="button"
            disabled={key === ""}
            onClick={() => pressKey(key)}
            key={index}
          >
            {key}
          </button>
        ))}
      </div>
    </main>
  );
}
