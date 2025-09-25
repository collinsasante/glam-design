# Airtable Integration Setup Guide

This guide will help you connect your form to Airtable to store and view all form submissions.

## Step 1: Create Airtable Base

1. **Sign up for Airtable** at [airtable.com](https://airtable.com) (free plan works perfectly)
2. **Create a new base** called "Label Design Requests"
3. **Create a table** called "Submissions" (or rename the default table)

## Step 2: Set Up Table Columns

Create these columns in your Airtable table:

| Column Name            | Field Type              |
| ---------------------- | ----------------------- |
| Customer Name          | Single line text        |
| Phone Number           | Phone number            |
| Product Name           | Single line text        |
| Colors                 | Single line text        |
| Weight/Volume          | Single line text        |
| Ingredients            | Long text               |
| Manufacturing Date     | Date                    |
| Expiry Date            | Date                    |
| Batch Number           | Single line text        |
| Country of Origin      | Single line text        |
| Manufacturer Details   | Long text               |
| Directions for Use     | Long text               |
| Storage Instructions   | Long text               |
| Label Dimensions       | Single line text        |
| Special Considerations | Long text               |
| Terms Accepted         | Single select (Yes, No) |
| Files Uploaded         | Long text               |
| Submission Date        | Date and time           |

## Step 3: Get Your Airtable Credentials

### Base ID:

1. Go to [airtable.com/api](https://airtable.com/api)
2. Select your base
3. Copy the Base ID (starts with "app...")

### Table ID:

1. In your base URL, the table ID is after "/tbl" (starts with "tbl...")
2. Or use the table name directly (e.g., "Submissions")

### API Key:

1. Go to [airtable.com/account](https://airtable.com/account)
2. Click "Generate API key"
3. Copy your Personal Access Token (starts with "pat...")

## Step 4: Configure Your Form

1. Open `assets/js/custom.js`
2. Find lines 177-180 and replace the placeholders:

```javascript
var airtableConfig = {
  baseId: "appXXXXXXXXXXXXXX", // Your Base ID
  tableId: "tblXXXXXXXXXXXXXX", // Your Table ID or table name
  apiKey: "patXXXXXXXXXXXXXX.XXXXXXXXXXXXXXX" // Your API key
};
```

## Step 5: Test Your Form

1. Upload your files to your web server
2. Fill out and submit the form
3. Check your Airtable base - you should see the submission!

## Benefits of Airtable Integration

✅ **Beautiful Interface**: View submissions in a spreadsheet-like format
✅ **Rich Data Types**: Proper handling of dates, phone numbers, etc.
✅ **Filtering & Sorting**: Easy to find specific submissions
✅ **Views**: Create different views for pending/completed requests
✅ **Collaboration**: Share access with team members
✅ **Mobile App**: View submissions on your phone
✅ **Export Options**: Export to CSV, PDF, etc.
✅ **API Access**: Build additional integrations if needed

## Troubleshooting

**"Authentication failed"**: Check your API key
**"Base or table not found"**: Verify your Base ID and Table ID
**"Invalid data format"**: Ensure all column names match exactly
**CORS errors**: Airtable API supports direct browser calls

## Security Note

Your API key will be visible in the JavaScript file. For production use, consider:

- Using environment variables if your hosting supports them
- Implementing a simple backend proxy
- Using Airtable's more restrictive scoped tokens

## Free Plan Limits

- 1,200 records per base
- 2GB attachment storage per base
- API: 1,000 requests per month per workspace

This should be plenty for most form submissions!
