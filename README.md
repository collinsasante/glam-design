# Label Design Form

A professional 8-step form wizard for collecting comprehensive product labeling information.

## Features

- ✅ **8-Step Wizard** - Organized data collection across logical steps
- ✅ **Fully Optional Fields** - Users can submit with any level of completion
- ✅ **File Uploads** - Support for logos, item photos, and reference designs
- ✅ **Terms Modal** - Professional terms and conditions with revision policy
- ✅ **Summary Review** - Complete form review before submission
- ✅ **Responsive Design** - Works on desktop and mobile devices
- ✅ **Color Themes** - Built-in theme switching capability

## Quick Start

1. **Serve the files** using any HTTP server:
   ```bash
   python -m http.server 8000
   # or
   php -S localhost:8000
   ```

2. **Open your browser** to `http://localhost:8000`

## Form Steps

1. **Product Basics** - Name, colors, weight/volume
2. **Product Details** - Ingredients, dates
3. **Manufacturing** - Batch number, country, manufacturer info
4. **Usage** - Directions and storage instructions
5. **File Uploads** - Logo, photos, references
6. **Design Specs** - Dimensions and special considerations
7. **Contact** - Customer details
8. **Review** - Summary and terms acceptance

## Project Structure

```
├── index.html              # Main form application
├── assets/
│   ├── css/
│   │   ├── style.css        # Main styles
│   │   ├── responsive.css   # Mobile responsiveness
│   │   ├── animation.css    # Form animations
│   │   └── bootstrap.min.css
│   ├── js/
│   │   ├── custom.js        # Form logic and navigation
│   │   ├── jquery-3.6.1.min.js
│   │   └── bootstrap.min.js
│   └── images/             # Form assets
├── colorswitcher/          # Theme switching system
└── CLAUDE.md              # Development guide
```

## Dependencies

- **Bootstrap 5** - UI framework
- **jQuery 3.6.1** - JavaScript library
- **Font Awesome 6.2.0** - Icons (CDN)

## Customization

- **Colors**: Edit CSS variables in `assets/css/style.css`
- **Steps**: Modify step content in `index.html`
- **Logic**: Update form behavior in `assets/js/custom.js`
- **Themes**: Add new color schemes in `colorswitcher/`

## Backend Integration

The form submits via AJAX to `form handling/send.php`. Implement your backend to:

1. Receive FormData with all form fields
2. Handle file uploads (logo, photos, references)
3. Process optional fields gracefully
4. Redirect to success page

## License

Template for label design form collection.