"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://yrvaabnalradtbwelatz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlydmFhYm5hbHJhZHRid2VsYXR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MjI0NDYsImV4cCI6MjA5MDE5ODQ0Nn0.2BXk57rWqim1JCyj95V5G05LvGCkMOZeSKDf_5YDVn0"
);

export default function Home() {
  const [group, setGroup] = useState("");
  const [username, setUsername] = useState("");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEnter = async () => {
    if (!group || !username) {
      alert("Fill all fields");
      return;
    }

    setLoading(true);

    // ✅ Validate user in DB
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .eq("group_name", group);

    setLoading(false);

    if (error) {
      alert("Something went wrong");
      return;
    }

    if (!data || data.length === 0) {
      alert("You are not part of this group ❌");
      return;
    }

    // ✅ Save session
    localStorage.setItem("group", group);
    localStorage.setItem("username", username.toLowerCase());

    setReady(true);
  };

  if (ready) {
    return (
      <iframe
        src="/ipl-ui.html"
        style={{ width: "100%", height: "100vh", border: "none" }}
      />
    );
  }

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#0b0f17",
      color: "white"
    }}>
      <div style={{
        background: "#12151c",
        padding: "30px",
        borderRadius: "12px",
        width: "320px",
        textAlign: "center"
      }}>
        <h2>Join Game 🏏</h2>

        <select
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          style={{ width: "100%", margin: "10px 0", padding: "8px" }}
        >
          <option value="">Select Group</option>
          <option value="Office">Office</option>
          <option value="Friends">Friends</option>
        </select>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "100%", margin: "10px 0", padding: "8px" }}
        />

        <button onClick={handleEnter} disabled={loading}>
          {loading ? "Checking..." : "Enter"}
        </button>
      </div>
    </div>
  );
}