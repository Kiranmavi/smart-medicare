'use client';

import { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, FileText, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { createWorker } from 'tesseract.js';
import { mockAPI } from '@/lib/mockData';

interface PrescriptionUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PrescriptionUpload({ open, onOpenChange }: PrescriptionUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const processImage = async (file: File) => {
    setProcessing(true);
    setExtractedText('');

    try {
      // Create preview
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);

      // Initialize Tesseract worker
      const worker = await createWorker('eng');
      
      // Perform OCR
      const { data: { text } } = await worker.recognize(file);
      
      // Clean up
      await worker.terminate();
      
      setExtractedText(text);
      toast.success('Prescription text extracted successfully!');
    } catch (error) {
      console.error('OCR Error:', error);
      toast.error('Failed to extract text from image');
    } finally {
      setProcessing(false);
    }
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB');
      return;
    }

    processImage(file);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const savePrescription = async () => {
    if (!extractedText) {
      toast.error('No text to save');
      return;
    }

    try {
      await mockAPI.savePrescription({
        ocrText: extractedText,
        imageUrl: uploadedImage,
      });

      toast.success('Prescription saved successfully!');
      onOpenChange(false);
      setExtractedText('');
      setUploadedImage(null);
    } catch (error) {
      toast.error('Failed to save prescription');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Prescription</DialogTitle>
          <DialogDescription>
            Upload an image of your prescription and we'll extract the text using OCR technology
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!uploadedImage ? (
            <Card
              className={`border-2 border-dashed transition-colors cursor-pointer ${
                isDragOver
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Upload className="h-12 w-12 text-gray-400 mb-4" />
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Drag and drop your prescription image
                  </p>
                  <p className="text-gray-600 mb-4">or click to browse files</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" className="cursor-pointer" asChild>
                      <span>Choose File</span>
                    </Button>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Supports JPG, PNG, WebP (max 10MB)
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Uploaded Image</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setUploadedImage(null);
                    setExtractedText('');
                  }}
                >
                  Upload New
                </Button>
              </div>
              <div className="relative">
                <img 
                  src={uploadedImage} 
                  alt="Uploaded prescription" 
                  className="w-full max-h-64 object-contain rounded-lg border"
                />
              </div>
            </div>
          )}

          {processing && (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-3" />
                <span>Processing image and extracting text...</span>
              </CardContent>
            </Card>
          )}

          {extractedText && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <h3 className="font-medium">Extracted Text</h3>
              </div>
              <Card>
                <CardContent className="p-4">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 max-h-48 overflow-y-auto">
                    {extractedText}
                  </pre>
                </CardContent>
              </Card>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button onClick={savePrescription} className="medical-button">
                  <FileText className="h-4 w-4 mr-2" />
                  Save Prescription
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}