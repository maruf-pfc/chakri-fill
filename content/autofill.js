/**
 * ChakriFill - Content Script Entry Point
 * Fetches the saved profile from storage and initiates form population via the Matcher engine.
 */

(async () => {
  console.log("ChakriFill: Starting Autofill Injection...");
  
  if (typeof chrome === "undefined" || !chrome.storage) {
    console.error("ChakriFill: Chrome Extension Storage API is not accessible in this context.");
    return;
  }
  
  try {
    const data = await chrome.storage.local.get("profile");
    let profile = data.profile;

    if (profile && window.ChakriFillSecurity) {
      const key = await window.ChakriFillSecurity.getOrCreateKey();
      profile = await window.ChakriFillSecurity.decryptSingleProfile(profile, key);
    }

    if (!profile || Object.keys(profile).length === 0) {
      alert("Please setup your ChakriFill profile first in the extension options page.");
      return;
    }

    if (window.ChakriFillMatcher) {
      await window.ChakriFillMatcher.autofill(profile);
    } else {
      console.error("ChakriFill: Matcher engine was not loaded properly.");
    }
  } catch (error) {
    console.error("ChakriFill: Autofill engine error:", error);
    alert("ChakriFill Autofill failed: " + error.message);
  }
})();
