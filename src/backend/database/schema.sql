
-- Users table (simplified without tokens)
CREATE TABLE
    IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'student', -- student, teacher, admin
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP,
        profile_image_url VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE,
        language_preference VARCHAR(10) DEFAULT 'ru' -- ru, kk, en
    );

-- Registration logs table with improved information
CREATE TABLE
    IF NOT EXISTS registration_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        user_id UUID REFERENCES users (id) ON DELETE CASCADE,
        email VARCHAR(255) NOT NULL,
        registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        registration_source VARCHAR(50), -- web, mobile, api
        ip_address VARCHAR(50),
        user_agent TEXT,
        referrer VARCHAR(255),
        device_info JSONB,
        verification_status VARCHAR(20) DEFAULT 'pending', -- pending, verified, failed
        verification_date TIMESTAMP,
        verification_method VARCHAR(20), -- email, phone, etc.
        verification_attempts INTEGER DEFAULT 0,
        metadata JSONB -- Additional metadata about registration process
    );

-- User login logs with enhanced tracking
CREATE TABLE
    IF NOT EXISTS login_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        user_id UUID REFERENCES users (id) ON DELETE CASCADE,
        login_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        login_source VARCHAR(50), -- web, mobile, api
        ip_address VARCHAR(50),
        user_agent TEXT,
        location VARCHAR(255), -- Country/city derived from IP
        device_id VARCHAR(255), -- Unique device identifier if available
        status VARCHAR(20) NOT NULL, -- success, failed
        failure_reason VARCHAR(255),
        session_id VARCHAR(255), -- Track user sessions
        session_duration INTEGER -- Session duration in seconds (updated on logout)
    );

-- User Sessions tracking
CREATE TABLE
    IF NOT EXISTS user_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        user_id UUID REFERENCES users (id) ON DELETE CASCADE,
        session_token VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL,
        last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address VARCHAR(50),
        user_agent TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        metadata JSONB
    );

-- User Settings table
CREATE TABLE
    IF NOT EXISTS user_settings (
        user_id UUID PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
        email_notifications BOOLEAN DEFAULT TRUE,
        theme VARCHAR(10) DEFAULT 'light',
        auto_play_videos BOOLEAN DEFAULT TRUE,
        show_progress BOOLEAN DEFAULT TRUE,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- Courses table
CREATE TABLE
    IF NOT EXISTS courses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        teacher_id UUID REFERENCES users (id),
        category VARCHAR(100) NOT NULL,
        image VARCHAR(255),
        duration VARCHAR(50),
        featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- Lessons table
CREATE TABLE
    IF NOT EXISTS lessons (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        course_id UUID REFERENCES courses (id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        title_kk VARCHAR(255),
        content TEXT NOT NULL,
        content_kk TEXT,
        duration_minutes INTEGER DEFAULT 0,
        order_index INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_published BOOLEAN DEFAULT TRUE
    );

-- Course enrollments
CREATE TABLE
    IF NOT EXISTS enrollments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        user_id UUID REFERENCES users (id) ON DELETE CASCADE,
        course_id UUID REFERENCES courses (id) ON DELETE CASCADE,
        enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP,
        progress INTEGER DEFAULT 0, -- percentage of completion
        last_accessed_at TIMESTAMP,
        UNIQUE (user_id, course_id)
    );

-- Lesson progress
CREATE TABLE
    IF NOT EXISTS lesson_progress (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        user_id UUID REFERENCES users (id) ON DELETE CASCADE,
        lesson_id UUID REFERENCES lessons (id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'not_started', -- not_started, in_progress, completed
        completion_date TIMESTAMP,
        time_spent_seconds INTEGER DEFAULT 0,
        last_position_seconds INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (user_id, lesson_id)
    );

-- Tests table
CREATE TABLE
    IF NOT EXISTS tests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        course_id UUID REFERENCES courses (id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        title_kk VARCHAR(255),
        description TEXT,
        description_kk TEXT,
        time_limit_minutes INTEGER DEFAULT 30,
        passing_score INTEGER DEFAULT 70, -- percentage
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_published BOOLEAN DEFAULT TRUE,
        order_index INTEGER NOT NULL
    );

-- Questions table
CREATE TABLE
    IF NOT EXISTS questions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        test_id UUID REFERENCES tests (id) ON DELETE CASCADE,
        question_text TEXT NOT NULL,
        question_text_kk TEXT,
        question_type VARCHAR(50) NOT NULL, -- multiple_choice, true_false, short_answer, essay
        correct_answer TEXT,
        explanation TEXT,
        explanation_kk TEXT,
        points INTEGER DEFAULT 1,
        difficulty VARCHAR(20) DEFAULT 'medium', -- easy, medium, hard
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- Options for multiple choice questions
CREATE TABLE
    IF NOT EXISTS question_options (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        question_id UUID REFERENCES questions (id) ON DELETE CASCADE,
        option_text TEXT NOT NULL,
        option_text_kk TEXT,
        is_correct BOOLEAN DEFAULT FALSE,
        order_index INTEGER NOT NULL
    );

-- Test attempts
CREATE TABLE
    IF NOT EXISTS test_attempts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        user_id UUID REFERENCES users (id) ON DELETE CASCADE,
        test_id UUID REFERENCES tests (id) ON DELETE CASCADE,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP,
        score INTEGER,
        time_spent_seconds INTEGER,
        status VARCHAR(20) DEFAULT 'in_progress', -- in_progress, completed, abandoned
        attempt_number INTEGER DEFAULT 1
    );

-- User answers for test questions
CREATE TABLE
    IF NOT EXISTS user_answers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        attempt_id UUID REFERENCES test_attempts (id) ON DELETE CASCADE,
        question_id UUID REFERENCES questions (id) ON DELETE CASCADE,
        answer TEXT,
        is_correct BOOLEAN,
        points_earned INTEGER DEFAULT 0,
        reviewed BOOLEAN DEFAULT FALSE,
        reviewer_id UUID REFERENCES users (id),
        reviewer_feedback TEXT,
        review_date TIMESTAMP
    );

-- Forum discussions
CREATE TABLE
    IF NOT EXISTS discussions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        course_id UUID REFERENCES courses (id) ON DELETE CASCADE,
        user_id UUID REFERENCES users (id),
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_pinned BOOLEAN DEFAULT FALSE,
        is_closed BOOLEAN DEFAULT FALSE,
        view_count INTEGER DEFAULT 0,
        helpful_count INTEGER DEFAULT 0
    );

-- Discussion replies
CREATE TABLE
    IF NOT EXISTS discussion_replies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        discussion_id UUID REFERENCES discussions (id) ON DELETE CASCADE,
        user_id UUID REFERENCES users (id),
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_solution BOOLEAN DEFAULT FALSE,
        helpful_count INTEGER DEFAULT 0
    );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments (user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments (course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons (course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON lesson_progress (user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_id ON lesson_progress (lesson_id);
CREATE INDEX IF NOT EXISTS idx_tests_course_id ON tests (course_id);
CREATE INDEX IF NOT EXISTS idx_questions_test_id ON questions (test_id);
CREATE INDEX IF NOT EXISTS idx_test_attempts_user_id ON test_attempts (user_id);
CREATE INDEX IF NOT EXISTS idx_test_attempts_test_id ON test_attempts (test_id);
CREATE INDEX IF NOT EXISTS idx_discussions_course_id ON discussions (course_id);
CREATE INDEX IF NOT EXISTS idx_registration_logs_user_id ON registration_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_login_logs_user_id ON login_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions (session_token);
CREATE INDEX IF NOT EXISTS idx_registration_logs_email ON registration_logs (email);
CREATE INDEX IF NOT EXISTS idx_courses_teacher_id ON courses (teacher_id);
