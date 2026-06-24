# Privacy Policy for ChakriFill

**Last Updated: June 25, 2026**

ChakriFill ("we," "our," or "the extension") is a browser extension designed to help job applicants in Bangladesh quickly and safely autofill recruitment forms on official job portals (specifically Teletalk portals). 

Your privacy and security are our highest priorities. This Privacy Policy details how we handle user data.

---

### 1. Data Collection and Transmission
* **Zero Data Collection:** ChakriFill does **not** collect, store, track, or monitor any of your personal details.
* **No Remote Servers:** The extension has **no backend servers** and makes **no remote network calls**. Your information never leaves your personal device.
* **No Analytics/Tracking:** There are no trackers, telemetry, or analytics scripts embedded in the extension.

### 2. Local Storage & Encryption
* **100% Local Storage:** Any profile data you input into the Profile Manager (such as name, contact details, and academic history) is stored exclusively on your own computer.
* **On-Disk Encryption:** All profile templates are encrypted on your local drive using industry-standard client-side **AES-256 (AES-GCM)** encryption.
* **Local Crypto Key:** The encryption key is randomly generated locally on your first installation and is securely kept within your browser's protected local storage.

### 3. Chrome / Firefox Permissions
ChakriFill requests only the minimum required permissions to function under the "Least Privilege" principle:
* `storage`: Required to save your encrypted profile templates locally.
* `activeTab` & `scripting`: Allows the extension to safely inject the autofill script into the currently active tab **only** when you click the "Autofill Job Form" button.
* `host_permissions` (`*://*.teletalk.com.bd/*`): Restricts the extension's execution strictly to official Teletalk job application domains.

### 4. Code Security & Safety
* **No Third-Party Analytics Code:** The extension only uses the native Web Crypto API built into modern web browsers for encryption, eliminating risks of third-party dependency vulnerabilities.
* **Open Source:** The code for this extension is transparent and auditable.

---

### Contact & Support
If you have any questions or feedback regarding the security of the extension, please open an issue on the GitHub repository:  
[https://github.com/maruf-pfc/chakri-fill](https://github.com/maruf-pfc/chakri-fill)
