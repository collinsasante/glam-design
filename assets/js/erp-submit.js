/**
 * Sends a design request to the Packaging Glamour ERP (glampack_ops).
 * A plain form POST (no custom headers) so the browser needs no CORS pre-flight; the ERP allows
 * this site's origin on this one endpoint only. No keys or secrets are needed in the browser.
 */
(function () {
  "use strict";
  var ERP_URL = "https://erp.packglamour.com";
  window.GLAM_ERP_URL = ERP_URL;

  window.submitDesignRequest = function (formData, attachments) {
    var body = new URLSearchParams();
    Object.keys(formData).forEach(function (k) {
      var v = formData[k];
      if (v !== undefined && v !== null && String(v).trim() !== "") body.append(k, String(v));
    });
    body.set("files", (attachments || []).map(function (a) { return a.url; }).join("\n"));
    var hp = document.getElementById("website");
    body.set("website", hp ? hp.value : "");

    return fetch(ERP_URL + "/api/method/glampack_ops.api.design.submit", {
      method: "POST",
      body: body,
      credentials: "omit",
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (!res.ok) {
          var msg = "Submission failed. Please try again or contact us.";
          try { msg = JSON.parse(JSON.parse(data._server_messages)[0]).message || msg; } catch (e) { /* keep default */ }
          if (res.status === 429) msg = "Too many submissions from this connection. Please wait and try again.";
          throw new Error(msg);
        }
        return data.message;
      });
    });
  };
})();
