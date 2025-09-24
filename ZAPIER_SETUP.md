# Zapier + Airtable Setup Guide

## 1. Create Zapier Webhook

1. **Login to Zapier** → Create new Zap
2. **Trigger**: Search "Webhooks by Zapier" → Select "Catch Hook"
3. **Copy the webhook URL** (looks like: `https://hooks.zapier.com/hooks/catch/xxxxx/xxxxxx/`)

## 2. Update Your Form Code

1. **Open**: `assets/js/custom.js`
2. **Find line 212**: `var zapierWebhookUrl = "YOUR_ZAPIER_WEBHOOK_URL_HERE";`
3. **Replace with**: Your actual Zapier webhook URL

```javascript
var zapierWebhookUrl = "https://hooks.zapier.com/hooks/catch/xxxxx/xxxxxx/";
```

## 3. Create Airtable Base

Create a new Airtable base with these columns:

### Product Information
- **Product Name** (Single line text)
- **Colors** (Single line text)
- **Weight Volume** (Single line text)
- **Ingredients** (Long text)
- **Manufacturing Date** (Date)
- **Expiry Date** (Date)

### Manufacturing Details
- **Batch Number** (Single line text)
- **Country Origin** (Single line text)
- **Manufacturer Details** (Long text)

### Usage Instructions
- **Directions Use** (Long text)
- **Storage Instructions** (Long text)

### Design & Contact
- **Label Dimensions** (Single line text)
- **Special Considerations** (Long text)
- **Full Name** (Single line text)
- **Phone Number** (Phone number)

### System Fields
- **Submitted At** (Date & Time)
- **Terms Accepted** (Checkbox)

### File Attachments (Optional)
- **Business Logo** (Attachment)
- **Item Photos** (Attachment)
- **Reference Designs** (Attachment)

## 4. Configure Zapier Action

1. **Action**: Search "Airtable" → Select "Create Record"
2. **Connect your Airtable account**
3. **Select your base and table**
4. **Map fields**:
   - Product Name → `product-name`
   - Colors → `colors`
   - Weight Volume → `weight-volume`
   - Ingredients → `ingredients`
   - Manufacturing Date → `manufacturing-date`
   - Expiry Date → `expiry-date`
   - Batch Number → `batch-number`
   - Country Origin → `country-origin`
   - Manufacturer Details → `manufacturer-details`
   - Directions Use → `directions-use`
   - Storage Instructions → `storage-instructions`
   - Label Dimensions → `label-dimensions`
   - Special Considerations → `special-considerations`
   - Full Name → `full-name`
   - Phone Number → `phone-number`
   - Submitted At → `submitted_at`
   - Terms Accepted → `terms-checkbox`

## 5. Test Your Setup

1. **In Zapier**: Click "Test & Continue" on both steps
2. **Test the form**: Fill out your form and submit
3. **Check Airtable**: Verify data appears correctly

## 6. Handle File Uploads (Advanced)

For file uploads, you may need additional Zapier steps:
1. **Add Zapier Code step** to process base64 file data
2. **Use Zapier Storage** to temporarily store files
3. **Add files to Airtable** via attachment fields

## Troubleshooting

- **CORS errors**: Zapier webhooks handle CORS automatically
- **Data not appearing**: Check field mapping in Zapier
- **File upload issues**: Files convert to base64, may need processing
- **Test webhook**: Use Zapier's test feature before going live

## Cost Estimate
- **Zapier**: Free tier (100 tasks/month) or $19.99/month
- **Airtable**: Free tier (1,200 records) or $10/month per user