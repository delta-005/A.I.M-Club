
import React, { useContext } from 'react';
import { NAV_LINKS } from '../constants';
import { AppContext, AppContextType } from '../App';
import { Page } from '../types';
import { Icon } from './icons';

const Footer: React.FC = () => {
  const appContext = useContext(AppContext as React.Context<AppContextType>);
  const { siteSettings } = appContext;
  
  const handleNavClick = (page: Page) => {
    window.scrollTo(0, 0);
    appContext?.setPage(page);
  };

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4 space-x-4">
              <img src={siteSettings.footer.secondaryLogoUrl} alt="College Logo" className="h-16 w-auto" />
              <div className="w-px h-12 bg-gray-300 dark:bg-gray-700"></div>
              <div className="flex items-center">
                <img src={siteSettings.footer.logoUrl} alt="A.I.M. Club Logo" className="h-16 w-auto" />
                <span className="ml-3 text-xl font-bold text-gray-800 dark:text-white">A.I.M. Club</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Exploring the frontiers of Artificial Intelligence and Machine Learning at JBREC.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              {NAV_LINKS.filter(l => l.name !== 'Admin').flatMap(link => 
                link.subLinks 
                  ? link.subLinks.map(subLink => (
                      <li key={subLink.name}>
                        <button onClick={() => handleNavClick(subLink.page)} className="text-base text-gray-600 dark:text-gray-400 hover:text-neon-blue dark:hover:text-neon-blue transition-colors">
                          {subLink.name}
                        </button>
                      </li>
                    ))
                  : (
                      <li key={link.name}>
                        <button onClick={() => handleNavClick(link.page!)} className="text-base text-gray-600 dark:text-gray-400 hover:text-neon-blue dark:hover:text-neon-blue transition-colors">
                          {link.name}
                        </button>
                      </li>
                    )
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">Contact Us</h3>
            <ul className="mt-4 space-y-2 text-base text-gray-600 dark:text-gray-400">
              <li><a href={`mailto:${siteSettings.adminPage.contactEmail}`} className="hover:text-neon-blue break-all">{siteSettings.adminPage.contactEmail}</a></li>
              <li>{siteSettings.footer.address}</li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">Follow Us</h3>
            <div className="flex mt-4 space-x-4">
              <a href={siteSettings.footer.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-neon-pink transition-colors">
                <Icon name="linkedin" className="w-6 h-6" />
              </a>
              <a href={siteSettings.footer.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-neon-blue transition-colors">
                <Icon name="logo" className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8 text-center">
          <p className="text-base text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} A.I.M. Club. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
