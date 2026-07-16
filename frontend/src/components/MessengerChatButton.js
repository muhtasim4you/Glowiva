import React, { useState } from 'react';
import { FaFacebookMessenger } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

/**
 * Custom Messenger Chat Button
 * Opens Facebook Messenger in a new window/tab
 * Works even when Facebook SDK is blocked by browser tracking prevention
 */

const MessengerChatButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  const facebookPageId = process.env.REACT_APP_FB_PAGE_ID || '554189441121473';
  const messengerUrl = `https://m.me/${facebookPageId}`;

  const handleClick = () => {
    setShowTooltip(false);
    // Open Messenger in a new window
    window.open(messengerUrl, '_blank', 'width=600,height=700');
  };

  // Don't show if no Page ID configured
  if (!facebookPageId) {
    return null;
  }

  return (
    <>
      {/* Chat Button - positioned above mobile bottom nav */}
      <div
        className="fixed md:bottom-5 md:right-5"
        style={{
          bottom: '90px', // Above mobile bottom nav on mobile
          right: '16px',
          zIndex: 10000, // Higher than bottom nav (9999)
        }}
      >

        {/* Tooltip */}
        {showTooltip && (
          <div
            className="absolute bg-white text-gray-800 px-3 py-2 rounded-lg shadow-xl mb-2 border border-gray-200"
            style={{
              bottom: '68px',
              right: '0',
              minWidth: '180px',
              maxWidth: '220px',
            }}
          >
            <div className="text-sm font-medium">Chat with us!</div>
            <div className="text-xs text-gray-600 mt-1">
              Hi! How can we help you? 😊
            </div>
            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="absolute top-1 right-1 text-gray-400 hover:text-gray-600 p-1"
            >
              <IoClose size={16} />
            </button>
          </div>
        )}

        {/* Main Chat Button */}
        <button
          onClick={handleClick}
          onMouseEnter={() => {
            setTimeout(() => setShowTooltip(true), 1000);
          }}
          onMouseLeave={() => {
            setShowTooltip(false);
          }}
          className="flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 relative"
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '28px',
            backgroundColor: '#E91E63',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
          aria-label="Chat with us on Messenger"
        >
          <FaFacebookMessenger size={26} className="text-white" />
        </button>

        {/* Pulse animation for attention */}
        <div
          className="absolute rounded-full animate-ping opacity-20 pointer-events-none"
          style={{
            backgroundColor: '#E91E63',
            width: '56px',
            height: '56px',
            top: '0',
            left: '0',
          }}
        />
      </div>
    </>
  );
};

export default MessengerChatButton;
