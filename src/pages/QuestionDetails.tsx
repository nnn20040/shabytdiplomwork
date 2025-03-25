
// Update the response object type to include the attachment property
const setQuestion = (prev) => ({
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
});
