# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Type
Multi-step label design form application - 8-step wizard for collecting comprehensive product labeling information. Static HTML/CSS/JavaScript with no build system. All form fields are optional with no validation requirements.

## Development
Serve files using any HTTP server:
```bash
python -m http.server 8000
# or
php -S localhost:8000
```

## Architecture
8-step form wizard with complete label design data collection:

### Form Steps Structure
1. **Step 1:** Product basics (name, colors, weight/volume)
2. **Step 2:** Product details (ingredients, manufacturing/expiry dates)
3. **Step 3:** Manufacturing info (batch number, country of origin, manufacturer details)
4. **Step 4:** Usage instructions (directions, storage/precautions)
5. **Step 5:** File uploads (business logo, item photos, reference designs)
6. **Step 6:** Design specs (label dimensions, special considerations)
7. **Step 7:** Customer contact (full name, phone number)
8. **Step 8:** Summary review + terms acceptance + submission

### Core Files
- `index.html` - Complete 8-step form with Bootstrap 5 layout
- `assets/js/custom.js` - Step navigation, validation, summary population, terms modal
- `assets/css/style.css` - Custom styling with CSS variables
- `colorswitcher/` - Dynamic color theme switching system

### Key JavaScript Functions
- `showStep(step)` - Handles step navigation and button states
- `formvalidate(stepnumber)` - Validates current step (handles input, textarea, file types) - currently allows empty fields
- `populateSummary()` - Auto-populates final step with all form data
- Terms modal system with checkbox auto-checking

### Form Validation Logic
- **All fields are optional** - no `required` attributes or asterisks (*)
- Step-based navigation allows progression with empty fields
- File inputs are always optional
- Visual feedback with `.invalid` CSS class (currently not triggered due to optional fields)
- Form can be submitted without filling any fields

### File Upload Support
- Business logo: single file, images/PDF, 100MB max
- Item photos: multiple images, 10MB per file, up to 10 files
- Reference designs: multiple images, 10MB per file, up to 10 files

### Terms & Conditions System
- Modal popup with complete revision policy detailing 3 free revisions and GHC 50 additional revision fees
- Automatic checkbox checking on terms acceptance
- Terms checkbox is optional (no validation)

### Button States
- Steps 1-7: "Next" button with arrow icon
- Step 8: "Submit" button with thumbs-up icon
- Previous button appears from Step 2 onwards

## Form Submission
- AJAX submission using FormData to `form handling/send.php` (backend not included)
- Success redirect to `thankyou.html` (not included)
- Loading states and error handling included

## Project Structure
```
├── index.html              # Main form application
├── assets/
│   ├── css/
│   │   ├── style.css        # Main styles with CSS variables
│   │   ├── responsive.css   # Mobile responsiveness
│   │   ├── animation.css    # Form animations
│   │   ├── bootstrap.min.css
│   │   └── colorvariants/
│   │       └── default.css
│   ├── js/
│   │   ├── custom.js        # Form logic (documented with JSDoc)
│   │   ├── jquery-3.6.1.min.js
│   │   ├── bootstrap.min.js
│   │   └── callswitcher.js
│   └── images/             # Form assets and uploaded images
├── colorswitcher/          # Theme switching system
├── CLAUDE.md              # Development guide (this file)
├── README.md              # User documentation
└── .gitignore             # Git ignore patterns
```

## Dependencies
All local files - Bootstrap 5, jQuery 3.6.1, Font Awesome 6.2.0 (CDN)

## Best Practices Implemented

### Code Quality
- ✅ **JSDoc Documentation** - Complete function documentation with @param, @returns, @listens
- ✅ **Clean Code Structure** - Logical organization with clear separation of concerns
- ✅ **Consistent Coding Style** - Uniform formatting and naming conventions
- ✅ **Error Handling** - Proper AJAX error handling and form validation states

### Project Organization
- ✅ **Clean File Structure** - Logical directory organization by file type
- ✅ **Version Control Ready** - .gitignore with proper exclusion patterns
- ✅ **No System Artifacts** - All .DS_Store and temporary files removed
- ✅ **Asset Organization** - Images, CSS, and JS properly categorized

### Documentation
- ✅ **User Documentation** - Comprehensive README.md with quick start guide
- ✅ **Developer Guide** - This CLAUDE.md file with technical details
- ✅ **Code Comments** - Inline documentation for complex logic
- ✅ **Feature Overview** - Clear explanation of form steps and functionality

### Professional Standards
- ✅ **Responsive Design** - Mobile-friendly Bootstrap 5 implementation
- ✅ **Accessibility** - Proper form labels and semantic HTML structure
- ✅ **Performance** - Minimal dependencies, local asset loading
- ✅ **Security** - File upload size restrictions and type validation
- ✅ **UX/UI** - Intuitive multi-step navigation with progress indicators

### Maintenance
- ✅ **Modular Architecture** - Easy to extend with additional form steps
- ✅ **Theme Support** - Color switching system for branding customization
- ✅ **Backend Ready** - Form submission structure prepared for server integration
- ✅ **Testing Friendly** - Clear element IDs and structured HTML for testing