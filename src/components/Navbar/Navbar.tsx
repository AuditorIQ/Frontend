import React, { useState } from 'react';
import './Navbar.css';

type NavLink = {
  id: string;
  label: string;
};

const Navbar: React.FC = () => {
  const links: NavLink[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'features', label: 'Features' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'contactus', label: 'Contact Us' },
  ];

  const [activeLink, setActiveLink] = useState<string>('home');

  const handleClick = (id: string) => {
    setActiveLink(id);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {links.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className={`nav-link ${activeLink === link.id ? 'active' : ''}`}
            onClick={() => handleClick(link.id)}
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
