import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { VideoIcon, BrainCircuitIcon, GraduationCapIcon, PlayIcon, SettingsIcon, SparklesIcon, Zap } from "lucide-react";
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[var(--gradient-bg)]" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-gradient-shift bg-[length:300%_300%]" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-float" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-accent/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-primary/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />

      {/* Navigation */}
      <div className="relative z-10 container mx-auto px-4 py-6">
        <div className="flex justify-between items-center backdrop-blur-sm bg-card/50 rounded-2xl p-4 border border-white/10 shadow-[var(--shadow-card)] animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
              <SparklesIcon className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">YouTube Learning Hub</h2>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="h-4 w-4 text-primary animate-pulse" />
            AI-Powered Learning
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-primary/20">
            <SparklesIcon className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Learning Platform</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-br from-foreground via-primary to-accent bg-clip-text text-transparent leading-tight">
            YouTube Learning
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Revolution</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transform any YouTube video into <span className="text-primary font-semibold">intelligent summaries</span>, 
            <span className="text-accent font-semibold"> interactive flashcards</span>, and 
            <span className="text-primary font-semibold"> adaptive quizzes</span>
          </p>
        </div>

        {/* Video Input Form */}
        <div className="max-w-2xl mx-auto mb-20 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Card className="backdrop-blur-sm bg-card/50 border-white/10 shadow-[var(--shadow-elevated)] hover:shadow-[var(--shadow-glow)] transition-all duration-500 group">
            <CardHeader className="text-center pb-6">
              <CardTitle className="flex items-center justify-center gap-3 text-2xl">
                <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <VideoIcon className="h-6 w-6 text-white" />
                </div>
                Transform Your Video
              </CardTitle>
              <CardDescription className="text-base">
                Paste any YouTube URL and watch AI create personalized learning materials instantly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="youtube-url" className="text-base font-medium">YouTube URL</Label>
                  <div className="relative group">
                    <Input
                      id="youtube-url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      className="w-full h-12 text-base bg-background/50 backdrop-blur-sm border-2 border-border/50 focus:border-primary/50 focus:bg-background/80 transition-all duration-300 group-hover:border-primary/30"
                    />
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                </div>

                {/* Generation Options */}
                <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm hover:border-primary/40 transition-all duration-300">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg">
                        <SettingsIcon className="h-5 w-5 text-primary" />
                      </div>
                      Customization Options
                    </CardTitle>
                    <CardDescription>Fine-tune your learning experience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-3 group">
                        <Label htmlFor="flashcard-count" className="flex items-center gap-2 text-sm font-medium">
                          <BrainCircuitIcon className="h-4 w-4 text-primary" />
                          Flashcards
                        </Label>
                        <Select value={flashcardCount.toString()} onValueChange={(value) => setFlashcardCount(Number(value))}>
                          <SelectTrigger id="flashcard-count" className="bg-background/50 border-border/50 group-hover:border-primary/50 transition-colors">
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

                      <div className="space-y-3 group">
                        <Label htmlFor="quiz-count" className="flex items-center gap-2 text-sm font-medium">
                          <GraduationCapIcon className="h-4 w-4 text-accent" />
                          Quiz Questions
                        </Label>
                        <Select value={quizQuestionCount.toString()} onValueChange={(value) => setQuizQuestionCount(Number(value))}>
                          <SelectTrigger id="quiz-count" className="bg-background/50 border-border/50 group-hover:border-accent/50 transition-colors">
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

                      <div className="space-y-3 group">
                        <Label htmlFor="difficulty" className="flex items-center gap-2 text-sm font-medium">
                          <Zap className="h-4 w-4 text-primary" />
                          Difficulty
                        </Label>
                        <Select value={difficulty} onValueChange={setDifficulty}>
                          <SelectTrigger id="difficulty" className="bg-background/50 border-border/50 group-hover:border-primary/50 transition-colors">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">🌱 Easy</SelectItem>
                            <SelectItem value="medium">🔥 Medium</SelectItem>
                            <SelectItem value="hard">⚡ Hard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-[var(--shadow-glow)] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]" 
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3" />
                      Generating Learning Materials...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="mr-3 h-5 w-5" />
                      Generate {flashcardCount} Flashcards & {quizQuestionCount} Quiz Questions
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Video Results */}
        {videoData && (
          <div className="max-w-4xl mx-auto mb-20 animate-bounce-in">
            <VideoResults 
              video={videoData.video}
              flashcards={videoData.flashcards || []}
              quizzes={videoData.quizzes || []}
              onDataUpdate={setVideoData}
            />
          </div>
        )}

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            {
              icon: BrainCircuitIcon,
              title: "AI-Powered Summaries",
              description: "Get concise, intelligent summaries of video content to quickly understand key points",
              gradient: "from-blue-500/20 to-purple-500/20",
              iconGradient: "from-blue-500 to-purple-500",
              delay: "0.1s"
            },
            {
              icon: GraduationCapIcon,
              title: "Smart Flashcards", 
              description: "Automatically generated flashcards help you memorize and review important concepts",
              gradient: "from-emerald-500/20 to-teal-500/20",
              iconGradient: "from-emerald-500 to-teal-500",
              delay: "0.2s"
            },
            {
              icon: PlayIcon,
              title: "Interactive Quizzes",
              description: "Test your knowledge with AI-generated quizzes based on video content",
              gradient: "from-orange-500/20 to-red-500/20",
              iconGradient: "from-orange-500 to-red-500", 
              delay: "0.3s"
            }
          ].map((feature, index) => (
            <div key={index} className="animate-fade-in-up" style={{ animationDelay: feature.delay }}>
              <Card className={`text-center h-full backdrop-blur-sm bg-gradient-to-br ${feature.gradient} border-white/10 hover:shadow-[var(--shadow-elevated)] transition-all duration-500 group hover:-translate-y-2`}>
                <CardHeader className="pb-6">
                  <div className={`mx-auto w-16 h-16 bg-gradient-to-br ${feature.iconGradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-3 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">{feature.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          ))}
        </div>

        {/* Demo Content Tabs */}
        <div className="max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Card className="backdrop-blur-sm bg-card/50 border-white/10 shadow-[var(--shadow-elevated)] overflow-hidden">
            <CardHeader className="text-center bg-gradient-to-r from-primary/5 to-accent/5">
              <CardTitle className="text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Learning Materials Preview</CardTitle>
              <CardDescription className="text-base">
                Experience how your personalized learning materials will look once generated
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-transparent p-2 gap-2">
                  <TabsTrigger 
                    value="summary" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-accent/20 data-[state=active]:text-primary transition-all duration-300"
                  >
                    📝 Summary
                  </TabsTrigger>
                  <TabsTrigger 
                    value="flashcards"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-accent/20 data-[state=active]:text-primary transition-all duration-300"
                  >
                    🧠 Flashcards
                  </TabsTrigger>
                  <TabsTrigger 
                    value="quiz"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-accent/20 data-[state=active]:text-primary transition-all duration-300"
                  >
                    🎯 Quiz
                  </TabsTrigger>
                </TabsList>
                
                <div className="p-8">
                  <TabsContent value="summary" className="mt-0 animate-fade-in">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                          <BrainCircuitIcon className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold">AI-Generated Summary</h3>
                      </div>
                      <div className="bg-gradient-to-br from-background/50 to-card/30 p-6 rounded-xl border border-primary/20">
                        <p className="text-muted-foreground leading-relaxed">
                          Your AI-generated summary will appear here, intelligently extracting and highlighting the main points, 
                          key concepts, and important takeaways from the video content. Our advanced algorithms ensure you get 
                          the most valuable insights in a concise, digestible format.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="flashcards" className="mt-0 animate-fade-in">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg">
                          <GraduationCapIcon className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold">Smart Flashcards</h3>
                      </div>
                      <div className="grid gap-4">
                        <Card className="p-6 bg-gradient-to-br from-background/80 to-card/50 border-emerald-200/20 hover:shadow-lg transition-all duration-300 group">
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                              Flashcard Example
                            </div>
                            <div className="font-semibold text-lg text-emerald-600">Front: What is React?</div>
                            <div className="text-muted-foreground bg-gradient-to-r from-emerald-50/50 to-teal-50/50 p-3 rounded-lg border-l-4 border-emerald-500">
                              <strong>Back:</strong> A JavaScript library for building user interfaces, developed by Facebook, that allows developers to create reusable UI components.
                            </div>
                          </div>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="quiz" className="mt-0 animate-fade-in">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg">
                          <PlayIcon className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold">Interactive Quiz</h3>
                      </div>
                      <Card className="p-6 bg-gradient-to-br from-background/80 to-card/50 border-orange-200/20">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            Quiz Question Example
                          </div>
                          <div className="font-semibold text-lg text-orange-600 mb-4">1. What is the main purpose of React?</div>
                          <div className="space-y-3">
                            <label className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-orange-50/30 to-red-50/30 hover:from-orange-100/50 hover:to-red-100/50 transition-all duration-200 cursor-pointer group">
                              <input type="radio" name="q1" className="text-orange-500 focus:ring-orange-500" />
                              <span className="group-hover:text-orange-600 transition-colors">Building user interfaces</span>
                              <div className="ml-auto w-2 h-2 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </label>
                            <label className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-gray-50/30 to-slate-50/30 hover:from-gray-100/50 hover:to-slate-100/50 transition-all duration-200 cursor-pointer">
                              <input type="radio" name="q1" className="text-orange-500 focus:ring-orange-500" />
                              <span>Database management</span>
                            </label>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
