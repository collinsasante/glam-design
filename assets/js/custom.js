/**
 * Label Design Form - Multi-step form wizard
 * Handles 8-step form navigation with optional fields
 *
 * @fileoverview Professional form wizard for collecting comprehensive product labeling information
 * @version 1.0.1 (Corrected)
 */

$("form").on("keyup keypress", function (e) {
  var keyCode = e.keyCode || e.which;
  if (keyCode === 13) {
    e.preventDefault();
    return false;
  }
});

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
  var logoFiles = $("#business-logo")[0].files;
  if (logoFiles.length > 0) {
    summary.push("📄 Business Logo: " + logoFiles[0].name);
  }
  var photoFiles = $("#item-photos")[0].files;
  if (photoFiles.length > 0) {
    summary.push("📸 Item Photos: " + photoFiles.length + " file(s)");
  }
  var designFiles = $("#reference-designs")[0].files;
  if (designFiles.length > 0) {
    summary.push("🎨 Reference Designs: " + designFiles.length + " file(s)");
  }
  return summary.length > 0 ? summary.join("\n") : "No files uploaded";
}

$(document).ready(function () {
  $("#sub").on("click", function () {
    formvalidate(currentStep);

    if (!inputschecked) {
      formvalidate(currentStep);
      return;
    }

    if (currentStep < totalSteps) {
      currentStep++;
      showStep(currentStep);
    } else {
      // Form submission - show success message
      $("#sub").html("Success!");

      setTimeout(function () {
        alert("Form completed successfully! Thank you for your submission.");
        // Reset form
        document.getElementById("steps").reset();
        currentStep = 1;
        showStep(1);
      }, 1000);
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
