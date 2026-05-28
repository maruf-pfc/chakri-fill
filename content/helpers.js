/**
 * ChakriFill - Content Script Helpers
 * Robust utilities for DOM manipulation, event dispatching, and asynchronous element polling.
 */

window.ChakriFillHelpers = window.ChakriFillHelpers || {
  /**
   * Helper to resolve promises with timeout
   */
  wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  /**
   * Dispatches standard bubbling events to trigger target form's JS event handlers (e.g. validation or styling updates)
   */
  dispatchEvent: (element, eventType) => {
    if (!element) return;
    const event = new Event(eventType, { bubbles: true, cancelable: true });
    element.dispatchEvent(event);
  },
  
  /**
   * Safe value setting that dispatches required event types
   */
  setValue: (selector, value) => {
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!el) return;
    el.value = value !== undefined && value !== null ? value : '';
    window.ChakriFillHelpers.dispatchEvent(el, 'input');
    window.ChakriFillHelpers.dispatchEvent(el, 'change');
  },
  
  /**
   * Triggers a checkbox to check/uncheck securely by executing its click event
   */
  setCheckbox: (selector, checked) => {
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!el) return;
    if (el.checked !== !!checked) {
      el.click();
    }
  },
  
  /**
   * Smart dropdown selection that first attempts exact value matching, then text matching (case-insensitive)
   */
  selectDropdownSmart: (selector, value) => {
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!el || value === undefined || value === null) return false;
    
    const stringVal = String(value).trim().toLowerCase();
    
    // 1. Exact Match on Option Value
    for (let option of el.options) {
      if (option.value.trim().toLowerCase() === stringVal) {
        el.value = option.value;
        window.ChakriFillHelpers.dispatchEvent(el, 'change');
        return true;
      }
    }
    
    // 2. Exact or Partial Match on Option TextContent
    for (let option of el.options) {
      const text = option.textContent.trim().toLowerCase();
      if (text === stringVal || text.includes(stringVal) || stringVal.includes(text)) {
        el.value = option.value;
        window.ChakriFillHelpers.dispatchEvent(el, 'change');
        return true;
      }
    }
    
    return false;
  },
  
  /**
   * Performs dynamic dropdown selection, falling back to selecting the "Other" option and populating a text field
   */
  fillSelectWithOther: (selectSelector, otherInputSelector, value) => {
    const select = document.querySelector(selectSelector);
    if (!select) return;
    
    const success = window.ChakriFillHelpers.selectDropdownSmart(select, value);
    if (!success && value) {
      // Find "Other" option dynamically
      let otherSelected = false;
      for (let option of select.options) {
        const isOtherVal = option.value === '99' || option.value === '999' || option.value === '9999';
        const isOtherText = option.textContent.trim().toLowerCase().includes('other');
        if (isOtherVal || isOtherText) {
          select.value = option.value;
          window.ChakriFillHelpers.dispatchEvent(select, 'change');
          otherSelected = true;
          break;
        }
      }
      
      // Populate custom other text field if successfully found and selected
      if (otherSelected) {
        const otherInput = document.querySelector(otherInputSelector);
        if (otherInput) {
          otherInput.value = value;
          window.ChakriFillHelpers.dispatchEvent(otherInput, 'input');
          window.ChakriFillHelpers.dispatchEvent(otherInput, 'change');
        }
      }
    }
  },
  
  /**
   * Asynchronously polls a select element until options are populated (e.g. present/permanent upazilas based on district selection)
   */
  waitForSelectOptions: async (selector, minOptions = 2, maxWaitMs = 1500) => {
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!el) return;
    const startTime = Date.now();
    while (el.options.length < minOptions && (Date.now() - startTime) < maxWaitMs) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }
};
