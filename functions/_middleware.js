/**
 * Cloudflare Pages Functions Middleware
 * Injects environment variables into HTML pages
 */

export async function onRequest(context) {
  const response = await context.next();

  // Only process HTML responses
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    return response;
  }

  // Get environment variables
  const env = context.env;

  // Read the HTML content
  let html = await response.text();

  // Inject environment variables as a script tag before </head>
  const envScript = `
    <script>
      window.AIRTABLE_BASE_ID = "${env.AIRTABLE_BASE_ID || ""}";
      window.AIRTABLE_API_KEY = "${env.AIRTABLE_API_KEY || ""}";
      window.CLOUDINARY_CLOUD_NAME = "${env.CLOUDINARY_CLOUD_NAME || ""}";
      window.CLOUDINARY_UPLOAD_PRESET = "${env.CLOUDINARY_UPLOAD_PRESET || ""}";
    </script>
  `;

  // Insert before closing head tag
  html = html.replace("</head>", `${envScript}</head>`);

  // Return modified response
  return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}
