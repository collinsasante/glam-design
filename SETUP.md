# Backend Setup for Slack Integration

This form uses a secure backend to protect your Slack webhook URL from being exposed on the frontend.

## Setup Instructions

### 1. Server Requirements
- PHP 7.0 or higher
- cURL extension enabled
- Web server (Apache, Nginx, etc.)

### 2. Configure Slack Webhook
1. Go to your Slack workspace
2. Navigate to **Apps** → **Incoming Webhooks**
3. Create a new webhook for your desired channel
4. Copy the webhook URL (looks like: `https://hooks.slack.com/services/...`)

### 3. Configure Backend
1. Open `api/submit-form.php`
2. Find line 18: `$slackWebhookUrl = 'YOUR_SLACK_WEBHOOK_URL_HERE';`
3. Replace `YOUR_SLACK_WEBHOOK_URL_HERE` with your actual Slack webhook URL
4. Save the file

### 4. Upload Files
Upload all files to your web server, maintaining the directory structure:
```
your-domain.com/
├── index.html
├── assets/
├── api/
│   └── submit-form.php  (with your webhook URL configured)
└── SETUP.md (this file)
```

### 5. Test the Form
1. Visit your form in a browser
2. Fill out and submit the form
3. Check your Slack channel for the formatted message

## Security Features

✅ **Webhook URL Hidden**: Your Slack webhook is secure on the server
✅ **CORS Enabled**: Allows form submission from your domain
✅ **Input Validation**: Validates JSON data before processing
✅ **Error Handling**: Proper error responses and logging

## Troubleshooting

**Form shows "Submission failed":**
- Check if `api/submit-form.php` exists and is accessible
- Verify PHP cURL extension is enabled
- Check server error logs
- Ensure webhook URL is correctly configured

**Messages not appearing in Slack:**
- Verify your webhook URL is correct
- Check that the Slack channel exists
- Test the webhook URL directly with curl

**File upload information not showing:**
- File uploads are summarized by name and count only
- Actual file handling would require additional backend logic

## File Permissions
Ensure the `api/` directory and `submit-form.php` have appropriate read/execute permissions on your server.