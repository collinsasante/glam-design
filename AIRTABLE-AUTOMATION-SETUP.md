# Airtable Automation Setup Guide
## Send Design Review Links via WhatsApp Automatically

This guide will help you set up an Airtable automation that sends unique design review links to customers via WhatsApp with a single click.

---

## 📋 Table of Contents
1. [Setup Overview](#setup-overview)
2. [Step 1: Add Fields to Submissions Table](#step-1-add-fields-to-submissions-table)
3. [Step 2: Create Formula for Review Link](#step-2-create-formula-for-review-link)
4. [Step 3: Set Up Automation](#step-3-set-up-automation)
5. [Step 4: Test the System](#step-4-test-the-system)
6. [Troubleshooting](#troubleshooting)

---

## Setup Overview

**What you'll create:**
- A "Design URL" field to paste the customer's design
- A "Review Link" field that auto-generates the unique URL
- A "Send Review Link" button that triggers WhatsApp
- An automation that opens WhatsApp with a pre-filled message

**How it works:**
1. You upload customer's design to Cloudinary
2. Paste design URL in Airtable
3. Click "Send Review Link" button
4. WhatsApp opens with pre-filled message containing the review link
5. Send to customer

---

## Step 1: Add Fields to Submissions Table

### 1.1 Add "Design URL" Field
1. Go to your **Submissions** table in Airtable
2. Click **+** to add a new field
3. Choose field type: **URL**
4. Name it: **Design URL**
5. Click **Create field**

### 1.2 Add "Review Link" Field (Formula)
1. Click **+** to add a new field
2. Choose field type: **Formula**
3. Name it: **Review Link**
4. Paste this formula:

```javascript
IF(
  {Design URL},
  CONCATENATE(
    "https://glam-design.pages.dev/Design%20Review.html?project=ORDER-",
    RECORD_ID(),
    "&customer=",
    ENCODE_URL_COMPONENT({Customer Name}),
    "&design=",
    ENCODE_URL_COMPONENT({Design URL})
  ),
  ""
)
```

5. Click **Create field**

**What this does:**
- Generates a unique link for each order
- Uses Airtable's RECORD_ID() as the order number (guaranteed unique)
- URL-encodes customer name and design URL
- Only creates link if Design URL is filled

### 1.3 Add "Send Review Link" Button
1. Click **+** to add a new field
2. Choose field type: **Button**
3. Name it: **Send Review Link**
4. Click **Customize button**
5. Choose action: **Open URL**
6. Paste this formula:

```javascript
CONCATENATE(
  "https://wa.me/",
  SUBSTITUTE({Phone Number}, " ", ""),
  "?text=",
  ENCODE_URL_COMPONENT(
    CONCATENATE(
      "Hi ", {Customer Name}, "! 👋\n\n",
      "Your design for *", {Product Name}, "* is ready for review! 🎨\n\n",
      "Please click the link below to view and provide feedback:\n",
      {Review Link}, "\n\n",
      "📝 *How to use:*\n",
      "1. Click anywhere on the design to add comments\n",
      "2. Enter your name and feedback\n",
      "3. Submit\n\n",
      "We look forward to your feedback!\n\n",
      "- Packaging Glamour Team"
    )
  )
)
```

7. Label: **📱 Send via WhatsApp**
8. Click **Save**

---

## Step 2: Update Your Site URL

### 2.1 If using custom domain:
Replace `https://glam-design.pages.dev` with your actual domain in the formulas above.

Example:
```javascript
"https://forms.yourdomain.com/Design%20Review.html?project=ORDER-",
```

### 2.2 Note about RECORD_ID():
- RECORD_ID() generates unique IDs like `recABC123`
- If you prefer sequential numbers (1, 2, 3), use an **Autonumber** field instead
- To use Autonumber:
  1. Create new field type: **Autonumber**
  2. Name it: **Order Number**
  3. Replace `RECORD_ID()` with `{Order Number}` in the formulas

---

## Step 3: Set Up Automation (Optional - Advanced)

If you want to send automatically instead of clicking button:

### 3.1 Create Automation
1. Go to **Automations** tab in Airtable
2. Click **Create automation**
3. Name it: **Send Design Review Link**

### 3.2 Configure Trigger
1. Choose trigger: **When record matches conditions**
2. Table: **Submissions**
3. Condition: **Design URL** → **is not empty**
4. Click **Continue**

### 3.3 Add Action (Optional - requires Zapier or Make.com)
**Note:** Airtable doesn't send WhatsApp messages directly. You have two options:

**Option A: Manual (Recommended)**
- Use the button field (Step 1.3) - it's simpler and free

**Option B: Automatic (Advanced)**
- Requires Zapier or Make.com integration
- Costs money for automation
- Steps:
  1. Airtable → Webhook → Zapier/Make
  2. Zapier/Make → WhatsApp Business API
  3. Send message with review link

**For most users, the button method is best!**

---

## Step 4: Test the System

### 4.1 Create Test Order
1. Go to your Submissions table
2. Find a test order with:
   - Customer Name filled
   - Phone Number filled
   - Product Name filled

### 4.2 Add Design URL
1. Upload a test design to Cloudinary
2. Copy the image URL
3. Paste in **Design URL** field
4. The **Review Link** should auto-generate

### 4.3 Send Test Message
1. Click **📱 Send via WhatsApp** button
2. WhatsApp Web/App should open
3. Verify the message looks correct
4. Send to your own number first to test

### 4.4 Test Review Link
1. Click the review link in WhatsApp
2. Verify:
   - ✅ Design image loads
   - ✅ Project info shows correctly
   - ✅ Customer name displays
   - ✅ Can add comments
   - ✅ Comments save to Airtable

---

## 🎯 Complete Workflow

### Daily Usage:
1. **Customer submits order** → Saved in Airtable
2. **You create design** → Upload to Cloudinary
3. **Copy Cloudinary URL** → Paste in "Design URL" field
4. **Review Link auto-generates** → Formula creates unique URL
5. **Click "Send via WhatsApp"** → Opens WhatsApp with message
6. **Send to customer** → Customer receives link
7. **Customer reviews** → Feedback saves to "Design Feedback" table
8. **You see feedback** → Make revisions
9. **Repeat if needed** → Send updated design link

---

## 📱 What the Customer Receives

**WhatsApp Message:**
```
Hi John Doe! 👋

Your design for *Face Cream* is ready for review! 🎨

Please click the link below to view and provide feedback:
https://glam-design.pages.dev/Design%20Review.html?project=ORDER-recABC123&customer=John%20Doe&design=https://...

📝 *How to use:*
1. Click anywhere on the design to add comments
2. Enter your name and feedback
3. Submit

We look forward to your feedback!

- Packaging Glamour Team
```

---

## 🔧 Troubleshooting

### Issue: Review Link is blank
**Solution:** Make sure "Design URL" field is filled

### Issue: WhatsApp doesn't open
**Solution:**
- Check phone number format (should be: 233XXXXXXXXX)
- Remove spaces from phone number field
- Use international format without + or spaces

### Issue: Design image doesn't load
**Solution:**
- Verify Cloudinary URL is public
- Make sure URL starts with https://
- Test URL in browser first

### Issue: Customer feedback not appearing in Airtable
**Solution:**
- Check "Design Feedback" table exists
- Verify field names match exactly
- Check Cloudflare environment variables are set

### Issue: Button doesn't appear
**Solution:**
- Make sure you created a "Button" field type
- Verify formula is correct (no syntax errors)
- Refresh Airtable page

---

## 📊 Required Airtable Fields Summary

### Submissions Table:
| Field Name | Field Type | Purpose |
|------------|-----------|---------|
| Customer Name | Single line text | Auto-filled from form |
| Phone Number | Phone number | Auto-filled from form |
| Product Name | Single line text | Auto-filled from form |
| Design URL | URL | **You add this** |
| Review Link | Formula | Auto-generates |
| Send Review Link | Button | Click to send |

### Design Feedback Table (already created):
| Field Name | Field Type | Purpose |
|------------|-----------|---------|
| Project ID | Single line text | Links to order |
| Customer Name | Single line text | From review link |
| Reviewer Name | Single line text | Who gave feedback |
| Feedback | Long text | The comment |
| Position X | Number | Where they clicked |
| Position Y | Number | Where they clicked |
| Timestamp | Single line text | When submitted |
| Marker Number | Number | Comment number |

---

## 🎨 Optional: Customize the Message

Edit the button formula to change the WhatsApp message:

```javascript
CONCATENATE(
  "https://wa.me/",
  SUBSTITUTE({Phone Number}, " ", ""),
  "?text=",
  ENCODE_URL_COMPONENT(
    "Your custom message here:\n" &
    {Review Link}
  )
)
```

---

## 💡 Pro Tips

1. **Create a View** for "Pending Reviews"
   - Filter: Design URL is not empty
   - Filter: Feedback count is 0

2. **Add Status Field**
   - Single select: Draft / Review Sent / Feedback Received / Approved

3. **Track Review Sends**
   - Add "Last Sent" field (Last modified time)
   - Add "Review Count" (Count from Design Feedback table)

4. **Use Autonumber for Sequential IDs**
   - Easier to reference (Order #1, #2, #3)
   - More professional looking

---

## 🚀 Quick Start Checklist

- [ ] Add "Design URL" field (URL type)
- [ ] Add "Review Link" field (Formula type)
- [ ] Add "Send Review Link" field (Button type)
- [ ] Update formulas with your site URL
- [ ] Test with a sample order
- [ ] Send test message to yourself
- [ ] Click test review link
- [ ] Verify feedback saves to Airtable
- [ ] Ready to use with real customers!

---

## Need Help?

If you run into issues:
1. Double-check field names match exactly
2. Verify formulas have no syntax errors
3. Test each component separately
4. Check Cloudflare environment variables

---

**Created by:** Packaging Glamour
**Last Updated:** January 2025
**Version:** 1.0
