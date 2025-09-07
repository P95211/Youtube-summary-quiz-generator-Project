import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useVideoProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedVideo, setProcessedVideo] = useState<any>(null);
  const { toast } = useToast();

  const processVideo = async (youtubeUrl: string, options?: {
    flashcardCount?: number;
    quizQuestionCount?: number;
    difficulty?: string;
  }) => {
    setIsProcessing(true);
    setProcessedVideo(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('process-youtube-video', {
        body: { 
          youtubeUrl,
          flashcardCount: options?.flashcardCount || 15,
          quizQuestionCount: options?.quizQuestionCount || 10,
          difficulty: options?.difficulty || 'medium'
        },
      });

      if (error) {
        throw error;
      }

      setProcessedVideo(data);
      
      toast({
        title: "Video processed successfully!",
        description: `Generated ${data.flashcards} flashcards and ${data.quiz?.questions || 0} quiz questions`,
      });

      return data;
    } catch (error: any) {
      console.error('Video processing error:', error);
      toast({
        title: "Processing failed",
        description: error.message || "Failed to process video",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const fetchVideoData = async (videoId: string) => {
    try {
      const { data: video } = await supabase
        .from('videos')
        .select('*')
        .eq('id', videoId)
        .single();

      const { data: flashcards } = await supabase
        .from('flashcards')
        .select('*')
        .eq('video_id', videoId);

      const { data: quizzes } = await supabase
        .from('quizzes')
        .select(`
          *,
          quiz_questions (*)
        `)
        .eq('video_id', videoId);

      return {
        video,
        flashcards,
        quizzes
      };
    } catch (error) {
      console.error('Error fetching video data:', error);
      throw error;
    }
  };

  return {
    isProcessing,
    processedVideo,
    processVideo,
    fetchVideoData
  };
};