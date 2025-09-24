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
$("form").on("keyup keypress", function (e) {
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
  inputvalue = $("#step" + stepnumber + " :input")
    .not("button")
    .map(function () {
      // Handle textarea elements
      if (this.tagName.toLowerCase() === "textarea") {
        if (this.value.trim().length > 0) {
          $(this).removeClass("invalid");
          return true;
        } else {
          if ($(this).prop("required")) {
            $(this).addClass("invalid");
            return false;
          } else {
            return true;
          }
        }
      }
      // Handle file input elements
      else if (this.type === "file") {
        // File inputs are optional, so always return true
        $(this).removeClass("invalid");
        return true;
      }
      // Handle other input elements
      else if (this.value.length > 0) {
        $(this).removeClass("invalid");
        return true;
      } else {
        if ($(this).prop("required")) {
          $(this).addClass("invalid");
          return false;
        } else {
          return true;
        }
      }
    })
    .get();

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
  for (let i = 1; i <= totalSteps; i++) {
    $("#step" + i).hide();
  }

  // Show current step
  $("#step" + step).show();

  // Update button visibility
  if (step === 1) {
    $("#prev").hide();
    $("#sub")
      .text("Next")
      .append('<span><i class="fa-solid fa-arrow-right"></i></span>');
  } else if (step === totalSteps) {
    $("#prev").show();
    $("#sub")
      .text("Submit")
      .append('<span><i class="fa-solid fa-thumbs-up"></i></span>');
    // Populate summary when reaching final step
    populateSummary();
  } else {
    $("#prev").show();
    $("#sub")
      .text("Next")
      .append('<span><i class="fa-solid fa-arrow-right"></i></span>');
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
  $("#summary-manufacturing-date").text(
    $("#manufacturing-date").val() || "Not provided"
  );
  $("#summary-expiry-date").text($("#expiry-date").val() || "Not provided");
  $("#summary-batch-number").text($("#batch-number").val() || "Not provided");
  $("#summary-country-origin").text(
    $("#country-origin").val() || "Not provided"
  );
  $("#summary-manufacturer-details").text(
    $("#manufacturer-details").val() || "Not provided"
  );
  $("#summary-directions-use").text(
    $("#directions-use").val() || "Not provided"
  );
  $("#summary-storage-instructions").text(
    $("#storage-instructions").val() || "Not provided"
  );
  $("#summary-label-dimensions").text(
    $("#label-dimensions").val() || "Not provided"
  );
  $("#summary-special-considerations").text(
    $("#special-considerations").val() || "Not provided"
  );
}

/**
 * Generate file upload summary for Slack message
 * @returns {string} Summary of uploaded files
 */
function getFileUploadSummary() {
  var summary = [];

  // Check business logo
  var logoFiles = $("#business-logo")[0].files;
  if (logoFiles.length > 0) {
    summary.push("📄 Business Logo: " + logoFiles[0].name);
  }

  // Check item photos
  var photoFiles = $("#item-photos")[0].files;
  if (photoFiles.length > 0) {
    summary.push("📸 Item Photos: " + photoFiles.length + " file(s)");
  }

  // Check reference designs
  var designFiles = $("#reference-designs")[0].files;
  if (designFiles.length > 0) {
    summary.push("🎨 Reference Designs: " + designFiles.length + " file(s)");
  }

  return summary.length > 0 ? summary.join("\n") : "No files uploaded";
}

/**
 * Document ready event handler
 * Initializes all form functionality, event handlers, and UI components
 * @listens document#ready
 */
$(document).ready(function () {
  /**
   * Next/Submit button click handler
   * Handles form validation, step navigation, and final submission
   * @listens click
   */
  $("#sub").on("click", function () {
    formvalidate(currentStep);

    if (inputschecked == false) {
      formvalidate(currentStep);
      return;
    }

    if (currentStep < totalSteps) {
      // Go to next step
      currentStep++;
      showStep(currentStep);
    } else {
      // Submit form to Slack
      $("#sub").html("<img src='assets/images/loading.gif'>");

      // Create formatted message for Slack
      var slackMessage = {
        text: "🆕 *New Label Design Request!*",
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "🏷️ New Label Design Request",
            },
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text:
                  "*👤 Customer:*\n" +
                  ($("#full-name").val() || "Not provided"),
              },
              {
                type: "mrkdwn",
                text:
                  "*📞 Phone:*\n" +
                  ($("#phone-number").val() || "Not provided"),
              },
            ],
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text:
                  "*🏷️ Product Name:*\n" +
                  ($("#product-name").val() || "Not provided"),
              },
              {
                type: "mrkdwn",
                text: "*🎨 Colors:*\n" + ($("#colors").val() || "Not provided"),
              },
            ],
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text:
                  "*📦 Weight/Volume:*\n" +
                  ($("#weight-volume").val() || "Not provided"),
              },
              {
                type: "mrkdwn",
                text:
                  "*📏 Dimensions:*\n" +
                  ($("#label-dimensions").val() || "Not provided"),
              },
            ],
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text:
                "*🧪 Ingredients:*\n" +
                ($("#ingredients").val() || "Not provided"),
            },
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text:
                  "*📅 Manufacturing Date:*\n" +
                  ($("#manufacturing-date").val() || "Not provided"),
              },
              {
                type: "mrkdwn",
                text:
                  "*⏰ Expiry Date:*\n" +
                  ($("#expiry-date").val() || "Not provided"),
              },
            ],
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text:
                  "*🏭 Batch Number:*\n" +
                  ($("#batch-number").val() || "Not provided"),
              },
              {
                type: "mrkdwn",
                text:
                  "*🌍 Country of Origin:*\n" +
                  ($("#country-origin").val() || "Not provided"),
              },
            ],
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text:
                "*🏢 Manufacturer Details:*\n" +
                ($("#manufacturer-details").val() || "Not provided"),
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text:
                "*📖 Directions for Use:*\n" +
                ($("#directions-use").val() || "Not provided"),
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text:
                "*🏪 Storage Instructions:*\n" +
                ($("#storage-instructions").val() || "Not provided"),
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text:
                "*⚠️ Special Considerations:*\n" +
                ($("#special-considerations").val() || "Not provided"),
            },
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text:
                  "*✅ Terms Accepted:*\n" +
                  ($("#terms-checkbox").is(":checked") ? "Yes" : "No"),
              },
              {
                type: "mrkdwn",
                text: "*🕒 Submitted:*\n" + new Date().toLocaleString(),
              },
            ],
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*📎 Files Uploaded:*\n" + getFileUploadSummary(),
            },
          }
        ],
      };

      // Get webhook URL from config file or fallback to placeholder
      var slackWebhookUrl = (typeof config !== 'undefined' && config.slackWebhookUrl)
        ? config.slackWebhookUrl
        : "YOUR_SLACK_WEBHOOK_URL_HERE";

      // Send to Slack
      $.ajax({
        type: "POST",
        url: slackWebhookUrl,
        data: JSON.stringify(slackMessage),
        contentType: "application/json",
        success: function () {
          $("#sub").html("Success!");

          // Show success message and reset form
          setTimeout(function () {
            alert("Form submitted successfully! We'll contact you soon.");
            // Reset form
            document.getElementById("steps").reset();
            currentStep = 1;
            showStep(1);
          }, 1000);
        },
        error: function (xhr, status, error) {
          $("#sub").html("Submission failed!");
          console.error("Slack submission error:", error, xhr.responseText);

          // Show user-friendly error message
          setTimeout(function () {
            alert("Submission failed. Please try again or contact support.");
            $("#sub")
              .text("Submit")
              .append('<span><i class="fa-solid fa-thumbs-up"></i></span>');
          }, 2000);
        },
      });
    }
  });

  /**
   * Previous button click handler
   * Navigates to the previous step without validation
   * @listens click
   */
  $("#prev").on("click", function () {
    if (currentStep > 1) {
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
  $("#terms-link").on("click", function (e) {
    e.preventDefault();
    $("#terms-modal").show();
  });

  /**
   * Modal close button handler
   * @listens click
   */
  $("#close-modal").on("click", function () {
    $("#terms-modal").hide();
  });

  /**
   * Accept terms button handler
   * Automatically checks the checkbox and closes modal
   * @listens click
   */
  $("#accept-terms").on("click", function () {
    $("#terms-checkbox").prop("checked", true);
    $("#terms-modal").hide();
  });

  /**
   * Modal backdrop click handler - closes modal when clicking outside
   * @listens click
   */
  $("#terms-modal").on("click", function (e) {
    if (e.target === this) {
      $("#terms-modal").hide();
    }
  });
});
