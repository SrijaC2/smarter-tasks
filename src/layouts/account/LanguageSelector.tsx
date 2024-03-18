import React, { useState } from 'react';
import i18n from 'i18next';
import { Menu} from "@headlessui/react";

const LanguageSelector: React.FC = () => {
  
  const [currentLanguage, setCurrentLanguage] = useState<string>(i18n.language);
  console.log('currentLanguage',currentLanguage)

  const toggleLanguage = (newLanguage: string) => {
    setCurrentLanguage(newLanguage);
    

    i18n.changeLanguage(newLanguage, (err) => {
      if (err) return console.log('something went wrong loading', err);
    });

    //Error 1
    throw new Error("An error occurred while changing the language")
    
  };

  const languageMap: { [key: string]: string } = {
    en: 'English',
    es: 'español',
    te: 'తెలుగు',
  };

  return (
    <>
       <Menu as="div" className="inline-block text-center relative mr-3">
      <div>
        <Menu.Button className="rounded-lg bg-blue-100 font-medium text-sm p-2 text-blue-900 hover:text-blue-600">
            {currentLanguage === 'en-US' ? 'English' : languageMap[currentLanguage]}
        </Menu.Button>
      </div>
      <Menu.Items className="absolute mt-2  rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1">
          {Object.keys(languageMap).map((code) => (
            <Menu.Item key={code}>
              {({ active }) => (
                <button
                  onClick={() => toggleLanguage(code)}
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } block px-4 py-2 text-sm text-gray-700`}
                >
                  {languageMap[code]}
                </button>
              )}
            </Menu.Item>
          ))}
        </div>
      </Menu.Items>
    </Menu>
    </>
  );
};

export default LanguageSelector;
