"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const GstVerify = () => {
  const router = useRouter();

  const [gstNumber, setGstNumber] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState("");

  const handleVerify = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/gst/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gstNumber }),
      });

      const responsedata = await response.json();
      const data = responsedata.dataResponse.result.source_output.gstin_status;
      if (response.ok) {
        setMessage(data.message);
        if (data === "Active") {
          setMessage("GST verified");
          router.push(`/bankacctVerify`);
        } else {
          setMessage("Invalid GST");
        }
      } else {
        setMessage(data.error || "Verification failed");
      }
    } catch (error) {
      setMessage("An error occurred while verifying GST!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>GST Verification</h2>
      <input
        type="text"
        placeholder="GST Number"
        value={gstNumber}
        onChange={(e) => setGstNumber(e.target.value)}
        style={{ width: "100%", padding: "8px", margin: "5px 0" }}
      />
      <button
        onClick={handleVerify}
        type="submit"
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#28a745",
          color: "#000000",
          border: "none",
          cursor: "pointer",
        }}
      >
        {isLoading ? "Verifying GST..." : "Verify GST"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default GstVerify;
