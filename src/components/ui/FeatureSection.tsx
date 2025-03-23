
import { useEffect, useRef, useState } from 'react';
import { 
  BookOpen, 
  Video, 
  TestTube, 
  Brain, 
  BarChart, 
  Users, 
  MessageCircle, 
  Award
} from 'lucide-react';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const Feature = ({ icon, title, description, delay = 0 }: FeatureProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const featureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    if (featureRef.current) {
      observer.observe(featureRef.current);
    }

    return () => {
      if (featureRef.current) {
        observer.unobserve(featureRef.current);
      }
    };
  }, [delay]);

  return (
    <div
      ref={featureRef}
      className={`glass-card p-6 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="bg-primary/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
        <div className="text-primary">{icon}</div>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const FeatureSection = () => {
  const features = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: 'Качественные материалы',
      description: 'Структурированные и актуальные уроки по всем предметам ЕНТ',
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: 'Видеоуроки',
      description: 'Подробные объяснения от лучших преподавателей Казахстана',
    },
    {
      icon: <TestTube className="h-6 w-6" />,
      title: 'Тренировочные тесты',
      description: 'Проверь свои знания на тестах в формате ЕНТ',
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: 'ИИ-ассистент',
      description: 'Получи мгновенные ответы на вопросы от умного помощника',
    },
    {
      icon: <BarChart className="h-6 w-6" />,
      title: 'Аналитика прогресса',
      description: 'Отслеживай свой прогресс и работай над слабыми сторонами',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Сообщество',
      description: 'Общайся с другими учениками и обменивайся опытом',
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: 'Поддержка учителей',
      description: 'Задавай вопросы преподавателям и получай обратную связь',
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: 'Гарантия результата',
      description: 'Повышай свои баллы на ЕНТ с нашей помощью',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Почему выбирают{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
              StudyHub
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Мы создали комплексную среду для успешной подготовки к ЕНТ, сочетающую современные технологии и эффективные методики обучения
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
