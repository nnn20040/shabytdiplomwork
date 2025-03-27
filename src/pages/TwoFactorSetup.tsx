
import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Smartphone, Mail, Lock, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const TwoFactorSetup = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState<'app' | 'sms' | 'email'>('app');
  const [verificationCode, setVerificationCode] = useState('');
  
  // Mock QR code and secret key
  const qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/Shabyt:alibek@shabyt.kz?secret=JBSWY3DPEHPK3PXP&issuer=Shabyt";
  const secretKey = "JBSWY3DPEHPK3PXP";
  
  const handleVerify = () => {
    if (verificationCode.length < 6) {
      toast.error(t('2fa.code_too_short'));
      return;
    }
    
    // In a real app, verify the code with the server
    // For now, we'll simulate success
    toast.success(t('2fa.setup_complete'));
    navigate('/settings');
  };
  
  const handleCancel = () => {
    navigate('/settings');
  };
  
  return (
    <Layout>
      <div className="container max-w-3xl py-10">
        <h1 className="text-3xl font-bold mb-2">{t('2fa.setup_title')}</h1>
        <p className="text-lg text-muted-foreground mb-8">{t('2fa.setup_description')}</p>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{t('2fa.choose_method')}</CardTitle>
                <CardDescription>{t('2fa.method_description')}</CardDescription>
              </div>
              <div className="text-sm text-muted-foreground">
                {t('2fa.step')} {step} {t('2fa.of')} 3
              </div>
            </div>
          </CardHeader>
          
          {step === 1 && (
            <CardContent>
              <Tabs defaultValue="app" onValueChange={(value) => setMethod(value as 'app' | 'sms' | 'email')}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="app">{t('2fa.method.app')}</TabsTrigger>
                  <TabsTrigger value="sms">{t('2fa.method.sms')}</TabsTrigger>
                  <TabsTrigger value="email">{t('2fa.method.email')}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="app" className="mt-6">
                  <div className="flex items-start space-x-4">
                    <Smartphone className="h-10 w-10 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-medium text-lg">{t('2fa.authenticator_app')}</h3>
                      <p className="text-muted-foreground mb-4">{t('2fa.authenticator_description')}</p>
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>{t('2fa.recommended')}</AlertTitle>
                        <AlertDescription>{t('2fa.app_recommendation')}</AlertDescription>
                      </Alert>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="sms" className="mt-6">
                  <div className="flex items-start space-x-4">
                    <Smartphone className="h-10 w-10 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-medium text-lg">{t('2fa.sms_verification')}</h3>
                      <p className="text-muted-foreground mb-4">{t('2fa.sms_description')}</p>
                      <div className="flex items-center space-x-2 mb-4">
                        <Input value="+7 (707) •••-••-67" disabled />
                        <Button variant="outline">{t('2fa.change')}</Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="email" className="mt-6">
                  <div className="flex items-start space-x-4">
                    <Mail className="h-10 w-10 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-medium text-lg">{t('2fa.email_verification')}</h3>
                      <p className="text-muted-foreground mb-4">{t('2fa.email_description')}</p>
                      <div className="flex items-center space-x-2 mb-4">
                        <Input value="a•••••@shabyt.kz" disabled />
                        <Button variant="outline">{t('2fa.change')}</Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={handleCancel}>{t('2fa.cancel')}</Button>
                <Button onClick={() => setStep(2)}>{t('2fa.continue')}</Button>
              </div>
            </CardContent>
          )}
          
          {step === 2 && method === 'app' && (
            <CardContent>
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <h3 className="font-medium text-lg">{t('2fa.scan_qr')}</h3>
                  <p className="text-muted-foreground">{t('2fa.scan_instructions')}</p>
                  
                  <div className="bg-white p-4 rounded-lg inline-block mx-auto my-6">
                    <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">{t('2fa.or_manual')}</h3>
                  <p className="text-muted-foreground">{t('2fa.manual_instructions')}</p>
                  
                  <div className="flex items-center space-x-2">
                    <Input value={secretKey} readOnly />
                    <Button variant="outline" onClick={() => {
                      navigator.clipboard.writeText(secretKey);
                      toast.success(t('2fa.copied'));
                    }}>
                      {t('2fa.copy')}
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={() => setStep(1)}>{t('2fa.back')}</Button>
                  <Button onClick={() => setStep(3)}>{t('2fa.continue')}</Button>
                </div>
              </div>
            </CardContent>
          )}
          
          {step === 2 && (method === 'sms' || method === 'email') && (
            <CardContent>
              <div className="space-y-6">
                <h3 className="font-medium text-lg">
                  {method === 'sms' ? t('2fa.sms_sent') : t('2fa.email_sent')}
                </h3>
                <p className="text-muted-foreground">
                  {method === 'sms' 
                    ? t('2fa.sms_sent_description').replace('{phone}', '+7 (707) •••-••-67')
                    : t('2fa.email_sent_description').replace('{email}', 'a•••••@shabyt.kz')
                  }
                </p>
                
                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={() => setStep(1)}>{t('2fa.back')}</Button>
                  <Button onClick={() => setStep(3)}>{t('2fa.continue')}</Button>
                </div>
              </div>
            </CardContent>
          )}
          
          {step === 3 && (
            <CardContent>
              <div className="space-y-6">
                <h3 className="font-medium text-lg">{t('2fa.verify_code')}</h3>
                <p className="text-muted-foreground">{t('2fa.verify_instructions')}</p>
                
                <div className="space-y-2">
                  <Label htmlFor="verification-code">{t('2fa.enter_code')}</Label>
                  <Input 
                    id="verification-code" 
                    value={verificationCode} 
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                  />
                </div>
                
                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={() => setStep(2)}>{t('2fa.back')}</Button>
                  <Button onClick={handleVerify}>{t('2fa.verify')}</Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default TwoFactorSetup;
