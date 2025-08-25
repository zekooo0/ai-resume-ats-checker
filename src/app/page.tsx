"use client";

import { useState } from 'react';
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Footer from "@/components/footer";
import FileUpload from "@/components/ui/file-upload";
import ScoreDisplay from "@/components/ui/score-display";

interface AnalysisResult {
  overall_score: number;
  score_breakdown: {
    formatting_ats_readiness: number;
    content_relevance_clarity: number;
    completeness: number;
    grammar_spelling: number;
  };
  strengths: string[];
  areas_for_improvement: string[];
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const resultData = await response.json();

      if (resultData.success) {
        setResult(resultData.data.result);
      } else {
        setError(resultData.error || 'An unknown error occurred.');
      }
    } catch (err) {
      console.error('API call failed:', err);
      setError('Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col md:flex-row items-start justify-center gap-8 p-4 md:p-8">
        <div className="w-full md:w-1/2 lg:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Resume ATS Checker</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Upload Resume</Label>
                <FileUpload onFileSelect={handleFileSelect} />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleAnalyze} disabled={!file || loading}>
                {loading ? 'Analyzing...' : 'Analyze'}
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="w-full md:w-1/2 lg:w-2/3">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Result</CardTitle>
            </CardHeader>
            <CardContent>
              {loading && <p className="text-center">Loading...</p>}
              {error && <p className="text-center text-red-500">{error}</p>}
              {result && (
                <div className="space-y-6">
                  <ScoreDisplay score={result.overall_score} />
                  <div>
                    <h4 className="font-semibold text-lg">Score Breakdown</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground mt-2">
                      <li>Formatting & ATS Readiness: {result.score_breakdown.formatting_ats_readiness}</li>
                      <li>Content Relevance & Clarity: {result.score_breakdown.content_relevance_clarity}</li>
                      <li>Completeness: {result.score_breakdown.completeness}</li>
                      <li>Grammar & Spelling: {result.score_breakdown.grammar_spelling}</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-lg">Strengths</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground mt-2">
                        {result.strengths.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Areas for Improvement</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground mt-2">
                        {result.areas_for_improvement.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              {!loading && !result && !error && (
                <p className="text-center text-muted-foreground">Your analysis will appear here.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
