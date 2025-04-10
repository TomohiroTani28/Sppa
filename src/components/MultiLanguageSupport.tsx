// src/components/MultiLanguageSupport.tsx
import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import Text from '@/components/ui/Text';
import { useRouter } from 'next/router';

/**
 * MultiLanguageSupport component
 * 
 * Provides language switching functionality and information about available languages
 * in the Sppa application. Designed to be displayed on the tourist home page.
 */
const MultiLanguageSupport: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState(router.locale || 'en');

  // Available languages in the application
  const availableLanguages = [
    { value: 'en', label: 'English' },
    { value: 'id', label: 'Bahasa Indonesia' },
  ];

  // Handle language change
  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    
    // Change the language and reload page
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: value });
  };

  return (
    <Card className="w-full bg-white shadow-sm border border-gray-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-gray-900">
          {t('home.languageSupport.title')}
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">
          {t('home.languageSupport.description')}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Text className="text-sm font-medium text-gray-700">
              {t('home.languageSupport.currentLanguage')}
            </Text>
            <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('home.languageSupport.selectLanguage')} />
              </SelectTrigger>
              <SelectContent>
                {availableLanguages.map(lang => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-md">
            <Text className="text-sm text-blue-700">
              {t('home.languageSupport.translationInfo')}
            </Text>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-gray-100 pt-4">
        <div className="flex flex-col w-full space-y-2">
          <Text className="text-xs text-gray-500">
            {t('home.languageSupport.therapistLanguageNote')}
          </Text>
          <div className="flex flex-wrap gap-2">
            {availableLanguages.map((lang) => (
              <Button
                key={lang.value}
                variant="outline"
                className="text-xs py-1 px-2 h-auto"
                onClick={() => router.push({
                  pathname: '/tourist/search',
                  query: { language: lang.value }
                })}
              >
                {lang.label} {t('home.languageSupport.speakers')}
              </Button>
            ))}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MultiLanguageSupport;