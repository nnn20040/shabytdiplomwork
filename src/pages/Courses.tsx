
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CourseCard from '@/components/ui/CourseCard';
import { Button } from '@/components/ui/button';
import { Search, Filter, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Mock data for courses
  const allCourses = [
    {
      id: '1',
      title: 'Математика для ЕНТ: полный курс',
      description: 'Подготовка по всем разделам математики для успешной сдачи ЕНТ',
      instructor: 'Асанов Болат',
      category: 'Математика',
      rating: 4.9,
      students: 1250,
      lessons: 42,
      duration: '36 часов',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=500&auto=format&fit=crop',
      featured: true,
    },
    {
      id: '2',
      title: 'Физика: механика и термодинамика',
      description: 'Все законы физики с примерами решения задач в формате ЕНТ',
      instructor: 'Сергеева Анна',
      category: 'Физика',
      rating: 4.8,
      students: 840,
      lessons: 38,
      duration: '32 часа',
      image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=500&auto=format&fit=crop',
      featured: false,
    },
    {
      id: '3',
      title: 'История Казахстана: даты и события',
      description: 'Систематизированный курс по истории Казахстана для ЕНТ',
      instructor: 'Муратов Ерлан',
      category: 'История',
      rating: 4.7,
      students: 920,
      lessons: 35,
      duration: '30 часов',
      image: 'https://images.unsplash.com/photo-1593696954577-ab3d39317b97?q=80&w=500&auto=format&fit=crop',
      featured: true,
    },
    {
      id: '4',
      title: 'Казахский язык: грамматика и лексика',
      description: 'Интенсивный курс казахского языка для подготовки к ЕНТ',
      instructor: 'Айгуль Калиева',
      category: 'Казахский язык',
      rating: 4.6,
      students: 750,
      lessons: 40,
      duration: '35 часов',
      image: 'https://images.unsplash.com/photo-1555431189-0fabf2667795?q=80&w=500&auto=format&fit=crop',
      featured: false,
    },
    {
      id: '5',
      title: 'Английский язык для ЕНТ',
      description: 'Грамматика, лексика и практические задания по английскому языку',
      instructor: 'Джонс Алекс',
      category: 'Английский язык',
      rating: 4.8,
      students: 680,
      lessons: 36,
      duration: '30 часов',
      image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=500&auto=format&fit=crop',
      featured: false,
    },
    {
      id: '6',
      title: 'Химия: органическая и неорганическая',
      description: 'Полный курс химии с упором на решение задач ЕНТ',
      instructor: 'Федоров Павел',
      category: 'Химия',
      rating: 4.7,
      students: 590,
      lessons: 34,
      duration: '28 часов',
      image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?q=80&w=500&auto=format&fit=crop',
      featured: true,
    },
  ];

  const categories = ['all', 'Математика', 'Физика', 'История', 'Казахский язык', 'Английский язык', 'Химия'];
  
  const filteredCourses = allCourses.filter(course => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Каталог предметов для ЕНТ
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl">
            Выберите предметы для подготовки к ЕНТ с опытными преподавателями и адаптивной методикой обучения
          </p>
          
          {/* Search and filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-12">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Поиск курсов..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button 
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category === 'all' ? 'Все предметы' : category}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Courses grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-xl text-muted-foreground">Курсы не найдены. Попробуйте изменить параметры поиска.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Courses;
