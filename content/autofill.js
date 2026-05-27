(async () => {
  const data = await chrome.storage.local.get("profile");

  const profile = data.profile;

  if (!profile) {
    alert("Please setup your profile first.");
    return;
  }

  console.log(profile);
})();
