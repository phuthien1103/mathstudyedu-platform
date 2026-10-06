import prisma from '../config/prisma.js';

export class QuizService {
  // 1. Tạo bài trắc nghiệm gắn với Bài học (Lesson)
  static async createQuiz(lessonId: string, data: { title: string; passingScore?: number }) {
    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) throw new Error('Không tìm thấy bài học');

    return await prisma.quiz.create({
      data: {
        title: data.title,
        passingScore: data.passingScore ?? 80,
        lessonId,
      },
    });
  }

  // 2. Thêm câu hỏi vào Quiz (Chuẩn schema: questionText, options dạng Json, correctAnswer dạng String)
  static async addQuestion(
    quizId: string,
    data: {
      questionText: string;
      options: string[];
      correctAnswer: string;
      points?: number;
    }
  ) {
    const quiz = await prisma.quiz.findUnique({ where: { id: quizId } });
    if (!quiz) throw new Error('Không tìm thấy bài trắc nghiệm');

    return await prisma.quizQuestion.create({
      data: {
        quizId,
        questionText: data.questionText,
        options: data.options,
        correctAnswer: String(data.correctAnswer),
        points: data.points ?? 1,
      },
    });
  }

  // 3. Học viên lấy đề thi (Tự động ẩn trường correctAnswer)
  static async getQuizForStudent(quizId: string) {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          select: {
            id: true,
            questionText: true,
            questionType: true,
            options: true,
            points: true,
          },
        },
      },
    });

    if (!quiz) throw new Error('Không tìm thấy bài trắc nghiệm');
    return quiz;
  }

  // 4. Học viên nộp bài thi, chấm điểm và lưu vào quiz_attempts
  static async submitQuiz(
    userId: string,
    quizId: string,
    userAnswers: { questionId: string; selectedAnswer: string }[]
  ) {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    });

    if (!quiz) throw new Error('Không tìm thấy bài trắc nghiệm');

    const totalQuestions = quiz.questions.length;
    if (totalQuestions === 0) {
      throw new Error('Bài trắc nghiệm chưa có câu hỏi nào');
    }

    let correctCount = 0;
    const questionMap = new Map(quiz.questions.map((q) => [q.id, q.correctAnswer]));

    for (const answer of userAnswers) {
      const correctAns = questionMap.get(answer.questionId);
      if (correctAns !== undefined && String(correctAns) === String(answer.selectedAnswer)) {
        correctCount++;
      }
    }

    const score = Math.round((correctCount / totalQuestions) * 100);
    const isPassed = score >= quiz.passingScore;

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId,
        quizId,
        score,
        passed: isPassed,
        answers: userAnswers,
      },
    });

    return {
      attemptId: attempt.id,
      score,
      correctCount,
      totalQuestions,
      passingScore: quiz.passingScore,
      isPassed,
    };
  }
}