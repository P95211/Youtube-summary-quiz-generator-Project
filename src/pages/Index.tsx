import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { VideoIcon, BrainCircuitIcon, GraduationCapIcon, PlayIcon, SettingsIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useVideoProcessing } from "@/hooks/useVideoProcessing";
import { VideoResults } from "@/components/VideoResults";

const Index = () => {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [videoData, setVideoData] = useState<any>(null);
  const [flashcardCount, setFlashcardCount] = useState(15);
  const [quizQuestionCount, setQuizQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState("medium");
  const { toast } = useToast();
  const { isProcessing, processVideo, fetchVideoData } = useVideoProcessing();

  const validateYouTubeUrl = (url: string): boolean => {
    const patterns = [
      /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
      /^https?:\/\/(www\.)?youtu\.be\/[\w-]+/,
      /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]+/,
      /^https?:\/\/(www\.)?youtube\.com\/v\/[\w-]+/
    ];
    return patterns.some(pattern => pattern.test(url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!youtubeUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a YouTube URL",
        variant: "destructive",
      });
      return;
    }

    if (!validateYouTubeUrl(youtubeUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid YouTube URL (youtube.com or youtu.be)",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await processVideo(youtubeUrl, {
        flashcardCount,
        quizQuestionCount,
        difficulty
      });
      const data = await fetchVideoData(result.video.id);
      setVideoData(data);
      setYoutubeUrl("");
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">YouTube Learning Hub</h2>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            YouTube Learning Hub
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform any YouTube video into summaries, flashcards, and quizzes. 
            Make learning more effective and engaging.
          </p>
        </div>

        {/* Video Input Form */}
        <Card className="max-w-2xl mx-auto mb-16">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <VideoIcon className="h-5 w-5" />
              Add YouTube Video
            </CardTitle>
            <CardDescription>
              Paste a YouTube URL to get started with generating learning materials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="youtube-url">YouTube URL</Label>
                <Input
                  id="youtube-url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Generation Options */}
              <Card className="border-dashed">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <SettingsIcon className="h-4 w-4" />
                    Generation Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="flashcard-count">Flashcards</Label>
                      <Select value={flashcardCount.toString()} onValueChange={(value) => setFlashcardCount(Number(value))}>
                        <SelectTrigger id="flashcard-count">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10 flashcards</SelectItem>
                          <SelectItem value="20">20 flashcards</SelectItem>
                          <SelectItem value="30">30 flashcards</SelectItem>
                          <SelectItem value="50">50 flashcards</SelectItem>
                          <SelectItem value="75">75 flashcards</SelectItem>
                          <SelectItem value="100">100 flashcards</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quiz-count">Quiz Questions</Label>
                      <Select value={quizQuestionCount.toString()} onValueChange={(value) => setQuizQuestionCount(Number(value))}>
                        <SelectTrigger id="quiz-count">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10 questions</SelectItem>
                          <SelectItem value="20">20 questions</SelectItem>
                          <SelectItem value="30">30 questions</SelectItem>
                          <SelectItem value="50">50 questions</SelectItem>
                          <SelectItem value="75">75 questions</SelectItem>
                          <SelectItem value="100">100 questions</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <Select value={difficulty} onValueChange={setDifficulty}>
                        <SelectTrigger id="difficulty">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <PlayIcon className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Generate ${flashcardCount} Flashcards & ${quizQuestionCount} Quiz Questions`
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Video Results */}
        {videoData && (
          <div className="max-w-4xl mx-auto mb-16">
            <VideoResults 
              video={videoData.video}
              flashcards={videoData.flashcards || []}
              quizzes={videoData.quizzes || []}
              onDataUpdate={setVideoData}
            />
          </div>
        )}

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BrainCircuitIcon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>AI-Powered Summaries</CardTitle>
              <CardDescription>
                Get concise, intelligent summaries of video content to quickly understand key points
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <GraduationCapIcon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Smart Flashcards</CardTitle>
              <CardDescription>
                Automatically generated flashcards help you memorize and review important concepts
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <PlayIcon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Interactive Quizzes</CardTitle>
              <CardDescription>
                Test your knowledge with AI-generated quizzes based on video content
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Demo Content Tabs */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Learning Materials Preview</CardTitle>
            <CardDescription>
              See how your learning materials will look once generated
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
                <TabsTrigger value="quiz">Quiz</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="mt-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Video Summary</h3>
                  <p className="text-muted-foreground">
                    Your AI-generated summary will appear here, highlighting the main points, 
                    key concepts, and important takeaways from the video.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="flashcards" className="mt-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Flashcards</h3>
                  <div className="grid gap-4">
                    <Card className="p-4">
                      <div className="font-medium mb-2">Front: What is React?</div>
                      <div className="text-muted-foreground">Back: A JavaScript library for building user interfaces</div>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="quiz" className="mt-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Interactive Quiz</h3>
                  <div className="space-y-3">
                    <div className="font-medium">1. What is the main purpose of React?</div>
                    <div className="space-y-2 ml-4">
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q1" id="a" />
                        <label htmlFor="a">Building user interfaces</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q1" id="b" />
                        <label htmlFor="b">Database management</label>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
