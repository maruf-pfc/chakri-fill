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

  // In js-yaml browser minified build, it exports to window.jsyaml or self.jsyaml or global
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

// 3. Test Smart Selection Matching Logic (matching selector rules from content scripts)
function selectDropdownSmartMock(options, value) {
  if (!options || value === undefined || value === null) return null;
  const stringVal = String(value).trim().toLowerCase();
  
  // Exact Match on Option Value
  for (let option of options) {
    if (option.value.trim().toLowerCase() === stringVal) {
      return option.value;
    }
  }
  
  // Exact or Partial Match on Option Text
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

console.log(`\n${YELLOW}=========================================${RESET}`);
console.log(`${passed + failed} Tests Run: ${GREEN}${passed} Passed${RESET}, ${RED}${failed} Failed${RESET}`);
console.log(`${YELLOW}=========================================${RESET}`);

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
