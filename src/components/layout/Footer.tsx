
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  PhoneCall, 
  MapPin 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary/50 pt-16 pb-8 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="animate-enter" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
              StudyHub
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Онлайн платформа для подготовки к ЕНТ с качественными материалами, тестами и помощью ИИ-ассистента.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          <div className="animate-enter" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-lg font-semibold mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Главная
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-muted-foreground hover:text-primary transition-colors">
                  Курсы
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
                  Как это работает
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  О нас
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-muted-foreground hover:text-primary transition-colors">
                  Войти
                </Link>
              </li>
            </ul>
          </div>

          <div className="animate-enter" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-lg font-semibold mb-4">Предметы</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/courses/mathematics" className="text-muted-foreground hover:text-primary transition-colors">
                  Математика
                </Link>
              </li>
              <li>
                <Link to="/courses/physics" className="text-muted-foreground hover:text-primary transition-colors">
                  Физика
                </Link>
              </li>
              <li>
                <Link to="/courses/history" className="text-muted-foreground hover:text-primary transition-colors">
                  История Казахстана
                </Link>
              </li>
              <li>
                <Link to="/courses/kazakh" className="text-muted-foreground hover:text-primary transition-colors">
                  Казахский язык
                </Link>
              </li>
              <li>
                <Link to="/courses/russian" className="text-muted-foreground hover:text-primary transition-colors">
                  Русский язык
                </Link>
              </li>
            </ul>
          </div>

          <div className="animate-enter" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-lg font-semibold mb-4">Контакты</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="text-primary mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Нур-Султан, проспект Мангилик Ел, 55/22</span>
              </li>
              <li className="flex items-center">
                <PhoneCall size={20} className="text-primary mr-3 flex-shrink-0" />
                <span className="text-muted-foreground">+7 (700) 123-45-67</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="text-primary mr-3 flex-shrink-0" />
                <span className="text-muted-foreground">info@studyhub.kz</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © {new Date().getFullYear()} StudyHub. Все права защищены.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Политика конфиденциальности
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Условия использования
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
