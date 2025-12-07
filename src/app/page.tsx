'use client';

import Footer from '@/components/footer';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import FileUpload from '@/components/ui/file-upload';
import ScoreDisplay from '@/components/ui/score-display';
import { Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ApiResult {
  score: number;
  feedback: string;
  fileId?: string;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiResult, setApiResult] = useState<ApiResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setLoading(true);
    setError(null);
    setApiResult(null);

    const formData = new FormData();
    formData.append('file', file);
    // To view FormData content, you need to iterate over it
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const resultData = await response.json();
      if (!response.ok) {
        setError(resultData?.error || 'An unknown error occurred.');
        return;
      }
      // Expected shape from API: { result: { result: { score: string, feedback: string }, fileId: string } }
      const inner = resultData?.result?.result;
      if (!inner) {
        setError('Unexpected API response shape.');
        return;
      }
      setApiResult({
        score: Number(inner.score),
        feedback: inner.feedback,
        fileId: resultData?.result?.fileId,
      });
      // Smooth-scroll to the results section when available
      requestAnimationFrame(() => {
        resultRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
    } catch (err) {
      console.error('API call failed:', err);
      setError('Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='flex-1'>
        {/* Section 1: Animated hero with centered upload */}
        <section className='hero-animated relative py-16 md:py-24'>
          <div className='grid-mask' aria-hidden='true' />
          <div className='max-w-5xl mx-auto px-4'>
            <div className='mx-auto text-center space-y-6'>
              <h1 className='text-4xl md:text-6xl font-bold tracking-tight'>
                AI‑powered ATS optimization in seconds
              </h1>
              <p className='text-muted-foreground text-lg md:text-xl'>
                Upload your PDF and let our AI analyze it to deliver an instant
                ATS score and actionable recommendations.
              </p>
              <div className='relative mx-auto w-full md:w-[680px]'>
                <Card className='backdrop-blur supports-[backdrop-filter]:bg-background/60'>
                  <CardHeader>
                    <CardTitle>Upload your resume</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-2'>
                      <FileUpload onFileSelect={handleFileSelect} />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className='w-full'
                      onClick={handleAnalyze}
                      disabled={!file || loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Analyzing...
                        </>
                      ) : (
                        'Analyze'
                      )}
                    </Button>
                  </CardFooter>
                </Card>
                {loading && (
                  <div className='absolute inset-0 z-10 rounded-xl bg-background/60 backdrop-blur-sm flex items-center justify-center'>
                    <Loader2 className='mr-2 h-6 w-6 animate-spin' />
                    Processing...
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Results */}
        <section ref={resultRef} className='py-10 md:py-16'>
          <div className='max-w-5xl mx-auto px-4'>
            <Card>
              <CardHeader>
                <CardTitle>Analysis Result</CardTitle>
              </CardHeader>
              <CardContent>
                {loading && (
                  <p className='text-center'>Hold tight, running checks...</p>
                )}
                {error && <p className='text-center text-red-500'>{error}</p>}
                {apiResult && (
                  <div className='space-y-6'>
                    <ScoreDisplay score={apiResult.score} />
                    {apiResult.fileId && (
                      <p className='text-xs text-muted-foreground'>
                        fileId: {apiResult.fileId}
                      </p>
                    )}
                    <div>
                      <h4 className='font-semibold text-lg'>Feedback</h4>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {apiResult.feedback}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
                {!loading && !apiResult && !error && (
                  <p className='text-center text-muted-foreground'>
                    Your analysis will appear here.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
