# 🚀 ChakriFill Store Publishing Guide

This guide details the step-by-step process to package, submit, and publish **ChakriFill** on the **Chrome Web Store** and **Firefox Add-ons (AMO)**.

---

## 📦 Step 1: Generate Release Packages

Before submitting, generate the optimized production builds. These builds are automatically stripped of development-only directories (such as tests, raw templates, and Git configurations).

1. Execute the build runner:
   ```bash
   node scripts/build.js
   ```
2. Verify the output files in the `dist/` directory:
   - `dist/chakri-fill-chrome.zip` (For Chrome Web Store)
   - `dist/chakri-fill-firefox.zip` (For Firefox AMO)

---

## 🌐 Step 2: Chrome Web Store Submission

### 1. Developer Account Setup
1. Go to the [Chrome Web Store Developer Console](https://chrome.google.com/webstore/devconsole).
2. Sign in with a Google account.
3. Pay the one-time developer registration fee ($5 USD) if you haven't already.

### 2. Upload the Package
1. Click **Add new item** in the top right.
2. Drag and drop `dist/chakri-fill-chrome.zip`.
3. The console will read the `manifest.json` and create the draft item.

### 3. Store Listing Assets
Prepare the following branding assets:
- **Icon:** A `128x128` PNG icon (already bundled in `assets/icons/icon128.png`).
- **Screenshots:** At least 1 (maximum 5) showcasing the Options page and the Toolbar popup.
  - *Dimensions:* `1280x800` or `640x400` pixels.
- **Promotional Tiles (Optional but recommended):**
  - Small Tile: `440x280` pixels.
  - Large Tile: `920x680` pixels.
  - Marquee Tile: `1400x560` pixels.

### 4. Listing Metadata
- **Product Title:** `ChakriFill - Smart BD Job Autofill`
- **Summary Description:** `Smart job application autofill extension for Bangladesh (Teletalk, Alljobs, etc.). Save profiles in YAML/JSON and auto-fill forms with one click.`
- **Category:** `Productivity` or `Developer Tools`
- **Language:** `English` (Primary)

### 5. Privacy & Permissions
- **Single-Purpose Description:** Explain that the extension fills form fields on recruitment pages on user request.
- **Permission Justification:**
  - `storage`: Required to save the user profile configuration locally on the device.
  - `activeTab` & `scripting`: Required to inject matching scripts into the active page ONLY when the user clicks the "Autofill" button.
- **Data Usage:** Check the box stating that all data remains local and is not sent to external servers.

---

## 🦊 Step 3: Firefox Add-ons (AMO) Submission

### 1. Developer Account Setup
1. Go to the [Firefox Add-on Developer Hub](https://addons.mozilla.org/developers/).
2. Sign in with a Firefox Account (Firefox Account registration is free).

### 2. Upload the Package
1. Click **Submit a New Add-on**.
2. Select **On your own** (if self-distributing) or **On this site** (highly recommended, lists it in the public Firefox Add-ons directory).
3. Upload the `dist/chakri-fill-firefox.zip` package.
4. The system validates the `manifest.json` for compatibility.

### 3. Store Listing Details
- Add the title, description, category, and screenshots (same assets prepared for Chrome can be reused).
- Select tags: `BD Jobs`, `Autofill`, `Teletalk`.

---

## 🛡️ Review & Approval Checklist

- [x] **No Remote Scripts:** Standard MV3 compliance. All parsing is done locally by `options/js-yaml.min.js`.
- [x] **No PII Leaks:** Source code and default profile templates are audited and contain only mock values.
- [x] **On-Demand Injection:** Scripts are injected dynamically on button-click via `chrome.scripting`, avoiding passive content injection.
