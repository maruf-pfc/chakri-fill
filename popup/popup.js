document.addEventListener("DOMContentLoaded", async () => {
  const statusBadge = document.getElementById("statusBadge");
  const emptyWarning = document.getElementById("emptyWarning");
  const profileDetails = document.getElementById("profileDetails");
  const profileName = document.getElementById("profileName");
  const profileMobile = document.getElementById("profileMobile");
  const profileEdu = document.getElementById("profileEdu");
  const fillBtn = document.getElementById("fillBtn");
  const settingsBtn = document.getElementById("settingsBtn");
  const helpLink = document.getElementById("helpLink");

  // Load profile from storage to check status
  let profile = null;
  if (typeof chrome !== "undefined" && chrome.storage) {
    const data = await chrome.storage.local.get("profile");
    profile = data.profile;
  } else {
    // Local storage fallback for local development/previews
    const saved = localStorage.getItem("profile");
    if (saved) {
      try {
        profile = JSON.parse(saved);
      } catch (e) {
        console.error("Local storage parse fail", e);
      }
    }
  }

  if (profile && profile.name) {
    // Hydrate UI with Profile Summary
    statusBadge.textContent = "Ready";
    statusBadge.className = "status-badge ready";
    emptyWarning.style.display = "none";
    profileDetails.style.display = "block";
    profileName.textContent = profile.name;
    profileMobile.textContent = profile.mobile || "-";
    
    // Academic short summary
    const eduExam = profile.gra_subject || profile.hsc_group || profile.ssc_group || "-";
    profileEdu.textContent = eduExam;
    
    // Enable Autofill Button
    fillBtn.disabled = false;
  } else {
    // Unconfigured State
    statusBadge.textContent = "Empty";
    statusBadge.className = "status-badge empty";
    emptyWarning.style.display = "block";
    profileDetails.style.display = "none";
    fillBtn.disabled = true;
  }

  // Open Options page
  settingsBtn.addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
  });

  // Help Link opens settings too
  helpLink.addEventListener("click", (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });

  // Autofill button click with script injection lifecycle
  fillBtn.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab) return;

    // Show loading spinner
    const originalContent = fillBtn.innerHTML;
    fillBtn.disabled = true;
    fillBtn.innerHTML = '<span class="loader-spinner"></span> Populating...';

    try {
      // Injects helpers, matcher, and then autofill engine sequentially
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: [
          "content/helpers.js",
          "content/matcher.js",
          "content/autofill.js"
        ]
      });

      // Show temporary Success State
      fillBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Done!';
      fillBtn.style.backgroundColor = "#059669"; // Emerald success
      
      setTimeout(() => {
        fillBtn.innerHTML = originalContent;
        fillBtn.disabled = false;
        fillBtn.style.backgroundColor = ""; // Reset
      }, 1500);

    } catch (err) {
      console.error("Autofill Injection failed:", err);
      fillBtn.innerHTML = "Error Infilling";
      fillBtn.style.backgroundColor = "#ef4444"; // Danger color
      
      setTimeout(() => {
        fillBtn.innerHTML = originalContent;
        fillBtn.disabled = false;
        fillBtn.style.backgroundColor = ""; // Reset
      }, 2500);
    }
  });
});
