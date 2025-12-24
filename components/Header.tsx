import React, { useState, useContext } from 'react';
import { NAV_LINKS } from '../constants';
import { AppContext, AppContextType } from '../App';
import { Page, Theme } from '../types';
import { Icon } from './icons';

interface HeaderProps {
  theme: Theme;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null);

  const appContext = useContext(AppContext as React.Context<AppContextType>);

  const handleNavClick = (page: Page) => {
    appContext?.setPage(page);
    setIsMenuOpen(false);
    setOpenDropdown(null);
    setOpenMobileSubmenu(null);
  };

  return (
    <header className="relative z-30 bg-white/30 dark:bg-dark-bg/30 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Club Name */}
          <div className="flex items-center cursor-pointer" onClick={() => handleNavClick('home')}>
            <img src={appContext.siteSettings.header.logoUrl} alt="A.I.M. Club Logo" className="h-16 w-auto" />
            <span className="ml-2 text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-pink to-golden-yellow">
              A.I.M. CLUB
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {NAV_LINKS.map(link => (
                link.subLinks ? (
                    <div key={link.name} className="relative" onMouseEnter={() => setOpenDropdown(link.name)} onMouseLeave={() => setOpenDropdown(null)}>
                         <button className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-neon-blue dark:hover:text-neon-blue transition-colors duration-200 p-3 flex items-center gap-1">
                            {link.name}
                            <Icon name="chevronDown" className="w-4 h-4" />
                        </button>
                        {openDropdown === link.name && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 bg-white dark:bg-dark-bg rounded-md shadow-lg py-1 z-20 border border-gray-200 dark:border-gray-700 animate-fade-in">
                                {link.subLinks.map(subLink => (
                                    <button key={subLink.name} onClick={() => handleNavClick(subLink.page)} className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                        {subLink.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                  <button 
                    key={link.name} 
                    onClick={() => handleNavClick(link.page!)}
                    className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-neon-blue dark:hover:text-neon-blue transition-colors duration-200"
                  >
                    {link.name === 'Apply Now' ? (
                       <span className="px-4 py-2 rounded-full bg-gradient-to-r from-neon-blue to-neon-pink text-white animate-pulse-glow">{link.name}</span>
                    ) : (
                        link.name
                    )}
                  </button>
                )
            ))}
          </nav>
          
          <div className="flex items-center">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Icon name="sun" /> : <Icon name="moon" />}
            </button>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden ml-2">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-gray-600 dark:text-gray-300">
                {isMenuOpen ? <Icon name="close" /> : <Icon name="menu" />}
              </button>
            </div>
          </div>

        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md animate-slide-in">
          <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {NAV_LINKS.map(link => (
              link.subLinks ? (
                <div key={link.name}>
                  <button
                    onClick={() => setOpenMobileSubmenu(openMobileSubmenu === link.name ? null : link.name)}
                    className="w-full flex justify-between items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <span>{link.name}</span>
                    <Icon name="chevronDown" className={`w-5 h-5 transition-transform ${openMobileSubmenu === link.name ? 'rotate-180' : ''}`} />
                  </button>
                  {openMobileSubmenu === link.name && (
                    <div className="pl-5 mt-1 space-y-1">
                      {link.subLinks.map(subLink => (
                        <button
                          key={subLink.name}
                          onClick={() => handleNavClick(subLink.page)}
                          className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          {subLink.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.page!)}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  {link.name}
                </button>
              )
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;