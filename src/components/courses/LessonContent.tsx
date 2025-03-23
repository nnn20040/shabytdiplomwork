
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Lesson } from '@/models/Course';
import { FileText, Video } from 'lucide-react';

interface LessonContentProps {
  lesson: Lesson;
}

const LessonContent = ({ lesson }: LessonContentProps) => {
  const [activeTab, setActiveTab] = useState('video');

  return (
    <Card className="p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="video" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Видео
          </TabsTrigger>
          <TabsTrigger value="theory" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Теория
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="video" className="mt-0">
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">{lesson.title}</h2>
            <p className="text-muted-foreground">{lesson.description}</p>
          </div>
          
          <AspectRatio ratio={16 / 9} className="bg-muted rounded-md overflow-hidden">
            <iframe
              src={lesson.video_url}
              title={lesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </AspectRatio>
        </TabsContent>
        
        <TabsContent value="theory" className="mt-0">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <h2 className="text-xl font-bold mb-4">{lesson.title} - Теоретический материал</h2>
            
            <div className="space-y-4">
              <h3>Основные понятия</h3>
              <p>
                {lesson.content || `Теоретический материал по теме "${lesson.title}". 
                Здесь будет подробное объяснение темы, включая определения, формулы, 
                правила и примеры решения задач.`}
              </p>
              
              <h3>Формулы и определения</h3>
              <ul>
                <li>Определение 1: важное понятие и его объяснение</li>
                <li>Формула 1: математическое выражение с пояснением</li>
                <li>Правило 1: важное правило для запоминания</li>
              </ul>
              
              <h3>Примеры</h3>
              <p>Пример 1: Подробное решение типовой задачи с объяснением каждого шага.</p>
              <p>Пример 2: Еще один пример с другим подходом к решению.</p>
              
              <h3>Важно помнить</h3>
              <ul>
                <li>Ключевой момент 1 для запоминания</li>
                <li>Ключевой момент 2 для запоминания</li>
                <li>Ключевой момент 3 для запоминания</li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default LessonContent;
