
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Menu, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import StudentProfile from './StudentProfile';

const Navbar = () => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in using localStorage
    const user = localStorage.getItem('user');
    const sessionLogin = sessionStorage.getItem('isLoggedIn');
    setIsLoggedIn(!!user || !!sessionLogin);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to search results page
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild className="mr-2 block sm:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader className="mb-4">
                <SheetTitle>Меню</SheetTitle>
                <SheetDescription>
                  Навигация по платформе обучения
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-2 py-6">
                <Link
                  to="/"
                  className="flex items-center py-2 text-lg font-semibold"
                >
                  Главная
                </Link>
                <Separator />
                <Link
                  to="/courses"
                  className="flex items-center py-2 text-lg font-semibold"
                >
                  Все курсы
                </Link>
                <Link
                  to="/how-it-works"
                  className="flex items-center py-2 text-lg font-semibold"
                >
                  Как это работает
                </Link>
                <Link
                  to="/about"
                  className="flex items-center py-2 text-lg font-semibold"
                >
                  О нас
                </Link>
                <Separator />
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/student-dashboard"
                      className="flex items-center py-2 text-lg font-semibold"
                    >
                      Личный кабинет
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center py-2 text-lg font-semibold"
                    >
                      Мой профиль
                    </Link>
                    <button
                      onClick={() => {
                        localStorage.removeItem('user');
                        sessionStorage.removeItem('isLoggedIn');
                        navigate('/');
                      }}
                      className="flex items-center py-2 text-lg font-semibold"
                    >
                      Выйти
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center py-2 text-lg font-semibold"
                    >
                      Вход
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center py-2 text-lg font-semibold"
                    >
                      Регистрация
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <Link to="/" className="hidden sm:flex items-center gap-2">
            <span className="font-bold text-xl">EduKZ</span>
          </Link>

          <div className="hidden md:flex ml-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/courses">
                    <NavigationMenuLink
                      className={cn(
                        'group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50'
                      )}
                    >
                      Все курсы
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Предметы</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {[
                        {
                          title: 'Математика',
                          href: '/courses?category=math',
                          description:
                            'Алгебра, геометрия, математический анализ и другие направления',
                        },
                        {
                          title: 'Физика',
                          href: '/courses?category=physics',
                          description:
                            'Механика, электричество, оптика, квантовая физика',
                        },
                        {
                          title: 'Химия',
                          href: '/courses?category=chemistry',
                          description:
                            'Неорганическая и органическая химия, химические элементы',
                        },
                        {
                          title: 'Биология',
                          href: '/courses?category=biology',
                          description:
                            'Ботаника, зоология, анатомия, генетика и экология',
                        },
                        {
                          title: 'История',
                          href: '/courses?category=history',
                          description:
                            'История Казахстана, всемирная история и культурология',
                        },
                        {
                          title: 'Языки',
                          href: '/courses?category=languages',
                          description:
                            'Казахский, русский, английский и другие языки',
                        },
                      ].map((subject) => (
                        <li key={subject.title}>
                          <Link
                            to={subject.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">
                              {subject.title}
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {subject.description}
                            </p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/how-it-works">
                    <NavigationMenuLink
                      className={cn(
                        'group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50'
                      )}
                    >
                      Как это работает
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/about">
                    <NavigationMenuLink
                      className={cn(
                        'group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50'
                      )}
                    >
                      О нас
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        <Link to="/" className="flex sm:hidden items-center gap-2">
          <span className="font-bold text-xl">EduKZ</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          {isLoggedIn ? (
            <StudentProfile onLogout={handleLogout} />
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost">Вход</Button>
              </Link>
              <Link to="/register">
                <Button>Регистрация</Button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Search overlay */}
      <div
        className={`fixed inset-0 z-50 flex items-start justify-center bg-background/80 backdrop-blur-sm transition-opacity ${
          isSearchOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="container mt-20 mx-auto p-4 max-w-2xl">
          <div className="relative">
            <form onSubmit={handleSearch}>
              <Input
                placeholder="Найти курсы, уроки, тесты..."
                className="pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </form>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0"
              onClick={() => setIsSearchOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="mt-4">
            <h3 className="font-medium text-sm">Популярные поисковые запросы:</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {['математика', 'физика', 'ЕНТ', 'тригонометрия', 'химия'].map(
                (term) => (
                  <Button
                    key={term}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery(term);
                    }}
                  >
                    {term}
                  </Button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
