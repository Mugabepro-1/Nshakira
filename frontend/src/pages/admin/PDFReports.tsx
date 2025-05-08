import { useState } from 'react';
import { toast } from 'react-toastify';
import { FileText, Download, Clock, CheckCircle } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import claimsService from '../../services/claimsService';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFReports = () => {
  const [loading, setLoading] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [previewMode, setPreviewMode] = useState(false);

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const pdfData = await claimsService.downloadApprovedClaimsPDF();
      
      // Create a blob from the PDF data
      const blob = new Blob([pdfData], { type: 'application/pdf' });
      setPdfBlob(blob);
      setPreviewMode(true);
      
      toast.success('PDF report generated successfully');
    } catch (error) {
      console.error('Error generating PDF report:', error);
      toast.error('Failed to generate PDF report');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!pdfBlob) return;
    
    // Create a download link
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `approved-claims-${new Date().toISOString().split('T')[0]}.pdf`);
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const nextPage = () => {
    if (pageNumber < (numPages || 1)) {
      setPageNumber(pageNumber + 1);
    }
  };

  const prevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">PDF Reports</h1>
        <p className="mt-1 text-gray-600">
          Generate and download reports of approved claims.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center p-6 bg-accent-50 rounded-lg mb-4">
              <FileText className="h-12 w-12 text-accent-600" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Approved Claims Report</h3>
            <p className="text-gray-600 mb-6">
              Generate a PDF report containing all approved claims with item details and claimant information.
            </p>
            
            <div className="mt-auto">
              <Button
                variant="accent"
                onClick={handleGenerateReport}
                loading={loading}
                fullWidth
              >
                <Clock className="mr-2 h-5 w-5" />
                Generate Report
              </Button>
              
              {pdfBlob && (
                <Button
                  variant="outline"
                  onClick={handleDownloadPDF}
                  className="mt-2"
                  fullWidth
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download PDF
                </Button>
              )}
            </div>
          </div>
        </Card>

        <div className="md:col-span-2">
          {previewMode ? (
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Report Preview</h3>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={prevPage} 
                    disabled={pageNumber <= 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {pageNumber} of {numPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextPage}
                    disabled={pageNumber >= (numPages || 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {pdfBlob ? (
                  <Document
                    file={URL.createObjectURL(pdfBlob)}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={<LoadingSpinner />}
                    error="Failed to load PDF. Please try again."
                  >
                    <Page 
                      pageNumber={pageNumber} 
                      width={600}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </Document>
                ) : (
                  <div className="p-12 text-center">
                    <p>No PDF to display</p>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card>
              <div className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-accent-100 p-4 mb-4">
                  <FileText className="h-8 w-8 text-accent-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No Report Generated</h3>
                <p className="mt-1 text-gray-500 text-center max-w-md">
                  Generate a report to view a preview. The report will include all approved claims in the system.
                </p>
                <div className="mt-6 flex items-center text-sm text-green-600">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Reports are generated in real-time with the latest data
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFReports;