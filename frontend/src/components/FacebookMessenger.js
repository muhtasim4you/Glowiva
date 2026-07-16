import React, { useEffect } from 'react';

/**
 * Facebook Messenger Chat Plugin
 * Adds a chat widget that connects to your Facebook Page Messenger
 * 
 * Setup Instructions:
 * 1. Create a Facebook Page for your business (if you don't have one)
 * 2. Get your Facebook Page ID from your Page settings
 * 3. Create a .env file in the frontend folder with:
 *    REACT_APP_FB_PAGE_ID=your_page_id_here
 * 4. Optional: Add REACT_APP_FB_APP_ID=your_app_id for better analytics
 */

const FacebookMessenger = () => {
  useEffect(() => {
    // Facebook Page ID from environment variable
    const pageId = process.env.REACT_APP_FB_PAGE_ID;

    // Only load if Page ID is configured
    if (!pageId) {
      return;
    }

    // Check if script is already loaded
    if (document.getElementById('facebook-jssdk')) {
      // Parse again if already loaded
      if (window.FB) {
        window.FB.XFBML.parse();
      }
      return;
    }

    // Load Facebook SDK
    window.fbAsyncInit = function() {
      window.FB.init({
        xfbml: true,
        version: 'v18.0'
      });
    };

    // Load the SDK asynchronously
    const script = document.createElement('script');
    script.id = 'facebook-jssdk';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    script.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
    
    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(script, firstScript);

  }, []);

  const pageId = process.env.REACT_APP_FB_PAGE_ID;

  // Don't render if Page ID is not configured
  if (!pageId) {
    return null;
  }

  return (
    <>
      {/* Messenger Chat Plugin - fb-root div is already in index.html */}
      <div
        className="fb-customerchat"
        attribution="setup_tool"
        page_id={pageId}
        theme_color="#E91E63"
        logged_in_greeting="Hi! How can we help you today? 😊"
        logged_out_greeting="Hi! How can we help you today? 😊"
        greeting_dialog_display="show"
        greeting_dialog_delay="5"
      ></div>
    </>
  );
};

export default FacebookMessenger;
