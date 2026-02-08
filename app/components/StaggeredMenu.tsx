'use client';

import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import './StaggeredMenu.css';
import UserAuth from './UserAuth';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================
interface MenuItem {
  label: string;
  link?: string;
  action?: () => void;
  ariaLabel?: string;
}

interface SocialItem {
  label: string;
  link: string;
}

interface StaggeredMenuProps {
  position?: 'left' | 'right';
  items?: MenuItem[];
  socialItems?: SocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  className?: string;
  colors?: [string, string];
  accentColor?: string;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
}

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

// Backdrop fade animation
const backdropVariants: Variants = {
  closed: {
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  open: {
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

// Container for staggered children
const menuContainerVariants: Variants = {
  closed: {
    transition: {
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
  open: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.3,
    },
  },
};

// Individual menu item animation
const menuItemVariants: Variants = {
  closed: {
    y: 80,
    opacity: 0,
    rotate: 8,
    transition: {
      duration: 0.25,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  open: {
    y: 0,
    opacity: 1,
    rotate: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Social items animation
const socialContainerVariants: Variants = {
  closed: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
  open: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.5,
    },
  },
};

const socialItemVariants: Variants = {
  closed: {
    y: 15,
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  open: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

// User auth section animation
const userAuthVariants: Variants = {
  closed: {
    y: 15,
    opacity: 0,
    transition: { duration: 0.2 },
  },
  open: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, delay: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// ============================================================================
// HAMBURGER ICON COMPONENT
// ============================================================================
const HamburgerIcon: React.FC<{ isOpen: boolean; onClick: () => void }> = ({
  isOpen,
  onClick,
}) => {
  return (
    <button
      className="hamburger-btn"
      onClick={onClick}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
    >
      <div className="hamburger-icon">
        {/* Top line - rotates to form X */}
        <motion.span
          className="hamburger-line"
          animate={{
            rotate: isOpen ? 45 : 0,
            y: isOpen ? 8 : 0,
          }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Middle line - fades out */}
        <motion.span
          className="hamburger-line"
          animate={{
            opacity: isOpen ? 0 : 1,
            scaleX: isOpen ? 0 : 1,
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        />
        {/* Bottom line - rotates to form X */}
        <motion.span
          className="hamburger-line"
          animate={{
            rotate: isOpen ? -45 : 0,
            y: isOpen ? -8 : 0,
          }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <span className="hamburger-text">
        <motion.span
          key={isOpen ? 'close' : 'menu'}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? 'Close' : 'Menu'}
        </motion.span>
      </span>
    </button>
  );
};

// ============================================================================
// MENU ITEM COMPONENT
// ============================================================================
const MenuItemComponent: React.FC<{
  item: MenuItem;
  index: number;
  onClick: () => void;
  showNumber: boolean;
}> = ({ item, index, onClick, showNumber }) => {
  const handleClick = (e: React.MouseEvent) => {
    if (item.action) {
      e.preventDefault();
      item.action();
    }
    onClick();
  };

  return (
    <motion.li
      className="menu-item-wrapper"
      variants={menuItemVariants}
    >
      <a
        href={item.link || '#'}
        className="menu-item"
        onClick={handleClick}
        aria-label={item.ariaLabel}
      >
        {showNumber && (
          <span className="menu-item-number">
            {String(index + 1).padStart(2, '0')}
          </span>
        )}
        <span className="menu-item-label">{item.label}</span>
        <span className="menu-item-indicator" />
      </a>
    </motion.li>
  );
};

// ============================================================================
// MAIN STAGGERED MENU COMPONENT
// ============================================================================
export const StaggeredMenu: React.FC<StaggeredMenuProps> = ({
  position = 'right',
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  className = '',
  colors = ['#B19EEF', '#5227FF'],
  accentColor = '#5227FF',
  onMenuOpen,
  onMenuClose,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  // Slide direction based on position
  const slideFrom = position === 'left' ? '-100%' : '100%';

  // Toggle menu state
  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        onMenuOpen?.();
      } else {
        onMenuClose?.();
      }
      return next;
    });
  }, [onMenuOpen, onMenuClose]);

  // Close menu handler
  const closeMenu = useCallback(() => {
    if (isOpen) {
      setIsOpen(false);
      onMenuClose?.();
    }
  }, [isOpen, onMenuClose]);

  // Disable body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeMenu();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeMenu]);

  return (
    <div
      className={`staggered-menu ${className}`}
      style={{
        '--accent-color': accentColor,
        '--layer-1-bg': colors[0],
        '--layer-2-bg': colors[1],
      } as React.CSSProperties}
    >
      {/* Hamburger Button - Always Visible */}
      <div className="menu-trigger">
        <HamburgerIcon isOpen={isOpen} onClick={toggleMenu} />
      </div>

      {/* Animated Menu Panel */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            {/* Dark Backdrop - Click to close */}
            <motion.div
              className="menu-backdrop"
              variants={backdropVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={closeMenu}
            />

            {/* Sliding Panel from Right */}
            <motion.aside
              className="menu-panel"
              data-position={position}
              initial={{ x: slideFrom }}
              animate={{ x: 0 }}
              exit={{ x: slideFrom }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Animated Pre-Layers (colored backgrounds) */}
              <motion.div
                className="menu-bg-layer layer-1"
                initial={{ x: slideFrom }}
                animate={{ x: 0 }}
                exit={{ x: slideFrom }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.div
                className="menu-bg-layer layer-2"
                initial={{ x: slideFrom }}
                animate={{ x: 0 }}
                exit={{ x: slideFrom }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
              />
              <motion.div
                className="menu-bg-layer layer-3"
                initial={{ x: slideFrom }}
                animate={{ x: 0 }}
                exit={{ x: slideFrom }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              />

              {/* Menu Content */}
              <div className="menu-content">
                {/* Navigation Items */}
                <motion.nav
                  className="menu-nav"
                  variants={menuContainerVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  <motion.ul className="menu-list">
                    {items.length > 0 ? (
                      items.map((item, index) => (
                        <MenuItemComponent
                          key={`${item.label}-${index}`}
                          item={item}
                          index={index}
                          onClick={closeMenu}
                          showNumber={displayItemNumbering}
                        />
                      ))
                    ) : (
                      <motion.li
                        className="menu-item-wrapper"
                        variants={menuItemVariants}
                      >
                        <span className="menu-item empty">No items</span>
                      </motion.li>
                    )}
                  </motion.ul>
                </motion.nav>

                {/* Footer Section: Socials + User Auth */}
                <div className="menu-footer">
                  {/* Social Links */}
                  {displaySocials && socialItems.length > 0 && (
                    <motion.div
                      className="menu-socials"
                      variants={socialContainerVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                    >
                      <motion.h3
                        className="socials-title"
                        variants={socialItemVariants}
                      >
                        Connect With Us
                      </motion.h3>
                      <motion.ul className="socials-list">
                        {socialItems.map((social, index) => (
                          <motion.li
                            key={`${social.label}-${index}`}
                            variants={socialItemVariants}
                          >
                            <a
                              href={social.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="social-link"
                            >
                              {social.label}
                            </a>
                          </motion.li>
                        ))}
                      </motion.ul>
                    </motion.div>
                  )}

                  {/* User Authentication */}
                  <motion.div
                    className="menu-user-auth"
                    variants={userAuthVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                  >
                    <UserAuth />
                  </motion.div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StaggeredMenu;
