# Cloudinary Setup for File Uploads

To enable actual image uploads to your Airtable attachments, you need to set up Cloudinary (free image hosting service).

## Step 1: Create Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Free tier includes: 25GB storage, 25GB bandwidth/month

## Step 2: Get Your Credentials

1. Go to your Cloudinary Dashboard
2. Find your **Cloud Name** (e.g., "your-cloud-name")
3. Create an **Upload Preset**:
   - Go to Settings → Upload
   - Click "Add upload preset"
   - Set Mode to "Unsigned"
   - Give it a name (e.g., "form-uploads")
   - Save the preset name

## Step 3: Configure Your Form

1. Open `assets/js/custom.js`
2. Find lines 142 and 145
3. Replace the placeholders:

```javascript
formData.append('upload_preset', 'dfm3kmq1y'); // Replace with your preset name

const response = await fetch('https://api.cloudinary.com/v1_1/your-cloud-name/image/upload', {
```

**Example:**

```javascript
formData.append('upload_preset', 'form-uploads');

const response = await fetch('https://api.cloudinary.com/v1_1/mycompany/image/upload', {
```

## Step 4: Update Airtable Field

Make sure your "Files Uploaded" field in Airtable is set to **"Attachment"** type.

## How It Works

1. User uploads files in your form
2. Files are automatically uploaded to Cloudinary
3. Cloudinary returns public URLs
4. Those URLs are sent to Airtable as attachments
5. You can view/download the actual images in Airtable

## Benefits

✅ **Real Image Attachments**: See actual images in Airtable
✅ **Fast CDN**: Images load quickly from Cloudinary's global CDN
✅ **Free Tier**: 25GB storage/bandwidth per month
✅ **Automatic Optimization**: Images are automatically optimized
✅ **Secure**: Files are hosted securely on Cloudinary

## Free Tier Limits

- 25GB storage
- 25GB bandwidth per month
- 1,000 transformations per month
- Should be plenty for most form submissions!

## Alternative Options

If you prefer not to use Cloudinary, you can:

1. Use the text summary version (change back to "Long text" field)
2. Set up your own file hosting
3. Use other services like Imgur or Firebase Storage
