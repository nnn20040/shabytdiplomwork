
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
import { Trash2, Plus, MoveUp, MoveDown, AlignLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Question } from '@/models/Course';

const CreateTest = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [lessons, setLessons] = useState<{ id: number; title: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [testData, setTestData] = useState({
    title: '',
    description: '',
    time_limit: 30,
    passing_score: 70,
    lesson_id: 0
  });

  // Questions state
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: Date.now(),
      question: '',
      options: ['', '', '', ''],
      correct_answer: 0,
      points: 1
    }
  ]);

  // Fetch lessons for this course
  useEffect(() => {
    const fetchLessons = async () => {
      setIsLoading(true);
      try {
        // This would be a real API call in production
        // const response = await fetch(`/api/courses/${courseId}/lessons`);
        // const data = await response.json();
        
        // Mock data for now
        const mockLessons = [
          { id: 1, title: 'Введение в алгебру' },
          { id: 2, title: 'Линейные уравнения' },
          { id: 3, title: 'Квадратные уравнения' },
        ];
        
        setLessons(mockLessons);
      } catch (error) {
        console.error('Failed to fetch lessons:', error);
        toast.error('Не удалось загрузить уроки курса');
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      fetchLessons();
    }
  }, [courseId]);

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
      
      // Swap the questions
      [newQuestions[index], newQuestions[targetIndex]] = 
      [newQuestions[targetIndex], newQuestions[index]];
      
      return newQuestions;
    });
  };

  const saveTest = async () => {
    // Validate the form
    if (!testData.title.trim()) {
      toast.error('Введите название теста');
      return;
    }

    if (testData.time_limit <= 0) {
      toast.error('Время на тест должно быть положительным числом');
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        toast.error(`Вопрос ${i + 1}: введите текст вопроса`);
        return;
      }

      // Check if at least two options are filled
      const filledOptions = q.options.filter(opt => opt.trim() !== '');
      if (filledOptions.length < 2) {
        toast.error(`Вопрос ${i + 1}: введите как минимум два варианта ответа`);
        return;
      }

      // Make sure the correct answer is valid
      if (q.options[q.correct_answer].trim() === '') {
        toast.error(`Вопрос ${i + 1}: правильный ответ не может быть пустым`);
        return;
      }
    }

    setSaving(true);
    try {
      // This would be a real API call in production
      // const response = await fetch(`/api/courses/${courseId}/tests`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     ...testData,
      //     course_id: parseInt(courseId || '0'),
      //     questions
      //   }),
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to create test');
      // }

      // Mock successful creation
      toast.success('Тест успешно создан!');
      setTimeout(() => {
        navigate(`/course/${courseId}/manage`);
      }, 1500);
    } catch (error) {
      console.error('Failed to save test:', error);
      toast.error('Не удалось сохранить тест');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          <h1 className="text-3xl font-bold mb-6">Создание теста</h1>
          
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
                  placeholder="Например: Контрольный тест по теме 'Линейные уравнения'" 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Описание теста</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={testData.description} 
                  onChange={handleTestDataChange} 
                  placeholder="Опишите, что проверяет этот тест и какие знания потребуются для его успешного прохождения" 
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
                  value={testData.lesson_id ? testData.lesson_id.toString() : ""}
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
          
          {/* Questions */}
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
                    placeholder="Введите текст вопроса"
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
                          <Badge className="bg-green-500">Верный</Badge>
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

export default CreateTest;
