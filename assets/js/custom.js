/**
 * Label Design Form - Multi-step form wizard
 * Handles 8-step form navigation with optional fields
 *
 * @fileoverview Professional form wizard for collecting comprehensive product labeling information
 * @version 1.0.1 (Corrected)
 */

// Form Manager - Encapsulated form state and methods
const FormManager = {
  // Form state
  state: {
    inputschecked: false,
    currentStep: 1,
    totalSteps: 8
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
var totalSteps = 8;

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

function getFileUploadSummary() {
  var summary = [];

  // Check business logo
  var logoElement = $("#business-logo")[0];
  if (logoElement && logoElement.files && logoElement.files.length > 0) {
    summary.push("📄 Business Logo: " + logoElement.files[0].name);
  }

  // Check item photos
  var photoElement = $("#item-photos")[0];
  if (photoElement && photoElement.files && photoElement.files.length > 0) {
    summary.push("📸 Item Photos: " + photoElement.files.length + " file(s)");
  }

  // Check reference designs (correct ID from HTML)
  var designElement = $("#reference-design")[0];
  if (designElement && designElement.files && designElement.files.length > 0) {
    summary.push(
      "🎨 Reference Designs: " + designElement.files.length + " file(s)"
    );
  }

  return summary.length > 0 ? summary.join("\n") : "No files uploaded";
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

  // Process reference designs
  var designElement = $("#reference-design")[0];
  if (designElement && designElement.files && designElement.files.length > 0) {
    const fileCount = Math.min(designElement.files.length, 5);
    for (let i = 0; i < fileCount; i++) {
      try {
        updateUploadStatus(`Uploading reference design ${i + 1} of ${fileCount}`);
        const file = designElement.files[i];
        const url = await uploadToCloudinary(file);
        if (url) {
          attachments.push({ url: url });
        }
      } catch (error) {
        errors.push(`Reference design ${i + 1}: ${error.message}`);
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
      // Form submission to Airtable
      $("#sub").html("Submitting...");

      try {
        // Upload files and prepare attachments
        const attachments = await prepareFileAttachments();

        // Collect form data - matching your existing Airtable columns
        var formData = {
          "Customer Name": $("#customer-name").val() || "",
          "Phone Number": $("#customer-phone").val() || "",
          "Product Name": $("#product-name").val() || "",
          color: $("#colors").val() || "",
          "Weight/Volume": $("#weight-volume").val() || "",
          Ingredients: $("#ingredients").val() || "",
          "Manufacturing Date": $("#manufacturing-date").val() || "",
          "Expiry Date": $("#expiry-date").val() || "",
          "Batch Number": $("#batch-number").val() || "",
          "Country of Origin": $("#country-origin").val() || "",
          "Manufacturer Details": $("#manufacturer-details").val() || "",
          "Directions for use": $("#directions-use").val() || "",
          "Storage Instructions": $("#storage-instructions").val() || "",
          "Label Dimensions": $("#label-dimensions").val() || "",
          "Special Considerations": $("#special-considerations").val() || "",
          "Terms Accepted": "Yes", // Automatically accepted by clicking submit
          "Files Uploaded":
            attachments.length > 0
              ? attachments.map((att) => att.url).join("\n")
              : "No files uploaded",
          "Submission Date": new Date().toISOString(),
        };

        // Airtable configuration from config.js
        var airtableConfig = window.CONFIG.airtable;

        // Debug: Check if configuration is loaded
        if (!airtableConfig.baseId || !airtableConfig.apiKey) {
          alert("Configuration Error: API keys not loaded. Please check your Cloudflare environment variables.");
          $("#sub").html(
            'Submit<span><i class="fa-solid fa-thumbs-up"></i></span>'
          );
          return;
        }

        // Send to Airtable API
        $.ajax({
          url: `https://api.airtable.com/v0/${airtableConfig.baseId}/${airtableConfig.tableId}`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${airtableConfig.apiKey}`,
            "Content-Type": "application/json",
          },
          data: JSON.stringify({
            fields: formData,
          }),
          success: function (response) {
            $("#sub").html("Success!");

            setTimeout(function () {
              alert("Form submitted successfully!");
              // Reset form
              document.getElementById("steps").reset();
              currentStep = 1;
              showStep(1);
            }, 1000);
          },
          error: function (xhr, _, error) {
            $("#sub").html("Submission failed!");

            // Log detailed error information
            console.error("Airtable Error Details:", {
              status: xhr.status,
              statusText: xhr.statusText,
              response: xhr.responseJSON || xhr.responseText,
              baseId: airtableConfig.baseId,
              tableId: airtableConfig.tableId
            });

            var errorMessage = "Submission failed. ";
            if (xhr.status === 401) {
              errorMessage += "Authentication failed. Check your API key.";
            } else if (xhr.status === 404) {
              errorMessage += "Base or table not found. Check your IDs.";
            } else if (xhr.status === 422) {
              errorMessage += "Invalid data format. Check your field names.";
              // Show specific field errors if available
              if (xhr.responseJSON && xhr.responseJSON.error) {
                console.error("Airtable field error:", xhr.responseJSON.error);
                errorMessage += "\n\nDetails: " + JSON.stringify(xhr.responseJSON.error);
              }
            } else {
              errorMessage += "Please try again or contact support.";
            }

            setTimeout(function () {
              alert(errorMessage);
              $("#sub")
                .text("Submit")
                .append('<span><i class="fa-solid fa-thumbs-up"></i></span>');
            }, 2000);
          },
        });
      } catch (error) {
        $("#sub").html("Submission failed!");
        alert("Error processing files. Please try again.");
        $("#sub")
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
