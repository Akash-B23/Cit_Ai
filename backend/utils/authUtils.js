export const logout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. You are already logged out.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,  // Sending the token in the Authorization header
        },
      });
  
      if (response.ok) {
        localStorage.removeItem("token");
        alert("You have been logged out successfully.");
        window.location.href = "/login"; // Redirect to login page
      } else {
        const data = await response.json();
        alert(data.error || "Failed to log out.");
      }
    } catch (err) {
      console.error("Logout error:", err);
      alert("An error occurred while logging out.");
    }
  };
  