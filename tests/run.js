const fs = require('fs');
const path = require('path');

// Colors for terminal output
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

console.log(`${YELLOW}=========================================${RESET}`);
console.log(`${YELLOW}Running ChakriFill Unit Test Suite...${RESET}`);
console.log(`${YELLOW}=========================================${RESET}\n`);

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`${GREEN}✔ PASS:${RESET} ${message}`);
  } else {
    failed++;
    console.error(`${RED}✘ FAIL:${RESET} ${message}`);
  }
}

// 1. Load js-yaml library in Node.js mock context
let jsyaml;
try {
  const jsYamlContent = fs.readFileSync(path.join(__dirname, '../options/js-yaml.min.js'), 'utf8');
  const vm = require('vm');
  const context = { window: {}, console };
  vm.createContext(context);
  vm.runInContext(jsYamlContent, context);

  jsyaml = context.jsyaml || context.window.jsyaml;
  assert(!!jsyaml, "js-yaml library loaded successfully");
} catch (e) {
  assert(false, "Could not load js-yaml library: " + e.message);
}

// 2. Test Parsing the profile template yaml
if (jsyaml) {
  try {
    const yamlPath = path.join(__dirname, '../profile_template.yaml');
    const yamlContent = fs.readFileSync(yamlPath, 'utf8');
    assert(!!yamlContent, "Read profile_template.yaml content successfully");

    const profile = jsyaml.load(yamlContent);
    assert(!!profile, "Parsed YAML successfully");
    
    assert(profile.name === "Rahim Uddin", "Applicant Name matches exactly");
    assert(profile.name_bn === "রহিম উদ্দিন", "Applicant Bangla Name matches exactly");
    assert(profile.father === "Anisur Rahman", "Father's Name matches exactly");
    assert(profile.dob === "1998-06-15", "Date of birth matches exactly");
    assert(profile.nid_no === "5504123456", "National ID matches exactly");
    assert(profile.email === "rahim.uddin@example.com", "Email matches exactly");
    assert(profile.mobile === "01712345678", "Mobile number matches exactly");
    
    assert(profile.present_district === "Dhaka", "Present district matches exactly");
    assert(profile.present_village === "House 12, Road 4, Sector 3", "Present address matches exactly");
    assert(profile.permanent_district === "Dhaka", "Permanent district matches exactly");
    assert(profile.permanent_village === "House 12, Road 4, Sector 3", "Permanent address matches exactly");
    
    assert(profile.ssc_roll === "102938", "SSC roll matches exactly");
    assert(profile.hsc_result === "4.80", "HSC result matches exactly");
    assert(profile.gra_subject === "Computer Science & Engineering", "Graduation subject matches exactly");
    assert(profile.gra_result === "3.75", "Graduation result matches exactly");
  } catch (e) {
    assert(false, "YAML parsing threw an error: " + e.message);
  }
}

// 3. Test Smart Selection Matching Logic
function selectDropdownSmartMock(options, value) {
  if (!options || value === undefined || value === null) return null;
  const stringVal = String(value).trim().toLowerCase();
  
  for (let option of options) {
    if (option.value.trim().toLowerCase() === stringVal) {
      return option.value;
    }
  }
  
  for (let option of options) {
    const text = option.text.trim().toLowerCase();
    if (text === stringVal || text.includes(stringVal) || stringVal.includes(text)) {
      return option.value;
    }
  }
  return null;
}

const mockReligionOptions = [
  { value: "1", text: "Islam" },
  { value: "2", text: "Hinduism" },
  { value: "3", text: "Buddhism" },
  { value: "4", text: "Christianity" }
];

assert(selectDropdownSmartMock(mockReligionOptions, "1") === "1", "Religion select: matches exact value '1'");
assert(selectDropdownSmartMock(mockReligionOptions, "Islam") === "1", "Religion select: matches exact text 'Islam'");
assert(selectDropdownSmartMock(mockReligionOptions, "islam") === "1", "Religion select: matches case-insensitive text 'islam'");
assert(selectDropdownSmartMock(mockReligionOptions, "Hindu") === "2", "Religion select: matches partial text 'Hindu'");

// 4. Test District to Code translation helper logic
const DISTRICT_TO_CODE = {
  "dhaka": "40",
  "jashore": "23",
  "chattogram": "60",
  "cumilla": "55"
};

function translateCodeToNameMock(fieldId, value) {
  if (!value) return "";
  const stringVal = String(value).trim().toLowerCase();

  if (fieldId.endsWith("district")) {
    for (const [name, code] of Object.entries(DISTRICT_TO_CODE)) {
      if (code === stringVal || name === stringVal) {
        return name.charAt(0).toUpperCase() + name.slice(1);
      }
    }
  }
  return value;
}

assert(translateCodeToNameMock("present_district", "40") === "Dhaka", "Translate district code '40' to 'Dhaka'");
assert(translateCodeToNameMock("permanent_district", "55") === "Cumilla", "Translate district code '55' to 'Cumilla'");
assert(translateCodeToNameMock("present_district", "dhaka") === "Dhaka", "Translate district name 'dhaka' to 'Dhaka'");
assert(translateCodeToNameMock("present_district", "unknown") === "unknown", "Translate unknown district as-is");

// 5. Test ChakriFillSecurity encryption and decryption
(async () => {
  try {
    const securityJsContent = fs.readFileSync(path.join(__dirname, '../content/security.js'), 'utf8');
    const vm = require('vm');
    
    const nodeCrypto = require('crypto');
    
    // Simple localStorage mock
    const mockLocalStorage = {
      _store: {},
      getItem(key) { return this._store[key] || null; },
      setItem(key, val) { this._store[key] = String(val); }
    };

    // Polyfill WebCrypto AES-GCM for Node.js v12 compatibility
    const mockCrypto = {
      getRandomValues(typedArray) {
        const bytes = nodeCrypto.randomBytes(typedArray.byteLength);
        typedArray.set(bytes);
        return typedArray;
      },
      subtle: {
        async importKey(format, keyData, algorithm, extractable, keyUsages) {
          return keyData;
        },
        async encrypt(algorithm, key, data) {
          const iv = algorithm.iv;
          const cipher = nodeCrypto.createCipheriv('aes-256-gcm', key, iv);
          const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
          const tag = cipher.getAuthTag();
          return new Uint8Array(Buffer.concat([encrypted, tag]));
        },
        async decrypt(algorithm, key, data) {
          const iv = algorithm.iv;
          const tagLength = 16;
          const ciphertext = data.slice(0, data.length - tagLength);
          const tag = data.slice(data.length - tagLength);
          const decipher = nodeCrypto.createDecipheriv('aes-256-gcm', key, iv);
          decipher.setAuthTag(tag);
          const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
          return new Uint8Array(decrypted);
        }
      }
    };

    const context = { 
      window: {}, 
      console,
      crypto: mockCrypto,
      localStorage: mockLocalStorage,
      Uint8Array,
      String,
      atob: str => Buffer.from(str, 'base64').toString('binary'),
      btoa: str => Buffer.from(str, 'binary').toString('base64'),
      TextEncoder: require('util').TextEncoder,
      TextDecoder: require('util').TextDecoder
    };
    context.window.crypto = mockCrypto;
    
    vm.createContext(context);
    vm.runInContext(securityJsContent, context);

    const security = context.window.ChakriFillSecurity;
    assert(!!security, "ChakriFillSecurity library loaded successfully in Node test context");

    const key = await security.getOrCreateKey();
    assert(!!key && key.length === 64, "Key generation returns a valid 64-character hex key");

    const testProfile = { name: "Rahim Uddin", age: 28, skills: ["JS", "CSS"] };
    const encrypted = await security.encryptSingleProfile(testProfile, key);
    assert(typeof encrypted === "string" && encrypted.length > 0, "Profile encrypted to a base64 string");

    const decrypted = await security.decryptSingleProfile(encrypted, key);
    assert(decrypted.name === testProfile.name, "Decrypted profile name matches exactly");
    assert(decrypted.age === testProfile.age, "Decrypted profile age matches exactly");
    assert(JSON.stringify(decrypted.skills) === JSON.stringify(testProfile.skills), "Decrypted nested skills array matches exactly");

    // Test multiple profiles collection
    const testProfiles = {
      "Default": { name: "Default User" },
      "Developer": { name: "Dev User" }
    };
    const encryptedProfiles = await security.encryptProfiles(testProfiles, key);
    const decryptedProfiles = await security.decryptProfiles(encryptedProfiles, key);
    assert(decryptedProfiles.Default.name === "Default User", "Decrypted profiles 'Default' name matches");
    assert(decryptedProfiles.Developer.name === "Dev User", "Decrypted profiles 'Developer' name matches");

    // Verify that unencrypted legacy data is passed-through safely
    const legacyData = { "Default": { name: "Legacy User" } };
    const passThrough = await security.decryptProfiles(legacyData, key);
    assert(passThrough.Default.name === "Legacy User", "Legacy (unencrypted) profiles passed through cleanly");

    // Final Reporting
    console.log(`\n${YELLOW}=========================================${RESET}`);
    console.log(`${passed + failed} Tests Run: ${GREEN}${passed} Passed${RESET}, ${RED}${failed} Failed${RESET}`);
    console.log(`${YELLOW}=========================================${RESET}`);

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error("Async security tests threw error:", err);
    process.exit(1);
  }
})();
