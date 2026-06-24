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
  const popupProfileSelect = document.getElementById("popupProfileSelect");

  let profiles = { "Default": {} };
  let activeProfileName = "Default";
  let profile = null;

  // Load profile state
  async function loadProfileState() {
    let rawProfiles, rawActiveProfileName, rawProfile;

    if (typeof chrome !== "undefined" && chrome.storage) {
      const data = await chrome.storage.local.get(["profiles", "activeProfileName", "profile"]);
      rawProfiles = data.profiles;
      rawActiveProfileName = data.activeProfileName;
      rawProfile = data.profile;
    } else {
      // Local storage fallback for local development/previews
      try {
        rawProfiles = localStorage.getItem("profiles");
        rawActiveProfileName = localStorage.getItem("activeProfileName");
        rawProfile = localStorage.getItem("profile");
      } catch (e) {}
    }

    const key = await window.ChakriFillSecurity.getOrCreateKey();
    
    // Decrypt profiles collection
    if (rawProfiles) {
      profiles = await window.ChakriFillSecurity.decryptProfiles(rawProfiles, key);
    } else if (rawProfile) {
      const decryptedSingle = await window.ChakriFillSecurity.decryptSingleProfile(rawProfile, key);
      profiles = { "Default": decryptedSingle };
    } else {
      profiles = { "Default": {} };
    }

    activeProfileName = rawActiveProfileName || "Default";
    if (!profiles[activeProfileName]) {
      activeProfileName = Object.keys(profiles)[0] || "Default";
    }

    // Populate dropdown options
    updatePopupProfileDropdown();

    // Set current active profile
    profile = profiles[activeProfileName];
    updateUIPreview();
  }

  // Populate popup dropdown
  function updatePopupProfileDropdown() {
    if (!popupProfileSelect) return;
    popupProfileSelect.innerHTML = "";
    Object.keys(profiles).forEach(name => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      if (name === activeProfileName) {
        opt.selected = true;
      }
      popupProfileSelect.appendChild(opt);
    });
  }

  // Update popup preview fields
  function updateUIPreview() {
    if (profile && profile.name) {
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
      statusBadge.textContent = "Empty";
      statusBadge.className = "status-badge empty";
      emptyWarning.style.display = "block";
      profileDetails.style.display = "none";
      
      // Disable Autofill Button
      fillBtn.disabled = true;
    }
  }

  // Dropdown switcher listener
  if (popupProfileSelect) {
    popupProfileSelect.addEventListener("change", async (e) => {
      const selected = e.target.value;
      if (selected && profiles[selected]) {
        activeProfileName = selected;
        profile = profiles[selected];
        
        const key = await window.ChakriFillSecurity.getOrCreateKey();
        const encryptedProfile = await window.ChakriFillSecurity.encryptSingleProfile(profile, key);

        // Save choice
        if (typeof chrome !== "undefined" && chrome.storage) {
          await chrome.storage.local.set({
            activeProfileName: activeProfileName,
            profile: encryptedProfile // Sync for injection compatibility
          });
        } else {
          localStorage.setItem("activeProfileName", activeProfileName);
          localStorage.setItem("profile", encryptedProfile);
        }
        
        updateUIPreview();
      }
    });
  }

  // Load state on startup
  await loadProfileState();

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
          "content/security.js",
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
