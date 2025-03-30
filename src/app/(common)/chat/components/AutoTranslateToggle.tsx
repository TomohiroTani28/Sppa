// src/app/(common)/chat/components/AutoTranslateToggle.tsx
import { Label } from '@/app/components/ui/Label';
import { Switch } from '@/app/components/ui/Switch';
import { useTranslation } from 'next-i18next';
import { useAutoTranslation } from '../../../../hooks/useAutoTranslation';

export default function AutoTranslateToggle() {
  const { t } = useTranslation('common');
  const { isAutoTranslateEnabled, toggleAutoTranslate } = useAutoTranslation();

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="auto-translate"
        checked={isAutoTranslateEnabled}
        onCheckedChange={toggleAutoTranslate}
      />
      <Label htmlFor="auto-translate" className="text-sm text-gray-700">
        {t('chat.autoTranslate')}
      </Label>
    </div>
  );
}