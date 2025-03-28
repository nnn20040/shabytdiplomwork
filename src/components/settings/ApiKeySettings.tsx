
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { setApiKey, getApiKey } from '@/services/aiService';
import { useLanguage } from '@/contexts/LanguageContext';

export const ApiKeySettings = () => {
  const { t } = useLanguage();
  const [apiKey, setApiKeyState] = useState('');
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    const savedKey = getApiKey();
    if (savedKey) {
      setApiKeyState(savedKey);
    }
  }, []);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      setApiKey(apiKey.trim());
      toast.success('API ключ успешно сохранен');
    } else {
      toast.error('Пожалуйста, введите API ключ');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI ассистент</CardTitle>
        <CardDescription>
          Настройка API ключа для AI ассистента
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="openai-key">OpenAI API ключ</Label>
          <div className="flex">
            <Input
              id="openai-key"
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKeyState(e.target.value)}
              placeholder="sk-..."
              className="flex-1"
            />
            <Button
              variant="outline"
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="ml-2"
            >
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Для использования AI ассистента требуется API ключ OpenAI. 
            Вы можете получить его на сайте <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">OpenAI</a>.
          </p>
        </div>
        <Button onClick={handleSaveKey}>Сохранить API ключ</Button>
      </CardContent>
    </Card>
  );
};
