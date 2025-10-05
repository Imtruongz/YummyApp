// Font configuration for Yummy App
// Following industry best practices for food/lifestyle apps

export const FONTS = {
  // Primary font family (Poppins - following Airbnb, Uber Eats pattern)
  PRIMARY: 'Poppins-Regular',
  
  // Font weights (following Material Design + iOS guidelines)
  WEIGHTS: {
    THIN: 'Poppins-Thin',           // 100 - Minimal use
    LIGHT: 'Poppins-Light',         // 300 - Subtle text
    REGULAR: 'Poppins-Regular',     // 400 - Body text (most used)
    MEDIUM: 'Poppins-Medium',       // 500 - Emphasis
    SEMI_BOLD: 'Poppins-SemiBold',  // 600 - Headings
    BOLD: 'Poppins-Bold',           // 700 - Strong emphasis
    EXTRA_BOLD: 'Poppins-ExtraBold', // 800 - Rare use
    BLACK: 'Poppins-Black',         // 900 - Display only
  },
  
  // Fallback fonts (system fonts as backup)
  FALLBACK: {
    IOS: 'San Francisco',
    ANDROID: 'Roboto',
    DEFAULT: 'System',
  }
};

// Typography scale (following 8pt grid system like big tech)
export const FONT_SIZES = {
  // Following iOS/Android guidelines
  CAPTION: 12,    // Small labels, captions
  BODY_SMALL: 14, // Secondary text
  BODY: 16,       // Primary body text (most readable on mobile)
  SUBTITLE: 18,   // Card titles, section headers
  TITLE: 20,      // Screen titles
  LARGE_TITLE: 24, // Main headings
  DISPLAY: 32,    // Hero text, brand name
  GIANT: 40,      // Splash screen, special occasions
};

// Line heights (following accessibility guidelines)
export const LINE_HEIGHTS = {
  TIGHT: 1.2,     // Headings, tight layouts
  NORMAL: 1.4,    // Body text (optimal for reading)
  RELAXED: 1.6,   // Long-form content
  LOOSE: 1.8,     // Accessibility, large text
};

// Font utilities matching big tech patterns
export const getFontFamily = (weight: keyof typeof FONTS.WEIGHTS = 'REGULAR') => {
  return FONTS.WEIGHTS[weight];
};

export const getTypographyStyle = (
  size: keyof typeof FONT_SIZES,
  weight: keyof typeof FONTS.WEIGHTS = 'REGULAR',
  lineHeight?: keyof typeof LINE_HEIGHTS
) => ({
  fontFamily: getFontFamily(weight),
  fontSize: FONT_SIZES[size],
  lineHeight: lineHeight ? FONT_SIZES[size] * LINE_HEIGHTS[lineHeight] : FONT_SIZES[size] * LINE_HEIGHTS.NORMAL,
});

// Predefined styles matching industry standards
export const TYPOGRAPHY_PRESETS = {
  // Following Material Design + iOS Human Interface Guidelines
  DISPLAY_LARGE: getTypographyStyle('DISPLAY', 'BOLD', 'TIGHT'),
  DISPLAY_MEDIUM: getTypographyStyle('GIANT', 'BOLD', 'TIGHT'),
  DISPLAY_SMALL: getTypographyStyle('LARGE_TITLE', 'SEMI_BOLD', 'TIGHT'),
  
  HEADLINE_LARGE: getTypographyStyle('TITLE', 'SEMI_BOLD', 'TIGHT'),
  HEADLINE_MEDIUM: getTypographyStyle('SUBTITLE', 'MEDIUM', 'NORMAL'),
  HEADLINE_SMALL: getTypographyStyle('BODY', 'MEDIUM', 'NORMAL'),
  
  BODY_LARGE: getTypographyStyle('BODY', 'REGULAR', 'NORMAL'),
  BODY_MEDIUM: getTypographyStyle('BODY_SMALL', 'REGULAR', 'NORMAL'),
  BODY_SMALL: getTypographyStyle('CAPTION', 'REGULAR', 'NORMAL'),
  
  LABEL_LARGE: getTypographyStyle('BODY_SMALL', 'MEDIUM', 'NORMAL'),
  LABEL_MEDIUM: getTypographyStyle('CAPTION', 'MEDIUM', 'NORMAL'),
  LABEL_SMALL: getTypographyStyle('CAPTION', 'MEDIUM', 'TIGHT'),
};

// Usage examples for different app sections
export const APP_TYPOGRAPHY = {
  // App branding
  APP_NAME: TYPOGRAPHY_PRESETS.DISPLAY_MEDIUM,
  WELCOME_TITLE: TYPOGRAPHY_PRESETS.DISPLAY_SMALL,
  
  // Navigation
  TAB_LABEL: TYPOGRAPHY_PRESETS.LABEL_SMALL,
  SCREEN_TITLE: TYPOGRAPHY_PRESETS.HEADLINE_LARGE,
  
  // Food items
  FOOD_NAME: TYPOGRAPHY_PRESETS.HEADLINE_MEDIUM,
  FOOD_PRICE: TYPOGRAPHY_PRESETS.HEADLINE_SMALL,
  FOOD_DESCRIPTION: TYPOGRAPHY_PRESETS.BODY_MEDIUM,
  
  // UI Components
  BUTTON_TEXT: TYPOGRAPHY_PRESETS.LABEL_LARGE,
  INPUT_LABEL: TYPOGRAPHY_PRESETS.LABEL_MEDIUM,
  CAPTION_TEXT: TYPOGRAPHY_PRESETS.BODY_SMALL,
  
  // Lists and cards
  LIST_TITLE: TYPOGRAPHY_PRESETS.HEADLINE_SMALL,
  LIST_SUBTITLE: TYPOGRAPHY_PRESETS.BODY_MEDIUM,
  CARD_TITLE: TYPOGRAPHY_PRESETS.HEADLINE_MEDIUM,
  CARD_CONTENT: TYPOGRAPHY_PRESETS.BODY_LARGE,
};