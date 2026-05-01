import { useMemo, useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const fieldStyle = {
  width: "100%",
  border: "1px solid #e8e2e2",
  borderRadius: 8,
  padding: "10px 12px",
  fontSize: 13,
  fontFamily: "inherit",
  background: "#fff",
  color: "#1c1212",
  outline: "none",
};

export default function CreateUserPage({ onCancel, onCreated }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [createdUserData, setCreatedUserData] = useState(null);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    contactNo: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    password: "",
    confirmPassword: "",
  });

  const isValid = useMemo(() => {
    return (
      formData.fullName.trim() &&
      formData.username.trim() &&
      formData.email.trim() &&
      formData.contactNo.trim() &&
      formData.addressLine1.trim() &&
      formData.city.trim() &&
      formData.country.trim() &&
      formData.password &&
      formData.confirmPassword
    );
  }, [formData]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          username: formData.username.trim(),
          email: formData.email.trim(),
          contactNo: formData.contactNo.trim(),
          address: {
            line1: formData.addressLine1.trim(),
            line2: formData.addressLine2.trim(),
            city: formData.city.trim(),
            state: formData.state.trim(),
            postalCode: formData.postalCode.trim(),
            country: formData.country.trim(),
          },
          password: formData.password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "User registration failed.");
      }

      setSuccess(data.message || "User registered successfully.");
      setCreatedUserData(data.data?.user);
      setShowCredentialsModal(true);
      setFormData({
        fullName: "",
        username: "",
        email: "",
        contactNo: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        password: "",
        confirmPassword: "",
      });

      if (onCreated) {
        onCreated(data);
      }
    } catch (submitError) {
      setError(submitError.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // auto-hide toast when success is set
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(""), 4000);
    return () => clearTimeout(t);
  }, [success]);

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text).catch(() => {
      alert("Failed to copy. Please try again.");
    });
  };

  const handleCloseModal = () => {
    setShowCredentialsModal(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, height: "100%", overflow: "hidden" }}>

      {/* Floating toast */}
      {success && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 60,
            background: "#16a34a",
            color: "#fff",
            padding: "10px 14px",
            borderRadius: 8,
            boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
            fontWeight: 600,
          }}
        >
          {success}
        </div>
      )}

      {/* Credentials Modal */}
      {showCredentialsModal && createdUserData && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 24,
              maxWidth: 450,
              boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
              border: "1px solid #e8e2e2",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  background: "#dcfce7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                  fontSize: 24,
                }}
              >
                ✓
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1c1212", margin: 0 }}>User Created Successfully!</h3>
              <p style={{ fontSize: 12, color: "#9b8888", margin: "4px 0 0" }}>Share these credentials with the user</p>
            </div>

            <div style={{ display: "grid", gap: 12, marginBottom: 16 }}>
              {/* Username */}
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#9b8888", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Username</label>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="text"
                    value={createdUserData.username || ""}
                    readOnly
                    style={{
                      flex: 1,
                      border: "1px solid #e8e2e2",
                      borderRadius: 8,
                      padding: "8px 10px",
                      fontSize: 13,
                      fontFamily: "monospace",
                      fontWeight: 600,
                      background: "#faf7f7",
                      color: "#1c1212",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleCopyToClipboard(createdUserData.username)}
                    style={{
                      background: "#b91c1c",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      padding: "6px 10px",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#9b8888", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Password</label>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="text"
                    value={createdUserData.password || "(Not displayed for security)"}
                    readOnly
                    style={{
                      flex: 1,
                      border: "1px solid #e8e2e2",
                      borderRadius: 8,
                      padding: "8px 10px",
                      fontSize: 13,
                      fontFamily: "monospace",
                      fontWeight: 600,
                      background: "#faf7f7",
                      color: createdUserData.password ? "#1c1212" : "#9b8888",
                    }}
                  />
                  {createdUserData.password && (
                    <button
                      type="button"
                      onClick={() => handleCopyToClipboard(createdUserData.password)}
                      style={{
                        background: "#b91c1c",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "6px 10px",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Copy
                    </button>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#9b8888", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Email</label>
                <input
                  type="email"
                  value={createdUserData.email || ""}
                  readOnly
                  style={{
                    width: "100%",
                    border: "1px solid #e8e2e2",
                    borderRadius: 8,
                    padding: "8px 10px",
                    fontSize: 13,
                    fontFamily: "monospace",
                    background: "#faf7f7",
                    color: "#1c1212",
                  }}
                />
              </div>
            </div>

            <div style={{ padding: "12px", background: "#fef3c7", borderRadius: 8, marginBottom: 16, fontSize: 12, color: "#92400e", lineHeight: 1.4 }}
            >
              <strong>Note:</strong> Please share these credentials securely and ask the user to change their password after first login.
            </div>

            <button
              type="button"
              onClick={handleCloseModal}
              style={{
                width: "100%",
                background: "#b91c1c",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "10px 14px",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div
        style={{
          flexShrink: 0,
          background: "#fff",
          borderBottom: "1px solid #e8e2e2",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#1c1212", margin: 0 }}>Create New User</p>
          <p style={{ fontSize: 12, color: "#9b8888", margin: "2px 0 0" }}>Enroll a new user account into the system</p>
        </div>
        <button
          onClick={onCancel}
          style={{
            background: "#fff",
            color: "#4a3030",
            border: "1px solid #e8e2e2",
            borderRadius: 8,
            padding: "8px 14px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Back to Users
        </button>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden", padding: "24px" }}>
        <div
          style={{
            maxWidth: 560,
            margin: "0 auto",
            background: "#fff",
            border: "1px solid #e8e2e2",
            borderRadius: 12,
            padding: 22,
          }}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gap: 12 }}>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                style={fieldStyle}
              />

              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                style={fieldStyle}
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                style={fieldStyle}
              />

              <input
                type="tel"
                name="contactNo"
                placeholder="Contact Number"
                value={formData.contactNo}
                onChange={handleChange}
                style={fieldStyle}
              />

              <input
                type="text"
                name="addressLine1"
                placeholder="Address Line 1"
                value={formData.addressLine1}
                onChange={handleChange}
                style={fieldStyle}
              />

              <input
                type="text"
                name="addressLine2"
                placeholder="Address Line 2 (Optional)"
                value={formData.addressLine2}
                onChange={handleChange}
                style={fieldStyle}
              />

              <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  style={fieldStyle}
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State / Province"
                  value={formData.state}
                  onChange={handleChange}
                  style={fieldStyle}
                />
              </div>

              <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  value={formData.postalCode}
                  onChange={handleChange}
                  style={fieldStyle}
                />
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleChange}
                  style={fieldStyle}
                />
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  style={{ ...fieldStyle, paddingRight: 90 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                    color: "#9b8888",
                    fontSize: 12,
                    cursor: "pointer",
                    padding: "2px 6px",
                  }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div style={{ position: "relative" }}>
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{ ...fieldStyle, paddingRight: 90 }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  style={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                    color: "#9b8888",
                    fontSize: 12,
                    cursor: "pointer",
                    padding: "2px 6px",
                  }}
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <p style={{ margin: "12px 0 0", fontSize: 12, color: "#b91c1c" }}>{error}</p>
            )}

            {success && (
              <p style={{ margin: "12px 0 0", fontSize: 12, color: "#166534" }}>{success}</p>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
              <button
                type="button"
                onClick={onCancel}
                style={{
                  background: "#fff",
                  color: "#4a3030",
                  border: "1px solid #e8e2e2",
                  borderRadius: 8,
                  padding: "8px 14px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid || submitting}
                style={{
                  background: !isValid || submitting ? "#fca5a5" : "#b91c1c",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 14px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: !isValid || submitting ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                }}
              >
                {submitting ? "Creating..." : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
