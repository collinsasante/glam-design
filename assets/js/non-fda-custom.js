/**
 * Non-FDA Label Design Form - Multi-step form wizard
 * Handles 5-step form navigation with optional fields
 *
 * @fileoverview Simplified form wizard for non-FDA regulated products
 * @version 1.1.0
 */

// Form Manager - Encapsulated form state and methods
const FormManager = {
  // Form state
  state: {
    inputschecked: false,
    currentStep: 1,
    totalSteps: 5
  },

  // Initialize form
  init: function() {
    // Prevent form submission on Enter key
    $("form").on("keyup keypress", function (e) {
      var keyCode = e.keyCode || e.which;
      if (keyCode === 13) {
        e.preventDefault();
        return false;
      }
    });
  }
};

// Backward compatibility - expose state as global variables
var inputschecked = false;
var currentStep = 1;
var totalSteps = 5;

function formvalidate(stepnumber) {
  inputvalue = $("#step" + stepnumber + " :input")
    .not("button")
    .map(function () {
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
      } else if (this.type === "file") {
        $(this).removeClass("invalid");
        return true;
      } else if (this.value.length > 0) {
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

  inputschecked = inputvalue.every(Boolean);
}

function showStep(step) {
  for (let i = 1; i <= totalSteps; i++) {
    $("#step" + i).hide();
  }

  $("#step" + step).show();

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
    populateSummary();
  } else {
    $("#prev").show();
    $("#sub")
      .text("Next")
      .append('<span><i class="fa-solid fa-arrow-right"></i></span>');
  }
}

function populateSummary() {
  $("#summary-product-name").text($("#product-name").val() || "Not provided");
  $("#summary-colors").text($("#colors").val() || "Not provided");
  $("#summary-weight-volume").text($("#weight-volume").val() || "Not provided");
  $("#summary-manufacturer-details").text(
    $("#manufacturer-details").val() || "Not provided"
  );
  $("#summary-customer-name").text($("#customer-name").val() || "Not provided");
  $("#summary-customer-phone").text($("#customer-phone").val() || "Not provided");
  $("#summary-customer-phone-2").text($("#customer-phone-2").val() || "Not provided");
}

// File size validation (10MB limit)
function validateFileSize(file, maxSizeMB = 10) {
  const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
  if (file.size > maxSize) {
    throw new Error(`File "${file.name}" is too large. Maximum size is ${maxSizeMB}MB.`);
  }
  return true;
}

// Validate file type
function validateFileType(file) {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File "${file.name}" has an unsupported format. Please use: JPG, PNG, GIF, WebP, or PDF.`);
  }
  return true;
}

async function uploadToCloudinary(file) {
  // Validate file before upload
  try {
    validateFileSize(file);
    validateFileType(file);
  } catch (error) {
    throw error; // Re-throw validation errors
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", window.CONFIG.cloudinary.uploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${window.CONFIG.cloudinary.cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.secure_url;
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Upload failed: ${errorData.error?.message || response.statusText}`);
    }
  } catch (error) {
    if (error.message.includes('Upload failed')) {
      throw error;
    }
    throw new Error(`Network error during upload: ${error.message}`);
  }
}

async function prepareFileAttachments() {
  var attachments = [];
  var errors = [];

  // Show upload progress
  function updateUploadStatus(message) {
    $("#sub").html(`${message}...`);
  }

  // Process business logo
  var logoElement = $("#business-logo")[0];
  if (logoElement && logoElement.files && logoElement.files.length > 0) {
    try {
      updateUploadStatus("Uploading business logo");
      const file = logoElement.files[0];
      const url = await uploadToCloudinary(file);
      if (url) {
        attachments.push({ url: url });
      }
    } catch (error) {
      errors.push(`Business logo: ${error.message}`);
    }
  }

  // Process item photos
  var photoElement = $("#item-photos")[0];
  if (photoElement && photoElement.files && photoElement.files.length > 0) {
    const fileCount = Math.min(photoElement.files.length, 5);
    for (let i = 0; i < fileCount; i++) {
      try {
        updateUploadStatus(`Uploading item photo ${i + 1} of ${fileCount}`);
        const file = photoElement.files[i];
        const url = await uploadToCloudinary(file);
        if (url) {
          attachments.push({ url: url });
        }
      } catch (error) {
        errors.push(`Item photo ${i + 1}: ${error.message}`);
      }
    }
  }

  // If there were file errors but some uploads succeeded, warn user
  if (errors.length > 0) {
    const errorMessage = `Some files couldn't be uploaded:\n${errors.join('\n')}\n\nContinue with submission?`;
    if (!confirm(errorMessage)) {
      throw new Error("Upload cancelled by user");
    }
  }

  return attachments;
}

$(document).ready(function () {
  // Initialize Form Manager
  FormManager.init();

  $("#sub").on("click", async function () {
    formvalidate(currentStep);

    if (!inputschecked) {
      formvalidate(currentStep);
      return;
    }

    if (currentStep < totalSteps) {
      currentStep++;
      showStep(currentStep);
    } else {
      // Form submission to the ERP
      $("#sub").html("Submitting...");
      $("#sub").prop("disabled", true); // no double submissions while uploading/sending

      try {
        // Upload files and prepare attachments
        const attachments = await prepareFileAttachments();

        // Collect form data - Non-FDA version (only include fields with values)
        var formData = {
          "Label Type": $("#label-type").val() || "",
          "Customer Name": $("#customer-name").val() || "",
          "Phone Number": $("#customer-phone").val() || "",
          "Phone 2": $("#customer-phone-2").val() || "",
          "Product Name": $("#product-name").val() || "",
          color: $("#colors").val() || "",
          "Weight/Volume": $("#weight-volume").val() || "",
          "Manufacturer Details": $("#manufacturer-details").val() || "",
          "Terms Accepted": "Yes", // Automatically accepted by clicking submit
          "Files Uploaded":
            attachments.length > 0
              ? attachments.map((att) => att.url).join("\n")
              : "No files uploaded",
          "Submission Date": new Date().toISOString(),
        };

        // Only add date fields if they have values (empty values are not sent)
        if ($("#ingredients").val()) formData["Ingredients"] = $("#ingredients").val();
        if ($("#manufacturing-date").val()) formData["Manufacturing Date"] = $("#manufacturing-date").val();
        if ($("#expiry-date").val()) formData["Expiry Date"] = $("#expiry-date").val();
        if ($("#batch-number").val()) formData["Batch Number"] = $("#batch-number").val();
        if ($("#country-origin").val()) formData["Country of Origin"] = $("#country-origin").val();
        if ($("#directions-use").val()) formData["Directions for use"] = $("#directions-use").val();
        if ($("#storage-instructions").val()) formData["Storage Instructions"] = $("#storage-instructions").val();
        if ($("#label-dimensions").val()) formData["Label Dimensions"] = $("#label-dimensions").val();
        if ($("#special-considerations").val()) formData["Special Considerations"] = $("#special-considerations").val();

        // Send to the Packaging Glamour ERP (assets/js/erp-submit.js).
        submitDesignRequest(formData, attachments)
          .then(function (res) {
            $("#sub").html("Success!");
            setTimeout(function () {
              document.getElementById("steps").reset();
              currentStep = 1;
              showStep(1);
              $("#sub").prop("disabled", false)
                .text("Submit")
                .append('<span><i class="fa-solid fa-thumbs-up"></i></span>');
              var open = confirm(
                "Thank you! Your order number is " + res.order + ".\n\n" +
                "Open your design tracking page now? Keep that page's link: it is how you follow, " +
                "comment on and approve your design."
              );
              if (open && res.track_url) window.location.href = res.track_url;
            }, 600);
          })
          .catch(function (err) {
            $("#sub").html("Submission failed!");
            setTimeout(function () {
              alert(err.message);
              $("#sub").prop("disabled", false)
                .text("Submit")
                .append('<span><i class="fa-solid fa-thumbs-up"></i></span>');
            }, 600);
          });
      } catch (error) {
        $("#sub").html("Submission failed!");
        alert("Error processing files. Please try again.");
        $("#sub").prop("disabled", false)
          .text("Submit")
          .append('<span><i class="fa-solid fa-thumbs-up"></i></span>');
      }
    }
  });

  $("#prev").on("click", function () {
    if (currentStep > 1) {
      currentStep--;
      showStep(currentStep);
    }
  });

  // Initialize first step
  showStep(1);

  // Terms and conditions modal handlers
  $("#terms-link").on("click", function (e) {
    e.preventDefault();
    $("#terms-modal").show();
  });

  $("#close-modal").on("click", function () {
    $("#terms-modal").hide();
  });

  $("#accept-terms").on("click", function () {
    $("#terms-checkbox").prop("checked", true);
    $("#terms-modal").hide();
  });

  $("#terms-modal").on("click", function (e) {
    if (e.target === this) {
      $("#terms-modal").hide();
    }
  });
});