
import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, Send, ChevronRight, ArrowUp, Loader2, MessageSquare, X as CloseIcon, Sparkles, Book, Calculator, Image, Crown, Search } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { Textarea } from '@/components/ui/textarea';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
}

const AIChatPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const initialConversation: Conversation = {
      id: 'default',
      title: 'Новый чат',
      lastMessage: 'Привет! Я ваш ЕНТ-ассистент. Чем я могу вам помочь?',
      timestamp: new Date(),
      messages: [
        {
          id: 'welcome',
          role: 'assistant',
          content: 'Привет! Я ваш ЕНТ-ассистент. Я могу помочь вам с подготовкой к экзамену, ответить на вопросы по школьной программе и объяснить сложные темы. Что вас интересует?',
          timestamp: new Date(),
        },
      ],
    };
    
    setConversations([initialConversation]);
    setActiveConversation(initialConversation.id);
  }, []);
  
  useEffect(() => {
    // Ensure messages scroll to bottom when they change
    if (messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [activeConversation, conversations]);
  
  const getCurrentConversation = (): Conversation | undefined => {
    return conversations.find(conv => conv.id === activeConversation);
  };
  
  const getCurrentMessages = (): Message[] => {
    const conversation = getCurrentConversation();
    return conversation ? conversation.messages : [];
  };
  
  const isMathExpression = (text: string) => {
    return /^[\d\s+\-*/().]+$/.test(text.trim());
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    if (!activeConversation) return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setConversations(prevConversations => {
      return prevConversations.map(conv => {
        if (conv.id === activeConversation) {
          return {
            ...conv,
            lastMessage: input,
            timestamp: new Date(),
            messages: [...conv.messages, userMessage],
          };
        }
        return conv;
      });
    });
    
    setInput('');
    setIsLoading(true);
    
    try {
      if (isMathExpression(input)) {
        try {
          // eslint-disable-next-line no-eval
          const result = eval(input);
          const response = `Результат вычисления: ${result}`;
          
          addAssistantResponse(response);
          return;
        } catch (error) {
          console.error('Error evaluating expression:', error);
        }
      }
      
      try {
        const response = await axios.post('/api/ai-assistant/ask', { question: input });
        const aiResponse = response.data.data.response;
        
        addAssistantResponse(aiResponse);
      } catch (error) {
        console.error('Error calling AI API:', error);
        
        let fallbackResponse = '';
        
        if (input.toLowerCase().includes('казахстан')) {
          fallbackResponse = 'Казахстан — государство в Центральной Азии, бывшая советская республика. Столица — Астана. Население составляет более 19 миллионов человек. Государственным языком является казахский, а русский имеет статус языка межнационального общения. Казахстан богат природными ресурсами, включая нефть, газ и минералы.';
        } else if (input.toLowerCase().includes('ент')) {
          fallbackResponse = 'ЕНТ (Единое национальное тестирование) — система оценки знаний выпускников школ Казахстана для поступления в высшие учебные заведения страны. Тестирование включает обязательные предметы (математическая грамотность, грамотность чтения, история Казахстана) и профильные предметы в зависимости от выбранной специальности.';
        } else if (input.toLowerCase().includes('математик') || input.toLowerCase().includes('алгебр') || input.toLowerCase().includes('геометри')) {
          fallbackResponse = 'В рамках школьной программы по математике изучаются алгебра, геометрия и начала математического анализа. Ключевые темы включают уравнения, функции, производные, интегралы, планиметрию и стереометрию. На ЕНТ часто встречаются задачи на решение уравнений, неравенств, задачи на оптимизацию и геометрические задачи.';
        }
          else if (input.toLowerCase().includes('алгебра')) {
  fallbackResponse = 'Алгебра — раздел математики, изучающий операции с числами и буквенными выражениями, уравнения и их свойства.';
}
else if (input.toLowerCase().includes('функция')) {
  fallbackResponse = 'Функция — зависимость, при которой каждому значению аргумента соответствует единственное значение функции.';
}
else if (input.toLowerCase().includes('график')) {
  fallbackResponse = 'График — наглядное изображение функции на координатной плоскости.';
}
else if (input.toLowerCase().includes('корень')) {
  fallbackResponse = 'Корень — значение переменной, при котором выражение или уравнение становится верным.';
}
else if (input.toLowerCase().includes('уравнение')) {
  fallbackResponse = 'Уравнение — равенство с переменной, для которой нужно найти значения, при которых оно выполняется.';
}
else if (input.toLowerCase().includes('неравенство')) {
  fallbackResponse = 'Неравенство — выражение, показывающее порядок между двумя величинами (>, <, ≥, ≤).';
}
else if (input.toLowerCase().includes('логарифм')) {
  fallbackResponse = 'Логарифм — показатель степени, в которую нужно возвести основание, чтобы получить заданное число.';
}
else if (input.toLowerCase().includes('показательная')) {
  fallbackResponse = 'Показательная функция — функция, в которой переменная находится в показателе степени.';
}
else if (input.toLowerCase().includes('производная')) {
  fallbackResponse = 'Производная — мера изменения функции относительно изменения её аргумента.';
}
else if (input.toLowerCase().includes('интеграл')) {
  fallbackResponse = 'Интеграл — величина, отражающая площадь под графиком функции.';
}
else if (input.toLowerCase().includes('тригонометрия')) {
  fallbackResponse = 'Тригонометрия — раздел математики, изучающий отношения между сторонами и углами треугольников.';
}
else if (input.toLowerCase().includes('синус')) {
  fallbackResponse = 'Синус — тригонометрическая функция, равная отношению противолежащего катета к гипотенузе.';
}
else if (input.toLowerCase().includes('косинус')) {
  fallbackResponse = 'Косинус — тригонометрическая функция, равная отношению прилежащего катета к гипотенузе.';
}
else if (input.toLowerCase().includes('тангенс')) {
  fallbackResponse = 'Тангенс — отношение синуса к косинусу данного угла.';
}
else if (input.toLowerCase().includes('радиан')) {
  fallbackResponse = 'Радиан — единица измерения углов, основанная на длине дуги окружности.';
}
else if (input.toLowerCase().includes('геометрия')) {
  fallbackResponse = 'Геометрия — раздел математики, изучающий фигуры, размеры, формы и их взаимное расположение в пространстве.';
}
else if (input.toLowerCase().includes('треугольник')) {
  fallbackResponse = 'Треугольник — геометрическая фигура с тремя сторонами и тремя углами.';
}
else if (input.toLowerCase().includes('окружность')) {
  fallbackResponse = 'Окружность — множество точек на плоскости, равноудалённых от одной точки (центра).';
}
else if (input.toLowerCase().includes('угол')) {
  fallbackResponse = 'Угол — геометрическая фигура, образованная двумя лучами, выходящими из одной точки.';
}
else if (input.toLowerCase().includes('площадь')) {
  fallbackResponse = 'Площадь — числовая характеристика, показывающая размер поверхности фигуры.';
}
else if (input.toLowerCase().includes('объём')) {
  fallbackResponse = 'Объём — мера пространства, занимаемого телом.';
}
else if (input.toLowerCase().includes('вектор')) {
  fallbackResponse = 'Вектор — направленный отрезок, имеющий длину и направление.';
}
else if (input.toLowerCase().includes('координаты')) {
  fallbackResponse = 'Координаты — числа, определяющие положение точки на плоскости или в пространстве.';
}
else if (input.toLowerCase().includes('стереометрия')) {
  fallbackResponse = 'Стереометрия — раздел геометрии, изучающий фигуры в трёхмерном пространстве.';
}
else if (input.toLowerCase().includes('комбинаторика')) {
  fallbackResponse = 'Комбинаторика — область математики, изучающая способы выбора и размещения элементов множества.';
}
else if (input.toLowerCase().includes('вероятность')) {
  fallbackResponse = 'Вероятность — числовая мера возможности наступления события.';
}
else if (input.toLowerCase().includes('прогрессия')) {
  fallbackResponse = 'Прогрессия — числовая последовательность с определённым правилом перехода от одного члена к другому.';
}
else if (input.toLowerCase().includes('модуль')) {
  fallbackResponse = 'Модуль — абсолютное значение числа, показывающее его расстояние от нуля.';
}
else if (input.toLowerCase().includes('система')) {
  fallbackResponse = 'Система — совокупность уравнений или неравенств, которые решаются одновременно.';
}
else if (input.toLowerCase().includes('дискриминант')) {
  fallbackResponse = 'Дискриминант — выражение, определяющее количество и вид корней квадратного уравнения.';
}
else if (input.toLowerCase().includes('механика')) {
  fallbackResponse = 'Механика — раздел физики, изучающий движение тел и взаимодействие между ними.';
}
else if (input.toLowerCase().includes('кинематика')) {
  fallbackResponse = 'Кинематика — раздел механики, изучающий движение тел без учета сил, его вызывающих.';
}
else if (input.toLowerCase().includes('динамика')) {
  fallbackResponse = 'Динамика — раздел механики, изучающий влияние сил на движение тел.';
}
else if (input.toLowerCase().includes('скорость')) {
  fallbackResponse = 'Скорость — величина, показывающая, какое расстояние проходит тело за единицу времени.';
}
else if (input.toLowerCase().includes('ускорение')) {
  fallbackResponse = 'Ускорение — величина, показывающая изменение скорости тела за единицу времени.';
}
else if (input.toLowerCase().includes('сила')) {
  fallbackResponse = 'Сила — физическая величина, описывающая взаимодействие тел, приводящее к изменению их движения.';
}
else if (input.toLowerCase().includes('закон ньютон')) {
  fallbackResponse = 'Закон Ньютона — три закона, описывающие взаимодействие тел и движение под действием сил.';
}
else if (input.toLowerCase().includes('гравитация')) {
  fallbackResponse = 'Гравитация — сила притяжения, действующая между всеми телами с массой.';
}
else if (input.toLowerCase().includes('работа')) {
  fallbackResponse = 'Работа — физическая величина, равная произведению силы на перемещение тела вдоль направления этой силы.';
}
else if (input.toLowerCase().includes('мощность')) {
  fallbackResponse = 'Мощность — физическая величина, равная работе, выполненной за единицу времени.';
}
else if (input.toLowerCase().includes('кинетическая энергия')) {
  fallbackResponse = 'Кинетическая энергия — энергия тела, связанная с его движением.';
}
else if (input.toLowerCase().includes('потенциальная энергия')) {
  fallbackResponse = 'Потенциальная энергия — энергия, которая связана с положением тела в поле силы (например, гравитационного).';
}
else if (input.toLowerCase().includes('закон сохранения энергии')) {
  fallbackResponse = 'Закон сохранения энергии — закон, согласно которому энергия не исчезает, а преобразуется из одной формы в другую.';
}
else if (input.toLowerCase().includes('импульс')) {
  fallbackResponse = 'Импульс — физическая величина, равная произведению массы тела на его скорость.';
}
else if (input.toLowerCase().includes('закон сохранения импульса')) {
  fallbackResponse = 'Закон сохранения импульса — закон, согласно которому суммарный импульс системы тел сохраняется, если на неё не действуют внешние силы.';
}
else if (input.toLowerCase().includes('колебания')) {
  fallbackResponse = 'Колебания — периодические движения тела или системы тел вокруг равновесного положения.';
}
else if (input.toLowerCase().includes('волна')) {
  fallbackResponse = 'Волна — возмущение, которое распространяется в пространстве или в среде, передавая энергию без переноса вещества.';
}
else if (input.toLowerCase().includes('закон ома')) {
  fallbackResponse = 'Закон Ома — закон, описывающий зависимость тока в проводнике от напряжения и сопротивления.';
}
else if (input.toLowerCase().includes('сопротивление')) {
  fallbackResponse = 'Сопротивление — физическая величина, характеризующая сопротивление проводника току.';
}
else if (input.toLowerCase().includes('электрическое поле')) {
  fallbackResponse = 'Электрическое поле — поле, создаваемое электрическими зарядами, которое оказывает воздействие на другие заряды.';
}
else if (input.toLowerCase().includes('магнитное поле')) {
  fallbackResponse = 'Магнитное поле — поле, создаваемое движущимися электрическими зарядами или магнитами, которое воздействует на другие заряды или магниты.';
}
else if (input.toLowerCase().includes('свет')) {
  fallbackResponse = 'Свет — электромагнитное излучение, воспринимаемое глазом, имеющее диапазон волн от 400 до 700 нм.';
}
else if (input.toLowerCase().includes('дифракция')) {
  fallbackResponse = 'Дифракция — отклонение волн от прямолинейного распространения при встрече с препятствиями или отверстиями.';
}
else if (input.toLowerCase().includes('рефракция')) {
  fallbackResponse = 'Рефракция — преломление волн, например, света при переходе из одной среды в другую.';
}
else if (input.toLowerCase().includes('термодинамика')) {
  fallbackResponse = 'Термодинамика — раздел физики, изучающий теплоту, её превращения и законы, управляющие тепловыми процессами.';
}
else if (input.toLowerCase().includes('температура')) {
  fallbackResponse = 'Температура — мера средней кинетической энергии частиц в теле или веществе.';
}
else if (input.toLowerCase().includes('первый закон термодинамики')) {
  fallbackResponse = 'Первый закон термодинамики — закон сохранения энергии для термодинамических процессов, связывающий изменение внутренней энергии системы с теплотой и работой.';
}
else if (input.toLowerCase().includes('энтропия')) {
  fallbackResponse = 'Энтропия — мера беспорядка в системе или степень неупорядоченности микросостояний системы.';
}
else if (input.toLowerCase().includes('клетка')) {
  fallbackResponse = 'Клетка — основная структурная и функциональная единица живых организмов, содержащая все необходимые компоненты для жизни.';
}
else if (input.toLowerCase().includes('органеллы')) {
  fallbackResponse = 'Органеллы — специализированные структуры внутри клетки, выполняющие определённые функции (например, митохондрии, ядро, рибосомы).';
}
else if (input.toLowerCase().includes('митоз')) {
  fallbackResponse = 'Митоз — процесс деления соматической клетки, при котором образуются две идентичные дочерние клетки.';
}
else if (input.toLowerCase().includes('мейоз')) {
  fallbackResponse = 'Мейоз — процесс клеточного деления, приводящий к образованию половых клеток (гамет) с половинным числом хромосом.';
}
else if (input.toLowerCase().includes('генетика')) {
  fallbackResponse = 'Генетика — наука, изучающая законы наследственности и вариации живых организмов.';
}
else if (input.toLowerCase().includes('ДНК')) {
  fallbackResponse = 'ДНК (дезоксирибонуклеиновая кислота) — молекула, содержащая генетическую информацию, необходимую для развития и функционирования живых существ.';
}
else if (input.toLowerCase().includes('РНК')) {
  fallbackResponse = 'РНК (рибонуклеиновая кислота) — молекула, которая участвует в синтезе белков на основе информации, закодированной в ДНК.';
}
else if (input.toLowerCase().includes('белки')) {
  fallbackResponse = 'Белки — молекулы, состоящие из аминокислот, выполняющие множество функций в клетках (например, ферменты, структурные компоненты).';
}
else if (input.toLowerCase().includes('фотосинтез')) {
  fallbackResponse = 'Фотосинтез — процесс, при котором растения и некоторые микроорганизмы превращают солнечную энергию в химическую, синтезируя органические вещества из углекислого газа и воды.';
}
else if (input.toLowerCase().includes('дыхание')) {
  fallbackResponse = 'Дыхание — процесс обмена газами (поглощение кислорода и выделение углекислого газа) в организме для получения энергии.';
}
else if (input.toLowerCase().includes('кровеносная система')) {
  fallbackResponse = 'Кровеносная система — система органов, отвечающая за циркуляцию крови и транспортировку питательных веществ, кислорода и углекислого газа по организму.';
}
else if (input.toLowerCase().includes('нервная система')) {
  fallbackResponse = 'Нервная система — система органов, обеспечивающая восприятие информации, её обработку и передачу сигналов для координации работы организма.';
}
else if (input.toLowerCase().includes('иммунная система')) {
  fallbackResponse = 'Иммунная система — система организма, обеспечивающая защиту от инфекций и других вредных воздействий.';
}
else if (input.toLowerCase().includes('анатомия')) {
  fallbackResponse = 'Анатомия — наука, изучающая строение организма, его органов и тканей.';
}
else if (input.toLowerCase().includes('физиология')) {
  fallbackResponse = 'Физиология — наука, изучающая функции и процессы, протекающие в живых организмах.';
}
else if (input.toLowerCase().includes('эволюция')) {
  fallbackResponse = 'Эволюция — процесс изменения видов организмов, приводящий к возникновению новых видов на основе наследственных изменений.';
}
else if (input.toLowerCase().includes('экосистема')) {
  fallbackResponse = 'Экосистема — совокупность живых существ и их среды обитания, взаимодействующих как единое целое.';
}
else if (input.toLowerCase().includes('биогеоценоз')) {
  fallbackResponse = 'Биогеоценоз — совокупность живых организмов и их среды, существующих в определённой территории и взаимосвязанных между собой.';
}
else if (input.toLowerCase().includes('классификация организмов')) {
  fallbackResponse = 'Классификация организмов — систематизация живых существ на основе их общих признаков и эволюционного происхождения.';
}
else if (input.toLowerCase().includes('пищеварительная система')) {
  fallbackResponse = 'Пищеварительная система — система органов, обеспечивающая переваривание пищи, всасывание питательных веществ и удаление остатков.';
}
else if (input.toLowerCase().includes('размножение')) {
  fallbackResponse = 'Размножение — процесс воспроизводства особей для продолжения существования вида.';
}
else if (input.toLowerCase().includes('гормоны')) {
  fallbackResponse = 'Гормоны — биологически активные вещества, регулирующие функции организма и обмен веществ.';
}
else if (input.toLowerCase().includes('метаболизм')) {
  fallbackResponse = 'Метаболизм — совокупность всех химических реакций, происходящих в организме, обеспечивающих его жизнедеятельность.';
}
else if (input.toLowerCase().includes('репродукция')) {
  fallbackResponse = 'Репродукция — процесс размножения и воспроизводства живых организмов.';
}
else if (input.toLowerCase().includes('атом')) {
  fallbackResponse = 'Атом — наименьшая единица вещества, состоящая из ядра и окружающих его электронов.';
}
else if (input.toLowerCase().includes('молекула')) {
  fallbackResponse = 'Молекула — группа атомов, соединённых химическими связями, являющаяся наименьшей частью вещества, обладающей его химическими свойствами.';
}
else if (input.toLowerCase().includes('химическая реакция')) {
  fallbackResponse = 'Химическая реакция — процесс, в ходе которого одни вещества превращаются в другие, с изменением их химической структуры.';
}
else if (input.toLowerCase().includes('реакция горения')) {
  fallbackResponse = 'Горение — химическая реакция, при которой вещество реагирует с кислородом, сопровождаясь выделением тепла и света.';
}
else if (input.toLowerCase().includes('кислота')) {
  fallbackResponse = 'Кислота — вещество, способное отдавать протон (ион водорода) в растворе.';
}
else if (input.toLowerCase().includes('основание')) {
  fallbackResponse = 'Основание — вещество, которое может принять протон (ион водорода) или отдать гидроксид-ион в растворе.';
}
else if (input.toLowerCase().includes('соль')) {
  fallbackResponse = 'Соль — химическое соединение, образующееся в результате реакции кислоты с основанием.';
}
else if (input.toLowerCase().includes('щелочь')) {
  fallbackResponse = 'Щелочь — растворимое в воде основание, способное образовывать гидроксид-ион в растворе.';
}
else if (input.toLowerCase().includes('окисление')) {
  fallbackResponse = 'Окисление — процесс, при котором атомы вещества теряют электроны и повышают свою степень окисления.';
}
else if (input.toLowerCase().includes('восстановление')) {
  fallbackResponse = 'Восстановление — процесс, при котором атомы вещества приобретают электроны и понижают свою степень окисления.';
}
else if (input.toLowerCase().includes('стехиометрия')) {
  fallbackResponse = 'Стехиометрия — раздел химии, изучающий количественные отношения между веществами в химических реакциях.';
}
else if (input.toLowerCase().includes('моль')) {
  fallbackResponse = 'Моль — количество вещества, содержащее столько частиц (атомов, молекул), сколько их в 12 г углерода-12.';
}
else if (input.toLowerCase().includes('молекулярная масса')) {
  fallbackResponse = 'Молекулярная масса — масса одной молекулы вещества, выраженная в атомных единицах массы.';
}
else if (input.toLowerCase().includes('периодическая таблица')) {
  fallbackResponse = 'Периодическая таблица — таблица химических элементов, расположенных по возрастанию атомных номеров и упорядоченных по их химическим свойствам.';
}
else if (input.toLowerCase().includes('периодичность свойств')) {
  fallbackResponse = 'Периодичность свойств — повторяющееся изменение химических и физических свойств элементов в зависимости от их положения в периодической таблице.';
}
else if (input.toLowerCase().includes('алканы')) {
  fallbackResponse = 'Алканы — углеводороды, содержащие только одинарные связи между углеродными атомами (например, метан, этан).';
}
else if (input.toLowerCase().includes('алкены')) {
  fallbackResponse = 'Алкены — углеводороды с хотя бы одной двойной связью между углеродными атомами (например, этилен).';
}
else if (input.toLowerCase().includes('алкины')) {
  fallbackResponse = 'Алкины — углеводороды с тройной связью между углеродами (например, ацетилен).';
}
else if (input.toLowerCase().includes('кислотный остаток')) {
  fallbackResponse = 'Кислотный остаток — часть молекулы кислоты, которая остаётся после удаления протона (H+).';
}
else if (input.toLowerCase().includes('изомерия')) {
  fallbackResponse = 'Изомерия — явление, при котором различные молекулы имеют одинаковую химическую формулу, но разные структурные или пространственные конфигурации.';
}
else if (input.toLowerCase().includes('катализ')) {
  fallbackResponse = 'Катализ — ускорение химической реакции с использованием катализатора, который не расходуется в реакции.';
}
else if (input.toLowerCase().includes('кипение')) {
  fallbackResponse = 'Кипение — процесс, при котором жидкость превращается в пар при нагревании, когда её давление насыщенного пара становится равным внешнему давлению.';
}
else if (input.toLowerCase().includes('испарение')) {
  fallbackResponse = 'Испарение — процесс перехода вещества из жидкого состояния в газообразное при температуре ниже точки кипения.';
}
else if (input.toLowerCase().includes('растворимость')) {
  fallbackResponse = 'Растворимость — способность вещества растворяться в другом веществе (например, в воде) при определённых условиях.';
}
else if (input.toLowerCase().includes('осмос')) {
  fallbackResponse = 'Осмос — процесс движения растворителя через полупроницаемую мембрану в сторону большей концентрации растворённого вещества.';
}
else if (input.toLowerCase().includes('законы газов')) {
  fallbackResponse = 'Законы газов — набор законов, описывающих поведение газов в различных условиях (например, закон Бойля, закон Шарля).';
}
else if (input.toLowerCase().includes('саксы')) {
  fallbackResponse = 'Саксы — древний народ, живший на территории Казахстана и Центральной Азии, предки современного казахского народа.';
}
else if (input.toLowerCase().includes('тюркский каганат')) {
  fallbackResponse = 'Тюркский каганат — одно из первых тюркских государств, существовавшее с VI по VIII века, на территории Казахстана и Центральной Азии.';
}
else if (input.toLowerCase().includes('карлуки')) {
  fallbackResponse = 'Карлуки — древний тюркский народ, который жил на территории Казахстана и Средней Азии в средние века.';
}
else if (input.toLowerCase().includes('монгольское нашествие')) {
  fallbackResponse = 'Монгольское нашествие — серия военных походов монголов, начавшихся в XIII веке, которые охватили территорию Казахстана и привели к разрушению многих городов.';
}
else if (input.toLowerCase().includes('средневековье')) {
  fallbackResponse = 'Средневековье — исторический период, охватывающий время с V по XV века, в ходе которого на территории Казахстана развивались различные ханства и государства.';
}
else if (input.toLowerCase().includes('красная армия')) {
  fallbackResponse = 'Красная армия — вооружённые силы Советского Союза, которые принимали участие в Октябрьской революции, а также в Гражданской войне, в том числе на территории Казахстана.';
}
else if (input.toLowerCase().includes('казахское ханство')) {
  fallbackResponse = 'Казахское ханство — государственное объединение казахских племён, существовавшее с XV века до XVIII века.';
}
else if (input.toLowerCase().includes('аблай хан')) {
  fallbackResponse = 'Аблай хан — один из великих казахских правителей XVIII века, который объединил казахские ханства и защитил их от внешних угроз.';
}
else if (input.toLowerCase().includes('первая мировая война')) {
  fallbackResponse = 'Первая мировая война — глобальный конфликт 1914-1918 годов, в котором приняли участие и жители Казахстана, в том числе в составе Российской империи.';
}
else if (input.toLowerCase().includes('великая отечественная война')) {
  fallbackResponse = 'Великая Отечественная война — часть Второй мировой войны, длившаяся с 1941 по 1945 год, в которой активно участвовали казахстанцы, сражавшиеся на фронте и работавшие в тылу.';
}
else if (input.toLowerCase().includes('сталинские репрессии')) {
  fallbackResponse = 'Сталинские репрессии — массовые политические преследования в СССР в 1930-40-е годы, затронувшие Казахстан, где были репрессированы многие казахи и представители других народов.';
}
else if (input.toLowerCase().includes('некрасовцы')) {
  fallbackResponse = 'Некрасовцы — народ, переселённый в Казахстан в 1930-х годах, представители русских и украинских крестьян, которые стали частью казахстанского населения.';
}
else if (input.toLowerCase().includes('казахстан в составе ссср')) {
  fallbackResponse = 'Казахстан в составе СССР — период с 1936 по 1991 годы, когда Казахстан был одной из союзных республик Советского Союза, пережив множество изменений в политическом, экономическом и культурном плане.';
}
else if (input.toLowerCase().includes('независимость казахстана')) {
  fallbackResponse = 'Независимость Казахстана — 16 декабря 1991 года, когда Казахстан стал независимым государством после распада Советского Союза.';
}
else if (input.toLowerCase().includes('период независимости')) {
  fallbackResponse = 'Период независимости Казахстана начался с 1991 года, когда была провозглашена независимость страны и начались важные реформы в политике, экономике и социальной сфере.';
}
else if (input.toLowerCase().includes('страны центральной азии')) {
  fallbackResponse = 'Казахстан является крупнейшей страной Центральной Азии, сыгравшей важную роль в формировании региональной политики и экономического развития.';
}
else if (input.toLowerCase().includes('казахская литература')) {
  fallbackResponse = 'Казахская литература — национальная литература, основанная на устном народном творчестве и развивавшаяся с эпохи Средневековья, включая произведения известных писателей и поэтов.';
}
else if (input.toLowerCase().includes('шамиль')) {
  fallbackResponse = 'Шамиль — лидер горцев Кавказа, который боролся против российской колонизации в XIX веке, включая участие в событиях, касающихся казахской истории.';
}
else if (input.toLowerCase().includes('абай кунанбаев')) {
  fallbackResponse = 'Абай Кунанбаев — великий казахский поэт, философ, просветитель, чьи произведения оказали глубокое влияние на развитие казахской культуры и литературы.';
}
else if (input.toLowerCase().includes('железный век')) {
  fallbackResponse = 'Железный век — исторический период, с VIII века до н. э. до V века н. э., когда на территории Казахстана начали активно использовать железо для изготовления орудий труда и оружия.';
}
else if (input.toLowerCase().includes('кереки')) {
  fallbackResponse = 'Кереки — одно из казахских племён, которое сыграло важную роль в формировании казахского народа и его истории.';
}
else if (input.toLowerCase().includes('отырар')) {
  fallbackResponse = 'Отырар — древний город Казахстана, играющий важную роль в истории Великого Шёлкового пути, был разрушен во время монгольского нашествия.';
}
else if (input.toLowerCase().includes('древний египет')) {
  fallbackResponse = 'Древний Египет — одна из первых великих цивилизаций, возникшая в долине Нила. Египтяне создали уникальную культуру, включая пирамиды, иероглифическое письмо и систему религиозных верований.';
}
else if (input.toLowerCase().includes('месопотамия')) {
  fallbackResponse = 'Месопотамия — регион между реками Тигр и Евфрат, где возникла одна из первых цивилизаций, включая шумеров, аккадцев, вавилонян и ассирийцев.';
}
else if (input.toLowerCase().includes('греция')) {
  fallbackResponse = 'Древняя Греция — цивилизация, ставшая основой западной культуры, философии, демократии, искусства и науки, с такими великими личностями, как Платон и Аристотель.';
}
else if (input.toLowerCase().includes('римская империя')) {
  fallbackResponse = 'Римская империя — одна из крупнейших и самых могущественных империй в истории, оказавшая огромное влияние на западную цивилизацию.';
}
else if (input.toLowerCase().includes('падение рима')) {
  fallbackResponse = 'Падение Римской империи в 476 году н. э. привело к распаду западной части империи и началу Средневековья в Европе.';
}
else if (input.toLowerCase().includes('темные века')) {
  fallbackResponse = 'Тёмные века — период с падением Рима до начала Ренессанса, характеризующийся упадком культуры, науки и технологий в Европе.';
}
else if (input.toLowerCase().includes('ренессанс')) {
  fallbackResponse = 'Ренессанс — культурное и научное возрождение в Европе в XIV-XVII веках, которое ознаменовало конец Средневековья и начало Нового времени.';
}
else if (input.toLowerCase().includes('французская революция')) {
  fallbackResponse = 'Французская революция (1789-1799) — политическое событие, в ходе которого была свергнута монархия, и в Франции установлена республика.';
}
else if (input.toLowerCase().includes('наполеон')) {
  fallbackResponse = 'Наполеон Бонапарт — французский военный лидер и император, который завоевал большую часть Европы в начале XIX века.';
}
else if (input.toLowerCase().includes('первая мировая война')) {
  fallbackResponse = 'Первая мировая война (1914-1918) — глобальный конфликт, в котором участвовали все великие державы того времени, приведший к разрушению старых империй и изменению мирового порядка.';
}
else if (input.toLowerCase().includes('вторая мировая война')) {
  fallbackResponse = 'Вторая мировая война (1939-1945) — крупнейший конфликт в истории, в котором участвовали большинство стран мира, включая крупнейшие державы, и который привёл к значительным изменениям в мировой политике и географии.';
}
else if (input.toLowerCase().includes('холодная война')) {
  fallbackResponse = 'Холодная война — период геополитической напряженности между Советским Союзом и США после Второй мировой войны, продолжавшийся с 1947 по 1991 год.';
}
else if (input.toLowerCase().includes('революция 1917 года')) {
  fallbackResponse = 'Октябрьская революция 1917 года в России привела к свержению монархии и установлению коммунистического правительства во главе с Владимиром Лениным.';
}
else if (input.toLowerCase().includes('американская революция')) {
  fallbackResponse = 'Американская революция (1775-1783) — война за независимость 13 колоний от Великобритании, результатом которой стало образование Соединённых Штатов Америки.';
}
else if (input.toLowerCase().includes('индустриальная революция')) {
  fallbackResponse = 'Индустриальная революция — процесс массовой механизации и технической модернизации, начавшийся в Великобритании в XVIII-XIX веках, который радикально изменил промышленное производство и общественные структуры.';
}
else if (input.toLowerCase().includes('колониализм')) {
  fallbackResponse = 'Колониализм — система захвата и эксплуатации территорий, созданная европейскими державами с XVI века, что привело к экономическому и культурному воздействию на многие страны мира.';
}
else if (input.toLowerCase().includes('апартеид')) {
  fallbackResponse = 'Апартеид — политика расовой сегрегации, проводившаяся в Южноафриканской Республике с 1948 по 1994 год.';
}
else if (input.toLowerCase().includes('мартовские идеи')) {
  fallbackResponse = 'Мартовские идеи — идеи, возникшие в марте 1848 года во время революции в Европе, связанные с требованиями либеральных реформ и демократических преобразований.';
}
else if (input.toLowerCase().includes('петр первый')) {
  fallbackResponse = 'Пётр I Великий — российский император, провёл серию реформ, значительно модернизировав страну и её армию, а также открыв Россию для западной культуры.';
}
else if (input.toLowerCase().includes('барокко')) {
  fallbackResponse = 'Барокко — художественный стиль XVII-XVIII веков, характеризующийся богатой декоративностью и динамичностью в архитектуре, живописи и скульптуре.';
}
else if (input.toLowerCase().includes('феодализм')) {
  fallbackResponse = 'Феодализм — социально-экономическая система, существовавшая в Средневековой Европе, основанная на отношениях вассалитета и земельной собственности.';
}
else if (input.toLowerCase().includes('декларация независимости')) {
  fallbackResponse = 'Декларация независимости США — документ, подписанный 4 июля 1776 года, в котором 13 американских колоний провозгласили свою независимость от Великобритании.';
}
else if (input.toLowerCase().includes('восточный блок')) {
  fallbackResponse = 'Восточный блок — совокупность стран, находившихся под контролем СССР во времена Холодной войны, включающих Восточную Европу и другие социалистические государства.';
}
else if (input.toLowerCase().includes('барбарийцы')) {
  fallbackResponse = 'Барбарийцы — термин, использовавшийся в античности для обозначения народов, не относящихся к греко-римской цивилизации.';
}
else if (input.toLowerCase().includes('грамматика')) {
  fallbackResponse = 'Грамматика — система правил, регулирующих структуру предложений и использование слов в языке, включая синтаксис, морфологию и другие аспекты.';
}
else if (input.toLowerCase().includes('артикли')) {
  fallbackResponse = 'Артикли — части речи, которые используются для уточнения существительных, разделяются на определённый (the) и неопределённый (a, an).';
}
else if (input.toLowerCase().includes('время глаголов')) {
  fallbackResponse = 'Время глаголов в английском языке указывает на момент действия или состояния. Существуют основные времена: настоящее, прошедшее, будущее и их продолженные, совершенные формы.';
}
else if (input.toLowerCase().includes('модальные глаголы')) {
  fallbackResponse = 'Модальные глаголы (can, could, may, might, must, should и др.) используются для выражения возможности, разрешения, необходимости или предположений.';
}
else if (input.toLowerCase().includes('словообразование')) {
  fallbackResponse = 'Словообразование — процесс создания новых слов с помощью аффиксов, приставок и суффиксов, а также сочетания корней и аффиксов.';
}
else if (input.toLowerCase().includes('предложения')) {
  fallbackResponse = 'Предложения в английском языке имеют структуру: подлежащее + сказуемое. Вопросительные и отрицательные предложения требуют специальных вспомогательных глаголов.';
}
else if (input.toLowerCase().includes('синтаксис')) {
  fallbackResponse = 'Синтаксис — раздел грамматики, изучающий правила сочетания слов в предложениях для формирования осмысленных фраз.';
}
else if (input.toLowerCase().includes('пунктуация')) {
  fallbackResponse = 'Пунктуация в английском языке регулирует использование знаков препинания, таких как точка, запятая, вопросительный и восклицательный знаки, чтобы отделять части предложения.';
}
else if (input.toLowerCase().includes('словарный запас')) {
  fallbackResponse = 'Словарный запас — это общее количество слов, которые человек знает и использует в речи или письме.';
}
else if (input.toLowerCase().includes('идиомы')) {
  fallbackResponse = 'Идиомы — устойчивые выражения или фразы, смысл которых нельзя понять, просто переведя слова, например, "break the ice" (нарушить неловкость).';
}
else if (input.toLowerCase().includes('фразовые глаголы')) {
  fallbackResponse = 'Фразовые глаголы — это глаголы, которые состоят из основного глагола и одной или нескольких частиц (предлогов или наречий), что придает им новый смысл, например, "look up" (искать).';
}
else if (input.toLowerCase().includes('правила ударения')) {
  fallbackResponse = 'Правила ударения в английском языке не всегда фиксированы и зависят от происхождения слова. Ударение может менять значение слова, например, "record" (существительное) и "record" (глагол).';
}
else if (input.toLowerCase().includes('антонимы')) {
  fallbackResponse = 'Антонимы — это слова с противоположным значением, например, "hot" (горячий) и "cold" (холодный).';
}
else if (input.toLowerCase().includes('синонимы')) {
  fallbackResponse = 'Синонимы — это слова, которые имеют схожее или одинаковое значение, например, "big" (большой) и "large" (огромный).';
}
else if (input.toLowerCase().includes('артикли с местоимениями')) {
  fallbackResponse = 'В английском языке артикли не используются с притяжательными местоимениями (my, your, his и др.). Например, "my book", но не "the my book".';
}
else if (input.toLowerCase().includes('сложные предложения')) {
  fallbackResponse = 'Сложные предложения в английском языке содержат более одного простого предложения, соединённого с помощью союзов или запятых, например, "I like coffee, but I don\'t drink it often."';
}
else if (input.toLowerCase().includes('местоимения')) {
  fallbackResponse = 'Местоимения — это слова, которые заменяют существительные, например, "he", "she", "it", "they", "we".';
}
else if (input.toLowerCase().includes('предлог')) {
  fallbackResponse = 'Предлоги — это слова, которые показывают отношение существительного или местоимения к другим частям предложения, например, "in", "on", "at", "with".';
}
else if (input.toLowerCase().includes('пассивный залог')) {
  fallbackResponse = 'Пассивный залог используется, когда важен не субъект действия, а само действие или объект. Например, "The book was read by her."';
}
else if (input.toLowerCase().includes('активный залог')) {
  fallbackResponse = 'Активный залог используется, когда субъект выполняет действие. Например, "She reads the book."';
}
else if (input.toLowerCase().includes('сравнительные степени прилагательных')) {
  fallbackResponse = 'Сравнительная степень прилагательных используется для сравнения двух объектов, например, "taller" (выше), а превосходная степень для сравнения трёх или более, например, "the tallest" (самый высокий).';
}
else if (input.toLowerCase().includes('начальные фразы для общения')) {
  fallbackResponse = 'Начальные фразы для общения на английском языке включают такие выражения, как "How are you?", "What’s your name?", "Nice to meet you."';
}
else if (input.toLowerCase().includes('future simple')) {
  fallbackResponse = 'Future Simple tense используется для описания действий, которые произойдут в будущем. Например: "I will go to the store."';
}
else if (input.toLowerCase().includes('future continuous')) {
  fallbackResponse = 'Future Continuous tense описывает действия, которые будут происходить в определённый момент в будущем. Например: "I will be studying at 5 PM."';
}
else if (input.toLowerCase().includes('future perfect')) {
  fallbackResponse = 'Future Perfect tense описывает действия, которые будут завершены к определенному моменту в будущем. Например: "I will have finished the project by tomorrow."';
}
else if (input.toLowerCase().includes('future perfect continuous')) {
  fallbackResponse = 'Future Perfect Continuous tense используется для описания продолжительных действий, которые будут происходить до определенного времени в будущем. Например: "By next year, I will have been working here for five years."';
}
else if (input.toLowerCase().includes('present simple')) {
  fallbackResponse = 'Present Simple tense используется для выражения обычных действий, фактов и привычек. Например: "I read books every day."';
}
else if (input.toLowerCase().includes('present continuous')) {
  fallbackResponse = 'Present Continuous tense описывает действия, происходящие в данный момент. Например: "I am reading a book right now."';
}
else if (input.toLowerCase().includes('present perfect')) {
  fallbackResponse = 'Present Perfect tense используется для описания действий, которые начались в прошлом и продолжаются в настоящем. Например: "I have lived here for five years."';
}
else if (input.toLowerCase().includes('present perfect continuous')) {
  fallbackResponse = 'Present Perfect Continuous tense используется для описания действий, которые начались в прошлом и продолжаются в настоящем, акцент на продолжительность действия. Например: "I have been reading for two hours."';
}
else if (input.toLowerCase().includes('past simple')) {
  fallbackResponse = 'Past Simple tense используется для описания действий, которые произошли в прошлом. Например: "I visited the museum yesterday."';
}
else if (input.toLowerCase().includes('past continuous')) {
  fallbackResponse = 'Past Continuous tense используется для описания действия, которое происходило в определённый момент в прошлом. Например: "I was reading when you called."';
}
else if (input.toLowerCase().includes('past perfect')) {
  fallbackResponse = 'Past Perfect tense описывает действие, которое произошло до другого действия в прошлом. Например: "I had finished the homework before the class started."';
}
else if (input.toLowerCase().includes('past perfect continuous')) {
  fallbackResponse = 'Past Perfect Continuous tense описывает длительное действие, которое происходило до другого действия в прошлом. Например: "I had been reading for two hours when she arrived."';
}
else if (input.toLowerCase().includes('conditional')) {
  fallbackResponse = 'Conditional sentences описывают возможные или гипотетические ситуации. Включают Zero Conditional, First Conditional, Second Conditional и Third Conditional.';
}
else if (input.toLowerCase().includes('zero conditional')) {
  fallbackResponse = 'Zero Conditional используется для выражения общих истин или законов природы. Например: "If you heat ice, it melts."';
}
else if (input.toLowerCase().includes('first conditional')) {
  fallbackResponse = 'First Conditional используется для выражения реальных условий в будущем. Например: "If it rains, I will stay home."';
}
else if (input.toLowerCase().includes('second conditional')) {
  fallbackResponse = 'Second Conditional используется для выражения гипотетических ситуаций в настоящем или будущем. Например: "If I had a million dollars, I would travel the world."';
}
else if (input.toLowerCase().includes('third conditional')) {
  fallbackResponse = 'Third Conditional используется для выражения гипотетических ситуаций в прошлом. Например: "If I had known, I would have told you."';
}
else if (input.toLowerCase().includes('reported speech')) {
  fallbackResponse = 'Reported Speech используется для передачи чьих-то слов, часто с изменением времени. Например: "She said that she was going to the store."';
}
else if (input.toLowerCase().includes('direct speech')) {
  fallbackResponse = 'Direct Speech используется для точной передачи чьих-то слов. Например: "He said, 'I will come tomorrow.'"';
}
else if (input.toLowerCase().includes('adjective clauses')) {
  fallbackResponse = 'Adjective clauses — это придаточные предложения, которые описывают существительные. Например: "The book that I bought is interesting."';
}
else if (input.toLowerCase().includes('relative pronouns')) {
  fallbackResponse = 'Relative Pronouns (who, which, that, whose, whom) используются для связывания двух предложений, например: "The man who called is my friend."';
}
else if (input.toLowerCase().includes('countable nouns')) {
  fallbackResponse = 'Countable nouns — это существительные, которые могут быть подсчитаны. Например: "apple" (яблоко), "book" (книга).';
}
else if (input.toLowerCase().includes('uncountable nouns')) {
  fallbackResponse = 'Uncountable nouns — это существительные, которые нельзя подсчитать. Например: "water" (вода), "rice" (рис).';
}
else if (input.toLowerCase().includes('comparative adjectives')) {
  fallbackResponse = 'Comparative adjectives используются для сравнения двух объектов. Например: "taller", "smarter".';
}
else if (input.toLowerCase().includes('superlative adjectives')) {
  fallbackResponse = 'Superlative adjectives используются для выражения наивысшей степени качества. Например: "the tallest", "the smartest".';
}
else if (input.toLowerCase().includes('gerund')) {
  fallbackResponse = 'Gerund — это форма глагола, которая действует как существительное, например: "Reading is fun."';
}
else if (input.toLowerCase().includes('infinitive')) {
  fallbackResponse = 'Infinitive — это начальная форма глагола, например: "to read", "to write".';
}
else if (input.toLowerCase().includes('subject verb agreement')) {
  fallbackResponse = 'Subject-verb agreement означает, что подлежащее и сказуемое должны согласовываться по числу и лицу. Например: "She reads" vs "They read."';
}
else if (input.toLowerCase().includes('indirect questions')) {
  fallbackResponse = 'Indirect questions — это косвенные вопросы, например: "Could you tell me where the station is?"';
}
else if (input.toLowerCase().includes('tag questions')) {
  fallbackResponse = 'Tag questions — это вопросы, которые добавляются к утверждениям, например: "You are coming, aren\'t you?"';
}
else if (input.toLowerCase().includes('quantifiers')) {
  fallbackResponse = 'Quantifiers — это слова, которые обозначают количество. Например: "some", "many", "few".';
}
else if (input.toLowerCase().includes('a lot of')) {
  fallbackResponse = 'A lot of используется для обозначения большого количества чего-либо. Например: "There are a lot of books on the shelf."';
}
else if (input.toLowerCase().includes('few and little')) {
  fallbackResponse = 'Few используется с существительными, которые можно посчитать, например: "few people". Little используется с неисчисляемыми существительными, например: "little water".';
}
else if (input.toLowerCase().includes('much and many')) {
  fallbackResponse = 'Much используется с неисчисляемыми существительными, например: "much water". Many используется с исчисляемыми существительными, например: "many books".';
}
else if (input.toLowerCase().includes('some and any')) {
  fallbackResponse = 'Some используется в утвердительных предложениях и просьбах, например: "I have some apples". Any используется в вопросах и отрицаниях, например: "Do you have any apples?"';
}
else if (input.toLowerCase().includes('relative clauses')) {
  fallbackResponse = 'Relative clauses используются для дополнительной информации о существительном. Например: "The book that I read was interesting."';
}
else if (input.toLowerCase().includes('nouns and pronouns')) {
  fallbackResponse = 'Nouns are words that name people, places, or things. Pronouns replace nouns in sentences, for example: "he", "she", "it".';
}
else if (input.toLowerCase().includes('prepositions of place')) {
  fallbackResponse = 'Prepositions of place indicate the location of something. For example: "in", "on", "under".';
}
else if (input.toLowerCase().includes('prepositions of time')) {
  fallbackResponse = 'Prepositions of time are used to indicate when something happens. For example: "at", "on", "in".';
}
else if (input.toLowerCase().includes('order of adjectives')) {
  fallbackResponse = 'Order of adjectives refers to the specific sequence in which adjectives appear in a sentence. For example: "a beautiful small house".';
}
else if (input.toLowerCase().includes('collocations')) {
  fallbackResponse = 'Collocations are words that often go together, such as "make a decision" or "take a shower."';
}
else if (input.toLowerCase().includes('последовательная цепь')) {
  fallbackResponse = 'Последовательная цепь — это цепь, в которой все элементы соединены последовательно, и ток проходит через все элементы цепи.';
}
else if (input.toLowerCase().includes('параллельная цепь')) {
  fallbackResponse = 'Параллельная цепь — это цепь, в которой элементы соединены параллельно, и ток делится между ними, проходя через несколько путей.';
}
else if (input.toLowerCase().includes('закон ома')) {
  fallbackResponse = 'Закон Ома описывает зависимость тока, напряжения и сопротивления в электрической цепи: I = U/R, где I — ток, U — напряжение, R — сопротивление.';
}
else if (input.toLowerCase().includes('электрические цепи')) {
  fallbackResponse = 'Электрические цепи — это пути, по которым течет электрический ток. Они могут быть последовательными или параллельными.';
}
else if (input.toLowerCase().includes('электричество')) {
  fallbackResponse = 'Электричество — это поток электрических зарядов, который используется для питания электрических приборов. Измеряется в амперах (A).';
}
else if (input.toLowerCase().includes('магнетизм')) {
  fallbackResponse = 'Магнетизм — это явление, связанное с силой взаимодействия магнитных полей и магнитных материалов.';
}
else if (input.toLowerCase().includes('электромагнетизм')) {
  fallbackResponse = 'Электромагнетизм — это объединение электрических и магнитных явлений в одно целое, описывающее их взаимодействие.';
}
else if (input.toLowerCase().includes('квантовая механика')) {
  fallbackResponse = 'Квантовая механика — это раздел физики, который изучает поведение частиц на атомном и субатомном уровнях.';
}
else if (input.toLowerCase().includes('ядерная энергия')) {
  fallbackResponse = 'Ядерная энергия — это энергия, высвобождаемая при делении атомных ядер или при их слиянии, используется в ядерных реакторах.';
}
else if (input.toLowerCase().includes('волновая скорость')) {
  fallbackResponse = 'Скорость волны — это скорость распространения волны в среде. Формула: v = λf, где λ — длина волны, f — частота.';
}
else if (input.toLowerCase().includes('дифракция')) {
  fallbackResponse = 'Дифракция — это явление, при котором волна изменяет своё направление при встрече с препятствием или щелью.';
}
else if (input.toLowerCase().includes('интерференция')) {
  fallbackResponse = 'Интерференция — это явление, при котором две или более волны встречаются и создают новую волну с результатирующей амплитудой.';
}
else if (input.toLowerCase().includes('отражение')) {
  fallbackResponse = 'Отражение — это явление, при котором волна возвращается в исходную среду, не изменяя свою форму.';
}
else if (input.toLowerCase().includes('преломление')) {
  fallbackResponse = 'Преломление — это изменение направления распространения волны при переходе из одной среды в другую, обусловленное изменением скорости волны.';
}
else if (input.toLowerCase().includes('простое гармоническое движение')) {
  fallbackResponse = 'Простое гармоническое движение — это колебательное движение, при котором сила восстановления пропорциональна смещению от положения равновесия.';
}
else if (input.toLowerCase().includes('плотность')) {
  fallbackResponse = 'Плотность — это масса вещества на единицу объема. Формула: ρ = m/V, где ρ — плотность, m — масса, V — объем.';
}
else if (input.toLowerCase().includes('температура')) {
  fallbackResponse = 'Температура — это мера средней кинетической энергии частиц вещества. Единицы измерения: градусы Цельсия (°C), Кельвины (K).';
}
else if (input.toLowerCase().includes('давление')) {
  fallbackResponse = 'Давление — это сила, действующая на единицу площади. Формула: p = F/S, где p — давление, F — сила, S — площадь.';
}
else if (input.toLowerCase().includes('ускорение')) {
  fallbackResponse = 'Ускорение — это изменение скорости объекта за единицу времени. Формула: a = (v2 - v1)/t, где v2 — конечная скорость, v1 — начальная скорость, t — время.';
}
else if (input.toLowerCase().includes('скорость')) {
  fallbackResponse = 'Скорость — это физическая величина, показывающая, какое расстояние проходит объект за единицу времени. Выражается как v = s/t, где s — расстояние, t — время.';
}
else if (input.toLowerCase().includes('динамика')) {
  fallbackResponse = 'Динамика — это раздел механики, изучающий движение тел и силы, вызывающие это движение.';
}
else if (input.toLowerCase().includes('статистика')) {
  fallbackResponse = 'Статика — это раздел механики, изучающий тела, находящиеся в покое или движущиеся с постоянной скоростью, под воздействием внешних сил.';
}
else if (input.toLowerCase().includes('энергия')) {
  fallbackResponse = 'Энергия — это способность тела совершать работу. Виды энергии включают кинетическую, потенциальную и внутреннюю энергию.';
}
else if (input.toLowerCase().includes('импульс')) {
  fallbackResponse = 'Импульс — это произведение массы тела на его скорость. Закон сохранения импульса утверждает, что импульс в замкнутой системе сохраняется.';
}
else if (input.toLowerCase().includes('работа')) {
  fallbackResponse = 'Работа — это физическая величина, характеризующая изменение энергии объекта под воздействием силы. Работу измеряют в джоулях (Дж).';
}
else if (input.toLowerCase().includes('вакуум')) {
  fallbackResponse = 'Вакуум — это пространство, в котором отсутствуют частички вещества, и в котором нет сопротивления движению объектов.';
}
else if (input.toLowerCase().includes('скорость света')) {
  fallbackResponse = 'Скорость света в вакууме составляет приблизительно 300 000 км/с, что является максимальной возможной скоростью передачи информации.';
}
else if (input.toLowerCase().includes('температурный коэффициент сопротивления')) {
  fallbackResponse = 'Температурный коэффициент сопротивления — это величина, показывающая, как изменяется сопротивление проводника с изменением температуры.';
}
else if (input.toLowerCase().includes('энергия связи')) {
  fallbackResponse = 'Энергия связи — это энергия, необходимая для разделения компонентов атома или молекулы на отдельные части.';
}
else if (input.toLowerCase().includes('теплота')) {
  fallbackResponse = 'Теплота — это форма энергии, которая передается от более горячего тела к более холодному. Измеряется в джоулях (Дж).';
}
else if (input.toLowerCase().includes('теплопередача')) {
  fallbackResponse = 'Теплопередача — это процесс передачи тепла от одного тела к другому, может быть выполнена тремя способами: проводимостью, конвекцией и излучением.';
}
else if (input.toLowerCase().includes('конвекция')) {
  fallbackResponse = 'Конвекция — это процесс передачи тепла за счет движения жидкости или газа, вызванного разницей температур.';
}
else if (input.toLowerCase().includes('проводность')) {
  fallbackResponse = 'Проводность — это способность материала передавать электрический ток или тепло. Для электричества это зависит от наличия свободных электронов в веществе.';
}
else if (input.toLowerCase().includes('излучение')) {
  fallbackResponse = 'Излучение — это передача энергии в виде волн или частиц, например, солнечное излучение или радиоволны.';
}
else if (input.toLowerCase().includes('резонанс')) {
  fallbackResponse = 'Резонанс — это явление, при котором объект начинает колебаться с максимальной амплитудой на частоте, совпадающей с собственной частотой этого объекта.';
}
else if (input.toLowerCase().includes('сила тяжести')) {
  fallbackResponse = 'Сила тяжести — это сила, с которой Земля притягивает все объекты. Она пропорциональна массе объекта и инверсно пропорциональна квадрату расстояния до центра Земли.';
}
else if (input.toLowerCase().includes('гравитационная постоянная')) {
  fallbackResponse = 'Гравитационная постоянная (G) — это физическая константа, которая участвует в расчетах гравитационных взаимодействий между телами.';
}
else if (input.toLowerCase().includes('центростремительная сила')) {
  fallbackResponse = 'Центростремительная сила — это сила, направленная к центру окружности, которая необходима для того, чтобы объект двигался по кривой траектории.';
}
else if (input.toLowerCase().includes('сила инерции')) {
  fallbackResponse = 'Сила инерции — это сила, которая возникает у объектов при изменении их состояния движения, пропорциональная массе и ускорению.';
}
else if (input.toLowerCase().includes('плотность энергии')) {
  fallbackResponse = 'Плотность энергии — это количество энергии, сосредоточенное в единице объема.';
}
else if (input.toLowerCase().includes('масса')) {
  fallbackResponse = 'Масса — это мера инертности тела и количества материи, которое оно содержит. Масса измеряется в килограммах (кг).';
}
else if (input.toLowerCase().includes('уровень энергии')) {
  fallbackResponse = 'Уровень энергии — это количество энергии, которое система может иметь в зависимости от ее состояния и свойств.';
}
else if (input.toLowerCase().includes('потенциальная энергия')) {
  fallbackResponse = 'Потенциальная энергия — это энергия, которую объект обладает за счет своего положения или состояния, например, высоты относительно поверхности Земли.';
}
else if (input.toLowerCase().includes('кинетическая энергия')) {
  fallbackResponse = 'Кинетическая энергия — это энергия движения тела, выражается как E = 1/2 mv^2, где m — масса, v — скорость объекта.';
}
else if (input.toLowerCase().includes('кулоновская сила')) {
  fallbackResponse = 'Кулоновская сила — это сила, которая действует между двумя точечными электрическими зарядами. Закон Кулона описывает эту силу как F = k(q1q2)/r^2.';
}
else if (input.toLowerCase().includes('электрический ток')) {
  fallbackResponse = 'Электрический ток — это направленное движение электрических зарядов, обычно электронов, в проводнике.';
}
else if (input.toLowerCase().includes('заряд')) {
  fallbackResponse = 'Электрический заряд — это физическая величина, характеризующая свойство частиц взаимодействовать с электрическими и магнитными полями.';
}
else if (input.toLowerCase().includes('клетка')) {
  fallbackResponse = 'Клетка — основная структурная и функциональная единица живых организмов. Все живые существа состоят из клеток.';
}
else if (input.toLowerCase().includes('митоз')) {
  fallbackResponse = 'Митоз — процесс деления клеток, в ходе которого из одной материнской клетки образуются две дочерние клетки с идентичным набором хромосом.';
}
else if (input.toLowerCase().includes('мейоз')) {
  fallbackResponse = 'Мейоз — процесс клеточного деления, который приводит к образованию половых клеток (гамет) с половинным набором хромосом.';
}
else if (input.toLowerCase().includes('ДНК')) {
  fallbackResponse = 'ДНК (дезоксирибонуклеиновая кислота) — молекула, которая хранит генетическую информацию и является основой наследственности.';
}
else if (input.toLowerCase().includes('РНК')) {
  fallbackResponse = 'РНК (рибонуклеиновая кислота) — молекула, участвующая в синтезе белков, в том числе передающая информацию с ДНК к рибосомам.';
}
else if (input.toLowerCase().includes('белки')) {
  fallbackResponse = 'Белки — органические молекулы, состоящие из аминокислот, играющие важную роль в клеточных процессах и структуре организма.';
}
else if (input.toLowerCase().includes('углеводы')) {
  fallbackResponse = 'Углеводы — органические вещества, основными функциями которых являются обеспечение организма энергией и участие в обменных процессах.';
}
else if (input.toLowerCase().includes('липиды')) {
  fallbackResponse = 'Липиды — органические вещества, такие как жиры и масла, которые участвуют в образовании клеточных мембран и служат источником энергии.';
}
else if (input.toLowerCase().includes('витамины')) {
  fallbackResponse = 'Витамины — органические вещества, необходимые для нормального обмена веществ в организме, но не синтезируемые в достаточном количестве.';
}
else if (input.toLowerCase().includes('минеральные вещества')) {
  fallbackResponse = 'Минеральные вещества — это элементы, необходимые для нормальной работы организма, такие как кальций, магний, железо и т.д.';
}
else if (input.toLowerCase().includes('клеточная мембрана')) {
  fallbackResponse = 'Клеточная мембрана — полупроницаемая оболочка, которая ограничивает клетку и регулирует обмен веществ между клеткой и внешней средой.';
}
else if (input.toLowerCase().includes('цитоплазма')) {
  fallbackResponse = 'Цитоплазма — часть клетки, расположенная между клеточной мембраной и ядром, в которой происходят многие биохимические реакции.';
}
else if (input.toLowerCase().includes('ядерная оболочка')) {
  fallbackResponse = 'Ядерная оболочка — мембрана, которая окружает ядро клетки и регулирует обмен веществ между ядром и цитоплазмой.';
}
else if (input.toLowerCase().includes('митохондрии')) {
  fallbackResponse = 'Митохондрии — органеллы клетки, которые отвечают за выработку энергии в виде АТФ, а также участвуют в клеточном дыхании.';
}
else if (input.toLowerCase().includes('хлоропласты')) {
  fallbackResponse = 'Хлоропласты — органеллы растительных клеток, содержащие хлорофилл и участвующие в процессе фотосинтеза.';
}
else if (input.toLowerCase().includes('эндоплазматический ретикулум')) {
  fallbackResponse = 'Эндоплазматический ретикулум — система мембран, которая синтезирует и транспортирует белки и липиды внутри клетки.';
}
else if (input.toLowerCase().includes('рибосомы')) {
  fallbackResponse = 'Рибосомы — органеллы, которые синтезируют белки в клетке, используя информацию, закодированную в молекулах РНК.';
}
else if (input.toLowerCase().includes('аппарат гольджи')) {
  fallbackResponse = 'Аппарат Гольджи — органелла клетки, участвующая в модификации, упаковке и транспортировке белков и липидов.';
}
else if (input.toLowerCase().includes('плазматическая мембрана')) {
  fallbackResponse = 'Плазматическая мембрана — мембрана клетки, которая регулирует поступление и выход веществ в и из клетки.';
}
else if (input.toLowerCase().includes('фотосинтез')) {
  fallbackResponse = 'Фотосинтез — процесс, при котором растения используют солнечный свет для синтеза органических веществ из углекислого газа и воды.';
}
else if (input.toLowerCase().includes('дыхание')) {
  fallbackResponse = 'Дыхание — процесс, при котором организмы получают кислород и выделяют углекислый газ, обеспечивая клеточное дыхание.';
}
else if (input.toLowerCase().includes('гликолиз')) {
  fallbackResponse = 'Гликолиз — это этап клеточного дыхания, при котором молекулы глюкозы расщепляются до пирувата, при этом выделяется энергия.';
}
else if (input.toLowerCase().includes('цитозоль')) {
  fallbackResponse = 'Цитозоль — жидкая часть цитоплазмы, в которой растворены различные вещества и происходят биохимические реакции.';
}
else if (input.toLowerCase().includes('осмос')) {
  fallbackResponse = 'Осмос — это процесс диффузии воды через полупроницаемую мембрану, направленный от области с низким содержанием растворенных веществ к области с более высоким содержанием.';
}
else if (input.toLowerCase().includes('диффузия')) {
  fallbackResponse = 'Диффузия — это процесс равномерного распределения молекул вещества в объеме или по поверхности из области с более высокой концентрацией в область с низкой концентрацией.';
}
else if (input.toLowerCase().includes('плазмолиз')) {
  fallbackResponse = 'Плазмолиз — это процесс отслоения клеточной мембраны от клеточной стенки в растительной клетке, происходящий при осмотическом давлении.';
}
else if (input.toLowerCase().includes('растворение')) {
  fallbackResponse = 'Растворение — процесс, при котором вещество (растворенное) распространяется в жидкости (растворителе) до полного равномерного распределения.';
}
else if (input.toLowerCase().includes('анималистика')) {
  fallbackResponse = 'Анималистика — это раздел биологии, изучающий животных, их классификацию, поведение и экосистемы, в которых они обитают.';
}
else if (input.toLowerCase().includes('экология')) {
  fallbackResponse = 'Экология — наука о взаимодействии организмов между собой и с окружающей средой, а также о влиянии этих взаимодействий на биосферу.';
}
else if (input.toLowerCase().includes('эволюция')) {
  fallbackResponse = 'Эволюция — процесс изменений в популяциях живых существ через поколения, направленный на улучшение приспособленности к условиям окружающей среды.';
}
else if (input.toLowerCase().includes('микроорганизмы')) {
  fallbackResponse = 'Микроорганизмы — это живые организмы, которые можно наблюдать только с помощью микроскопа, включая бактерии, вирусы и простейшие.';
}
else if (input.toLowerCase().includes('иммунная система')) {
  fallbackResponse = 'Иммунная система — это система организма, обеспечивающая защиту от инфекций и болезней путем распознавания и уничтожения чуждых веществ.';
}
else if (input.toLowerCase().includes('антитела')) {
  fallbackResponse = 'Антитела — белки, которые вырабатываются иммунной системой для распознавания и нейтрализации чуждых веществ (антигенов).';
}
else if (input.toLowerCase().includes('вакцинация')) {
  fallbackResponse = 'Вакцинация — это процесс введения в организм ослабленных или убитых микробов или их компонентов для стимулирования иммунного ответа.';
}
else if (input.toLowerCase().includes('генетика')) {
  fallbackResponse = 'Генетика — это наука о наследственности и изменчивости организмов, изучающая законы передачи признаков от родителей к потомству.';
}
else if (input.toLowerCase().includes('генетический код')) {
  fallbackResponse = 'Генетический код — это система, с помощью которой информация, содержащаяся в ДНК, используется для синтеза белков.';
}
else if (input.toLowerCase().includes('мутаторные гены')) {
  fallbackResponse = 'Мутаторные гены — это гены, которые повышают частоту мутаций в организме и играют важную роль в эволюции.';
}
else if (input.toLowerCase().includes('атом')) {
  fallbackResponse = 'Атом — наименьшая частица химического элемента, состоящая из ядра, содержащего протоны и нейтроны, и облака электронов.';
}
else if (input.toLowerCase().includes('молекула')) {
  fallbackResponse = 'Молекула — группа атомов, соединенных химическими связями, которая является основным структурным элементом химического вещества.';
}
else if (input.toLowerCase().includes('химическая связь')) {
  fallbackResponse = 'Химическая связь — взаимодействие между атомами или молекулами, которое приводит к образованию химических веществ.';
}
else if (input.toLowerCase().includes('ион')) {
  fallbackResponse = 'Ион — зарядная частица, образующаяся в результате потери или приобретения электрона атомом или молекулой.';
}
else if (input.toLowerCase().includes('кислота')) {
  fallbackResponse = 'Кислота — вещество, которое при растворении в воде отдает протоны (ион водорода, H+) и имеет кислотный вкус.';
}
else if (input.toLowerCase().includes('основание')) {
  fallbackResponse = 'Основание — вещество, которое при растворении в воде принимает протоны (H+) или отдает ионы гидроксила (OH-).';
}
else if (input.toLowerCase().includes('соль')) {
  fallbackResponse = 'Соль — химическое соединение, образующееся в результате реакции кислоты с основанием, в которой один из элементов заменяется на катион.';
}
else if (input.toLowerCase().includes('реакция')) {
  fallbackResponse = 'Химическая реакция — процесс преобразования одних веществ в другие с изменением их химической структуры и свойств.';
}
else if (input.toLowerCase().includes('катализатор')) {
  fallbackResponse = 'Катализатор — вещество, которое ускоряет химическую реакцию, но не расходуется в процессе реакции.';
}
else if (input.toLowerCase().includes('окисление')) {
  fallbackResponse = 'Окисление — процесс, при котором атом или ион теряет электроны, увеличивая свою степень окисления.';
}
else if (input.toLowerCase().includes('восстановление')) {
  fallbackResponse = 'Восстановление — процесс, при котором атом или ион принимает электроны, уменьшая свою степень окисления.';
}
else if (input.toLowerCase().includes('температура кипения')) {
  fallbackResponse = 'Температура кипения — температура, при которой давление насыщенного пара жидкости становится равным внешнему давлению, и жидкость переходит в газообразное состояние.';
}
else if (input.toLowerCase().includes('температура плавления')) {
  fallbackResponse = 'Температура плавления — температура, при которой твёрдое вещество плавится и переходит в жидкое состояние.';
}
else if (input.toLowerCase().includes('растворимость')) {
  fallbackResponse = 'Растворимость — способность вещества растворяться в другом веществе (растворителе) при определенных условиях, таких как температура и давление.';
}
else if (input.toLowerCase().includes('кислотный дождь')) {
  fallbackResponse = 'Кислотный дождь — осадки с повышенной кислотностью, которые образуются из-за выбросов в атмосферу оксидов серы и азота, взаимодействующих с водяными парами.';
}
else if (input.toLowerCase().includes('оксид')) {
  fallbackResponse = 'Оксид — химическое соединение, в котором кислород соединен с другим элементом. Например, углекислый газ (CO2) является оксидом углерода.';
}
else if (input.toLowerCase().includes('соляная кислота')) {
  fallbackResponse = 'Соляная кислота — водный раствор хлороводородной кислоты (HCl), используемый в химической промышленности и лабораториях.';
}
else if (input.toLowerCase().includes('серная кислота')) {
  fallbackResponse = 'Серная кислота — сильная кислота, химическая формула которой H2SO4, используется в производстве удобрений и в других химических процессах.';
}
else if (input.toLowerCase().includes('азотная кислота')) {
  fallbackResponse = 'Азотная кислота — сильная кислота с формулой HNO3, используется в производстве удобрений, взрывчатых веществ и в других химических реакциях.';
}
else if (input.toLowerCase().includes('углекислый газ')) {
  fallbackResponse = 'Углекислый газ (CO2) — газ, который образуется при сжигании углеродсодержащих веществ и используется растениями в процессе фотосинтеза.';
}
else if (input.toLowerCase().includes('водород')) {
  fallbackResponse = 'Водород — химический элемент с атомным номером 1, который является основным компонентом многих химических соединений, включая воду.';
}
else if (input.toLowerCase().includes('кислород')) {
  fallbackResponse = 'Кислород — химический элемент с атомным номером 8, необходим для дыхания большинства живых организмов и участвует в процессах горения.';
}
else if (input.toLowerCase().includes('хлор')) {
  fallbackResponse = 'Хлор — химический элемент с атомным номером 17, газ с сильным запахом, широко используемый в химической промышленности, например, в производстве хлорсодержащих соединений.';
}
else if (input.toLowerCase().includes('сероорганические соединения')) {
  fallbackResponse = 'Сероорганические соединения — органические вещества, содержащие серу, такие как сульфиды и сульфоны, которые играют важную роль в биохимических процессах.';
}
else if (input.toLowerCase().includes('периодическая таблица')) {
  fallbackResponse = 'Периодическая таблица элементов — таблица, в которой химические элементы упорядочены по их атомным номерам, и которая отображает их химические свойства и поведение.';
}
else if (input.toLowerCase().includes('алканы')) {
  fallbackResponse = 'Алканы — углеводороды, состоящие только из углерода и водорода, которые связаны одинарными связями. Пример: метан (CH4).';
}
else if (input.toLowerCase().includes('алкены')) {
  fallbackResponse = 'Алкены — углеводороды с одной или несколькими двойными связями между атомами углерода. Пример: этилен (C2H4).';
}
else if (input.toLowerCase().includes('алкин')) {
  fallbackResponse = 'Алкин — углеводороды, содержащие тройные связи между атомами углерода. Пример: ацетилен (C2H2).';
}
else if (input.toLowerCase().includes('соли кислот')) {
  fallbackResponse = 'Соли кислот — химические соединения, образующиеся в результате реакции кислоты с основанием, например, натрий хлорид (NaCl) — соль соляной кислоты.';
}
else if (input.toLowerCase().includes('антипирены')) {
  fallbackResponse = 'Антипирены — химические вещества, которые замедляют или предотвращают горение материалов, используемые для повышения огнестойкости.';
}
else if (input.toLowerCase().includes('соли металлов')) {
  fallbackResponse = 'Соли металлов — это химические соединения, образующиеся в результате реакции кислот с металлами. Пример: сульфат меди (CuSO4).';
}
else if (input.toLowerCase().includes('осаждение')) {
  fallbackResponse = 'Осаждение — процесс образования твёрдого вещества (осадка) из раствора, который происходит при изменении условий, таких как температура или концентрация.';
}
else if (input.toLowerCase().includes('реакция нейтрализации')) {
  fallbackResponse = 'Реакция нейтрализации — реакция между кислотой и основанием с образованием соли и воды.';
}
else if (input.toLowerCase().includes('элементарный состав')) {
  fallbackResponse = 'Элементарный состав — это перечень химических элементов, входящих в состав вещества или соединения.';
}
else if (input.toLowerCase().includes('дистилляция')) {
  fallbackResponse = 'Дистилляция — метод разделения смеси веществ с различными точками кипения, используемый для очистки жидкостей или отделения компонентов.';
}
else if (input.toLowerCase().includes('казахское ханство')) {
  fallbackResponse = 'Казахское ханство — средневековое государство, существовавшее на территории Казахстана с XV века, основанное Жәнібеком и Керей.';
}
else if (input.toLowerCase().includes('аблай хан')) {
  fallbackResponse = 'Абылай хан — казахский хан XVIII века, который объединял различные казахские племена и вел борьбу против внешних угроз, в том числе против Российской империи.';
}
else if (input.toLowerCase().includes('жәнібек хан')) {
  fallbackResponse = 'Жәнібек хан — один из основателей Казахского ханства, правитель казахских племен в XV веке.';
}
else if (input.toLowerCase().includes('керей хан')) {
  fallbackResponse = 'Керей хан — основатель и первый правитель Казахского ханства, который вместе с Жәнібеком в 1465 году основал это государство.';
}
else if (input.toLowerCase().includes('орда')) {
  fallbackResponse = 'Орда — средневековое государственное объединение, которое существовало в Казахстане, например, Золотая Орда, являющаяся наследницей Великой Монгольской империи.';
}
else if (input.toLowerCase().includes('тюркский каганат')) {
  fallbackResponse = 'Тюркский каганат — древнее государство, существовавшее в Центральной Азии в VI-VIII веках, на территории которого позже возник Казахстан.';
}
else if (input.toLowerCase().includes('кипчак')) {
  fallbackResponse = 'Кипчак — тюркский народ и племя, которое составляло основу Великой Орды и участвовало в формировании Казахского ханства.';
}
else if (input.toLowerCase().includes('цонгозь')) {
  fallbackResponse = 'Цонгозь — народ, проживавший в Казахстане в древности, являвшийся частью более широкой группы тюркских племен.';
}
else if (input.toLowerCase().includes('казахи')) {
  fallbackResponse = 'Казахи — тюркский народ, основное население Казахстана, говорящий на казахском языке и имеющий богатую культурную и историческую традицию.';
}
else if (input.toLowerCase().includes('сибирь')) {
  fallbackResponse = 'Сибирь — обширная географическая область, часть которой вошла в состав Российской империи в XVIII-XIX веках, включая территорию Казахстана.';
}
else if (input.toLowerCase().includes('алтай')) {
  fallbackResponse = 'Алтай — горная система в Центральной Азии, которая исторически служила важным культурным и политическим центром для тюркских народов.';
}
else if (input.toLowerCase().includes('батыс казахстан')) {
  fallbackResponse = 'Западный Казахстан — важная часть страны, исторически играющая роль в экономическом и культурном развитии Казахстана.';
}
else if (input.toLowerCase().includes('мавзолей хана')) {
  fallbackResponse = 'Мавзолей хана — историческое памятное сооружение, посвященное великим правителям, например, мавзолей Аблая хана в Казахстане.';
}
else if (input.toLowerCase().includes('мухаммед-хан')) {
  fallbackResponse = 'Мухаммед-хан — хан казахского ханства в XVI веке, который укрепил территориальную целостность и осуществил важные реформы.';
}
else if (input.toLowerCase().includes('кз')) {
  fallbackResponse = 'Казахстан (КЗ) — суверенное государство в Центральной Азии, которое в настоящее время имеет стратегическое значение для региона.';
}
else if (input.toLowerCase().includes('сырдарья')) {
  fallbackResponse = 'Сырдарья — одна из крупнейших рек Центральной Азии, проходящая через территорию Казахстана и имеющая историческое значение для древних цивилизаций региона.';
}
else if (input.toLowerCase().includes('каспийское море')) {
  fallbackResponse = 'Каспийское море — крупнейшее замкнутое водоем в мире, который омывает западные границы Казахстана и имеет важное экономическое и экологическое значение.';
}
else if (input.toLowerCase().includes('каратау')) {
  fallbackResponse = 'Каратау — горная система в южной части Казахстана, известная своей исторической значимостью и уникальными природными ресурсами.';
}
else if (input.toLowerCase().includes('ахмет яшауи')) {
  fallbackResponse = 'Ахмет Яссауи — знаменитый казахский суфийский святой и поэт XIII века, чье учение оказало влияние на развитие духовной жизни Казахстана.';
}
else if (input.toLowerCase().includes('түркістан')) {
  fallbackResponse = 'Туркестан — исторический город в Южном Казахстане, центр духовного и культурного развития региона, где находится мавзолей Ахмета Яссауи.';
}
else if (input.toLowerCase().includes('козы казак') {
  fallbackResponse = 'Козы Казак — важный символ казахской культуры и национальной идентичности, относящийся к прошлому казахов.';
}
else if (input.toLowerCase().includes('туран')) {
  fallbackResponse = 'Туран — историческое название территории, которая включает Казахстан, и охватывает значительные части Центральной Азии.';
}
else if (input.toLowerCase().includes('цзинь империи')) {
  fallbackResponse = 'Цзинь империи — китайская империя, имевшая влияние на территорию Казахстана и сыгравшая важную роль в формировании отношений с соседними народами.';
}
else if (input.toLowerCase().includes('шагатайская орда')) {
  fallbackResponse = 'Шагатайская Орда — часть великой монгольской империи, которая занимала территорию современного Казахстана и Центральной Азии.';
}
else if (input.toLowerCase().includes('средневековье')) {
  fallbackResponse = 'Средневековье — период в истории, в который происходило активное развитие государств, таких как Казахстан, и установление культурных и политических связей.';
}
else if (input.toLowerCase().includes('выход из монголов')) {
  fallbackResponse = 'Выход из монгольского владычества — процесс освобождения казахских племен от монгольского господства и утверждения независимости.';
}
else if (input.toLowerCase().includes('золотая орда')) {
  fallbackResponse = 'Золотая Орда — монгольское государство, включавшее территорию Казахстана и ставшее важным политическим и культурным центром Средней Азии.';
}
else if (input.toLowerCase().includes('северное и южное казахское ханство')) {
  fallbackResponse = 'Северное и Южное казахское ханство — историческое деление казахского ханства, возникшее после распада единого государства.';
}
else if (input.toLowerCase().includes('кризисная эпоха')) {
  fallbackResponse = 'Кризисная эпоха — период в истории Казахстана, когда страну постигли внутренние и внешние политические конфликты и экономические трудности.';
}
else if (input.toLowerCase().includes('древний египет')) {
  fallbackResponse = 'Древний Египет — одна из самых древних цивилизаций мира, известная своими пирамидами, фараонами и развитием письменности.';
}
else if (input.toLowerCase().includes('рима')) {
  fallbackResponse = 'Древний Рим — одна из крупнейших цивилизаций античности, оставившая наследие в праве, архитектуре и войне.';
}
else if (input.toLowerCase().includes('греция')) {
  fallbackResponse = 'Древняя Греция — цивилизация, оказавшая значительное влияние на культуру, философию и науку.';
}
else if (input.toLowerCase().includes('фараоны')) {
  fallbackResponse = 'Фараоны — правители Древнего Египта, которые считались богами на земле и обладали неограниченной властью.';
}
else if (input.toLowerCase().includes('пифагор')) {
  fallbackResponse = 'Пифагор — древнегреческий математик и философ, известный теоремой, касающейся прямоугольных треугольников.';
}
else if (input.toLowerCase().includes('платон')) {
  fallbackResponse = 'Платон — философ Древней Греции, основатель Академии, знаменитый своими трудами по философии, математике и политике.';
}
else if (input.toLowerCase().includes('аристотель')) {
  fallbackResponse = 'Аристотель — древнегреческий философ, ученик Платона и учитель Александра Македонского, автор множества философских трудов.';
}
else if (input.toLowerCase().includes('александр македонский')) {
  fallbackResponse = 'Александр Македонский — один из величайших полководцев в истории, который создал империю, охватывающую большую часть тогдашнего известного мира.';
}
else if (input.toLowerCase().includes('персидская империя')) {
  fallbackResponse = 'Персидская империя — одно из крупнейших государств в истории, известное своей культурой, архитектурой и политической системой.';
}
else if (input.toLowerCase().includes('римская империя')) {
  fallbackResponse = 'Римская империя — одно из величайших государств античности, которое существовало более 500 лет и охватывало почти всю Европу, Северную Африку и часть Азии.';
}
else if (input.toLowerCase().includes('византийская империя')) {
  fallbackResponse = 'Византийская империя — восточная часть Римской империи, которая продолжала существовать после падения Западной Римской империи и просуществовала до 1453 года.';
}
else if (input.toLowerCase().includes('средневековье')) {
  fallbackResponse = 'Средневековье — период в истории Европы, продолжавшийся с 5 по 15 век, известен феодализмом, крестовыми походами и развитием христианства.';
}
else if (input.toLowerCase().includes('темные века')) {
  fallbackResponse = 'Темные века — исторический период в Европе после падения Римской империи, характеризующийся упадком культуры и образования.';
}
else if (input.toLowerCase().includes('крестовые походы')) {
  fallbackResponse = 'Крестовые походы — военные экспедиции христиан в средние века, направленные на освобождение Святой Земли от мусульман.';
}
else if (input.toLowerCase().includes('феодализм')) {
  fallbackResponse = 'Феодализм — социально-экономическая система, распространенная в Европе в Средние века, основанная на земле и вассальных отношениях.';
}
else if (input.toLowerCase().includes('французская революция')) {
  fallbackResponse = 'Французская революция — массовое восстание в конце XVIII века, приведшее к падению монархии и установлению республики во Франции.';
}
else if (input.toLowerCase().includes('наполеон')) {
  fallbackResponse = 'Наполеон Бонапарт — французский император, который создал огромную империю и ввел реформы в юридической и социальной сферах.';
}
else if (input.toLowerCase().includes('индустриальная революция')) {
  fallbackResponse = 'Индустриальная революция — исторический процесс, который начался в Великобритании в XVIII веке и привел к массовому переходу от аграрной экономики к промышленной.';
}
else if (input.toLowerCase().includes('первая мировая война')) {
  fallbackResponse = 'Первая мировая война — глобальный конфликт, который происходил с 1914 по 1918 год, в котором участвовали мировые державы, а также привел к значительным политическим и социальным изменениям.';
}
else if (input.toLowerCase().includes('вторая мировая война')) {
  fallbackResponse = 'Вторая мировая война — глобальный конфликт, продолжавшийся с 1939 по 1945 год, в который были вовлечены страны по всему миру, и который завершился победой антигитлеровской коалиции.';
}
else if (input.toLowerCase().includes('холодная война')) {
  fallbackResponse = 'Холодная война — период напряженности между СССР и США с 1947 по 1991 год, характеризующийся политическим, военным и идеологическим соперничеством.';
}
else if (input.toLowerCase().includes('европейский союз')) {
  fallbackResponse = 'Европейский союз — политическое и экономическое объединение европейских стран, целью которого является создание общего рынка и поддержание мира в Европе.';
}
else if (input.toLowerCase().includes('глобализация')) {
  fallbackResponse = 'Глобализация — процесс интеграции стран и народов через экономические, культурные и политические связи.';
}
else if (input.toLowerCase().includes('колониализм')) {
  fallbackResponse = 'Колониализм — система завоевания и эксплуатации территорий, установление контроля над странами и народами для получения экономической выгоды.';
}
else if (input.toLowerCase().includes('индийская независимость')) {
  fallbackResponse = 'Индийская независимость — процесс освобождения Индии от британского колониального владычества в 1947 году.';
}
else if (input.toLowerCase().includes('битва при водах')) {
  fallbackResponse = 'Битва при Водах — важное сражение в истории, победа в котором повлияла на исход определенного исторического конфликта.';
}
else if (input.toLowerCase().includes('персидская империя')) {
  fallbackResponse = 'Персидская империя — одно из крупнейших государств античности, существовавшее с 6 века до н. э. до завоевания Александром Македонским.';
}
else if (input.toLowerCase().includes('корейская война')) {
  fallbackResponse = 'Корейская война — военный конфликт, происходивший в Корее с 1950 по 1953 год, в который были вовлечены США и Китай.';
}
else if (input.toLowerCase().includes('мексиканская революция')) {
  fallbackResponse = 'Мексиканская революция — серия вооруженных конфликтов в Мексике в начале 20 века, в результате которой было свергнуто диктаторское правление и установлена республика.';
}
          else if (input.toLowerCase().includes('физик')) {
          fallbackResponse = 'Школьный курс физики охватывает механику, термодинамику, электричество и магнетизм, оптику и элементы квантовой физики. На ЕНТ по физике проверяется умение применять формулы, законы и принципы для решения практических задач, понимание физических явлений и процессов.';
        } 
          else if (input.toLowerCase().includes('биолог')) {
          fallbackResponse = 'Школьный курс биологии охватывает клеточную структуру, генетику, анатомию человека, зоологию, ботанику и экологию. На ЕНТ по биологии проверяются знания о строении клеток, процессах жизнедеятельности организмов, функциях органов человека, законах наследственности и взаимодействии живых организмов с окружающей средой.';
        } else if (input.toLowerCase().includes('хими')) {
          fallbackResponse = 'Курс химии в школе включает основы общей, неорганической и органической химии. На ЕНТ по химии проверяются знания периодической системы элементов, степеней окисления, типов химических реакций, кислот и оснований, органических веществ (углеводороды, спирты, кислоты), а также умение решать задачи на массу, объем, молярную концентрацию и уравнивание реакций.';
        } else if (input.toLowerCase().includes('истори') || input.toLowerCase().includes('казахстан')) {
          fallbackResponse = 'История Казахстана — обязательный предмет на ЕНТ, охватывающий древнюю, средневековую, новую и новейшую историю страны. Темы включают ранние государства (Саки, Усунь, Тюркский каганат), Золотую Орду, Казахское ханство, колониальную политику Российской империи, период Советского Союза, обретение независимости и современное развитие Республики Казахстан.';
        }
        else {
          fallbackResponse = 'Я могу помочь вам с информацией по предметам ЕНТ, стратегиям подготовки и различным темам школьной программы. Вы можете задать более конкретный вопрос по интересующей вас теме, и я постараюсь предоставить полезную информацию.';
        }
        
        addAssistantResponse(fallbackResponse);
      }
    } catch (error) {
      console.error('Error getting response:', error);
      toast.error('Не удалось получить ответ');
      
      addAssistantResponse('Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const addAssistantResponse = (content: string) => {
    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content,
      timestamp: new Date(),
    };
    
    setConversations(prevConversations => {
      return prevConversations.map(conv => {
        if (conv.id === activeConversation) {
          const newTitle = conv.messages.length === 1 ? input.slice(0, 30) + (input.length > 30 ? '...' : '') : conv.title;
          
          return {
            ...conv,
            title: newTitle,
            messages: [...conv.messages, assistantMessage],
          };
        }
        return conv;
      });
    });
    
    setIsLoading(false);
  };
  
  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      title: 'Новый чат',
      lastMessage: 'Привет! Я ваш ЕНТ-ассистент. Чем я могу вам помочь?',
      timestamp: new Date(),
      messages: [
        {
          id: `welcome-${Date.now()}`,
          role: 'assistant',
          content: 'Привет! Я ваш ЕНТ-ассистент. Я могу помочь вам с подготовкой к экзамену, ответить на вопросы по школьной программе и объяснить сложные темы. Что вас интересует?',
          timestamp: new Date(),
        },
      ],
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversation(newConversation.id);
    inputRef.current?.focus();
  };
  
  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    
    if (activeConversation === id) {
      const remaining = conversations.filter(conv => conv.id !== id);
      if (remaining.length > 0) {
        setActiveConversation(remaining[0].id);
      } else {
        createNewConversation();
      }
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };
  
  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const filteredConversations = searchInput
    ? conversations.filter(conv => 
        conv.title.toLowerCase().includes(searchInput.toLowerCase()) ||
        conv.messages.some(msg => msg.content.toLowerCase().includes(searchInput.toLowerCase()))
      )
    : conversations;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
            <Card className="lg:col-span-1 h-full flex flex-col">
              <CardHeader className="px-4 py-3 space-y-2 border-b">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Чаты</CardTitle>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={createNewConversation}
                    title="Новый чат"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="relative">
                  <Input
                    placeholder="Поиск чатов..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-8"
                  />
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  {searchInput && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1.5 h-6 w-6"
                      onClick={() => setSearchInput('')}
                    >
                      <CloseIcon className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              
              <ScrollArea className="flex-1 p-2">
                {filteredConversations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Нет активных чатов</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredConversations.map((conv) => (
                      <div
                        key={conv.id}
                        className={`p-3 rounded-lg cursor-pointer flex flex-col hover:bg-muted transition-colors ${
                          activeConversation === conv.id ? 'bg-muted' : ''
                        }`}
                        onClick={() => setActiveConversation(conv.id)}
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium truncate">{conv.title}</h3>
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(conv.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {conv.lastMessage}
                        </p>
                        
                        {activeConversation === conv.id && (
                          <div className="flex justify-end mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteConversation(conv.id);
                              }}
                            >
                              Удалить
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </Card>
            
            <Card className="lg:col-span-3 h-full flex flex-col">
              <CardHeader className="px-6 py-4 border-b">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarImage src="/favicon.ico" alt="Shabyt AI" />
                    <AvatarFallback><Brain className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">ЕНТ Ассистент</CardTitle>
                    <p className="text-xs text-muted-foreground">Задавайте вопросы по школьной программе, ЕНТ и не только</p>
                  </div>
                </div>
              </CardHeader>
              
              <Tabs defaultValue="chat" className="flex-1 flex flex-col">
                <TabsList className="mx-6 mt-2 mb-4 grid grid-cols-3">
                  <TabsTrigger value="chat">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Чат
                  </TabsTrigger>
                  <TabsTrigger value="features">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Возможности
                  </TabsTrigger>
                  <TabsTrigger value="usage">
                    <Crown className="h-4 w-4 mr-2" />
                    Использование
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0 overflow-hidden">
                  <ScrollArea 
                    ref={scrollAreaRef} 
                    className="flex-1 px-6 overflow-y-auto"
                    style={{ height: "calc(100% - 160px)" }} // Ensure we leave space for the input area
                  >
                    <div className="space-y-6 py-4">
                      {getCurrentMessages().map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.role === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div className="flex items-start max-w-[80%]">
                            {message.role === 'assistant' && (
                              <Avatar className="h-8 w-8 mr-3 mt-1">
                                <AvatarImage src="/favicon.ico" alt="Shabyt AI" />
                                <AvatarFallback><Brain className="h-4 w-4" /></AvatarFallback>
                              </Avatar>
                            )}
                            
                            <div
                              className={`px-4 py-3 rounded-lg ${
                                message.role === 'user'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              <div className="whitespace-pre-wrap text-sm">
                                {message.content}
                              </div>
                              <div className="text-xs mt-1 opacity-70 text-right">
                                {formatTimestamp(message.timestamp)}
                              </div>
                            </div>
                            
                            {message.role === 'user' && (
                              <Avatar className="h-8 w-8 ml-3 mt-1">
                                <AvatarImage 
                                  src="https://api.dicebear.com/7.x/initials/svg?seed=User" 
                                  alt="User" 
                                />
                                <AvatarFallback>U</AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="flex items-start max-w-[80%]">
                            <Avatar className="h-8 w-8 mr-3 mt-1">
                              <AvatarImage src="/favicon.ico" alt="Shabyt AI" />
                              <AvatarFallback><Brain className="h-4 w-4" /></AvatarFallback>
                            </Avatar>
                            
                            <div className="px-4 py-3 rounded-lg bg-muted">
                              <div className="flex items-center space-x-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-sm">Печатает...</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                  
                  <div className="p-4 border-t">
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                      <Textarea
                        ref={inputRef}
                        placeholder="Напишите сообщение..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 resize-none"
                        rows={1}
                        disabled={isLoading}
                      />
                      <Button 
                        type="submit" 
                        size="icon" 
                        disabled={isLoading || !input.trim()}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </form>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Используйте Enter для отправки, Shift+Enter для новой строки
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="features" className="flex-1 p-6 overflow-auto">
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Возможности ЕНТ-ассистента</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4 hover:bg-secondary/20 transition-colors">
                        <div className="flex items-start">
                          <div className="bg-primary/10 p-2 rounded-full mr-3">
                            <Book className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">Подготовка к ЕНТ</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Получите ответы на вопросы по программе ЕНТ, разъяснения сложных тем и понятий.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4 hover:bg-secondary/20 transition-colors">
                        <div className="flex items-start">
                          <div className="bg-primary/10 p-2 rounded-full mr-3">
                            <Calculator className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">Решение задач</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Помощь в решении математических, физических и других задач с пошаговым объяснением.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4 hover:bg-secondary/20 transition-colors">
                        <div className="flex items-start">
                          <div className="bg-primary/10 p-2 rounded-full mr-3">
                            <Image className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">Визуализация</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Получите визуальные объяснения сложных концепций и процессов.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4 hover:bg-secondary/20 transition-colors">
                        <div className="flex items-start">
                          <div className="bg-primary/10 p-2 rounded-full mr-3">
                            <Brain className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">Интеллектуальный помощник</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Персональный помощник, который адаптируется к вашему уровню знаний и помогает улучшать результаты.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-4">Примеры запросов</h3>
                      
                      <div className="space-y-3">
                        <div className="bg-muted p-3 rounded-lg">
                          <p className="font-medium">Объясни теорему Пифагора простыми словами</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Получите простое объяснение математических концепций
                          </p>
                        </div>
                        
                        <div className="bg-muted p-3 rounded-lg">
                          <p className="font-medium">Как решить квадратное уравнение x² + 5x + 6 = 0?</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Пошаговое решение задач с объяснениями
                          </p>
                        </div>
                        
                        <div className="bg-muted p-3 rounded-lg">
                          <p className="font-medium">Расскажи о важных событиях в истории Казахстана</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Получите информацию по исторической тематике
                          </p>
                        </div>
                        
                        <div className="bg-muted p-3 rounded-lg">
                          <p className="font-medium">25 * 32 / 4 + 17</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Вычисление математических выражений
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="usage" className="flex-1 p-6 overflow-auto">
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Использование ассистента</h2>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <h3 className="font-medium text-lg mb-3">Советы по эффективному использованию</h3>
                          
                          <ul className="space-y-3">
                            <li className="flex items-start">
                              <div className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                                <span className="text-xs font-bold text-primary px-1">1</span>
                              </div>
                              <div>
                                <p className="font-medium">Задавайте конкретные вопросы</p>
                                <p className="text-sm text-muted-foreground">
                                  Чем точнее вопрос, тем полезнее будет ответ. Вместо "Расскажи о математике" спросите "Объясни правило дифференцирования сложной функции".
                                </p>
                              </div>
                            </li>
                            
                            <li className="flex items-start">
                              <div className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                                <span className="text-xs font-bold text-primary px-1">2</span>
                              </div>
                              <div>
                                <p className="font-medium">Используйте контекст беседы</p>
                                <p className="text-sm text-muted-foreground">
                                  Ассистент запоминает предыдущие сообщения в разговор��, поэтому вы можете задавать уточняющие вопросы.
                                </p>
                              </div>
                            </li>
                            
                            <li className="flex items-start">
                              <div className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                                <span className="text-xs font-bold text-primary px-1">3</span>
                              </div>
                              <div>
                                <p className="font-medium">Проверяйте информацию</p>
                                <p className="text-sm text-muted-foreground">
                                  Ассистент стремится предоставлять точную информацию, но рекомендуется проверять важные данные в надежных источниках.
                                </p>
                              </div>
                            </li>
                            
                            <li className="flex items-start">
                              <div className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                                <span className="text-xs font-bold text-primary px-1">4</span>
                              </div>
                              <div>
                                <p className="font-medium">Оценивайте предоставленные ответы</p>
                                <p className="text-sm text-muted-foreground">
                                  Обратная связь помогает улучшать качество работы ассистента.
                                </p>
                              </div>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <h3 className="font-medium text-lg mb-3">Ограничения</h3>
                          
                          <ul className="space-y-2">
                            <li className="text-sm flex items-start">
                              <div className="h-5 w-5 flex items-center justify-center mr-2">•</div>
                              <p>
                                Ассистент не имеет доступа к интернету и основывается на данных, доступных на момент его создания.
                              </p>
                            </li>
                            <li className="text-sm flex items-start">
                              <div className="h-5 w-5 flex items-center justify-center mr-2">•</div>
                              <p>
                                Могут быть ограничения в решении очень сложных или узкоспециализированных задач.
                              </p>
                            </li>
                            <li className="text-sm flex items-start">
                              <div className="h-5 w-5 flex items-center justify-center mr-2">•</div>
                              <p>
                                Ассистент не может выполнять действия вне платформы, такие как отправка электронной почты или доступ к файлам.
                              </p>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AIChatPage;
