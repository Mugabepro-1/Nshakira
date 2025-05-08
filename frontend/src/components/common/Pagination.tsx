import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const PageButton = ({ page, isCurrent }: { page: number, isCurrent: boolean }) => (
    <button
      className={`px-3 py-1 mx-1 rounded ${
        isCurrent
          ? 'bg-primary-600 text-white'
          : 'bg-white text-gray-700 hover:bg-gray-100'
      }`}
      onClick={() => onPageChange(page)}
      disabled={isCurrent}
    >
      {page}
    </button>
  );

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];

    // Always include first page
    pageNumbers.push(1);

    // Calculate range around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    // Add ellipsis after first page if there's a gap
    if (startPage > 2) {
      pageNumbers.push('...');
    }

    // Add pages around current page
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Add ellipsis before last page if there's a gap
    if (endPage < totalPages - 1) {
      pageNumbers.push('...');
    }

    // Always include last page if it exists
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center mt-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="mr-2"
      >
        <ChevronLeft size={16} />
        <span className="sr-only">Previous</span>
      </Button>

      <div className="flex">
        {getPageNumbers().map((page, index) => (
          typeof page === 'number' ? (
            <PageButton 
              key={index} 
              page={page} 
              isCurrent={page === currentPage} 
            />
          ) : (
            <span key={index} className="px-2 py-1 mx-1">
              {page}
            </span>
          )
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="ml-2"
      >
        <ChevronRight size={16} />
        <span className="sr-only">Next</span>
      </Button>
    </div>
  );
};

export default Pagination;