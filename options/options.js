// Dynamic Upazila Mapping based on popular districts from form.html
const DISTRICT_TO_CODE = {
  "dhaka": "40",
  "jashore": "23",
  "chattogram": "60",
  "khulna": "25",
  "rajshahi": "14",
  "sylhet": "51",
  "barishal": "29",
  "rangpur": "6",
  "mymensingh": "34",
  "cumilla": "55",
  "pabna": "16",
  "bogura": "10"
};

const UPAZILA_MAP = {
  "40": [ // Dhaka
    { code: "314", name: "Gulshan" },
    { code: "311", name: "Dhanmondi" },
    { code: "305", name: "Cantonment" },
    { code: "320", name: "Kalabagan" },
    { code: "301", name: "Badda" },
    { code: "299", name: "Adabor" },
    { code: "307", name: "Dakshin Khan" },
    { code: "319", name: "Kafrul" },
    { code: "321", name: "Kamrangir Char" },
    { code: "323", name: "Hatirjheel" },
    { code: "313", name: "Khilgaon" },
    { code: "318", name: "Mirpur" },
    { code: "322", name: "Tejgaon" }
  ],
  "23": [ // Jashore
    { code: "155", name: "Abhay Nagar" },
    { code: "156", name: "Bagherpara" },
    { code: "157", name: "Chowghacha" },
    { code: "158", name: "Jhikargacha" },
    { code: "159", name: "Keshabpur" }
  ],
  "60": [ // Chattogram
    { code: "496", name: "Anowara" },
    { code: "497", name: "Bakalia" },
    { code: "499", name: "Banshkhali" },
    { code: "503", name: "Chandgaon" }
  ],
  "25": [ // Khulna
    { code: "170", name: "Batiaghata" },
    { code: "171", name: "Dacope" },
    { code: "172", name: "Daulatpur" },
    { code: "174", name: "Dumuria" }
  ],
  "14": [ // Rajshahi
    { code: "99", name: "Bagha" },
    { code: "100", name: "Baghmara" },
    { code: "101", name: "Boalia" }
  ],
  "51": [ // Sylhet
    { code: "417", name: "Balaganj" },
    { code: "418", name: "Beanibazar" },
    { code: "419", name: "Bishwanath" }
  ],
  "29": [ // Barishal
    { code: "204", name: "Agailihara" },
    { code: "205", name: "Babuganj" },
    { code: "208", name: "Barishal Sadar" }
  ],
  "6": [ // Rangpur
    { code: "35", name: "Badarganj" },
    { code: "36", name: "Gangachara" }
  ],
  "34": [ // Mymensingh
    { code: "243", name: "Bhalukha" },
    { code: "246", name: "Gaffargaon" }
  ],
  "55": [ // Cumilla
    { code: "452", name: "Barura" },
    { code: "455", name: "Chandina" },
    { code: "458", name: "Muradnagar" },
    { code: "456", name: "Daudkandi" },
    { code: "457", name: "Debidwar" }
  ],
  "16": [ // Pabna
    { code: "120", name: "Atgharia" },
    { code: "125", name: "Ishwardi" }
  ],
  "10": [ // Bogura
    { code: "65", name: "Adamdighi" },
    { code: "66", name: "Bogura Sadar" }
  ]
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initConditionalFields();
  initDynamicExperiences();
  initAddressSync();
  initDragAndDrop();
  initEditorTabs();
  loadSavedProfile();

  // Load demo data button
  document.getElementById("loadMockBtn").addEventListener("click", () => {
    if (typeof DEFAULT_PROFILE !== "undefined") {
      populateForm(DEFAULT_PROFILE);
      showToast("Loaded Demo Profile! Click 'Save Profile' at the bottom to store it.", "info");
    } else {
      showToast("Default profile template not found.", "danger");
    }
  });

  // Reset button
  document.getElementById("resetBtn").addEventListener("click", () => {
    if (confirm("Are you sure you want to clear your current profile details?")) {
      document.getElementById("profileForm").reset();
      document.getElementById("experienceList").innerHTML = "";
      showToast("Form cleared.", "warning");
    }
  });

  // JSON / YAML Editor actions
  document.getElementById("copyJsonBtn").addEventListener("click", () => copyTextToClipboard("jsonTextarea", "JSON"));
  document.getElementById("copyYamlBtn").addEventListener("click", () => copyTextToClipboard("yamlTextarea", "YAML"));
  document.getElementById("importJsonBtn").addEventListener("click", importJsonProfile);
  document.getElementById("importYamlBtn").addEventListener("click", importYamlProfile);
  document.getElementById("exportJsonBtn").addEventListener("click", () => exportProfile("json"));
  document.getElementById("exportYamlBtn").addEventListener("click", () => exportProfile("yaml"));

  // Profile Selector and Management Actions
  document.getElementById("profileSelect").addEventListener("change", handleProfileChange);
  document.getElementById("newProfileBtn").addEventListener("click", handleNewProfile);
  document.getElementById("renameProfileBtn").addEventListener("click", handleRenameProfile);
  document.getElementById("deleteProfileBtn").addEventListener("click", handleDeleteProfile);

  // Form submission
  document.getElementById("profileForm").addEventListener("submit", saveProfile);
});

// Toast Notifications System
function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  
  let icon = "";
  if (type === "success") icon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
  else if (type === "info") icon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
  else if (type === "warning") icon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
  else icon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';

  toast.innerHTML = `
    ${icon}
    <span>${message}</span>
  `;
  container.appendChild(toast);
  
  // Slide in
  setTimeout(() => toast.classList.add("show"), 10);
  
  // Remove after 4s
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

// Tab Switching
function initTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");

      tabBtns.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));

      btn.classList.add("active");
      document.getElementById(tabId).classList.add("active");

      // Auto update textareas if backup tab is active
      if (tabId === "backup") {
        updateCodeTextareas();
      }
    });
  });
}

// Sub-tabs inside editor panel
function initEditorTabs() {
  const tabs = document.querySelectorAll(".editor-tab-btn");
  const views = document.querySelectorAll(".editor-view");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const format = tab.getAttribute("data-format");

      tabs.forEach(t => t.classList.remove("active"));
      views.forEach(v => v.classList.remove("active"));

      tab.classList.add("active");
      document.getElementById(`${format}EditorView`).classList.add("active");
    });
  });
}

// Show/Hide Fields based on dropdown inputs
function initConditionalFields() {
  const toggleSelect = (selectId, wrapperId, showVal = "1") => {
    const select = document.getElementById(selectId);
    const wrapper = document.getElementById(wrapperId);
    if (!select || !wrapper) return;

    const handler = () => {
      if (select.value === showVal || (showVal === "married" && select.value === "Married") || (showVal === "not_equal" && select.value !== "8")) {
        wrapper.classList.remove("conditional-hide");
        wrapper.classList.add("conditional-show");
      } else {
        wrapper.classList.remove("conditional-show");
        wrapper.classList.add("conditional-hide");
      }
    };
    select.addEventListener("change", handler);
    handler(); // Run once initially
  };

  toggleSelect("nid", "nidNoWrapper", "1");
  toggleSelect("breg", "bregNoWrapper", "1");
  toggleSelect("passport", "passportNoWrapper", "1");
  toggleSelect("marital_status", "spouseNameWrapper", "married");
  toggleSelect("quota", "quotaDetailsWrapper", "not_equal");

  // Masters section toggle
  const masCheckbox = document.getElementById("if_applicable_mas");
  const masFields = document.getElementById("mastersFields");
  masCheckbox.addEventListener("change", () => {
    if (masCheckbox.checked) {
      masFields.classList.remove("conditional-hide");
      masFields.classList.add("conditional-show");
    } else {
      masFields.classList.remove("conditional-show");
      masFields.classList.add("conditional-hide");
    }
  });

  // Experience section toggle
  const expCheckbox = document.getElementById("if_applicable_exp");
  const expFields = document.getElementById("experienceFields");
  expCheckbox.addEventListener("change", () => {
    if (expCheckbox.checked) {
      expFields.classList.remove("conditional-hide");
      expFields.classList.add("conditional-show");
    } else {
      expFields.classList.remove("conditional-show");
      expFields.classList.add("conditional-hide");
    }
  });
}

// Translate district/upazila codes to names for user friendly input display
function translateCodeToName(fieldId, value) {
  if (!value) return "";
  
  const stringVal = String(value).trim().toLowerCase();

  // District translation
  if (fieldId.endsWith("district")) {
    for (const [name, code] of Object.entries(DISTRICT_TO_CODE)) {
      if (code === stringVal || name === stringVal) {
        return name.charAt(0).toUpperCase() + name.slice(1);
      }
    }
  }

  // Upazila translation
  if (fieldId.endsWith("upazila")) {
    for (const upazilas of Object.values(UPAZILA_MAP)) {
      for (const up of upazilas) {
        if (up.code === stringVal || up.name.toLowerCase() === stringVal) {
          return up.name;
        }
      }
    }
  }

  return value; // Return as-is if no mapping found
}

// Setup Dynamic Upazila Autocomplete Suggestions for Text inputs using datalists
function setupDynamicUpazilaAutocomplete(districtInputId, upazilaDatalistId) {
  const districtInput = document.getElementById(districtInputId);
  const upazilaDatalist = document.getElementById(upazilaDatalistId);
  
  if (!districtInput || !upazilaDatalist) return;

  const updateUpazilas = () => {
    const val = districtInput.value.trim().toLowerCase();
    
    // Check if the value matches either a district code or name
    let code = null;
    if (DISTRICT_TO_CODE[val]) {
      code = DISTRICT_TO_CODE[val];
    } else {
      // Find by code directly (e.g. if profile has "40" stored)
      for (const [name, c] of Object.entries(DISTRICT_TO_CODE)) {
        if (c === val) {
          code = c;
          break;
        }
      }
    }
    
    upazilaDatalist.innerHTML = "";
    
    if (code && UPAZILA_MAP[code]) {
      UPAZILA_MAP[code].forEach(up => {
        const option = document.createElement("option");
        option.value = up.name; // Keep as text name for clean user viewing
        option.setAttribute("data-code", up.code);
        upazilaDatalist.appendChild(option);
      });
    }
  };

  districtInput.addEventListener("input", updateUpazilas);
  districtInput.addEventListener("change", updateUpazilas);
  updateUpazilas();
}

// Present and Permanent Address Sync Logic
function initAddressSync() {
  setupDynamicUpazilaAutocomplete("present_district", "present_upazilas_list");
  setupDynamicUpazilaAutocomplete("permanent_district", "permanent_upazilas_list");

  const syncCheckbox = document.getElementById("same_as_present");
  const permFieldsWrapper = document.getElementById("permanentAddressFields");

  syncCheckbox.addEventListener("change", () => {
    if (syncCheckbox.checked) {
      permFieldsWrapper.classList.add("conditional-hide");
    } else {
      permFieldsWrapper.classList.remove("conditional-hide");
      permFieldsWrapper.classList.add("conditional-show");
    }
  });
}

// Job Experience dynamically adding/removing rows
function initDynamicExperiences() {
  const addBtn = document.getElementById("addJobBtn");
  addBtn.addEventListener("click", () => {
    addExperienceRow();
  });
}

function addExperienceRow(data = null) {
  const container = document.getElementById("experienceList");
  const index = container.children.length;
  const item = document.createElement("div");
  item.className = "experience-item";
  item.dataset.index = index;

  item.innerHTML = `
    <div class="experience-item-header">
      <span class="experience-index">Position #${index + 1}</span>
      <button type="button" class="btn btn-danger btn-icon-only remove-job-btn" title="Remove Experience">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
      </button>
    </div>

    <div class="form-grid-2">
      <div class="form-group">
        <label>Employed on <span class="required-badge">*</span></label>
        <select class="job-employment-type" required>
          <option value="" disabled selected>Select</option>
          <option value="1">Regular Basis Under Revenue Budget</option>
          <option value="2">Ad-hoc Basis Under Revenue Budget</option>
          <option value="3">Temporary Basis Under Revenue Budget</option>
          <option value="4">Work Charged Basis Under Revenue Budget</option>
          <option value="5">Temporary Basis Under Development Project</option>
          <option value="6">Work Charged Basis Under Development Project</option>
          <option value="7">Autonomous/Semi Autonomous Organization</option>
          <option value="8">Private Organization</option>
          <option value="9">Business/Self Employed</option>
        </select>
      </div>
      <div class="form-group">
        <label>Designation/Post <span class="required-badge">*</span></label>
        <input type="text" class="job-designation" required placeholder="e.g. Software Engineer" />
      </div>
    </div>

    <div class="form-grid-3">
      <div class="form-group">
        <label>Start Date <span class="required-badge">*</span></label>
        <input type="date" class="job-start-date" required />
      </div>
      <div class="form-group">
        <label>End Date</label>
        <input type="date" class="job-end-date" />
      </div>
      <div class="form-group checkbox-row" style="margin-top: 1.5rem;">
        <input type="checkbox" class="job-currently-working" />
        <label>Currently Working</label>
      </div>
    </div>

    <div class="form-grid-2">
      <div class="form-group">
        <label>Organization Name <span class="required-badge">*</span></label>
        <input type="text" class="job-organization" required />
      </div>
      <div class="form-group">
        <label>Organization Address <span class="required-badge">*</span></label>
        <input type="text" class="job-office-address" required />
      </div>
    </div>

    <div class="form-group">
      <label>Job Description (Responsibilities) <span class="required-badge">*</span></label>
      <textarea class="job-description" required maxlength="300" placeholder="Describe your duties (max 300 characters)..."></textarea>
    </div>
  `;

  // Attach delete listener
  item.querySelector(".remove-job-btn").addEventListener("click", () => {
    item.remove();
    reindexExperiences();
  });

  // Attach currently working logic
  const currentCheck = item.querySelector(".job-currently-working");
  const endDateInput = item.querySelector(".job-end-date");
  currentCheck.addEventListener("change", () => {
    if (currentCheck.checked) {
      endDateInput.value = "";
      endDateInput.disabled = true;
      endDateInput.removeAttribute("required");
    } else {
      endDateInput.disabled = false;
      endDateInput.setAttribute("required", "");
    }
  });

  container.appendChild(item);

  // If loading saved data, populate now
  if (data) {
    item.querySelector(".job-employment-type").value = data.employment_type || "";
    item.querySelector(".job-designation").value = data.designation || "";
    item.querySelector(".job-start-date").value = data.job_start_date || "";
    item.querySelector(".job-end-date").value = data.job_end_date || "";
    item.querySelector(".job-currently-working").checked = !!data.currently_working;
    item.querySelector(".job-organization").value = data.organization || "";
    item.querySelector(".job-office-address").value = data.office_address || "";
    item.querySelector(".job-description").value = data.job_description || "";
    
    if (data.currently_working) {
      endDateInput.disabled = true;
    }
  }
}

function reindexExperiences() {
  const container = document.getElementById("experienceList");
  Array.from(container.children).forEach((child, index) => {
    child.dataset.index = index;
    child.querySelector(".experience-index").textContent = `Position #${index + 1}`;
  });
}

// Smart Select population helper to allow mapping values or texts
function selectSelectOptionSmart(selectEl, value) {
  if (!selectEl || value === undefined || value === null) return;
  const stringVal = String(value).trim().toLowerCase();
  
  // 1. Exact value match
  for (let option of selectEl.options) {
    if (option.value.trim().toLowerCase() === stringVal) {
      selectEl.value = option.value;
      return;
    }
  }
  
  // 2. Exact or partial text match
  for (let option of selectEl.options) {
    const text = option.textContent.trim().toLowerCase();
    if (text === stringVal || text.includes(stringVal) || stringVal.includes(text)) {
      selectEl.value = option.value;
      return;
    }
  }
}

// Populate the options form with profile object
function populateForm(profile) {
  if (!profile) return;

  // Single value text/select elements
  const fields = [
    "name", "name_bn", "father", "father_bn", "mother", "mother_bn", "dob",
    "nationality", "religion", "gender", "nid", "nid_no", "breg", "breg_no",
    "passport", "passport_no", "marital_status", "spouse_name", "mobile",
    "confirm_mobile", "email", "quota", "quota_details", "dep_status",
    "present_careof", "present_village", "present_district", "present_upazila", "present_post", "present_postcode",
    "permanent_careof", "permanent_village", "permanent_district", "permanent_upazila", "permanent_post", "permanent_postcode",
    "ssc_exam", "ssc_roll", "ssc_group", "ssc_board", "ssc_result_type", "ssc_result", "ssc_year",
    "hsc_exam", "hsc_roll", "hsc_group", "hsc_board", "hsc_result_type", "hsc_result", "hsc_year",
    "gra_exam", "gra_institute", "gra_year", "gra_subject", "gra_result_type", "gra_result", "gra_duration",
    "mas_exam", "mas_institute", "mas_year", "mas_subject", "mas_result_type", "mas_result", "mas_duration"
  ];

  fields.forEach(f => {
    const el = document.getElementById(f);
    if (el) {
      let val = profile[f] || "";
      
      // Translate code to name for district and upazila to show human-readable text
      if (f.endsWith("district") || f.endsWith("upazila")) {
        val = translateCodeToName(f, val);
      }

      if (el.tagName === "SELECT") {
        selectSelectOptionSmart(el, val);
      } else {
        el.value = val;
      }
    }
  });

  // Handle checkboxes
  document.getElementById("same_as_present").checked = !!profile.same_as_present;
  document.getElementById("if_applicable_mas").checked = !!profile.if_applicable_mas;
  document.getElementById("if_applicable_exp").checked = !!profile.if_applicable_exp;

  // Trigger change events to update layouts
  document.getElementById("nid").dispatchEvent(new Event("change"));
  document.getElementById("breg").dispatchEvent(new Event("change"));
  document.getElementById("passport").dispatchEvent(new Event("change"));
  document.getElementById("marital_status").dispatchEvent(new Event("change"));
  document.getElementById("quota").dispatchEvent(new Event("change"));
  document.getElementById("same_as_present").dispatchEvent(new Event("change"));
  document.getElementById("if_applicable_mas").dispatchEvent(new Event("change"));
  document.getElementById("if_applicable_exp").dispatchEvent(new Event("change"));

  // Trigger autocompleter input events to sync upazila datalists
  document.getElementById("present_district").dispatchEvent(new Event("input"));
  document.getElementById("permanent_district").dispatchEvent(new Event("input"));

  // Clear and load job experiences
  const expContainer = document.getElementById("experienceList");
  expContainer.innerHTML = "";
  if (profile.jobs && profile.jobs.length !== 0) {
    profile.jobs.forEach(job => {
      addExperienceRow(job);
    });
  }
}

// Gather all inputs from the form into a single JS profile object
function gatherProfileData() {
  const profile = {};
  
  const fields = [
    "name", "name_bn", "father", "father_bn", "mother", "mother_bn", "dob",
    "nationality", "religion", "gender", "nid", "nid_no", "breg", "breg_no",
    "passport", "passport_no", "marital_status", "spouse_name", "mobile",
    "confirm_mobile", "email", "quota", "quota_details", "dep_status",
    "present_careof", "present_village", "present_district", "present_upazila", "present_post", "present_postcode",
    "permanent_careof", "permanent_village", "permanent_district", "permanent_upazila", "permanent_post", "permanent_postcode",
    "ssc_exam", "ssc_roll", "ssc_group", "ssc_board", "ssc_result_type", "ssc_result", "ssc_year",
    "hsc_exam", "hsc_roll", "hsc_group", "hsc_board", "hsc_result_type", "hsc_result", "hsc_year",
    "gra_exam", "gra_institute", "gra_year", "gra_subject", "gra_result_type", "gra_result", "gra_duration",
    "mas_exam", "mas_institute", "mas_year", "mas_subject", "mas_result_type", "mas_result", "mas_duration"
  ];

  fields.forEach(f => {
    const el = document.getElementById(f);
    if (el) {
      profile[f] = el.value;
    }
  });

  // Checkboxes
  profile.same_as_present = document.getElementById("same_as_present").checked;
  profile.if_applicable_mas = document.getElementById("if_applicable_mas").checked;
  profile.if_applicable_exp = document.getElementById("if_applicable_exp").checked;

  // Job experience list gathering
  profile.jobs = [];
  if (profile.if_applicable_exp) {
    const jobItems = document.querySelectorAll(".experience-item");
    jobItems.forEach(item => {
      const job = {
        employment_type: item.querySelector(".job-employment-type").value,
        designation: item.querySelector(".job-designation").value,
        job_start_date: item.querySelector(".job-start-date").value,
        job_end_date: item.querySelector(".job-end-date").value,
        currently_working: item.querySelector(".job-currently-working").checked,
        organization: item.querySelector(".job-organization").value,
        office_address: item.querySelector(".job-office-address").value,
        job_description: item.querySelector(".job-description").value
      };
      profile.jobs.push(job);
    });
  }

  return profile;
}

// State
let allProfiles = { "Default": {} };
let currentProfileName = "Default";

// Load profiles from Chrome storage
async function loadSavedProfile() {
  let data = {};
  if (typeof chrome !== "undefined" && chrome.storage) {
    data = await chrome.storage.local.get(["profiles", "activeProfileName", "profile"]);
  } else {
    // Local storage fallback for previews
    try {
      data = {
        profiles: JSON.parse(localStorage.getItem("profiles")),
        activeProfileName: localStorage.getItem("activeProfileName"),
        profile: JSON.parse(localStorage.getItem("profile"))
      };
    } catch (e) {}
  }

  // Schema migration and backwards compatibility check
  if (data.profiles && Object.keys(data.profiles).length > 0) {
    allProfiles = data.profiles;
  } else if (data.profile && Object.keys(data.profile).length > 0) {
    allProfiles = { "Default": data.profile };
  } else {
    allProfiles = { "Default": typeof DEFAULT_PROFILE !== "undefined" ? DEFAULT_PROFILE : {} };
  }

  currentProfileName = data.activeProfileName || "Default";
  if (!allProfiles[currentProfileName]) {
    currentProfileName = Object.keys(allProfiles)[0] || "Default";
  }

  // Rebuild the select options
  updateProfileDropdown();

  // Populate fields
  populateForm(allProfiles[currentProfileName]);
}

// Rebuild the profile switcher dropdown
function updateProfileDropdown() {
  const select = document.getElementById("profileSelect");
  if (!select) return;
  select.innerHTML = "";
  Object.keys(allProfiles).forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    if (name === currentProfileName) {
      opt.selected = true;
    }
    select.appendChild(opt);
  });
}

// Save profile to Chrome storage
async function saveProfile(e) {
  if (e) e.preventDefault();

  const profile = gatherProfileData();
  allProfiles[currentProfileName] = profile;
  
  if (typeof chrome !== "undefined" && chrome.storage) {
    await chrome.storage.local.set({
      profiles: allProfiles,
      activeProfileName: currentProfileName,
      profile: profile // Sync for backwards-compatibility
    });
    showToast(`Profile "${currentProfileName}" saved successfully!`, "success");
  } else {
    localStorage.setItem("profiles", JSON.stringify(allProfiles));
    localStorage.setItem("activeProfileName", currentProfileName);
    localStorage.setItem("profile", JSON.stringify(profile));
    showToast(`Saved "${currentProfileName}" to mock local storage.`, "info");
  }

  // Refresh live editors
  updateCodeTextareas();
}

// Handle profile switcher change event
async function handleProfileChange(e) {
  const selected = e.target.value;
  if (selected && allProfiles[selected]) {
    // Save current profile changes first
    allProfiles[currentProfileName] = gatherProfileData();
    
    currentProfileName = selected;
    populateForm(allProfiles[selected]);

    // Save active state to storage
    if (typeof chrome !== "undefined" && chrome.storage) {
      await chrome.storage.local.set({
        profiles: allProfiles,
        activeProfileName: currentProfileName,
        profile: allProfiles[currentProfileName]
      });
    } else {
      localStorage.setItem("profiles", JSON.stringify(allProfiles));
      localStorage.setItem("activeProfileName", currentProfileName);
      localStorage.setItem("profile", JSON.stringify(allProfiles[currentProfileName]));
    }

    showToast(`Switched to profile: ${selected}`, "info");
    updateCodeTextareas();
  }
}

// Create new profile
async function handleNewProfile() {
  const name = prompt("Enter a name for the new profile:");
  if (!name) return;
  const trimmed = name.trim();
  if (!trimmed) return;

  if (allProfiles[trimmed]) {
    showToast("A profile with this name already exists.", "danger");
    return;
  }

  // Clone current form data into the new profile
  allProfiles[trimmed] = gatherProfileData();
  currentProfileName = trimmed;

  updateProfileDropdown();
  showToast(`Profile "${trimmed}" created!`, "success");
  await saveProfile();
}

// Rename current profile
async function handleRenameProfile() {
  if (currentProfileName === "Default") {
    showToast("The 'Default' profile cannot be renamed.", "warning");
    return;
  }
  const name = prompt(`Rename profile "${currentProfileName}" to:`, currentProfileName);
  if (!name) return;
  const trimmed = name.trim();
  if (!trimmed || trimmed === currentProfileName) return;

  if (allProfiles[trimmed]) {
    showToast("A profile with this name already exists.", "danger");
    return;
  }

  const data = allProfiles[currentProfileName];
  delete allProfiles[currentProfileName];
  allProfiles[trimmed] = data;

  currentProfileName = trimmed;
  updateProfileDropdown();
  showToast(`Profile renamed to "${trimmed}"`, "success");
  await saveProfile();
}

// Delete current profile
async function handleDeleteProfile() {
  if (Object.keys(allProfiles).length <= 1) {
    showToast("You must keep at least one profile.", "warning");
    return;
  }

  if (!confirm(`Are you sure you want to delete the profile "${currentProfileName}"?`)) {
    return;
  }

  delete allProfiles[currentProfileName];
  currentProfileName = Object.keys(allProfiles)[0];

  updateProfileDropdown();
  populateForm(allProfiles[currentProfileName]);
  showToast("Profile deleted.", "warning");

  // Save updated profiles
  if (typeof chrome !== "undefined" && chrome.storage) {
    await chrome.storage.local.set({
      profiles: allProfiles,
      activeProfileName: currentProfileName,
      profile: allProfiles[currentProfileName]
    });
  } else {
    localStorage.setItem("profiles", JSON.stringify(allProfiles));
    localStorage.setItem("activeProfileName", currentProfileName);
    localStorage.setItem("profile", JSON.stringify(allProfiles[currentProfileName]));
  }
  
  updateCodeTextareas();
}

// Drag and Drop File Upload Sync Setup
function initDragAndDrop() {
  const dropZone = document.getElementById("dropZone");
  const fileInput = document.getElementById("fileInput");
  const fileSelectBtn = document.getElementById("fileSelectBtn");

  if (!dropZone || !fileInput || !fileSelectBtn) return;

  fileSelectBtn.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) handleUploadedFile(file);
  });

  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dragover");
  });

  ["dragleave", "drop"].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.remove("dragover");
    });
  });

  dropZone.addEventListener("drop", (e) => {
    const file = e.dataTransfer.files[0];
    if (file) handleUploadedFile(file);
  });
}

function handleUploadedFile(file) {
  const reader = new FileReader();
  const extension = file.name.split(".").pop().toLowerCase();

  reader.onload = (e) => {
    const content = e.target.result;
    if (extension === "json") {
      try {
        const profile = JSON.parse(content);
        populateForm(profile);
        showToast("Profile JSON imported successfully! Click 'Save Profile' below to store.", "success");
      } catch (err) {
        showToast("Error parsing JSON file.", "danger");
      }
    } else if (extension === "yaml" || extension === "yml") {
      try {
        if (typeof jsyaml === "undefined") {
          showToast("YAML parser library is loading. Try again in a moment.", "warning");
          return;
        }
        const profile = jsyaml.load(content);
        populateForm(profile);
        showToast("Profile YAML imported successfully! Click 'Save Profile' below to store.", "success");
      } catch (err) {
        showToast("Error parsing YAML file: " + err.message, "danger");
      }
    } else {
      showToast("Unsupported file format. Please upload .json, .yaml, or .yml.", "warning");
    }
  };

  reader.readAsText(file);
}

// Update JSON and YAML backup textareas
function updateCodeTextareas() {
  const profile = gatherProfileData();
  
  const jsonTextarea = document.getElementById("jsonTextarea");
  if (jsonTextarea) {
    jsonTextarea.value = JSON.stringify(profile, null, 2);
  }
  
  const yamlTextarea = document.getElementById("yamlTextarea");
  if (yamlTextarea && typeof jsyaml !== "undefined") {
    try {
      yamlTextarea.value = jsyaml.dump(profile);
    } catch (e) {
      console.error("Error dumping YAML:", e);
    }
  }
}

// Copy Text to Clipboard
function copyTextToClipboard(textareaId, formatName) {
  const txt = document.getElementById(textareaId);
  if (!txt) return;
  txt.select();
  document.execCommand("copy");
  showToast(`Profile ${formatName} copied to clipboard!`, "success");
}

// Import JSON profile
function importJsonProfile() {
  const jsonVal = document.getElementById("jsonTextarea").value.trim();
  if (!jsonVal) {
    showToast("Please paste profile JSON first.", "warning");
    return;
  }

  try {
    const profile = JSON.parse(jsonVal);
    populateForm(profile);
    showToast("Profile JSON parsed and loaded! Click 'Save Profile' below to store.", "success");
  } catch (err) {
    showToast("Invalid JSON syntax. Please verify and try again.", "danger");
  }
}

// Import YAML profile
function importYamlProfile() {
  const yamlVal = document.getElementById("yamlTextarea").value.trim();
  if (!yamlVal) {
    showToast("Please paste profile YAML first.", "warning");
    return;
  }

  try {
    if (typeof jsyaml === "undefined") {
      showToast("YAML parser is not loaded.", "danger");
      return;
    }
    const profile = jsyaml.load(yamlVal);
    populateForm(profile);
    showToast("Profile YAML parsed and loaded! Click 'Save Profile' below to store.", "success");
  } catch (err) {
    showToast("Invalid YAML syntax: " + err.message, "danger");
  }
}

// Export Profile as File Download
function exportProfile(format) {
  const profile = gatherProfileData();
  let content = "";
  let filename = "chakrifill_profile";
  let mimeType = "text/plain";

  if (format === "json") {
    content = JSON.stringify(profile, null, 2);
    filename += ".json";
    mimeType = "application/json";
  } else if (format === "yaml") {
    if (typeof jsyaml === "undefined") {
      showToast("YAML library is not loaded.", "danger");
      return;
    }
    content = jsyaml.dump(profile);
    filename += ".yaml";
    mimeType = "text/yaml";
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(`Profile exported as ${format.toUpperCase()}!`, "success");
}
