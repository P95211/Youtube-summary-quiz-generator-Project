import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircleIcon, XCircleIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useVideoProcessing } from "@/hooks/useVideoProcessing";

interface VideoResultsProps {
  video: any;
  flashcards: any[];
  quizzes: any[];
  onDataUpdate?: (data: any) => void;
}

export const VideoResults = ({ video, flashcards, quizzes, onDataUpdate }: VideoResultsProps) => {
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});
  const { isProcessing, processVideo, fetchVideoData } = useVideoProcessing();

  const toggleCard = (cardId: string) => {
    const newFlipped = new Set(flippedCards);
    if (newFlipped.has(cardId)) {
      newFlipped.delete(cardId);
    } else {
      newFlipped.add(cardId);
    }
    setFlippedCards(newFlipped);
  };

  const handleQuizAnswer = (questionId: string, answer: string) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const submitQuiz = (quizId: string) => {
    setQuizSubmitted(prev => ({
      ...prev,
      [quizId]: true
    }));
  };

  const generateMoreContent = async (type: 'flashcards' | 'quiz', count: number = 10) => {
    try {
      await processVideo(video.youtube_url, {
        flashcardCount: type === 'flashcards' ? count : 0,
        quizQuestionCount: type === 'quiz' ? count : 0,
        difficulty: 'medium'
      });
      
      const updatedData = await fetchVideoData(video.id);
      onDataUpdate?.(updatedData);
    } catch (error) {
      console.error('Error generating more content:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Video Info */}
      <Card>
        <CardHeader>
          <CardTitle>{video.title}</CardTitle>
          <CardDescription>
            Processed on {new Date(video.created_at).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {video.thumbnail_url && (
            <img 
              src={video.thumbnail_url} 
              alt={video.title}
              className="w-full max-w-md mx-auto rounded-lg mb-4"
            />
          )}
          <a 
            href={video.youtube_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Watch on YouTube
          </a>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Materials</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="flashcards">
                Flashcards ({flashcards.length})
              </TabsTrigger>
              <TabsTrigger value="quiz">
                Quiz ({quizzes.reduce((acc, quiz) => acc + quiz.quiz_questions.length, 0)} questions)
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="mt-6">
              <div className="prose max-w-none">
                <h3 className="font-semibold mb-4">Video Summary</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {video.summary || "Summary not available"}
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="flashcards" className="mt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Flashcards</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => generateMoreContent('flashcards', 10)}
                    disabled={isProcessing}
                    className="flex items-center gap-2"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Generate 10 More
                  </Button>
                </div>
                <div className="grid gap-4">
                  {flashcards.map((card) => (
                    <Card 
                      key={card.id} 
                      className="cursor-pointer transition-all hover:shadow-md"
                      onClick={() => toggleCard(card.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="outline">{card.difficulty}</Badge>
                          <span className="text-sm text-muted-foreground">
                            Click to flip
                          </span>
                        </div>
                        <div className="min-h-[60px] flex items-center">
                          {flippedCards.has(card.id) ? (
                            <div>
                              <div className="text-sm font-medium text-muted-foreground mb-1">Answer:</div>
                              <div>{card.answer}</div>
                            </div>
                          ) : (
                            <div>
                              <div className="text-sm font-medium text-muted-foreground mb-1">Question:</div>
                              <div className="font-medium">{card.question}</div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="quiz" className="mt-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Interactive Quizzes</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => generateMoreContent('quiz', 10)}
                    disabled={isProcessing}
                    className="flex items-center gap-2"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Generate 10 More Questions
                  </Button>
                </div>
                {quizzes.map((quiz) => (
                  <div key={quiz.id} className="space-y-4">
                    <div>
                      <h3 className="font-semibold">{quiz.title}</h3>
                      <p className="text-muted-foreground">{quiz.description}</p>
                    </div>
                    
                    <div className="space-y-4">
                      {quiz.quiz_questions
                        .sort((a: any, b: any) => a.order_index - b.order_index)
                        .map((question: any, index: number) => (
                        <Card key={question.id}>
                          <CardContent className="p-4">
                            <div className="font-medium mb-3">
                              {index + 1}. {question.question}
                            </div>
                            <div className="space-y-2">
                              {question.options.map((option: string, optIndex: number) => {
                                const isSelected = quizAnswers[question.id] === option;
                                const isCorrect = option === question.correct_answer;
                                const wasAnswered = !!quizAnswers[question.id];
                                
                                return (
                                  <label
                                    key={optIndex}
                                    className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors ${
                                      wasAnswered
                                        ? isCorrect
                                          ? 'bg-green-50 border-green-200'
                                          : isSelected && !isCorrect
                                          ? 'bg-red-50 border-red-200'
                                          : 'bg-gray-50 border-gray-200'
                                        : isSelected
                                        ? 'bg-primary/10 border-primary'
                                        : 'hover:bg-gray-50'
                                    }`}
                                    onClick={() => {
                                      if (!wasAnswered) {
                                        handleQuizAnswer(question.id, option);
                                      }
                                    }}
                                  >
                                    <input
                                      type="radio"
                                      name={question.id}
                                      value={option}
                                      checked={isSelected}
                                      onChange={() => {}}
                                      disabled={wasAnswered}
                                      className="sr-only"
                                    />
                                    <div className="flex items-center gap-2 flex-1">
                                      <span>{option}</span>
                                      {wasAnswered && isCorrect && (
                                        <CheckCircleIcon className="h-4 w-4 text-green-600" />
                                      )}
                                      {wasAnswered && isSelected && !isCorrect && (
                                        <XCircleIcon className="h-4 w-4 text-red-600" />
                                      )}
                                    </div>
                                  </label>
                                );
                              })}
                            </div>
                            {quizAnswers[question.id] && question.explanation && (
                              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                                <div className="text-sm font-medium text-blue-900 mb-1">Explanation:</div>
                                <div className="text-sm text-blue-800">{question.explanation}</div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    {!quizSubmitted[quiz.id] && (
                      <Button 
                        onClick={() => submitQuiz(quiz.id)}
                        className="w-full"
                        disabled={quiz.quiz_questions.some((q: any) => !quizAnswers[q.id])}
                      >
                        Submit Quiz
                      </Button>
                    )}
                    
                    {quizSubmitted[quiz.id] && (
                      <div className="text-center p-4 bg-green-50 border border-green-200 rounded">
                        <div className="font-medium text-green-900">Quiz Completed!</div>
                        <div className="text-sm text-green-700">
                          Score: {quiz.quiz_questions.filter((q: any) => quizAnswers[q.id] === q.correct_answer).length} / {quiz.quiz_questions.length}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};