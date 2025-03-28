
import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface Student {
  id: number;
  name: string;
  email: string;
  progress: number;
  lastActive: string;
  status: 'active' | 'inactive';
}

const Students = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // В реальном приложении здесь будет API-вызов к бэкенду
    const fetchStudents = async () => {
      try {
        // Имитация API-запроса
        setTimeout(() => {
          const mockStudents: Student[] = [
            { 
              id: 1, 
              name: 'Айдар Сериков', 
              email: 'aidar@example.com', 
              progress: 67, 
              lastActive: '2023-11-15', 
              status: 'active' 
            },
            { 
              id: 2, 
              name: 'Асель Муратова', 
              email: 'assel@example.com', 
              progress: 89, 
              lastActive: '2023-11-17', 
              status: 'active' 
            },
            { 
              id: 3, 
              name: 'Канат Алиев', 
              email: 'kanat@example.com', 
              progress: 45, 
              lastActive: '2023-11-10', 
              status: 'inactive' 
            },
            { 
              id: 4, 
              name: 'Дина Ахметова', 
              email: 'dina@example.com', 
              progress: 72, 
              lastActive: '2023-11-16', 
              status: 'active' 
            },
            { 
              id: 5, 
              name: 'Ерлан Тулегенов', 
              email: 'erlan@example.com', 
              progress: 53, 
              lastActive: '2023-11-14', 
              status: 'active' 
            },
          ];
          setStudents(mockStudents);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Ошибка при загрузке списка студентов:', error);
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleViewProgress = (studentId: number) => {
    navigate(`/student/${studentId}/progress`);
  };

  const handleSendMessage = (studentId: number) => {
    navigate(`/student/${studentId}/message`);
  };

  const getProgressColorClass = (progress: number) => {
    if (progress >= 75) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    if (progress >= 50) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  };

  return (
    <Layout>
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Студенты</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Список всех студентов</CardTitle>
            <CardDescription>Просмотр прогресса и взаимодействие со студентами</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-4">Загрузка данных...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Имя</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Прогресс</TableHead>
                    <TableHead>Последняя активность</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getProgressColorClass(student.progress)}`}>
                          {student.progress}%
                        </span>
                      </TableCell>
                      <TableCell>{student.lastActive}</TableCell>
                      <TableCell>
                        <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                          {student.status === 'active' ? 'Активен' : 'Неактивен'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewProgress(student.id)}
                          >
                            Прогресс
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleSendMessage(student.id)}
                          >
                            Сообщение
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Ежедневная активность</CardTitle>
              <CardDescription>Количество активных студентов по дням</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center border rounded">
                <p className="text-muted-foreground">График активности студентов</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Прогресс по неделям</CardTitle>
              <CardDescription>Средний прогресс студентов по неделям</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center border rounded">
                <p className="text-muted-foreground">График прогресса по неделям</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Распределение по предметам</CardTitle>
              <CardDescription>Количество студентов по предметам</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center border rounded">
                <p className="text-muted-foreground">График распределения по предметам</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Результаты тестов</CardTitle>
              <CardDescription>Средние результаты тестов по предметам</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center border rounded">
                <p className="text-muted-foreground">График результатов тестов</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Students;
