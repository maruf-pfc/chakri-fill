const DEFAULT_PROFILE = {
  // Basic Information
  name: "Rahim Uddin",
  name_bn: "রহিম উদ্দিন",
  father: "Anisur Rahman",
  father_bn: "আনিসুর রহমান",
  mother: "Sufia Begum",
  mother_bn: "সুফিয়া বেগম",
  dob: "1998-06-15",
  nationality: "Bangladeshi",
  religion: "Islam", // Smart matched by text
  gender: "Male",
  nid: "1", // Yes
  nid_no: "5504123456",
  breg: "0", // No
  breg_no: "",
  passport: "0", // No
  passport_no: "",
  marital_status: "Single",
  spouse_name: "",
  mobile: "01712345678",
  confirm_mobile: "01712345678",
  email: "rahim.uddin@example.com",
  quota: "8", // 8: Not Applicable
  quota_details: "",
  dep_status: "5", // 5: Not Applicable

  // Present Address
  present_careof: "Anisur Rahman",
  present_village: "House 12, Road 4, Sector 3",
  present_district: "Dhaka", // Text-based
  present_upazila: "Gulshan", // Text-based
  present_post: "Gulshan",
  present_postcode: "1212",

  // Permanent Address
  same_as_present: true,
  permanent_careof: "Anisur Rahman",
  permanent_village: "House 12, Road 4, Sector 3",
  permanent_district: "Dhaka",
  permanent_upazila: "Gulshan",
  permanent_post: "Gulshan",
  permanent_postcode: "1212",

  // Academic Qualifications
  ssc_exam: "1", // S.S.C
  ssc_roll: "102938",
  ssc_group: "Science", // Group/Subject
  ssc_board: "Dhaka", // Text-based
  ssc_result_type: "5", // GPA(out of 5)
  ssc_result: "5.00",
  ssc_year: "2014",

  hsc_exam: "1", // H.S.C
  hsc_roll: "654321",
  hsc_group: "Science",
  hsc_board: "Dhaka", // Text-based
  hsc_result_type: "5", // GPA(out of 5)
  hsc_result: "4.80",
  hsc_year: "2016",

  gra_exam: "1", // B.Sc Engineering
  gra_institute: "Dhaka University", // Text-based
  gra_year: "2020",
  gra_subject: "Computer Science & Engineering", // Matching value
  gra_result_type: "4", // CGPA(out of 4)
  gra_result: "3.75",
  gra_duration: "04", // 04 Years

  if_applicable_mas: false,
  mas_exam: "",
  mas_institute: "",
  mas_year: "",
  mas_subject: "",
  mas_result_type: "",
  mas_result: "",
  mas_duration: "",

  // Job Experiences
  if_applicable_exp: true,
  jobs: [
    {
      employment_type: "8", // Private Organization
      designation: "Software Engineer",
      job_start_date: "2021-01-01",
      job_end_date: "2023-12-31",
      currently_working: false,
      organization: "Tech Solutions Ltd",
      office_address: "Banani, Dhaka",
      job_description: "Developed and maintained full-stack web applications using Node.js, React, and databases. Collaborated with cross-functional teams to deliver high-quality scalable software features."
    }
  ]
};

// Export to make it globally available or node export
if (typeof module !== "undefined" && module.exports) {
  module.exports = { DEFAULT_PROFILE };
} else {
  window.DEFAULT_PROFILE = DEFAULT_PROFILE;
}
