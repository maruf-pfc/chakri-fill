<p align="center">
  <img src="assets/banner.png" alt="ChakriFill Banner" width="100%" />
</p>

<h1 align="center">ChakriFill — Bangladesh Job Application Autofill Chrome Extension</h1>

<p align="center">
  <strong>The ultimate smart autofill extension for Bangladesh government job applications (Teletalk Recruitment Portals) and Alljobs BD.</strong>
</p>

<p align="center">
  <img alt="Manifest Version" src="https://img.shields.io/badge/Manifest-v3-10b981?style=flat-square&logo=googlechrome&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/License-GPLv3-06b6d4?style=flat-square" />
  <img alt="Platform" src="https://img.shields.io/badge/Platform-Chromium-8b5cf6?style=flat-square&logo=googlechrome&logoColor=white" />
  <img alt="Status" src="https://img.shields.io/badge/Status-Developer%20Preview-f59e0b?style=flat-square" />
  <img alt="Not on Web Store" src="https://img.shields.io/badge/Web%20Store-Not%20Published-ef4444?style=flat-square&logo=googlechrome&logoColor=white" />
</p>

## ✨ What is ChakriFill?

ChakriFill is a modern, high-performance **Chromium browser extension** designed to automatically fill Bangladesh government job application forms hosted on the **Teletalk** web recruitment systems (such as `*.teletalk.com.bd` and `alljobs.teletalk.com.bd`).

Instead of tediously re-entering your name, address, educational qualifications, and job experience every time you apply for a new post, you save your profile **once** and ChakriFill populates the entire form in seconds.

### 🎯 Key Features

| Feature | Description |
|---|---|
| **One-Click Autofill** | Fills all personal, address, education, and experience sections instantly |
| **Smart Dropdown Matching** | Matches values by code *or* display text, with "Other" fallback |
| **District → Upazila Cascade** | Waits for upazila options to load after district is selected |
| **Event-Safe Injection** | Dispatches native `input`, `change`, `keyup` events — invisible to form validators |
| **Smart Captcha Bypass** | Reads the hidden `CAPTCHA_ACTUAL` field and fills the input automatically |
| **JSON & YAML Profiles** | Export, import, and download backups as both JSON and YAML |
| **Drag & Drop Upload** | Drag and drop .json, .yaml, or .yml files to load profile data instantly |
| **Glassmorphic UI** | A beautiful settings page with tabbed layout and neon-emerald accents |


---

## 🚀 Installation & Build

> **⚠️ Not on the browser web stores yet.**  
> ChakriFill is in developer preview. You can load the raw folder manually or build optimized release packages for Chrome/Firefox.

### Requirements

- **Chromium Browsers:** Google Chrome, Brave, Microsoft Edge, Opera, etc.
- **Gecko Browsers:** Mozilla Firefox (Manifest V3 supported)
- **Node.js (Optional):** Version 12+ (for building release packages)
- The extension source code (download or clone — see Step 1)

---

### Step-by-Step Installation

#### Step 1 — Get the source code

**Option A — Download ZIP** _(easiest, no Git needed)_

1. Go to **https://github.com/maruf-pfc/chakri-fill**
2. Click the green **`<> Code`** button → **Download ZIP**
3. Extract the ZIP anywhere on your computer (e.g. `Downloads/chakri-fill-main/`)

**Option B — Clone with Git**

```bash
git clone https://github.com/maruf-pfc/chakri-fill.git
```

---

#### Step 2 — Open Chrome Extensions

Type the following in your browser address bar and press Enter:

```
chrome://extensions
```

> For **Brave**: `brave://extensions` &nbsp;|&nbsp; For **Edge**: `edge://extensions`

---

#### Step 3 — Enable Developer Mode

In the top-right corner of the Extensions page, toggle the **"Developer mode"** switch **ON**.

Three new buttons will appear: *Load unpacked*, *Pack extension*, *Update*.

---

#### Step 4 — Load the extension

##### For Chrome / Chromium:
1. Click **"Load unpacked"**.
2. Select the repository root folder (which directly contains `manifest.json`).

##### For Firefox:
1. Open a new tab, type **`about:debugging`** in the address bar, and press Enter.
2. Click **"This Firefox"** in the left sidebar.
3. Click **"Load Temporary Add-on..."**.
4. Select the **`manifest.json`** or **`manifest.firefox.json`** from the project directory.

---

#### Step 5 — Pin it to your toolbar _(recommended)_

1. Click the **puzzle-piece 🧩 icon** in the browser toolbar (or the extensions menu).
2. Find **ChakriFill** in the list.
3. Click the **pin 📌 icon** (or toggle visibility) next to it.

The ChakriFill icon will now be permanently visible in your toolbar.

---

### 📦 Building Release Packages

To build production-ready packages for Chrome and Firefox (specifically managing Manifest V3 platform differences):

1. Run the build script in the project directory:
   ```bash
   npm run build
   # Or directly:
   node scripts/build.js
   ```
2. The built folders and ready-to-upload zip archives will be saved in the **`dist/`** directory:
   - `dist/chrome/` & `dist/chakri-fill-chrome.zip` (For Chrome Web Store)
   - `dist/firefox/` & `dist/chakri-fill-firefox.zip` (For Firefox AMO)

---

## 🛠 How to Use

> **First time?** You must complete Step 1 (profile setup) before autofill will work.
> You only need to do this once — your profile is saved permanently.

---

### Step 1 — Set up your profile (one time only)

1. Click the **ChakriFill icon** in your browser toolbar
2. The popup opens — click the **⚙️ Settings** button
3. The **Options page** opens in a new tab with these sections:

| Tab | What to fill in |
|---|---|
| **Personal Info** | Full name (English + Bangla), father/mother, DOB, NID, gender, religion, marital status, mobile, email, quota |
| **Address** | Present address with district + upazila, permanent address (or tick "Same as Present") |
| **Education** | SSC, HSC, Graduation details — exam type, board, group, result, year |
| **Experience** | Job history — employment type, designation, dates, organization, description |
| **Backup** | Drag-and-drop or upload JSON/YAML profile files, edit live with raw code editors, and export/download configurations |

4. Click **"💾 Save Profile"** at the bottom of the page
5. A green toast confirms your profile is saved

> **💡 Tip:** Click **"Load Demo Profile"** to instantly fill the form with sample data and
> explore how a complete profile looks before entering your own details.

---

### Step 2 — Open the Teletalk application form

Navigate to the job application form. The URL looks like:

```
https://recruitment.teletalk.com.bd/job/apply/...
```

Make sure the form is **fully loaded** before triggering autofill.

---

### Step 3 — Click Autofill

1. Click the **ChakriFill icon** in the toolbar — the popup opens
2. You'll see your profile summary and a green **"Ready"** badge
3. Click **"⚡ Autofill Form"**
4. ChakriFill automatically:
   - Fills all personal, address, and qualification fields
   - Handles district → upazila cascading dropdowns
   - Fills all job experience blocks
   - Reads the hidden captcha value and fills the captcha field
   - Ticks the declaration checkbox

The button turns **green with "Done! ✓"** when finished, or **red with "Error"** if something failed (check DevTools Console for details).

---

### Step 4 — Review and submit

Scroll through the form to verify the filled values, then submit normally.

> **ChakriFill never auto-submits.** You are always in control of the final submission.

---

### Troubleshooting

| Problem | Fix |
|---|---|
| Popup shows **"Empty"** badge | Go to Settings and save your profile first |
| Button shows **"Error"** | Ensure you are on the actual Teletalk form page, not a different site |
| Upazila not filled | The form's upazila list may take a moment — try clicking Autofill again |
| Fields greyed out after fill | The form locked them (SSC/HSC verified mode) — this is expected |
| Extension disappeared | Chrome may have disabled it after restart — go to `chrome://extensions` and re-enable |

---

## 📁 Project Structure

```
chakri-fill/
├── manifest.json           # Extension manifest (MV3) with toolbar icons declared
├── form.html               # Local copy of the Teletalk NPA form (for dev/testing)
├── profile_template.yaml   # Sanitized YAML configuration template
├── package.json            # Project specifications & test scripts
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
    └── defaultProfile.js   # Default/demo profile schema reference (fully text-based)
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
| `name` | string | `"Rahim Uddin"` | Full name in English |
| `name_bn` | string | `"রহিম উদ্দিন"` | Full name in Bangla |
| `father` | string | `"Anisur Rahman"` | Father's name (English) |
| `father_bn` | string | `"আনিসুর রহমান"` | Father's name (Bangla) |
| `mother` | string | `"Sufia Begum"` | Mother's name (English) |
| `mother_bn` | string | `"সুফিয়া বেগম"` | Mother's name (Bangla) |
| `dob` | string | `"1998-06-15"` | Date of birth (YYYY-MM-DD) |
| `nationality` | string | `"Bangladeshi"` | Nationality |
| `religion` | string | `"Islam"` | Religion name (matched by text) |
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
| `email` | string | `"rahim.uddin@example.com"` | Email address |
| `quota` | string | `"8"` | Quota code (8=Not Applicable) |
| `quota_details` | string | `""` | Quota detail text (if applicable) |
| `dep_status` | string | `"5"` | Department status code |

</details>

<details>
<summary><strong>Present Address</strong></summary>

| Key | Type | Example | Description |
|---|---|---|---|
| `present_careof` | string | `"Anisur Rahman"` | Care-of name |
| `present_village` | string | `"House 12, Road 4"` | Village/street address |
| `present_district` | string | `"Dhaka"` | District name (smart matched) |
| `present_upazila` | string | `"Gulshan"` | Upazila name (smart matched) |
| `present_post` | string | `"Gulshan"` | Post office |
| `present_postcode` | string | `"1212"` | Post code |

</details>

<details>
<summary><strong>Permanent Address</strong></summary>

| Key | Type | Description |
|---|---|---|
| `same_as_present` | boolean | If `true`, copies present address |
| `permanent_careof` | string | Care-of name |
| `permanent_village` | string | Village/street address |
| `permanent_district` | string | District name (smart matched) |
| `permanent_upazila` | string | Upazila name (smart matched) |
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
| `_board` | `"Dhaka"` | Board name (smart matched) |
| `_result_type` | `"5"` | Result type (5=GPA/5, 4=CGPA/4) |
| `_result` | `"5.00"` | GPA/CGPA value |
| `_year` | `"2014"` | Passing year |
| `_institute` | `"Dhaka University"` | Institute name (smart matched, GRA/MAS only) |
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

### 1. Automated Unit Tests

ChakriFill includes a built-in unit test suite to verify profile schema parsing, YAML-to-JSON translation, smart selection matching, and upazila/district translation mapping.

You can run the tests using Node.js directly from your terminal:

```bash
node tests/run.js
```

Or using npm:

```bash
npm test
```

### 2. Manual Form Testing

You can test the autofill engine directly against the bundled `form.html` file **without** installing the extension:


**1. Open the form**

Open `form.html` from the repo root in your browser. You can simply double-click the file, or serve it:

```bash
# Option A: Direct file open (simplest)
xdg-open form.html        # Linux
open form.html            # macOS
# Or drag-and-drop the file into a Chrome tab

# Option B: Local server (avoids some browser file restrictions)
npx serve .
# Then visit http://localhost:3000/form.html
```

**2. Open DevTools Console**

Press `F12` → click the **Console** tab.

**3. Paste the test script**

Copy and paste the following snippet into the console and press **Enter**:

```js
// Quick smoke test — fills form with demo data
window.__cfTest = true;
const s = document.createElement('script');
s.textContent = `
  window.ChakriFillHelpers = {
    wait: ms => new Promise(r => setTimeout(r, ms)),
    dispatchEvent: (el, t) => el && el.dispatchEvent(new Event(t, {bubbles:true})),
    setValue: (sel, val) => {
      const el = typeof sel === 'string' ? document.querySelector(sel) : sel;
      if (el) { el.value = val ?? ''; ['input','change'].forEach(t => el.dispatchEvent(new Event(t,{bubbles:true}))); }
    },
    setCheckbox: (sel, on) => { const el = document.querySelector(sel); if (el && el.checked !== !!on) el.click(); },
    selectDropdownSmart: (sel, val) => {
      const el = typeof sel === 'string' ? document.querySelector(sel) : sel;
      if (!el || val == null) return false;
      const v = String(val).toLowerCase();
      for (const o of el.options) if (o.value.toLowerCase() === v || o.text.toLowerCase().includes(v)) { el.value = o.value; el.dispatchEvent(new Event('change',{bubbles:true})); return true; }
      return false;
    },
    waitForSelectOptions: async (sel, n=2, max=1500) => {
      const el = document.querySelector(sel); if (!el) return;
      const t = Date.now(); while (el.options.length < n && Date.now()-t < max) await new Promise(r=>setTimeout(r,50));
    },
    fillSelectWithOther: (sel, other, val) => {
      const H = window.ChakriFillHelpers;
      if (!H.selectDropdownSmart(sel, val) && val) {
        const el = document.querySelector(sel);
        for (const o of (el?.options ?? [])) if (o.value==='99'||o.value==='999'||o.text.toLowerCase().includes('other')) { el.value=o.value; el.dispatchEvent(new Event('change',{bubbles:true})); break; }
        const oi = document.querySelector(other); if (oi) H.setValue(oi, val);
      }
    }
  };
`;
document.head.appendChild(s);
console.log('Helpers loaded. Now paste and run the matcher script.');
```

Then load and run `content/matcher.js` followed by `content/autofill.js` in the same console, or simply install the extension and use the popup button — that is the easiest verification path.

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
- [x] Firefox (Manifest V3) support
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
