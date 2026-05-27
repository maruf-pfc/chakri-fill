const form = document.getElementById("profileForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const profile = {
    name: document.getElementById("name").value,
    fatherName: document.getElementById("fatherName").value,
    motherName: document.getElementById("motherName").value,
    email: document.getElementById("email").value,
    mobile: document.getElementById("mobile").value,
    dob: document.getElementById("dob").value,
  };

  await chrome.storage.local.set({
    profile,
  });

  alert("Profile Saved!");
});

window.addEventListener("DOMContentLoaded", async () => {
  const data = await chrome.storage.local.get("profile");

  if (!data.profile) return;

  document.getElementById("name").value = data.profile.name || "";

  document.getElementById("fatherName").value = data.profile.fatherName || "";

  document.getElementById("motherName").value = data.profile.motherName || "";

  document.getElementById("email").value = data.profile.email || "";

  document.getElementById("mobile").value = data.profile.mobile || "";

  document.getElementById("dob").value = data.profile.dob || "";
});
