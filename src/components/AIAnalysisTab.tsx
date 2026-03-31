import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { analyzeChartImage } from '../services/geminiService';
import { Button, Card, Badge } from './UI';
import { Upload, Loader2, FileText, AlertCircle, BrainCircuit, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const AIAnalysisTab: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setPreview(base64);
      setResult(null);
      setError(null);
      setAnalyzing(true);

      try {
        const analysis = await analyzeChartImage(base64, file.type);
        setResult(analysis);
      } catch (err) {
        setError('Failed to analyze image. Please ensure your Gemini API key is configured correctly in the Secrets panel.');
      } finally {
        setAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  return (
    <div className="space-y-16 max-w-7xl mx-auto">
      <div className="flex flex-col items-center text-center space-y-8">
        <Badge variant="info">Neural Market Intelligence</Badge>
        <h2 className="text-8xl font-display font-black tracking-tighter text-white leading-none uppercase">AI Vision Analysis</h2>
        <p className="text-text-secondary text-3xl font-light max-w-3xl leading-relaxed">
          Upload a chart screenshot for institutional-grade SMC analysis. 
          Our neural models identify Order Blocks, FVGs, and Liquidity Pools with surgical precision.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Upload Section */}
        <div className="lg:col-span-5 space-y-12">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div 
              {...getRootProps()} 
              className={cn(
                "terminal-glass rounded-[3.5rem] p-12 text-center transition-all cursor-pointer border-2 border-dashed",
                isDragActive ? "border-accent bg-accent/5" : "border-border hover:border-accent/20"
              )}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                  <Upload size={32} />
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-display font-bold text-white tracking-tight uppercase">
                    {isDragActive ? "Drop the chart here" : "Upload Chart Screenshot"}
                  </p>
                  <p className="text-sm text-text-secondary font-medium uppercase tracking-widest">Supports PNG, JPG, JPEG (Max 10MB)</p>
                </div>
                <Button variant="primary" className="px-10 py-5 text-base uppercase tracking-widest">Select File</Button>
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {preview && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card title="Source Material" className="overflow-hidden p-0 rounded-[3rem] terminal-glass border-border" index={1}>
                  <img src={preview} alt="Preview" className="w-full h-auto object-cover" />
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Analysis Result Section */}
        <div className="lg:col-span-7">
          <Card 
            title="Intelligence Report" 
            icon={<BrainCircuit size={24} className="text-accent" />} 
            className="min-h-[600px] flex flex-col terminal-glass rounded-[3.5rem] p-12"
            index={2}
          >
            <div className="flex-1 mt-8">
              {analyzing ? (
                <div className="flex flex-col items-center justify-center h-full py-20 gap-8">
                  <div className="relative">
                    <Loader2 size={64} className="text-accent animate-spin opacity-10" />
                    <Sparkles size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent animate-pulse" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-3xl font-display font-bold text-white tracking-tight uppercase">Analyzing Market Structure...</p>
                    <p className="text-text-secondary text-lg font-medium uppercase tracking-widest">Identifying Institutional Footprints & Liquidity Pools</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-full py-20 gap-6 text-rose-500">
                  <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center">
                    <AlertCircle size={32} />
                  </div>
                  <p className="text-center text-lg max-w-md leading-relaxed font-medium">{error}</p>
                </div>
              ) : result ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="prose prose-invert max-w-none prose-headings:font-display prose-headings:tracking-tighter prose-headings:font-bold prose-p:text-text-secondary prose-p:text-lg prose-p:leading-relaxed"
                >
                  <div className="markdown-body">
                    <ReactMarkdown>{result}</ReactMarkdown>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-20 text-text-secondary/20 gap-6">
                  <FileText size={56} strokeWidth={1} />
                  <p className="text-xl italic font-medium uppercase tracking-widest">Awaiting source material for analysis...</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisTab;
