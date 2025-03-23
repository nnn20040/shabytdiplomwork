
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Clock, CheckCircle } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct_answer: number;
}

interface TestContentProps {
  testId: number;
  title: string;
  description: string;
  timeLimit: number;
  passingScore: number;
}

const TestContent = ({ 
  testId, 
  title, 
  description, 
  timeLimit, 
  passingScore 
}: TestContentProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60);
  
  // Mock questions
  const questions: Question[] = [
    {
      id: 1,
      question: 'Вопрос 1: Чему равно произведение корней уравнения x² - 5x + 6 = 0?',
      options: ['2', '3', '6', '9'],
      correct_answer: 2
    },
    {
      id: 2,
      question: 'Вопрос 2: Найдите значение sinα, если cosα = 0.6',
      options: ['0.6', '0.8', '0.36', '0.64'],
      correct_answer: 1
    },
    {
      id: 3,
      question: 'Вопрос 3: Чему равна площадь треугольника со сторонами 3, 4 и 5?',
      options: ['6', '7.5', '10', '12'],
      correct_answer: 0
    },
    {
      id: 4,
      question: 'Вопрос 4: Вычислите значение выражения log₂8',
      options: ['2', '3', '4', '8'],
      correct_answer: 1
    },
    {
      id: 5,
      question: 'Вопрос 5: Решите неравенство x² - 9 > 0',
      options: ['x < -3 или x > 3', 'x > 3', '-3 < x < 3', 'x < -3'],
      correct_answer: 0
    }
  ];

  const handleSelectAnswer = (value: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: parseInt(value)
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitTest = () => {
    // Calculate score
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correct_answer) {
        correctCount++;
      }
    });
    
    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);
    setIsCompleted(true);
    
    if (finalScore >= passingScore) {
      toast.success(`Поздравляем! Вы набрали ${finalScore}% и успешно прошли тест.`);
    } else {
      toast.error(`Вы набрали ${finalScore}%. Для прохождения теста необходимо набрать минимум ${passingScore}%.`);
    }
  };

  // Format time remaining
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isCompleted) {
    return (
      <Card className="p-6">
        <div className="text-center my-8">
          <div className={`inline-flex items-center justify-center rounded-full p-4 ${
            score >= passingScore ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
          }`}>
            <CheckCircle className={`h-16 w-16 ${
              score >= passingScore ? 'text-green-500' : 'text-red-500'
            }`} />
          </div>
          
          <h2 className="text-2xl font-bold mt-4">
            {score >= passingScore ? 'Тест пройден успешно!' : 'Тест не пройден'}
          </h2>
          
          <div className="mt-4 space-y-2">
            <p className="text-lg">Ваш результат: <span className="font-bold">{score}%</span></p>
            <p className="text-muted-foreground">
              Для успешного прохождения необходимо: <span className="font-medium">{passingScore}%</span>
            </p>
          </div>
          
          <div className="mt-8 space-x-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setCurrentQuestion(0);
                setSelectedAnswers({});
                setIsCompleted(false);
              }}
            >
              Пройти еще раз
            </Button>
            <Button onClick={() => window.history.back()}>
              Вернуться к курсу
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-2 bg-secondary rounded-md px-3 py-1.5">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{formatTime(timeRemaining)}</span>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm">Прогресс</span>
          <span className="text-sm font-medium">{currentQuestion + 1}/{questions.length}</span>
        </div>
        <Progress value={((currentQuestion + 1) / questions.length) * 100} />
      </div>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{questions[currentQuestion].question}</h3>
          
          <RadioGroup 
            value={selectedAnswers[currentQuestion]?.toString()} 
            onValueChange={handleSelectAnswer}
          >
            {questions[currentQuestion].options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer py-2">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <div className="flex justify-between pt-4">
          <Button 
            variant="outline" 
            onClick={handlePrevQuestion}
            disabled={currentQuestion === 0}
          >
            Назад
          </Button>
          
          {currentQuestion < questions.length - 1 ? (
            <Button 
              onClick={handleNextQuestion}
              disabled={selectedAnswers[currentQuestion] === undefined}
            >
              Следующий вопрос
            </Button>
          ) : (
            <Button 
              onClick={handleSubmitTest}
              disabled={Object.keys(selectedAnswers).length !== questions.length}
            >
              Завершить тест
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TestContent;
