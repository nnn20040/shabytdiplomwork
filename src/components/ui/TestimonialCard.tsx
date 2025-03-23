
import { Quote } from 'lucide-react';

interface TestimonialCardProps {
  content: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
  delay?: number;
}

const TestimonialCard = ({
  content,
  author,
  role,
  avatar,
  rating,
  delay = 0,
}: TestimonialCardProps) => {
  return (
    <div
      className="glass-card p-6 md:p-8 transition-all duration-500 animate-hover"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-6 text-primary/80">
        <Quote className="h-8 w-8" />
      </div>
      <p className="text-foreground mb-6 leading-relaxed">{content}</p>
      <div className="flex items-center">
        <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
          <img
            src={avatar}
            alt={author}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div>
          <h4 className="font-medium">{author}</h4>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
        <div className="ml-auto flex">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 15.585l-7.07 3.754 1.352-7.95L.3 6.693l7.893-1.15L10 0l1.806 5.543 7.893 1.15-4.983 4.696 1.352 7.95L10 15.585z"
                clipRule="evenodd"
              />
            </svg>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
