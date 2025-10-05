// Typography Usage Examples - Following Big Tech Patterns
// Use this as reference for consistent typography across Yummy app

import React from 'react';
import { View } from 'react-native';
import Typography from '../components/customize/Typography';

export const TypographyExamples = () => {
  return (
    <View>
      {/* App Branding - Like Spotify, Netflix */}
      <Typography 
        title="Yummy" 
        appStyle="APP_NAME" 
      />
      
      {/* Screen Titles - Like Instagram, WhatsApp */}
      <Typography 
        title="Discover Delicious Food" 
        appStyle="SCREEN_TITLE" 
      />
      
      {/* Food Items - Like Uber Eats, DoorDash */}
      <Typography 
        title="Margherita Pizza" 
        appStyle="FOOD_NAME" 
      />
      <Typography 
        title="$12.99" 
        appStyle="FOOD_PRICE" 
      />
      <Typography 
        title="Fresh mozzarella, tomato sauce, basil leaves on crispy thin crust" 
        appStyle="FOOD_DESCRIPTION" 
      />
      
      {/* Buttons - Like Apple, Google Material */}
      <Typography 
        title="Add to Cart" 
        appStyle="BUTTON_TEXT" 
      />
      
      {/* Using Presets (Material Design + iOS style) */}
      <Typography 
        title="Featured Restaurants" 
        preset="HEADLINE_LARGE" 
      />
      <Typography 
        title="Near your location" 
        preset="BODY_MEDIUM" 
      />
      
      {/* Custom combinations */}
      <Typography 
        title="Special Offer!" 
        preset="HEADLINE_MEDIUM" 
        color="#FF6B35" 
        textAlign="center"
      />
      
      {/* Traditional props still work */}
      <Typography 
        title="Legacy text" 
        fontSize={18} 
        fontFamily="Poppins-Bold" 
        color="#333333"
      />
    </View>
  );
};

// Migration Guide - How to update existing components
export const MIGRATION_EXAMPLES = {
  // OLD WAY (current):
  old: `<Typography 
    title="Food Name" 
    fontSize={18} 
    fontFamily="Poppins-SemiBold" 
    color="#333" 
  />`,
  
  // NEW WAY (industry standard):
  new: `<Typography 
    title="Food Name" 
    appStyle="FOOD_NAME" 
  />`,
  
  // Benefits: Consistent, maintainable, follows big tech patterns
};

// Color combinations that work well with Poppins
export const FONT_COLOR_COMBINATIONS = {
  // Following Material Design + iOS guidelines
  PRIMARY_TEXT: '#212121',      // Dark gray - primary content
  SECONDARY_TEXT: '#757575',    // Medium gray - secondary content  
  DISABLED_TEXT: '#BDBDBD',     // Light gray - disabled states
  
  // Brand colors (adjust to your Yummy brand)
  BRAND_PRIMARY: '#FF6B35',     // Orange - food/appetite
  BRAND_SECONDARY: '#4CAF50',   // Green - fresh/healthy
  
  // Semantic colors
  SUCCESS: '#4CAF50',           // Green
  WARNING: '#FF9800',           // Orange  
  ERROR: '#F44336',             // Red
  INFO: '#2196F3',              // Blue
  
  // Background combinations
  ON_WHITE: '#212121',          // Dark text on white
  ON_DARK: '#FFFFFF',           // White text on dark
  ON_BRAND: '#FFFFFF',          // White text on brand colors
};