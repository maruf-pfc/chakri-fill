<p align="center">
  <img src="assets/banner.png" alt="ChakriFill Banner" width="100%" />
</p>

<h1 align="center">⚡ ChakriFill - Smart BD Job Application Autofill</h1>

<p align="center">
  <strong>The ultimate smart autofill extension for Bangladesh government job applications (Teletalk Recruitment Portals) and Alljobs BD.</strong>
</p>

<p align="center">
  <img alt="Release Version" src="https://img.shields.io/badge/Release-v1.1.1-10b981?style=flat-square&logo=googlechrome&logoColor=white" />
  <img alt="Manifest Version" src="https://img.shields.io/badge/Manifest-v3-06b6d4?style=flat-square" />
  <img alt="Security" src="https://img.shields.io/badge/Security-AES--256--GCM-8b5cf6?style=flat-square" />
  <img alt="License" src="https://img.shields.io/badge/License-GPLv3-f59e0b?style=flat-square" />
</p>

---

## ✨ Features at a Glance

ChakriFill is built to save you time and protect your privacy. Here is what makes it unique:

### 🔒 Bank-Grade Security
* **On-Disk AES-256 Encryption:** All your sensitive details (NID, contact numbers, academic info) are encrypted locally using **AES-GCM (256-bit)** before being written to disk.
* **100% Local Storage:** The extension has **no backend servers** and makes **no remote web requests**. Your personal data never leaves your computer.
* **Restricted Permission Scope:** In compliance with least-privilege standards, host permissions are locked strictly to official Teletalk portals (`*://*.teletalk.com.bd/*`).

### ⚡ Smart Form Matching
* **One-Click Autofill:** Click a single button in your toolbar to populate all personal, academic, address, and experience fields in seconds.
* **Dynamic Geography Cascading:** Automatically selects your District, waits for the system to load Upazilas, and then selects the correct Upazila.
* **Smart Dropdown Fallbacks:** Intelligent board and institute matching. If a university or board isn't in the standard list, it automatically selects "Other" and types your custom entry into the companion text input.
* **Validation Event-Safe:** Dispatches native browser events (`input`, `change`, `keyup`) so the target form validation registers the inputs correctly.
* **No Auto-Submit:** You are always in full control. The extension fills the fields but leaves the final submission to you.

### 📂 Profile Management & Backup
* **Multiple Profiles:** Set up separate profiles (e.g., one for General jobs, one for Technical jobs) and switch between them instantly.
* **JSON & YAML Support:** Export your configurations or drag-and-drop a `.json` or `.yaml` file to load/sync your profile instantly.
* **Glassmorphic UI:** A beautiful, responsive dark-themed dashboard built to manage your profiles with ease.

---

## 🚀 Easy Installation Guide

### Step 1 — Download the Extension
1. Go to the top of this GitHub repository page.
2. Click the green **`<> Code`** button and select **Download ZIP**.
3. Extract the ZIP file anywhere on your computer (e.g., in your `Documents` folder).

### Step 2 — Load Into Your Browser

#### For Google Chrome / Brave / Edge / Opera:
1. Open a new tab and go to: `chrome://extensions` (or `brave://extensions`).
2. In the top-right corner, toggle the **"Developer mode"** switch **ON**.
3. Click the **"Load unpacked"** button in the top-left corner.
4. Select the extracted extension folder (the directory containing `manifest.json`).

#### For Mozilla Firefox:
1. Open a new tab and go to: `about:debugging`.
2. Click **"This Firefox"** in the left sidebar.
3. Click the **"Load Temporary Add-on..."** button.
4. Select the **`manifest.json`** or **`manifest.firefox.json`** file from the extracted folder.

### Step 3 — Pin it to Your Toolbar
Click the puzzle-piece icon (🧩) next to your browser's address bar and **pin 📌 ChakriFill** for quick access.

---

## 🛠 How to Use

### 1. Set Up Your Profile (One-Time)
* Click the **ChakriFill toolbar icon** and select **⚙️ Profile Manager**.
* Fill in your Personal Info, Present/Permanent Addresses, Education, and Work History.
* Click **💾 Save Profile** at the bottom of the page.
* *Tip: Click "Load Demo Profile" to see a fully populated sample configuration!*

### 2. Autofill the Application Form
* Open the official Teletalk recruitment application form page (URL typically starts with `https://*.teletalk.com.bd/`).
* Wait for the form to fully load.
* Click the **ChakriFill toolbar icon** and click **⚡ Autofill Form**.
* Watch the extension securely decrypt your data and fill the form fields in real-time.
* Double-check your details, solve the captcha manually, and submit!

---

## 🧠 Architecture Deep Dive

ChakriFill utilizes a secure, **four-layer script injection architecture** executed sequentially upon clicking the autofill button:

```
popup.js
  └─ chrome.scripting.executeScript([
        "content/security.js",   // Layer 1: Decryption Hook
        "content/helpers.js",    // Layer 2: DOM Utility Library
        "content/matcher.js",    // Layer 3: Mapping & Orchestration Engine
        "content/autofill.js"    // Layer 4: Entry Point
     ])
```

1. **`security.js`**: Generates a local random key on installation and decrypts the encrypted profile string retrieved from storage.
2. **`helpers.js`**: Exposes helper functions to set values, trigger native events, handle dropdown selections, and wait for async cascades.
3. **`matcher.js`**: Contains the mapping rules that connect your saved profile fields to the input elements of the Teletalk recruitment form.
4. **`autofill.js`**: The main controller script that coordinates the decryption and populates the tab DOM safely.

---

## 📜 License & Disclaimer
This project is licensed under the **GNU General Public License v3.0**. 

*Disclaimer: ChakriFill is an independent open-source tool and is not affiliated with Teletalk Bangladesh Ltd. or any government recruitment portal.*
