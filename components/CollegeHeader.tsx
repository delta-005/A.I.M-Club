

import React, { useContext } from 'react';
import { AppContext, AppContextType } from '../App';

const CollegeHeader: React.FC = () => {
    const appContext = useContext(AppContext as React.Context<AppContextType>);
    const { siteSettings } = appContext;
    const { jbrecLogoUrl, naacLogoUrl, isoLogoUrl, aicteLogoUrl, jntuhLogoUrl } = siteSettings.collegeHeader;

    return (
        <div className="bg-white text-black py-2 px-4 sm:px-6 lg:px-8 border-b-2 border-gray-200 hidden md:block">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                {/* JBREC Logo */}
                <div className="flex-shrink-0">
                    <img src={jbrecLogoUrl} alt="JBREC Logo" className="h-24" />
                </div>
                
                {/* College Info */}
                <div className="text-center">
                    <h1 className="text-xl lg:text-2xl font-bold text-blue-800 font-serif tracking-wide">
                        JOGINPALLY B.R. ENGINEERING COLLEGE
                    </h1>
                    <p className="font-semibold text-sm">
                        <span className="bg-yellow-300 px-2 py-0.5 rounded">(UGC AUTONOMOUS)</span>
                    </p>
                    <p className="font-semibold text-blue-800 mt-1 text-sm lg:text-base">
                        ECET/EAPCET/ICET/PGECET CODE: JOGI
                    </p>
                    <p className="text-xs lg:text-sm font-semibold text-pink-600 mt-1">
                        Accredited by NBA (ECE & EEE) and NAAC with A+ Grade, ISO 9001:2015 Certified
                    </p>
                    <p className="text-xs lg:text-sm font-semibold text-pink-600">
                        Approved by AICTE & Affiliated to JNTUH
                    </p>
                    <p className="text-xs mt-1 text-gray-700">
                        Survey No. 156 To 162, Yenkapally village, Near Chilkur Balaji Temple, Moinabad Mandal, Hyderabad, Telangana 500075
                    </p>
                </div>

                {/* Accreditation Logos */}
                <div className="flex items-center justify-center gap-2">
                    <img src={naacLogoUrl} alt="NAAC A+ Logo" className="h-16" />
                    <img src={isoLogoUrl} alt="ISO Certified Logo" className="h-16" />
                    <img src={aicteLogoUrl} alt="AICTE Approved Logo" className="h-16" />
                    <img src={jntuhLogoUrl} alt="JNTUH Logo" className="h-16" />
                </div>
            </div>
        </div>
    );
};

export default CollegeHeader;