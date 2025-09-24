/**
 * Label Design Form - Multi-step form wizard
 * Handles 8-step form navigation with optional fields
 *
 * @fileoverview Professional form wizard for collecting comprehensive product labeling information
 * @author Label Design Form Team
 * @version 1.0.0
 */

/**
 * Disable form submission on Enter key press to prevent accidental submissions
 * @listens keyup
 * @listens keypress
 */
$('form').on('keyup keypress', function(e) {
    var keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      e.preventDefault();
      return false;
    }
});
  

/**
 * Global form configuration variables
 */

/** @type {boolean} Flag indicating if current step validation has passed */
var inputschecked = false;

/** @type {number} Current active step number (1-8) */
var currentStep = 1;

/** @type {number} Total number of steps in the form wizard */
var totalSteps = 8;

/**
 * Validates form fields for current step
 * All fields are optional - validation only checks for required fields if explicitly marked
 * @param {number} stepnumber - The current step to validate (1-8)
 * @returns {void} Updates global inputschecked variable
 */
function formvalidate(stepnumber) {
  // Check form fields (all optional)
  inputvalue = $("#step"+stepnumber+" :input").not("button").map(function()
  {
    // Handle textarea elements
    if(this.tagName.toLowerCase() === 'textarea')
    {
      if(this.value.trim().length > 0)
      {
        $(this).removeClass('invalid');
        return true;
      }
      else
      {
        if($(this).prop('required'))
        {
          $(this).addClass('invalid');
          return false
        }
        else
        {
          return true;
        }
      }
    }
    // Handle file input elements
    else if(this.type === 'file')
    {
      // File inputs are optional, so always return true
      $(this).removeClass('invalid');
      return true;
    }
    // Handle other input elements
    else if(this.value.length > 0)
    {
      $(this).removeClass('invalid');
      return true;

    }
    else
    {

      if($(this).prop('required'))
      {
        $(this).addClass('invalid');
        return false
      }
      else
      {
        return true;
      }

    }
  }).get();


  // console.log(inputvalue);

  inputschecked = inputvalue.every(Boolean);

  // console.log(inputschecked);
}

/**
 * Navigate to specific form step and update UI elements
 * Handles step visibility, button states, and summary population
 * @param {number} step - Step number to display (1-8)
 * @returns {void} Updates DOM elements for step navigation
 */
function showStep(step) {
  // Hide all steps
  for(let i = 1; i <= totalSteps; i++) {
    $("#step" + i).hide();
  }

  // Show current step
  $("#step" + step).show();

  // Update button visibility
  if(step === 1) {
    $("#prev").hide();
    $("#sub").text("Next").append('<span><i class="fa-solid fa-arrow-right"></i></span>');
  } else if(step === totalSteps) {
    $("#prev").show();
    $("#sub").text("Submit").append('<span><i class="fa-solid fa-thumbs-up"></i></span>');
    // Populate summary when reaching final step
    populateSummary();
  } else {
    $("#prev").show();
    $("#sub").text("Next").append('<span><i class="fa-solid fa-arrow-right"></i></span>');
  }
}

/**
 * Populate final step summary with all form data
 * Collects data from all previous steps and displays in summary format
 * Shows "Not provided" for empty fields to maintain professional appearance
 * @returns {void} Updates summary display elements in step 8
 */
function populateSummary() {
  // Populate summary with form values
  $("#summary-product-name").text($("#product-name").val() || "Not provided");
  $("#summary-colors").text($("#colors").val() || "Not provided");
  $("#summary-weight-volume").text($("#weight-volume").val() || "Not provided");
  $("#summary-ingredients").text($("#ingredients").val() || "Not provided");
  $("#summary-manufacturing-date").text($("#manufacturing-date").val() || "Not provided");
  $("#summary-expiry-date").text($("#expiry-date").val() || "Not provided");
  $("#summary-batch-number").text($("#batch-number").val() || "Not provided");
  $("#summary-country-origin").text($("#country-origin").val() || "Not provided");
  $("#summary-manufacturer-details").text($("#manufacturer-details").val() || "Not provided");
  $("#summary-directions-use").text($("#directions-use").val() || "Not provided");
  $("#summary-storage-instructions").text($("#storage-instructions").val() || "Not provided");
  $("#summary-label-dimensions").text($("#label-dimensions").val() || "Not provided");
  $("#summary-special-considerations").text($("#special-considerations").val() || "Not provided");
}


/**
 * Document ready event handler
 * Initializes all form functionality, event handlers, and UI components
 * @listens document#ready
 */
$(document).ready(function()
   {
       /**
        * Next/Submit button click handler
        * Handles form validation, step navigation, and final submission
        * @listens click
        */
       $("#sub").on('click' , function()
       {
            formvalidate(currentStep);

            if(inputschecked == false)
            {
                formvalidate(currentStep);
                return;
            }

            if(currentStep < totalSteps) {
                // Go to next step
                currentStep++;
                showStep(currentStep);
            } else {
                // Submit form to Zapier webhook
                $("#sub").html("<img src='assets/images/loading.gif'>");

                // Prepare data for Zapier webhook
                var formData = new FormData(document.getElementById("steps"));

                // Convert FormData to JSON object for better Zapier handling
                var jsonData = {};
                for (var pair of formData.entries()) {
                    if (jsonData[pair[0]]) {
                        // Handle multiple values (like file uploads)
                        if (Array.isArray(jsonData[pair[0]])) {
                            jsonData[pair[0]].push(pair[1]);
                        } else {
                            jsonData[pair[0]] = [jsonData[pair[0]], pair[1]];
                        }
                    } else {
                        jsonData[pair[0]] = pair[1];
                    }
                }

                // Add submission timestamp
                jsonData.submitted_at = new Date().toISOString();

                // TODO: Replace with your actual Zapier webhook URL
                var zapierWebhookUrl = "YOUR_ZAPIER_WEBHOOK_URL_HERE";

                // Send to Zapier webhook
                $.ajax({
                    type: "POST",
                    url: zapierWebhookUrl,
                    data: JSON.stringify(jsonData),
                    contentType: "application/json",
                    success: function(data, status) {
                        $("#sub").html("Success!");

                        // Optional: Redirect after successful submission
                        setTimeout(function() {
                            alert("Form submitted successfully! We'll contact you soon.");
                            // Reset form if needed
                            document.getElementById("steps").reset();
                            currentStep = 1;
                            showStep(1);
                        }, 1000);
                    },
                    error: function(xhr, status, error) {
                        $("#sub").html("Submission failed!");
                        console.error("Submission error:", error);

                        // Show user-friendly error message
                        setTimeout(function() {
                            alert("Submission failed. Please try again or contact support.");
                            $("#sub").text("Submit").append('<span><i class="fa-solid fa-thumbs-up"></i></span>');
                        }, 2000);
                    }
                });
            }
        });

        /**
         * Previous button click handler
         * Navigates to the previous step without validation
         * @listens click
         */
        $("#prev").on('click', function() {
            if(currentStep > 1) {
                currentStep--;
                showStep(currentStep);
            }
        });

        // Initialize first step
        showStep(1);

        /**
         * Terms and conditions modal handlers
         * Manages modal display, acceptance, and checkbox interaction
         */

        /**
         * Terms link click handler - opens modal
         * @listens click
         */
        $("#terms-link").on('click', function(e) {
            e.preventDefault();
            $("#terms-modal").show();
        });

        /**
         * Modal close button handler
         * @listens click
         */
        $("#close-modal").on('click', function() {
            $("#terms-modal").hide();
        });

        /**
         * Accept terms button handler
         * Automatically checks the checkbox and closes modal
         * @listens click
         */
        $("#accept-terms").on('click', function() {
            $("#terms-checkbox").prop('checked', true);
            $("#terms-modal").hide();
        });

        /**
         * Modal backdrop click handler - closes modal when clicking outside
         * @listens click
         */
        $("#terms-modal").on('click', function(e) {
            if (e.target === this) {
                $("#terms-modal").hide();
            }
        });
   });

