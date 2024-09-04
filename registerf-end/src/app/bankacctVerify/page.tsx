"use client";
import React, { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";


const BankacctVerify = () => {
  const router = useRouter();

  const [acctNumber, setAcctNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleVerify = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/bankAcct/handle-acct-verify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ acctNumber, ifscCode }),
        }
      );

      const responsedata = await response.json();
      const requestId = responsedata?.request_id;
      if (requestId) {
        getVerified(requestId);
      } else {
        setMessage(responsedata.error || "Verification failed");
      }
    } catch (error) {
      setMessage("An error occurred during verification!");
    } finally {
      setIsLoading(false);
    }
  };

  const getVerified = async (rid: any) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/bankAcct/get-acct-verify?request_id=${rid}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const responsedata = await response.json();

      if (response.ok) {
        setMessage(responsedata.message || "Verification successful!");
        router.push(`/addressLookup`);
      } else {
        setMessage(responsedata.error || "Verification failed");
      }
    } catch (error) {
      setMessage("An error occurred during verification!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "acctNumber") {
      setAcctNumber(value);
    } else if (name === "ifscCode") {
      setIfscCode(value);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>Bank Account Verification</h2>
      <input
        type="text"
        name="acctNumber"
        placeholder="Bank Account Number"
        value={acctNumber}
        onChange={handleInputChange}
        style={{ width: "100%", padding: "8px", margin: "5px 0" }}
      />
      <input
        type="text"
        name="ifscCode"
        placeholder="IFSC Code"
        value={ifscCode}
        onChange={handleInputChange}
        style={{ width: "100%", padding: "8px", margin: "5px 0" }}
      />
      <button
        onClick={handleVerify}
        type="button"
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#28a745",
          color: "#ffffff",
          border: "none",
          cursor: "pointer",
        }}
        disabled={isLoading}
      >
        {isLoading ? "Verifying..." : "Verify"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default BankacctVerify;
