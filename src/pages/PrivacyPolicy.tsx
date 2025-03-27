
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/" className="inline-flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Вернуться на главную
              </Link>
            </Button>
          </div>
          
          <h1 className="text-3xl font-bold mb-8">Политика конфиденциальности</h1>
          
          <div className="prose prose-blue max-w-none">
            <p className="mb-4">Последнее обновление: {new Date().toLocaleDateString('ru-RU')}</p>
            
            <p className="mb-4">
              Благодарим вас за использование StudyHub. Мы уважаем вашу приватность и стремимся защитить ваши личные данные. 
              Эта политика конфиденциальности объясняет, как мы собираем, используем и защищаем информацию, которую вы предоставляете при использовании нашей платформы.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Сбор информации</h2>
            <p className="mb-4">
              Мы собираем следующие типы информации:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Личная информация (имя, email, номер телефона), которую вы предоставляете при регистрации.</li>
              <li>Информация об устройстве и использовании (IP-адрес, тип браузера, время доступа).</li>
              <li>Данные об успеваемости и прогрессе в обучении.</li>
              <li>Информация, которую вы предоставляете в профиле, сообщениях и при взаимодействии с другими пользователями.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Использование информации</h2>
            <p className="mb-4">
              Мы используем собранную информацию для:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Предоставления и улучшения наших образовательных услуг.</li>
              <li>Персонализации вашего опыта обучения.</li>
              <li>Обработки транзакций и управления вашей учетной записью.</li>
              <li>Коммуникации с вами по поводу обновлений, новых курсов и специальных предложений.</li>
              <li>Анализа тенденций и улучшения нашей платформы.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Защита информации</h2>
            <p className="mb-4">
              Мы принимаем следующие меры для защиты вашей информации:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Используем шифрование для защиты передаваемых данных.</li>
              <li>Регулярно проводим аудиты безопасности системы.</li>
              <li>Ограничиваем доступ к личной информации только для авторизованного персонала.</li>
              <li>Храним данные на защищенных серверах с регулярным резервным копированием.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Раскрытие информации третьим лицам</h2>
            <p className="mb-4">
              Мы не продаем, не обмениваем и не передаем вашу личную информацию третьим лицам без вашего согласия, за исключением следующих случаев:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Когда это необходимо для предоставления запрошенных вами услуг.</li>
              <li>В случае слияния или приобретения компании.</li>
              <li>Когда это требуется по закону.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Файлы cookie</h2>
            <p className="mb-4">
              Наш сайт использует файлы cookie для улучшения пользовательского опыта и анализа использования платформы. 
              Вы можете настроить свой браузер так, чтобы отклонять файлы cookie, однако это может ограничить функциональность сайта.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Права пользователей</h2>
            <p className="mb-4">
              Вы имеете право:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Запросить доступ к своим личным данным.</li>
              <li>Исправить неточную информацию.</li>
              <li>Запросить удаление данных.</li>
              <li>Ограничить обработку вашей информации.</li>
              <li>Получить свои данные в структурированном, машиночитаемом формате.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Изменения в политике конфиденциальности</h2>
            <p className="mb-4">
              Мы можем обновлять нашу политику конфиденциальности время от времени. 
              Мы будем уведомлять вас о любых существенных изменениях через email или уведомление на нашем сайте.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Контактная информация</h2>
            <p className="mb-4">
              Если у вас есть вопросы или опасения по поводу нашей политики конфиденциальности, 
              пожалуйста, свяжитесь с нами:
            </p>
            <p className="mb-4">
              Email: info@studyhub.kz<br />
              Телефон: +7 (700) 123-45-67<br />
              Адрес: Нур-Султан, проспект Мангилик Ел, 55/22
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
