
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Send, User } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const StudentMessage = () => {
  const { id: studentId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !message.trim()) {
      toast.error('Пожалуйста, заполните все поля');
      return;
    }
    
    setIsSending(true);
    
    try {
      // Replace this with your actual API endpoint
      await axios.post(`/api/students/${studentId}/messages`, {
        subject,
        message
      });
      
      toast.success('Сообщение успешно отправлено');
      navigate(`/student/${studentId}/progress`);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Не удалось отправить сообщение. Пожалуйста, попробуйте позже.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Layout>
      <div className="container py-8 max-w-3xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Назад
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle>Отправить сообщение студенту</CardTitle>
            <CardDescription>
              Отправьте личное сообщение студенту по вопросам обучения или успеваемости
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Получатель: Студент #{studentId}</p>
                  <p className="text-xs text-muted-foreground">ID: {studentId}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Тема сообщения
                </label>
                <Input
                  id="subject"
                  placeholder="Введите тему сообщения"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Текст сообщения
                </label>
                <Textarea
                  id="message"
                  placeholder="Введите ваше сообщение здесь..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  required
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(-1)}
              >
                Отмена
              </Button>
              <Button 
                type="submit"
                disabled={isSending || !subject.trim() || !message.trim()}
              >
                {isSending ? (
                  <>Отправка...</>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Отправить сообщение
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default StudentMessage;
