/**
 * Request Help Block - 4-Step Guided Form
 * Step 1: Parts or Projects
 * Step 2: Product Options (when "Projects" is selected)
 * Step 3: Clarifying Questions for Design Services
 * Step 4: Submission to Service Desk
 */

class RequestHelpForm {
  constructor(block) {
    this.block = block;
    this.currentStep = 1;
    this.formData = {
      step1: null,
      step2: null,
      step3: {}
    };
    this.init();
  }

  init() {
    this.createFormStructure();
    this.bindEvents();
    this.updateStepIndicator();
  }

  createFormStructure() {
    this.block.innerHTML = `
      <div class="form-container">
        <!-- Step Indicator -->
        <div class="step-indicator">
          <div class="step active" data-step="1">
            <div class="step-number">1</div>
            <div class="step-label">Type</div>
          </div>
          <div class="step" data-step="2">
            <div class="step-number">2</div>
            <div class="step-label">Service</div>
          </div>
          <div class="step" data-step="3">
            <div class="step-number">3</div>
            <div class="step-label">Details</div>
          </div>
          <div class="step" data-step="4">
            <div class="step-number">4</div>
            <div class="step-label">Submit</div>
          </div>
        </div>

        <!-- Form Content -->
        <div class="form-content">
          <!-- Step 1: Parts or Projects -->
          <div class="step-content step-1 active">
            <h2>What type of help do you need?</h2>
            <p>Select the category that best describes your request.</p>
            <div class="option-grid">
              <div class="option-card" data-value="parts">
                <div class="icon">🔧</div>
                <h3>Parts</h3>
                <p>Looking for specific components, replacement parts, or product information</p>
              </div>
              <div class="option-card" data-value="projects">
                <div class="icon">🏗️</div>
                <h3>Projects</h3>
                <p>Need assistance with engineering projects, design, or application consulting</p>
              </div>
            </div>
          </div>

          <!-- Step 2: Product Options (only shown when "Projects" is selected) -->
          <div class="step-content step-2">
            <h2>What type of project assistance do you need?</h2>
            <p>Choose the service that best matches your requirements.</p>
            <div class="option-list">
              <div class="option-item" data-value="product-information">
                <div class="radio"></div>
                <div class="content">
                  <h3>Product Information</h3>
                  <p>Get detailed specifications, datasheets, and technical documentation for products</p>
                </div>
              </div>
              <div class="option-item" data-value="product-selection">
                <div class="radio"></div>
                <div class="content">
                  <h3>Product Selection</h3>
                  <p>Help choosing the right components for your specific application requirements</p>
                </div>
              </div>
              <div class="option-item" data-value="application-consulting">
                <div class="radio"></div>
                <div class="content">
                  <h3>Application Consulting</h3>
                  <p>Expert advice on how to implement and integrate products into your system</p>
                </div>
              </div>
              <div class="option-item" data-value="design-services">
                <div class="radio"></div>
                <div class="content">
                  <h3>Design Services</h3>
                  <p>Professional engineering design support for complex projects and systems</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: Clarifying Questions for Design Services -->
          <div class="step-content step-3">
            <h2>Tell us more about your design project</h2>
            <p>Please provide additional details to help us better assist you.</p>
            <div class="questions">
              <div class="question-group">
                <h3>Project Overview</h3>
                <div class="form-group">
                  <label for="project-type">What type of engineering project are you working on?</label>
                  <select id="project-type" name="projectType">
                    <option value="">Select project type...</option>
                    <option value="automation">Industrial Automation</option>
                    <option value="control-systems">Control Systems</option>
                    <option value="power-distribution">Power Distribution</option>
                    <option value="safety-systems">Safety Systems</option>
                    <option value="monitoring">Monitoring & Sensing</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="project-description">Describe your project requirements and objectives</label>
                  <textarea id="project-description" name="projectDescription" 
                    placeholder="Please provide a detailed description of your project, including goals, constraints, and any specific challenges you're facing...">Project Overview:

Objective: To design a high-efficiency cooling system for industrial use]

Deliverables: CAD models, technical drawings, BOMs, performance simulations, and compliance documentation

Timeline: Initial concepts by October 1st, final design by November 30th

Constraints: Must comply with ISO standards, limited to specific materials, etc.</textarea>
                </div>
              </div>

              <div class="question-group">
                <h3>Technical Specifications</h3>
                <div class="form-group">
                  <label for="voltage-requirements">What are your voltage and power requirements?</label>
                  <input type="text" id="voltage-requirements" name="voltageRequirements" 
                    placeholder="e.g., 24V DC, 120V AC, 480V 3-phase" value="24V DC">
                </div>
                <div class="form-group">
                  <label for="environmental-conditions">What environmental conditions will the system operate in?</label>
                  <select id="environmental-conditions" name="environmentalConditions">
                    <option value="">Select conditions...</option>
                    <option value="indoor-controlled">Indoor, Climate Controlled</option>
                    <option value="indoor-industrial">Indoor, Industrial Environment</option>
                    <option value="outdoor">Outdoor Installation</option>
                    <option value="hazardous">Hazardous Location</option>
                    <option value="extreme-temp">Extreme Temperature</option>
                    <option value="high-humidity">High Humidity</option>
                  </select>
                </div>
              </div>

              <div class="question-group">
                <h3>Timeline & Resources</h3>
                <div class="form-group">
                  <label for="project-timeline">What is your project timeline?</label>
                  <select id="project-timeline" name="projectTimeline">
                    <option value="">Select timeline...</option>
                    <option value="immediate">Immediate (1-2 weeks)</option>
                    <option value="short-term">Short-term (1-3 months)</option>
                    <option value="medium-term">Medium-term (3-6 months)</option>
                    <option value="long-term">Long-term (6+ months)</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="budget-range">What is your approximate budget range?</label>
                  <select id="budget-range" name="budgetRange">
                    <option value="">Select budget range...</option>
                    <option value="under-10k">Under $10,000</option>
                    <option value="10k-50k">$10,000 - $50,000</option>
                    <option value="50k-100k">$50,000 - $100,000</option>
                    <option value="100k-500k">$100,000 - $500,000</option>
                    <option value="over-500k">Over $500,000</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 4: Submission -->
          <div class="step-content step-4">
            <div class="submission-content">
              <div class="success-icon">✓</div>
              <h2>Request Submitted Successfully!</h2>
              <p>Thank you for your request. Our service desk team will review your information and provide either self-help resources or connect you with our technical services team within 24 hours.</p>
              <p><strong>Reference Number:</strong> <span id="reference-number">RS-1234567890</span></p>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="form-navigation">
          <button type="button" class="btn btn-secondary" id="prev-btn" style="display: none;">
            <span class="icon">←</span> Previous
          </button>
          <button type="button" class="btn btn-primary" id="next-btn">
            Next <span class="icon">→</span>
          </button>
        </div>
      </div>
    `;
  }

  bindEvents() {
    // Step 1: Parts or Projects selection
    this.block.querySelectorAll('.step-1 .option-card').forEach(card => {
      card.addEventListener('click', (e) => {
        this.block.querySelectorAll('.step-1 .option-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.formData.step1 = card.dataset.value;
        this.updateNavigation();
      });
    });

    // Step 2: Product options selection
    this.block.querySelectorAll('.step-2 .option-item').forEach(item => {
      item.addEventListener('click', (e) => {
        this.block.querySelectorAll('.step-2 .option-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        this.formData.step2 = item.dataset.value;
        this.updateNavigation();
      });
    });

    // Navigation buttons
    this.block.querySelector('#prev-btn').addEventListener('click', () => this.previousStep());
    this.block.querySelector('#next-btn').addEventListener('click', () => this.nextStep());

    // Form inputs for step 3
    this.block.querySelectorAll('.step-3 input, .step-3 textarea, .step-3 select').forEach(input => {
      input.addEventListener('input', () => this.updateNavigation());
      input.addEventListener('change', () => this.updateNavigation());
    });
  }

  updateStepIndicator() {
    this.block.querySelectorAll('.step-indicator .step').forEach((step, index) => {
      const stepNum = index + 1;
      step.classList.remove('active', 'completed');
      
      if (stepNum === this.currentStep) {
        step.classList.add('active');
      } else if (stepNum < this.currentStep) {
        step.classList.add('completed');
      }
    });
  }

  showStep(stepNumber) {
    this.block.querySelectorAll('.step-content').forEach((content, index) => {
      content.classList.remove('active');
      if (index + 1 === stepNumber) {
        content.classList.add('active');
      }
    });
    
    this.currentStep = stepNumber;
    this.updateStepIndicator();
    this.updateNavigation();
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.showStep(this.currentStep - 1);
    }
  }

  nextStep() {
    if (this.canProceed()) {
      if (this.currentStep === 4) {
        this.submitForm();
      } else {
        this.showStep(this.currentStep + 1);
      }
    }
  }

  canProceed() {
    switch (this.currentStep) {
      case 1:
        return this.formData.step1 !== null;
      case 2:
        return this.formData.step2 !== null;
      case 3:
        // Check if required fields are filled
        const requiredFields = [];
        return requiredFields.every(field => {
          const input = this.block.querySelector(`[name="${field}"]`);
          return input && input.value.trim() !== '';
        });
      case 4:
        return true;
      default:
        return false;
    }
  }

  updateNavigation() {
    const prevBtn = this.block.querySelector('#prev-btn');
    const nextBtn = this.block.querySelector('#next-btn');

    // Show/hide previous button
    prevBtn.style.display = this.currentStep > 1 ? 'inline-flex' : 'none';

    // Update next button text
    if (this.currentStep === 4) {
      nextBtn.innerHTML = 'Submit <span class="icon">✓</span>';
    } else {
      nextBtn.innerHTML = 'Next <span class="icon">→</span>';
    }

    // Enable/disable next button
    nextBtn.disabled = !this.canProceed();
  }

  collectStep3Data() {
    const formData = {};
    this.block.querySelectorAll('.step-3 input, .step-3 textarea, .step-3 select').forEach(input => {
      formData[input.name] = input.value;
    });
    this.formData.step3 = formData;
  }

  generateReferenceNumber() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `RH-${timestamp}-${random}`.toUpperCase();
  }

  submitForm() {
    this.collectStep3Data();
    
    // Generate reference number
    const referenceNumber = this.generateReferenceNumber();
    this.block.querySelector('#reference-number').textContent = referenceNumber;

    // In a real implementation, you would send this data to your service desk
    console.log('Form submitted:', {
      referenceNumber,
      formData: this.formData
    });

    // Show step 4
    this.showStep(4);
  }
}

/**
 * Decorates the request help block
 * @param {Element} block The request help block element
 */
export default function decorate(block) {
  new RequestHelpForm(block);
}
