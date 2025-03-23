
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, Star } from 'lucide-react';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative bg-gradient-to-b from-secondary/50 to-background pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Star size={14} className="mr-1" /> Подготовка к ЕНТ стала проще
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-balance">
                Готовься к ЕНТ <br className="hidden md:inline" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
                  с помощью ИИ
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
                Персонализированные курсы, видеоуроки и тесты для успешной подготовки к ЕНТ. Изучай в своем темпе и повышай свои результаты.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto text-base group">
                    Начать бесплатно
                    <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-base">
                    Смотреть курсы
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Уже более 10,000 студентов подготовились к ЕНТ с нами
              </p>
            </div>
          </div>
          <div className={`transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-500 rounded-2xl blur-lg opacity-20 animate-pulse"></div>
              <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-border/50">
                <div className="bg-secondary/50 dark:bg-gray-800/50 p-3 border-b border-border/50 flex items-center">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="mx-auto pr-6 text-sm font-medium text-muted-foreground">
                    ИИ-ассистент StudyHub
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="bg-primary/10 text-primary p-3 rounded-xl rounded-tl-none text-sm">
                      Я не понимаю, как решать квадратные уравнения. Можешь помочь?
                    </div>
                  </div>
                  <div className="flex items-start flex-row-reverse mb-4">
                    <div className="bg-secondary text-foreground p-3 rounded-xl rounded-tr-none text-sm">
                      <p className="mb-2">Конечно! Квадратное уравнение имеет вид:</p>
                      <p className="font-medium mb-2">ax² + bx + c = 0</p>
                      <p className="mb-2">Где a, b, c - это коэффициенты, и a ≠ 0.</p>
                      <p>Для решения используй формулу: x = (-b ± √(b² - 4ac)) / 2a</p>
                    </div>
                  </div>
                  <div className="flex items-start mb-4">
                    <div className="bg-primary/10 text-primary p-3 rounded-xl rounded-tl-none text-sm">
                      Можешь показать пример? Например, x² + 5x + 6 = 0
                    </div>
                  </div>
                  <div className="flex items-start flex-row-reverse">
                    <div className="bg-secondary text-foreground p-3 rounded-xl rounded-tr-none text-sm">
                      <p className="mb-2">Давай решим x² + 5x + 6 = 0:</p>
                      <p className="mb-2">Здесь a=1, b=5, c=6</p>
                      <p className="mb-2">x = (-5 ± √(25 - 24)) / 2</p>
                      <p className="mb-2">x = (-5 ± √1) / 2</p>
                      <p className="mb-2">x = (-5 ± 1) / 2</p>
                      <p>x₁ = -2, x₂ = -3</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary opacity-5 rounded-full"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-blue-500 opacity-5 rounded-full"></div>
        <div className="absolute -bottom-40 right-1/4 w-72 h-72 bg-primary opacity-5 rounded-full"></div>
      </div>
    </div>
  );
};

export default Hero;
