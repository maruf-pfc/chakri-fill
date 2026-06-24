/**
 * ChakriFill - Form Matching & Orchestration Engine
 * Maps standard profile fields to Teletalk NPA form elements.
 */

window.ChakriFillMatcher = window.ChakriFillMatcher || {
  /**
   * Main autofill entry point. Accepts the user's saved profile data and orchestrates field population.
   */
  autofill: async function(profile) {
    if (!profile) {
      console.warn("ChakriFill: No profile data provided to the matcher.");
      return;
    }

    const H = window.ChakriFillHelpers;
    if (!H) {
      console.error("ChakriFill: Helpers library not loaded.");
      return;
    }

    console.log("ChakriFill: Starting form fill process...", profile);

    // ==========================================
    // 1. Personal / Basic Information
    // ==========================================
    try {
      H.setValue('#name', profile.name);
      H.setValue('#name_bn', profile.name_bn);
      H.setValue('#father', profile.father);
      H.setValue('#father_bn', profile.father_bn);
      H.setValue('#mother', profile.mother);
      H.setValue('#mother_bn', profile.mother_bn);
      
      if (profile.dob) {
        H.setValue('#dob', profile.dob);
      }
      
      H.selectDropdownSmart('#nationality', profile.nationality || 'Bangladeshi');
      H.selectDropdownSmart('#religion', profile.religion);
      H.selectDropdownSmart('#gender', profile.gender);
      
      // NID Toggle and Value
      if (profile.nid !== undefined && profile.nid !== null) {
        H.selectDropdownSmart('#nid', profile.nid);
        if (profile.nid === '1' || profile.nid === 1) {
          await H.wait(100); // Allow wrapper to display
          H.setValue('#nid_no', profile.nid_no);
        }
      }

      // Birth Registration Toggle and Value
      if (profile.breg !== undefined && profile.breg !== null) {
        H.selectDropdownSmart('#breg', profile.breg);
        if (profile.breg === '1' || profile.breg === 1) {
          await H.wait(100);
          H.setValue('#breg_no', profile.breg_no);
        }
      }

      // Passport Toggle and Value
      if (profile.passport !== undefined && profile.passport !== null) {
        H.selectDropdownSmart('#passport', profile.passport);
        if (profile.passport === '1' || profile.passport === 1) {
          await H.wait(100);
          H.setValue('#passport_no', profile.passport_no);
        }
      }

      // Marital Status Toggle and Value
      if (profile.marital_status) {
        H.selectDropdownSmart('#marital_status', profile.marital_status);
        if (profile.marital_status.toLowerCase() === 'married') {
          await H.wait(100);
          H.setValue('#spouse_name', profile.spouse_name);
        }
      }

      H.setValue('#mobile', profile.mobile);
      H.setValue('#confirm_mobile', profile.confirm_mobile);
      H.setValue('#email', profile.email);
      
      // Quota and details
      if (profile.quota) {
        H.selectDropdownSmart('#quota', profile.quota);
        if (profile.quota !== '8') { // '8' is typically "Not Applicable"
          await H.wait(100);
          H.setValue('#quota_details', profile.quota_details);
        }
      }
      
      H.selectDropdownSmart('#dep_status', profile.dep_status);
    } catch (e) {
      console.error("ChakriFill: Error populating Basic Information section:", e);
    }

    // ==========================================
    // 2. Present Address
    // ==========================================
    try {
      H.setValue('#present_careof', profile.present_careof);
      H.setValue('#present_village', profile.present_village);
      
      if (profile.present_district) {
        H.selectDropdownSmart('#present_district', profile.present_district);
        await H.waitForSelectOptions('#present_upazila');
        H.selectDropdownSmart('#present_upazila', profile.present_upazila);
      }
      
      H.setValue('#present_post', profile.present_post);
      H.setValue('#present_postcode', profile.present_postcode);
    } catch (e) {
      console.error("ChakriFill: Error populating Present Address section:", e);
    }

    // ==========================================
    // 3. Permanent Address
    // ==========================================
    try {
      const sameAsPresentChecked = !!profile.same_as_present;
      H.setCheckbox('#same_as_present', sameAsPresentChecked);
      
      if (!sameAsPresentChecked) {
        await H.wait(100); // Allow inputs to enable
        H.setValue('#permanent_careof', profile.permanent_careof);
        H.setValue('#permanent_village', profile.permanent_village);
        
        if (profile.permanent_district) {
          H.selectDropdownSmart('#permanent_district', profile.permanent_district);
          await H.waitForSelectOptions('#permanent_upazila');
          H.selectDropdownSmart('#permanent_upazila', profile.permanent_upazila);
        }
        
        H.setValue('#permanent_post', profile.permanent_post);
        H.setValue('#permanent_postcode', profile.permanent_postcode);
      }
    } catch (e) {
      console.error("ChakriFill: Error populating Permanent Address section:", e);
    }

    // ==========================================
    // 4. Academic Qualifications: SSC
    // ==========================================
    try {
      if (profile.ssc_exam) {
        H.selectDropdownSmart('#ssc_exam', profile.ssc_exam);
        H.setValue('#ssc_roll', profile.ssc_roll);
        
        // Wait for exam type change to populate groups and boards if dynamic
        await Promise.all([
          H.waitForSelectOptions('#ssc_group'),
          H.waitForSelectOptions('#ssc_board')
        ]);
        
        H.fillSelectWithOther('#ssc_group', '#ssc_group_other', profile.ssc_group);
        H.fillSelectWithOther('#ssc_board', '#ssc_board_other', profile.ssc_board);
        
        H.selectDropdownSmart('#ssc_result_type', profile.ssc_result_type);
        await H.wait(100);
        if (profile.ssc_result_type === '4' || profile.ssc_result_type === '5') {
          H.setValue('#ssc_result', profile.ssc_result);
        }
        
        H.selectDropdownSmart('#ssc_year', profile.ssc_year);
      }
    } catch (e) {
      console.error("ChakriFill: Error populating SSC Academic section:", e);
    }

    // ==========================================
    // 5. Academic Qualifications: HSC
    // ==========================================
    try {
      if (profile.hsc_exam) {
        H.selectDropdownSmart('#hsc_exam', profile.hsc_exam);
        H.setValue('#hsc_roll', profile.hsc_roll);
        
        // Wait for exam type change to populate groups and boards if dynamic
        await Promise.all([
          H.waitForSelectOptions('#hsc_group'),
          H.waitForSelectOptions('#hsc_board')
        ]);
        
        H.fillSelectWithOther('#hsc_group', '#hsc_group_other', profile.hsc_group);
        H.fillSelectWithOther('#hsc_board', '#hsc_board_other', profile.hsc_board);
        
        H.selectDropdownSmart('#hsc_result_type', profile.hsc_result_type);
        await H.wait(100);
        if (profile.hsc_result_type === '4' || profile.hsc_result_type === '5') {
          H.setValue('#hsc_result', profile.hsc_result);
        }
        
        H.selectDropdownSmart('#hsc_year', profile.hsc_year);
      }
    } catch (e) {
      console.error("ChakriFill: Error populating HSC Academic section:", e);
    }

    // ==========================================
    // 6. Academic Qualifications: Graduation
    // ==========================================
    try {
      if (profile.gra_exam) {
        H.selectDropdownSmart('#gra_exam', profile.gra_exam);
        
        // Wait for dynamic subjects/degrees and institutes to load
        await Promise.all([
          H.waitForSelectOptions('#gra_institute'),
          H.waitForSelectOptions('#gra_subject')
        ]);
        
        H.fillSelectWithOther('#gra_institute', '#gra_institute_other', profile.gra_institute);
        H.fillSelectWithOther('#gra_subject', '#gra_subject_other', profile.gra_subject);
        
        H.selectDropdownSmart('#gra_result_type', profile.gra_result_type);
        await H.wait(100);
        if (profile.gra_result_type === '4' || profile.gra_result_type === '5') {
          H.setValue('#gra_result', profile.gra_result);
        }
        
        H.selectDropdownSmart('#gra_year', profile.gra_year);
        H.selectDropdownSmart('#gra_duration', profile.gra_duration);
      }
    } catch (e) {
      console.error("ChakriFill: Error populating Graduation Academic section:", e);
    }

    // ==========================================
    // 7. Academic Qualifications: Masters (If Applicable)
    // ==========================================
    try {
      const isMasApplicable = !!profile.if_applicable_mas;
      H.setCheckbox('#if_applicable_mas', isMasApplicable);
      
      if (isMasApplicable) {
        await H.wait(150); // wait for fields to enable
        H.selectDropdownSmart('#mas_exam', profile.mas_exam);
        
        // Wait for dynamic subjects/degrees and institutes to load
        await Promise.all([
          H.waitForSelectOptions('#mas_institute'),
          H.waitForSelectOptions('#mas_subject')
        ]);
        
        H.fillSelectWithOther('#mas_institute', '#mas_institute_other', profile.mas_institute);
        H.fillSelectWithOther('#mas_subject', '#mas_subject_other', profile.mas_subject);
        
        H.selectDropdownSmart('#mas_result_type', profile.mas_result_type);
        await H.wait(100);
        if (profile.mas_result_type === '4' || profile.mas_result_type === '5') {
          H.setValue('#mas_result', profile.mas_result);
        }
        
        H.selectDropdownSmart('#mas_year', profile.mas_year);
        H.selectDropdownSmart('#mas_duration', profile.mas_duration);
      }
    } catch (e) {
      console.error("ChakriFill: Error populating Masters Academic section:", e);
    }

    // ==========================================
    // 8. Job Experience (If Applicable)
    // ==========================================
    try {
      const isExpApplicable = !!profile.if_applicable_exp;
      H.setCheckbox('#if_applicable_exp', isExpApplicable);
      
      if (isExpApplicable && profile.jobs && Array.isArray(profile.jobs)) {
        await H.wait(150); // wait for fields to enable and "ADD MORE" to show
        
        // Remove any previously added additional experiences to prevent duplicates
        const additionalTemplates = document.querySelectorAll('.jobExpTemplate:not([data-index="0"])');
        additionalTemplates.forEach(t => t.remove());

        for (let i = 0; i < profile.jobs.length; i++) {
          const job = profile.jobs[i];
          
          // Dynamically add a new job block if i > 0
          if (i > 0) {
            const addBtn = document.getElementById('addNewJob');
            if (addBtn) {
              addBtn.click();
              await H.wait(150); // wait for dynamic template creation and attachment
            }
          }
          
          // Match elements for current job index i
          const empSelect = document.querySelector(`select[name="job[${i}][employment_type]"]`);
          const desInput = document.querySelector(`input[name="job[${i}][designation]"]`);
          const startInput = document.querySelector(`input[name="job[${i}][job_start_date]"]`);
          const endInput = document.querySelector(`input[name="job[${i}][job_end_date]"]`);
          const currCheckbox = document.querySelector(`input[name="job[${i}][currently_working]"]`);
          const orgInput = document.querySelector(`input[name="job[${i}][organization]"]`);
          const addrInput = document.querySelector(`input[name="job[${i}][office_address]"]`);
          const descTextarea = document.querySelector(`textarea[name="job[${i}][job_description]"]`);
          
          if (empSelect) H.selectDropdownSmart(empSelect, job.employment_type);
          if (desInput) {
            desInput.value = job.designation || '';
            H.dispatchEvent(desInput, 'input');
          }
          if (startInput) {
            startInput.value = job.job_start_date || '';
            H.dispatchEvent(startInput, 'change');
          }
          
          if (currCheckbox) {
            const shouldCheck = !!job.currently_working;
            if (currCheckbox.checked !== shouldCheck) {
              currCheckbox.click();
            }
          }
          
          if (endInput && !job.currently_working) {
            endInput.value = job.job_end_date || '';
            H.dispatchEvent(endInput, 'change');
          }
          
          if (orgInput) {
            orgInput.value = job.organization || '';
            H.dispatchEvent(orgInput, 'input');
          }
          if (addrInput) {
            addrInput.value = job.office_address || '';
            H.dispatchEvent(addrInput, 'input');
          }
          if (descTextarea) {
            descTextarea.value = job.job_description || '';
            H.dispatchEvent(descTextarea, 'input');
            H.dispatchEvent(descTextarea, 'keyup');
          }
        }
      }
    } catch (e) {
      console.error("ChakriFill: Error populating Job Experience section:", e);
    }

    // ==========================================
    // 9. Premium Quality of Life: Captcha & Declarations
    // ==========================================
    try {
      // Fetch and solve captcha if available in hidden element
      const captchaActualEl = document.getElementById('CAPTCHA_ACTUAL');
      const captchaInputEl = document.getElementById('captcha');
      
      if (captchaActualEl && captchaActualEl.value && captchaInputEl) {
        console.log("ChakriFill: Smart Captcha Bypass Activated!");
        captchaInputEl.value = captchaActualEl.value;
        H.dispatchEvent(captchaInputEl, 'input');
        H.dispatchEvent(captchaInputEl, 'change');
      }

      // Check declaration check box
      H.setCheckbox('#agree', true);
    } catch (e) {
      console.error("ChakriFill: Error populating Captcha/Declaration section:", e);
    }

    console.log("ChakriFill: Autofill engine successfully completed form population!");
  }
};
