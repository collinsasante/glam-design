# Airtable Integration Setup Guide

This guide will help you connect your form to Airtable to store and view all form submissions.

## Step 1: Create Airtable Base

1. **Sign up for Airtable** at [airtable.com](https://airtable.com) (free plan works perfectly)
2. **Create a new base** called "Label Design Requests"
3. **Create a table** called "Submissions" (or rename the default table)

## Step 2: Set Up Table Columns

Create these columns in your Airtable table:

| Column Name            | Field Type              | Used By                          |
| ---------------------- | ----------------------- | -------------------------------- |
| Logo Name              | Single line text        | Logo Design Form                 |
| Customer Name          | Single line text        | All Forms                        |
| Phone Number           | Phone number            | All Forms                        |
| Phone 2                | Phone number            | All Forms                        |
| Product Name           | Single line text        | FDA Form, Non-FDA Form           |
| color                  | Single line text        | All Forms                        |
| Weight/Volume          | Single line text        | FDA Form, Non-FDA Form           |
| Ingredients            | Long text               | FDA Form, Non-FDA Form           |
| Manufacturing Date     | Date                    | FDA Form, Non-FDA Form           |
| Expiry Date            | Date                    | FDA Form, Non-FDA Form           |
| Batch Number           | Single line text        | FDA Form                         |
| Country of Origin      | Single line text        | FDA Form                         |
| Manufacturer Details   | Long text               | FDA Form, Non-FDA Form           |
| Directions for Use     | Long text               | FDA Form                         |
| Storage Instructions   | Long text               | FDA Form                         |
| Label Dimensions       | Single line text        | FDA Form                         |
| Special Considerations | Long text               | FDA Form                         |
| Label Type             | Single line text        | FDA Form, Non-FDA Form           |
| Terms Accepted         | Single select (Yes, No) | All Forms                        |
| Files Uploaded         | Long text               | All Forms                        |
| Submission Date        | Date and time           | All Forms                        |

**Note**: The table is designed to accommodate all three form types (FDA Compliant Design, Standard Design, and Logo Design). Not all fields will be filled for every submission - only the relevant fields for each form type will contain data.

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
2. Find lines 178-182 and replace the placeholders:

```javascript
var airtableConfig = {
  baseId: "appXXXXXXXXXXXXXX", // Your Base ID
  tableId: "tblXXXXXXXXXXXXXX", // Your Table ID or table name
  apiKey: "patXXXXXXXXXXXXXX.XXXXXXXXXXXXXXX" // Your API key
};
```

## Step 5: Understanding Different Form Types

Your application now has **three different forms** that all submit to the same Airtable table:

### 1. FDA Compliant Design Form (`fda-form.html`)
- **8 steps**: Product info, details, manufacturing, usage, uploads, design specs, contact, summary
- **Use case**: Products requiring FDA approval with comprehensive labeling
- **JavaScript**: `assets/js/custom.js`

### 2. Standard Design Form (`non-fda-form.html`)
- **5 steps**: Product info, manufacturer info, file uploads, contact, summary
- **Use case**: Products not requiring FDA approval with simplified labeling
- **JavaScript**: `assets/js/non-fda-custom.js`

### 3. Logo Design Form (`logo-form.html`)
- **4 steps**: Logo information, file uploads, contact details, summary
- **Fields collected**:
  - Logo Name
  - Preferred Colors (Max 3)
  - Customer Name
  - WhatsApp Number (Phone Number)
  - Phone Number 2 (Optional)
  - Reference Designs (Optional file uploads)
- **Use case**: Clients requesting logo design services only
- **JavaScript**: `assets/js/logo-custom.js`

All three forms submit data to the same **Submissions** table, making it easy to manage all design requests in one place.

## Step 6: Deploy to Cloudflare Pages

1. **Connect your GitHub repository** to Cloudflare Pages
2. **Set build settings**:
   - Build command: (leave empty)
   - Build output directory: (leave empty or "/")
3. **Deploy** - your site will be available at `yourproject.pages.dev`

## Step 7: Test Your Forms

1. Test each form type:
   - FDA Compliant Design Form
   - Standard Design Form
   - Logo Design Form
2. Check your Airtable base - you should see all submissions in the same table!
3. You can identify form types by the "Form Type" or "Label Type" fields

## Benefits of Airtable Integration

✅ **Beautiful Interface**: View submissions in a spreadsheet-like format
✅ **Rich Data Types**: Proper handling of dates, phone numbers, etc.
✅ **Filtering & Sorting**: Easy to find specific submissions
✅ **Views**: Create different views for pending/completed requests
✅ **Collaboration**: Share access with team members
✅ **Mobile App**: View submissions on your phone
✅ **Export Options**: Export to CSV, PDF, etc.
✅ **API Access**: Build additional integrations if needed

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

## Troubleshooting

**"Authentication failed"**: Check your API key
**"Base or table not found"**: Verify your Base ID and Table ID
**"Invalid data format"**: Ensure all column names match exactly
**CORS errors**: Airtable API supports direct browser calls