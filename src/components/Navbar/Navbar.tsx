import React, { useState, useEffect } from 'react';
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
    { id: 'contactus', label: 'Contact' },
  ];

  const [activeLink, setActiveLink] = useState<string>('home');

  const handleClick = (id: string) => {
    setActiveLink(id);
  };

  const linkClass = (id: string) =>
    activeLink === id
      ? 'active'
      : '';

      useEffect(() => {
        const handleScroll = () => {
          const scrollY = window.scrollY;
    
          for (let i = links.length - 1; i >= 0; i--) {
            const id = links[i].id;
            const el = document.getElementById(id);
            if (el && scrollY >= el.offsetTop - 80) {
              setActiveLink(id);
              break;
            }
          }
        };
    
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
      }, []);

  return (
    <nav className="navbar">
      <div className="nav-container">
        {links.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className={`linkClass('${link.id}') nav-link ${activeLink === link.id ? 'active' : ''}`}
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
