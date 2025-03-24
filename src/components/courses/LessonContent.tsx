
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Clock, Play, ExternalLink } from 'lucide-react';
import { Lesson } from '@/models/Course';

interface LessonContentProps {
  lesson: Lesson;
  onComplete?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  progress?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

const LessonContent: React.FC<LessonContentProps> = ({
  lesson,
  onComplete,
  onNext,
  onPrevious,
  progress = 0,
  hasNext = false,
  hasPrevious = false,
}) => {
  const [activeTab, setActiveTab] = useState<string>('video');
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [lessonCompleted, setLessonCompleted] = useState<boolean>(false);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleCompleteLesson = () => {
    setLessonCompleted(true);
    if (onComplete) {
      onComplete();
    }
  };

  const handleVideoLoad = () => {
    setVideoLoaded(true);
    setVideoError(false);
  };

  const handleVideoError = () => {
    setVideoError(true);
    setVideoLoaded(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">{lesson.title}</h1>
          <p className="text-muted-foreground">{lesson.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {lessonCompleted ? (
            <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Завершен
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
              <Clock className="h-3 w-3 mr-1" />
              В процессе
            </Badge>
          )}
        </div>
      </div>
      
      {progress > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Прогресс урока</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
      
      <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="video">Видео</TabsTrigger>
          <TabsTrigger value="content">Материалы</TabsTrigger>
        </TabsList>
        
        <TabsContent value="video" className="space-y-4">
          {lesson.video_url ? (
            <Card>
              <CardContent className="p-0 aspect-video relative">
                {!videoLoaded && !videoError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
                    <div className="animate-pulse text-center">
                      <Play className="h-12 w-12 mx-auto text-primary" />
                      <p className="mt-2">Загрузка видео...</p>
                    </div>
                  </div>
                )}
                
                {videoError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
                    <div className="text-center text-destructive">
                      <p className="text-lg font-medium">Ошибка загрузки видео</p>
                      <p className="mt-1">Пожалуйста, проверьте подключение к интернету или попробуйте позже</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => window.open(lesson.video_url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Открыть видео в новой вкладке
                      </Button>
                    </div>
                  </div>
                )}
                
                <iframe
                  src={lesson.video_url}
                  title={lesson.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onLoad={handleVideoLoad}
                  onError={handleVideoError}
                ></iframe>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Для этого урока видео не доступно.</p>
              </CardContent>
            </Card>
          )}
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={!hasPrevious}
            >
              Предыдущий урок
            </Button>
            <Button
              variant="outline"
              onClick={handleCompleteLesson}
              disabled={lessonCompleted}
            >
              {lessonCompleted ? 'Урок завершен' : 'Отметить как завершенный'}
            </Button>
            <Button
              onClick={onNext}
              disabled={!hasNext}
            >
              Следующий урок
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{lesson.title}</CardTitle>
              <CardDescription>{lesson.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {lesson.content ? (
                  <div dangerouslySetInnerHTML={{ __html: lesson.content.replace(/\n/g, '<br/>') }} />
                ) : (
                  <p className="text-muted-foreground text-center">Материалы для этого урока ещё не добавлены.</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={!hasPrevious}
            >
              Предыдущий урок
            </Button>
            <Button
              variant="outline"
              onClick={handleCompleteLesson}
              disabled={lessonCompleted}
            >
              {lessonCompleted ? 'Урок завершен' : 'Отметить как завершенный'}
            </Button>
            <Button
              onClick={onNext}
              disabled={!hasNext}
            >
              Следующий урок
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LessonContent;
