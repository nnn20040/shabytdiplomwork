
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';

// Mock data for student list
const mockStudents = Array(15).fill(0).map((_, i) => ({
  id: i + 1,
  name: `Студент ${i + 1}`,
  email: `student${i + 1}@example.com`,
  courses: Math.floor(Math.random() * 5) + 1,
  progress: Math.floor(Math.random() * 100),
  lastActive: new Date(Date.now() - Math.floor(Math.random() * 10) * 86400000).toLocaleDateString(),
  avatar: `/placeholder.svg`,
}));

// Mock data for activity chart
const activityData = [
  { day: 'Пн', count: 32 },
  { day: 'Вт', count: 45 },
  { day: 'Ср', count: 38 },
  { day: 'Чт', count: 42 },
  { day: 'Пт', count: 50 },
  { day: 'Сб', count: 25 },
  { day: 'Вс', count: 20 },
];

// Mock data for subject distribution
const subjectData = [
  { name: 'Математика', value: 35 },
  { name: 'Физика', value: 20 },
  { name: 'История', value: 15 },
  { name: 'Химия', value: 10 },
  { name: 'Биология', value: 10 },
  { name: 'Другие', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Students = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter students based on search query
  const filteredStudents = mockStudents.filter(
    student => 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">{t('students.title') || 'Ученики'}</h1>
        
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-3 mb-8">
            <TabsTrigger value="list">{t('students.list') || 'Список'}</TabsTrigger>
            <TabsTrigger value="analytics">{t('students.analytics') || 'Аналитика'}</TabsTrigger>
            <TabsTrigger value="progress">{t('students.progress') || 'Прогресс'}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <div className="mb-6">
              <Input
                placeholder={t('students.search') || "Поиск по имени или email..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
              />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredStudents.map((student) => (
                <Card key={student.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12 border">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-medium">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                        <div className="flex items-center mt-2 gap-2">
                          <Badge variant="outline">{student.courses} курсов</Badge>
                          <Badge variant="outline" className={
                            student.progress > 75 ? "bg-green-100 dark:bg-green-900" :
                            student.progress > 50 ? "bg-yellow-100 dark:bg-yellow-900" :
                            "bg-red-100 dark:bg-red-900"
                          }>
                            {student.progress}% прогресс
                          </Badge>
                        </div>
                        <p className="text-xs mt-2 text-muted-foreground">
                          {t('students.last_active') || 'Последняя активность'}: {student.lastActive}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" size="sm">
                        {t('students.view_profile') || 'Профиль'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="analytics">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t('students.daily_activity') || 'Ежедневная активность'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={activityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" name="Активность" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t('students.subject_distribution') || 'Распределение по предметам'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={subjectData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {subjectData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="progress">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('students.weekly_progress') || 'Прогресс по неделям'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { week: 'Неделя 1', completed: 65, target: 70 },
                          { week: 'Неделя 2', completed: 72, target: 70 },
                          { week: 'Неделя 3', completed: 68, target: 70 },
                          { week: 'Неделя 4', completed: 85, target: 70 },
                          { week: 'Неделя 5', completed: 75, target: 70 },
                          { week: 'Неделя 6', completed: 80, target: 70 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="completed" name="Выполнено %" fill="#82ca9d" />
                        <Bar dataKey="target" name="Целевой %" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t('students.test_results') || 'Результаты тестов'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { test: 'Тест 1', score: 85, average: 75 },
                          { test: 'Тест 2', score: 72, average: 70 },
                          { test: 'Тест 3', score: 90, average: 72 },
                          { test: 'Тест 4', score: 65, average: 68 },
                          { test: 'Тест 5', score: 78, average: 73 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="test" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="score" name="Балл ученика" fill="#8884d8" />
                        <Bar dataKey="average" name="Средний балл" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Students;
