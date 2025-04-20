
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, MoveUp, MoveDown } from 'lucide-react';
import { toast } from 'sonner';
import { Question, Test } from '@/models/Course';
import { coursesApi, testsApi } from '@/api';
import { useAuth } from '@/contexts/AuthContext';

const EditTest = () => {
  const navigate = useNavigate();
  const { courseId, testId } = useParams();
  const { user } = useAuth();
  const [lessons, setLessons] = useState<{ id: number; title: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [testData, setTestData] = useState<Partial<Test>>({
    title: '',
    description: '',
    time_limit: 30,
    passing_score: 70,
    lesson_id: 0
  });

  const [questions, setQuestions] = useState<Question[]>([]);

  // Проверяем, является ли пользователь учителем
  const isTeacher = user?.role === 'teacher';

  // Если пользователь не учитель, перенаправляем его на страницу курса
  useEffect(() => {
    if (!isTeacher) {
      toast.error('У вас нет прав для редактирования теста');
      navigate(`/course/${courseId}`);
    }
  }, [isTeacher, courseId, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Получаем уроки курса
        const courseData = await coursesApi.getCourseDetails(String(courseId));
        if (courseData && courseData.lessons) {
          setLessons(courseData.lessons.map((lesson: any) => ({
            id: lesson.id,
            title: lesson.title
          })));
        }
        
        // Получаем данные теста
        const testData = await testsApi.getTest(String(courseId), String(testId));
        if (testData) {
          setTestData({
            id: testData.id,
            title: testData.title,
            description: testData.description,
            time_limit: testData.time_limit,
            passing_score: testData.passing_score,
            lesson_id: testData.lesson_id
          });
          
          if (testData.questions) {
            setQuestions(testData.questions);
          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('Не удалось загрузить данные теста');
        
        // В случае ошибки используем тестовые данные
        const mockTest = {
          id: Number(testId),
          title: 'Тест по линейным уравнениям',
          description: 'Проверка знаний по теме "Линейные уравнения"',
          time_limit: 30,
          passing_score: 70,
          course_id: Number(courseId),
          lesson_id: 2
        };
        
        const mockQuestions = [
          {
            id: 1,
            question: 'Чему равно произведение корней уравнения x² - 5x + 6 = 0?',
            options: ['2', '3', '6', '9'],
            correct_answer: 2,
            points: 1
          },
          {
            id: 2,
            question: 'Найдите значение sinα, если cosα = 0.6',
            options: ['0.6', '0.8', '0.36', '0.64'],
            correct_answer: 1,
            points: 1
          }
        ];
        
        setTestData(mockTest);
        setQuestions(mockQuestions);
        
        // Добавляем мок-данные уроков, если не удалось получить их с сервера
        if (lessons.length === 0) {
          setLessons([
            { id: 1, title: 'Введение в алгебру' },
            { id: 2, title: 'Линейные уравнения' },
            { id: 3, title: 'Квадратные уравнения' },
          ]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId && testId && isTeacher) {
      fetchData();
    }
  }, [courseId, testId, isTeacher, lessons.length]);

  const handleTestDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTestData(prev => ({
      ...prev,
      [name]: name === 'time_limit' || name === 'passing_score' ? parseInt(value) : value
    }));
  };

  const handleLessonChange = (value: string) => {
    setTestData(prev => ({
      ...prev,
      lesson_id: parseInt(value)
    }));
  };

  const handleQuestionChange = (index: number, field: keyof Question, value: any) => {
    setQuestions(prev => 
      prev.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    );
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    setQuestions(prev => 
      prev.map((q, i) => 
        i === questionIndex 
          ? { 
              ...q, 
              options: q.options.map((opt, j) => j === optionIndex ? value : opt) 
            } 
          : q
      )
    );
  };

  const handleCorrectAnswerChange = (questionIndex: number, value: string) => {
    setQuestions(prev => 
      prev.map((q, i) => 
        i === questionIndex ? { ...q, correct_answer: parseInt(value) } : q
      )
    );
  };

  const addQuestion = () => {
    setQuestions(prev => [
      ...prev,
      {
        id: Date.now(),
        question: '',
        options: ['', '', '', ''],
        correct_answer: 0,
        points: 1
      }
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(prev => prev.filter((_, i) => i !== index));
    } else {
      toast.error('Тест должен содержать хотя бы один вопрос');
    }
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === questions.length - 1)
    ) {
      return;
    }

    setQuestions(prev => {
      const newQuestions = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      
      [newQuestions[index], newQuestions[targetIndex]] = 
      [newQuestions[targetIndex], newQuestions[index]];
      
      return newQuestions;
    });
  };

  const saveTest = async () => {
    if (!testData.title?.trim()) {
      toast.error('Введите название теста');
      return;
    }

    if (testData.time_limit && testData.time_limit <= 0) {
      toast.error('Время на тест должно быть положительным числом');
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        toast.error(`Вопрос ${i + 1}: введите текст вопроса`);
        return;
      }

      const filledOptions = q.options.filter(opt => opt.trim() !== '');
      if (filledOptions.length < 2) {
        toast.error(`Вопрос ${i + 1}: введите как минимум два варианта ответа`);
        return;
      }

      if (q.options[q.correct_answer].trim() === '') {
        toast.error(`Вопрос ${i + 1}: правильный ответ не может быть пустым`);
        return;
      }
    }

    setSaving(true);
    try {
      // Обновляем тест через API
      const updatedTestData = {
        ...testData,
        questions: questions
      };
      
      await testsApi.updateTest(String(courseId), String(testId), updatedTestData);
      
      toast.success('Тест успешно обновлен!');
      navigate(`/course/${courseId}/manage`);
    } catch (error) {
      console.error('Failed to update test:', error);
      toast.error('Не удалось обновить тест');
    } finally {
      setSaving(false);
    }
  };

  if (!isTeacher) {
    return null; // Не рендерим ничего, если пользователь не учитель
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="container">
            <p className="text-center">Загрузка данных теста...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          <h1 className="text-3xl font-bold mb-6">Редактирование теста</h1>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Название теста</Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={testData.title} 
                  onChange={handleTestDataChange} 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Описание теста</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={testData.description} 
                  onChange={handleTestDataChange} 
                  rows={3} 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="time_limit">Ограничение по времени (в минутах)</Label>
                  <Input 
                    id="time_limit" 
                    name="time_limit" 
                    type="number" 
                    value={testData.time_limit} 
                    onChange={handleTestDataChange} 
                    min={1}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="passing_score">Проходной балл (%)</Label>
                  <Input 
                    id="passing_score" 
                    name="passing_score" 
                    type="number" 
                    value={testData.passing_score} 
                    onChange={handleTestDataChange} 
                    min={1} 
                    max={100}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="lesson">Связать с уроком (необязательно)</Label>
                <Select 
                  onValueChange={handleLessonChange} 
                  value={testData.lesson_id ? testData.lesson_id.toString() : "0"}
                >
                  <SelectTrigger id="lesson">
                    <SelectValue placeholder="Выберите урок" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Не связывать с уроком</SelectItem>
                    {lessons.map(lesson => (
                      <SelectItem key={lesson.id} value={lesson.id.toString()}>
                        {lesson.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <h2 className="text-2xl font-semibold mb-4">Вопросы</h2>
          
          {questions.map((question, qIndex) => (
            <Card key={question.id} className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Вопрос {qIndex + 1}</CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => moveQuestion(qIndex, 'up')}
                    disabled={qIndex === 0}
                  >
                    <MoveUp className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => moveQuestion(qIndex, 'down')}
                    disabled={qIndex === questions.length - 1}
                  >
                    <MoveDown className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={() => removeQuestion(qIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor={`question-${qIndex}`}>Текст вопроса</Label>
                  <Textarea 
                    id={`question-${qIndex}`} 
                    value={question.question} 
                    onChange={e => handleQuestionChange(qIndex, 'question', e.target.value)} 
                    rows={2}
                  />
                </div>
                
                <div className="grid gap-4">
                  <Label>Варианты ответов</Label>
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-2">
                      <div className="flex-1">
                        <Input 
                          value={option} 
                          onChange={e => handleOptionChange(qIndex, oIndex, e.target.value)} 
                          placeholder={`Вариант ${oIndex + 1}`} 
                        />
                      </div>
                      <div className="w-20">
                        {oIndex === question.correct_answer && (
                          <Badge variant="default" className="bg-green-500">Верный</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor={`correct-${qIndex}`}>Правильный ответ</Label>
                  <Select 
                    onValueChange={value => handleCorrectAnswerChange(qIndex, value)} 
                    value={question.correct_answer.toString()}
                  >
                    <SelectTrigger id={`correct-${qIndex}`}>
                      <SelectValue placeholder="Выберите правильный ответ" />
                    </SelectTrigger>
                    <SelectContent>
                      {question.options.map((_, oIndex) => (
                        <SelectItem key={oIndex} value={oIndex.toString()}>
                          Вариант {oIndex + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor={`points-${qIndex}`}>Баллы за вопрос</Label>
                  <Input 
                    id={`points-${qIndex}`} 
                    type="number" 
                    value={question.points} 
                    onChange={e => handleQuestionChange(qIndex, 'points', parseInt(e.target.value))} 
                    min={1}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div className="flex justify-center mb-8">
            <Button 
              variant="outline" 
              onClick={addQuestion}
              className="w-full max-w-md"
            >
              <Plus className="h-4 w-4 mr-2" />
              Добавить вопрос
            </Button>
          </div>
          
          <div className="flex justify-end gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/course/${courseId}/manage`)}
            >
              Отмена
            </Button>
            <Button 
              onClick={saveTest}
              disabled={saving}
            >
              {saving ? 'Сохранение...' : 'Сохранить тест'}
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EditTest;
