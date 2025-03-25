
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';

const QuestionDetails = () => {
  const { id } = useParams();
  const [responseContent, setResponseContent] = useState('');
  const [userData, setUserData] = useState({ name: 'Преподаватель' });
  const [question, setQuestion] = useState({
    id: id,
    title: 'Вопрос о законе Ньютона',
    content: 'Как формулируется третий закон Ньютона и какие примеры его применения можно привести?',
    student: 'Айгерим Нуржанова',
    studentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Student1',
    date: '15.04.2023',
    status: 'Открыт',
    subject: 'Физика',
    responses: []
  });

  const handleSendResponse = () => {
    if (!responseContent.trim()) return;

    // Update the response object type to include the attachment property
    setQuestion(prev => ({
      ...prev,
      responses: [...prev.responses, {
        id: `response-${Date.now()}`,
        content: responseContent,
        teacher: userData?.name || 'Преподаватель',
        teacherAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher',
        date: new Date().toLocaleDateString(),
        attachment: '' // Add this empty string to match the expected type
      }],
      status: 'Отвечено'
    }));

    setResponseContent('');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-800">{question.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm ${
                question.status === 'Открыт' ? 'bg-blue-100 text-blue-800' : 
                question.status === 'Отвечено' ? 'bg-green-100 text-green-800' : 
                'bg-gray-100 text-gray-800'
              }`}>
                {question.status}
              </span>
            </div>
            <div className="flex items-center mb-2">
              <img 
                src={question.studentAvatar} 
                alt={question.student} 
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p className="font-medium text-gray-900">{question.student}</p>
                <p className="text-sm text-gray-500">Предмет: {question.subject}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4">Задан: {question.date}</p>
            <div className="prose max-w-none">
              <p>{question.content}</p>
            </div>
          </div>

          {question.responses.length > 0 && (
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold mb-4">Ответы преподавателя</h2>
              {question.responses.map((response) => (
                <div key={response.id} className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <img 
                      src={response.teacherAvatar} 
                      alt={response.teacher} 
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{response.teacher}</p>
                      <p className="text-sm text-gray-500">{response.date}</p>
                    </div>
                  </div>
                  <div className="prose max-w-none mt-2">
                    <p>{response.content}</p>
                    {response.attachment && (
                      <div className="mt-3 p-2 border rounded flex items-center bg-gray-50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        <span className="text-sm text-blue-600 hover:underline">{response.attachment}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Ответить на вопрос</h2>
            <div className="mb-4">
              <textarea
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={5}
                placeholder="Напишите ваш ответ здесь..."
                value={responseContent}
                onChange={(e) => setResponseContent(e.target.value)}
              ></textarea>
            </div>
            <div className="flex justify-between items-center">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                onClick={handleSendResponse}
              >
                Отправить ответ
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QuestionDetails;
