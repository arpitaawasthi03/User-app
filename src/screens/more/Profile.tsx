import { useState } from "react";
import FlowHeader from "../../components/FlowHeader";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import { prettyPhone } from "../../lib/format";
import { useNav } from "../../navigation/Navigation";
import { useApp } from "../../state/AppState";

export default function Profile() {
  const { back, reset } = useNav();
  const { state, updateProfile, signOut, showToast } = useApp();

  const [name, setName] = useState(state.profile.name || "Arjun Khanna");
  const [language, setLanguage] = useState(state.profile.language || "English");

  const handleSave = () => {
    if (!name.trim()) {
      showToast("Please enter your name");
      return;
    }
    updateProfile({ name: name.trim(), language });
    showToast("Profile updated successfully!");
    back();
  };

  const handleSignOut = () => {
    signOut();
    showToast("Signed out of RoadRider");
    reset([{ name: "splash" }]);
  };

  const displayPhone = state.profile.phone ? `+91 ${prettyPhone(state.profile.phone)}` : "+91 98765 43210";

  return (
    <div className="more-page">
      <FlowHeader title="" onBack={back} showHelp={false} />

      <div className="more-hero">
        <span>
          <Icon name="user" size={28} />
        </span>
        <p>PERSONAL DETAILS</p>
        <h1>Profile & settings</h1>
        <p>Keep your RoadRider account details and preferences up to date.</p>
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid var(--line)",
          borderRadius: 17,
          padding: 16,
          display: "grid",
          gap: 14,
        }}
      >
        <div>
          <label style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", display: "block", marginBottom: 6 }}>
            FULL NAME
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid var(--line)",
              fontSize: 12,
              outline: "none",
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", display: "block", marginBottom: 6 }}>
            VERIFIED MOBILE NUMBER
          </label>
          <input
            value={displayPhone}
            readOnly
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid var(--line)",
              background: "#fbf9f6",
              color: "var(--muted)",
              fontSize: 12,
              outline: "none",
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", display: "block", marginBottom: 6 }}>
            APP LANGUAGE
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            {["English", "हिन्दी (Hindi)"].map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  borderRadius: 10,
                  fontSize: 11,
                  fontWeight: 700,
                  border: language === lang ? "1px solid var(--accent)" : "1px solid var(--line)",
                  background: language === lang ? "var(--accent-soft)" : "#fff",
                  color: language === lang ? "var(--accent)" : "inherit",
                }}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSignOut}
        style={{
          width: "100%",
          marginTop: 14,
          padding: 14,
          background: "#fff",
          border: "1px solid #ffd0c7",
          borderRadius: 14,
          color: "#c84b31",
          fontWeight: 700,
          fontSize: 11,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        <Icon name="logout" size={16} /> Sign out
      </button>

      <div className="more-action">
        <Button onClick={handleSave}>Save changes</Button>
      </div>
    </div>
  );
}
