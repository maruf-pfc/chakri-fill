<![CDATA[<p align="center">
  <img src="assets/banner.png" alt="ChakriFill Banner" width="100%" />
</p>

<h1 align="center">ChakriFill</h1>

<p align="center">
  <strong>Smart autofill browser extension for Bangladesh government job applications (Teletalk)</strong>
</p>

<p align="center">
  <img alt="Manifest Version" src="https://img.shields.io/badge/Manifest-v3-10b981?style=flat-square&logo=googlechrome&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/License-GPLv3-06b6d4?style=flat-square" />
  <img alt="Branch" src="https://img.shields.io/badge/Branch-feature%2Fautofill--engine-8b5cf6?style=flat-square&logo=git&logoColor=white" />
  <img alt="Status" src="https://img.shields.io/badge/Status-Active%20Development-f59e0b?style=flat-square" />
</p>

## ✨ What is ChakriFill?

ChakriFill is a **Chromium browser extension** that automatically fills Bangladesh government job application forms hosted on the **Teletalk/National Pension Authority (NPA)** recruitment portal.

Instead of tediously re-entering your name, address, educational qualifications, and job experience every time you apply for a new post, you save your profile **once** and ChakriFill populates the entire form in seconds — including the captcha.

### 🎯 Key Features

| Feature | Description |
|---|---|
| **One-Click Autofill** | Fills all personal, address, education, and experience sections instantly |
| **Smart Dropdown Matching** | Matches values by code *or* display text, with "Other" fallback |
| **District → Upazila Cascade** | Waits for upazila options to load after district is selected |
| **Event-Safe Injection** | Dispatches native `input`, `change`, `keyup` events — invisible to form validators |
| **Smart Captcha Bypass** | Reads the hidden `CAPTCHA_ACTUAL` field and fills the input automatically |
| **JSON Profile Backup** | Export/import your profile as a JSON file |
| **Glassmorphic UI** | A beautiful settings page with tabbed layout and neon-emerald accents |

---

## 🚀 Installation (Developer Mode)

ChakriFill is currently in active development and is not yet published to the Chrome Web Store. Install it manually:

### Prerequisites
- Google Chrome, Brave, or any Chromium-based browser
- Git (optional, for cloning)

### Steps

**1. Get the source code**
```bash
git clone https://github.com/maruf-pfc/chakri-fill.git
cd chakri-fill
```

**2. Open Chrome Extensions page**

Navigate to `chrome://extensions` in your browser's address bar.

**3. Enable Developer Mode**

Toggle the **"Developer mode"** switch in the top-right corner of the Extensions page.

**4. Load the extension**

Click **"Load unpacked"** and select the root `chakri-fill/` directory (the one containing `manifest.json`).

**5. Pin the extension** _(recommended)_

Click the puzzle-piece icon in the toolbar and pin **ChakriFill** for quick access.

---

## 🛠 How to Use

### Step 1 — Set up your profile

1. Click the **ChakriFill icon** in your browser toolbar.
2. Click **"Settings"** (or the gear icon).
3. The **Options page** opens. Fill in all your details across the tabs:
   - **Personal Info** — Name, NID, DOB, Contact, Quota
   - **Address** — Present and Permanent address with district/upazila
   - **Education** — SSC, HSC, Graduation, Masters
   - **Experience** — Job history with employment type, dates, and description
4. Click **"Save Profile"** at the bottom.

> **Tip:** Click **"Load Demo Profile"** to populate sample data and see what a completed profile looks like.

### Step 2 — Open the application form

Navigate to the Teletalk job application form in the same browser tab. The URL typically looks like:

```
https://recruitment.teletalk.com.bd/job/apply/...
```

Or open `form.html` locally if you are testing.

### Step 3 — Trigger autofill

1. Click the **ChakriFill icon** in the toolbar.
2. The popup shows your profile summary and status badge (green = **Ready**).
3. Click the **"⚡ Autofill Form"** button.
4. ChakriFill injects the scripts, fills all fields, solves the captcha, and checks the declaration checkbox — all automatically.

> The button briefly shows **"Done! ✓"** in green on success, or **"Error"** in red with a console message if something went wrong.

### Step 4 — Review and submit

Take a moment to review the filled form visually, then submit. ChakriFill never submits on your behalf.

---

## 📁 Project Structure

```
chakri-fill/
├── manifest.json           # Extension manifest (MV3)
├── form.html               # Local copy of the Teletalk NPA form (for dev/testing)
├── assets/
│   ├── icons/              # Extension icons (16, 48, 128px)
│   └── banner.png          # Project banner
│
├── background/
│   └── background.js       # Service worker — opens options page on install
│
├── popup/
│   ├── popup.html          # Extension toolbar popup UI
│   ├── popup.css           # Glassmorphic popup styles
│   └── popup.js            # Popup logic — profile status, autofill trigger
│
├── options/
│   ├── options.html        # Full settings page with tabbed form
│   ├── options.css         # Premium dark-mode UI styles
│   └── options.js          # Options controller — save/load/export/import profile
│
├── content/
│   ├── helpers.js          # DOM utilities (setValue, selectDropdownSmart, dispatchEvent…)
│   ├── matcher.js          # Form mapping engine — maps profile keys to form fields
│   └── autofill.js         # Entry point — fetches profile, calls matcher
│
└── storage/
    └── defaultProfile.js   # Default/demo profile schema reference
```

---

## 🧠 Architecture Deep Dive

ChakriFill uses a **three-layer injection architecture**, executed sequentially by `popup.js` via `chrome.scripting.executeScript`:

```
popup.js
  └─ chrome.scripting.executeScript([
        "content/helpers.js",    // Layer 1: Utility Library
        "content/matcher.js",    // Layer 2: Mapping & Orchestration Engine
        "content/autofill.js"    // Layer 3: Entry Point & Profile Fetcher
     ])
```

### Layer 1 — `helpers.js` (Utility Library)

Exposes `window.ChakriFillHelpers` with:

| Method | Purpose |
|---|---|
| `setValue(selector, value)` | Sets input/textarea value + fires `input` & `change` events |
| `selectDropdownSmart(selector, value)` | Matches `<select>` by option value *or* text content (case-insensitive) |
| `fillSelectWithOther(selectSel, otherSel, value)` | Selects "Other" and populates the companion text input when no match found |
| `setCheckbox(selector, checked)` | Clicks checkbox if state differs (triggers onclick handlers) |
| `waitForSelectOptions(selector, minOpts)` | Polls a select until it has loaded N options (async, for cascade dropdowns) |
| `dispatchEvent(element, type)` | Fires a bubbling, cancellable native DOM event |
| `wait(ms)` | Simple async delay |

### Layer 2 — `matcher.js` (Mapping Engine)

Exposes `window.ChakriFillMatcher.autofill(profile)`. This async function:

1. Fills all **9 sections** of the form in order
2. Uses `await H.wait()` between sections that have dynamic dependencies (e.g., upazila loads after district change)
3. Handles conditional logic (show/hide of NID, spouse, quota detail fields)
4. Fills **all job experience blocks** using indexed `name="job[i][field]"` selectors
5. Solves the captcha by reading the hidden `#CAPTCHA_ACTUAL` element

### Layer 3 — `autofill.js` (Entry Point)

An immediately-invoked async function that:
1. Calls `chrome.storage.local.get("profile")` to retrieve the saved profile
2. Shows an alert if no profile is found
3. Calls `ChakriFillMatcher.autofill(profile)`

---

## 🔑 Profile Schema Reference

All fields saved to `chrome.storage.local` under the key `"profile"`:

<details>
<summary><strong>Personal Information</strong></summary>

| Key | Type | Example | Description |
|---|---|---|---|
| `name` | string | `"Maruf Rahman"` | Full name in English |
| `name_bn` | string | `"মারুফ রহমান"` | Full name in Bangla |
| `father` | string | `"Anisur Rahman"` | Father's name (English) |
| `father_bn` | string | `"আনিসুর রহমান"` | Father's name (Bangla) |
| `mother` | string | `"Sufia Begum"` | Mother's name (English) |
| `mother_bn` | string | `"সুফিয়া বেগম"` | Mother's name (Bangla) |
| `dob` | string | `"1998-06-15"` | Date of birth (YYYY-MM-DD) |
| `nationality` | string | `"Bangladeshi"` | Nationality |
| `religion` | string | `"1"` | Religion code (1=Islam, 2=Hindu…) |
| `gender` | string | `"Male"` | `Male`, `Female`, or `Other` |
| `nid` | string | `"1"` | Has NID? `1`=Yes, `0`=No |
| `nid_no` | string | `"5504123456"` | National ID number |
| `breg` | string | `"0"` | Has Birth Registration? |
| `breg_no` | string | `""` | Birth registration number |
| `passport` | string | `"0"` | Has Passport? |
| `passport_no` | string | `""` | Passport number |
| `marital_status` | string | `"Single"` | `Single` or `Married` |
| `spouse_name` | string | `""` | Spouse's name (if married) |
| `mobile` | string | `"01712345678"` | Primary mobile number |
| `confirm_mobile` | string | `"01712345678"` | Confirm mobile (must match) |
| `email` | string | `"you@example.com"` | Email address |
| `quota` | string | `"8"` | Quota code (8=Not Applicable) |
| `quota_details` | string | `""` | Quota detail text (if applicable) |
| `dep_status` | string | `"5"` | Department status code |

</details>

<details>
<summary><strong>Present Address</strong></summary>

| Key | Type | Example |
|---|---|---|
| `present_careof` | string | `"Anisur Rahman"` |
| `present_village` | string | `"House 12, Road 4"` |
| `present_district` | string | `"40"` (Dhaka) |
| `present_upazila` | string | `"314"` (Gulshan) |
| `present_post` | string | `"Gulshan"` |
| `present_postcode` | string | `"1212"` |

</details>

<details>
<summary><strong>Permanent Address</strong></summary>

| Key | Type | Description |
|---|---|---|
| `same_as_present` | boolean | If `true`, copies present address |
| `permanent_careof` | string | Care-of name |
| `permanent_village` | string | Village/street address |
| `permanent_district` | string | District code |
| `permanent_upazila` | string | Upazila code |
| `permanent_post` | string | Post office name |
| `permanent_postcode` | string | 4-digit post code |

</details>

<details>
<summary><strong>Academic Qualifications (SSC, HSC, GRA, MAS)</strong></summary>

Each level (`ssc_`, `hsc_`, `gra_`, `mas_`) follows the same pattern:

| Key suffix | Example | Description |
|---|---|---|
| `_exam` | `"1"` | Exam type code |
| `_roll` | `"102938"` | Roll number |
| `_group` or `_subject` | `"Science"` | Group/subject text or code |
| `_board` | `"14"` | Board code (14=Dhaka) |
| `_result_type` | `"5"` | Result type (5=GPA/5, 4=CGPA/4) |
| `_result` | `"5.00"` | GPA/CGPA value |
| `_year` | `"2014"` | Passing year |
| `_institute` | `"168"` | Institute code (GRA/MAS only) |
| `_duration` | `"04"` | Course duration in years |

Use `if_applicable_mas: true` to enable the Masters section.

</details>

<details>
<summary><strong>Job Experience</strong></summary>

`if_applicable_exp: true` enables the section. `jobs` is an array:

```json
{
  "if_applicable_exp": true,
  "jobs": [
    {
      "employment_type": "8",
      "designation": "Software Engineer",
      "job_start_date": "2021-01-01",
      "job_end_date": "2023-12-31",
      "currently_working": false,
      "organization": "Tech Solutions Ltd",
      "office_address": "Banani, Dhaka",
      "job_description": "Developed full-stack applications..."
    }
  ]
}
```

`employment_type` codes: `1`=Regular Revenue, `7`=Autonomous/Semi-Autonomous, `8`=Private, `9`=Self-Employed.

</details>

---

## 🧪 Testing Locally

To verify the autofill engine against the reference form without installing the extension:

1. Open `form.html` in your browser (or via a local server)
2. Open **DevTools → Console** (`F12` → Console tab)
3. Copy the contents of `brain/scratch/injected_test.js` and paste into the console
4. Press **Enter** — the form will auto-populate with demo data
5. Verify each section is filled correctly

---

## 🔒 Privacy

- **All data stays local.** ChakriFill stores your profile exclusively in `chrome.storage.local` — it never leaves your device.
- **No analytics, no telemetry, no network requests** are made by this extension.
- The extension only injects scripts on-demand (when you click "Autofill"), never automatically.

---

## 🗺️ Roadmap

- [x] Glassmorphic options page with tabbed profile editor
- [x] Popup dashboard with profile status
- [x] Autofill engine with smart dropdown matching
- [x] District → Upazila cascade handling
- [x] Smart captcha bypass
- [x] JSON profile backup / import
- [ ] Firefox (Manifest V3) support
- [ ] Chrome Web Store release
- [ ] Multiple saved profiles
- [ ] Auto-detect form type and load matching template

---

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for our Git workflow, branching strategy, and commit conventions.

---

## 📜 License

This project is licensed under the **GNU General Public License v3.0**. See [LICENSE](LICENSE) for the full text.

---

<p align="center">Made with ❤️ for Bangladeshi job seekers — stop wasting time on forms.</p>
]]>
