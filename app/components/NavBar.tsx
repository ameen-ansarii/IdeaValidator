"use client";

import React from "react";
import StaggeredMenu from "../components/StaggeredMenu";

export default function NavBar() {
    // Menu items - matching your original example
    const menuItems = [
        { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
        { label: 'Domain Checker', ariaLabel: 'Check domain availability', link: '/domain-checker' },
        { label: 'About', ariaLabel: 'Learn about us', link: '/about' },
        { label: 'History', ariaLabel: 'View history', link: '/history' },
        { label: 'Pricing', ariaLabel: 'View our pricing', link: '/pricing' },
        { label: 'Contact', ariaLabel: 'Get in touch', link: '/legal' },
    ];

    // Social media links
    const socialItems = [
        { label: 'Twitter', link: 'https://twitter.com' },
        { label: 'GitHub', link: 'https://github.com' },
        { label: 'LinkedIn', link: 'https://linkedin.com' }
    ];

    return (
        <StaggeredMenu
            position="right"
            items={menuItems}
            socialItems={socialItems}
            displaySocials={true}
            displayItemNumbering={true}
            colors={['#B19EEF', '#5227FF']}
            accentColor="#5227FF"
            onMenuOpen={() => console.log('Menu opened')}
            onMenuClose={() => console.log('Menu closed')}
        />
    );
}
