import * as React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const Modal: React.FC<ModalProps> = ({ open, onOpenChange, children, title, description }) => {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div className="relative bg-surface border border-border rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between p-6 border-b border-border">
            <div>
              {title && <h2 className="text-xl font-semibold">{title}</h2>}
              {description && <p className="text-sm text-muted mt-1">{description}</p>}
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-lg p-1 hover:bg-surface/80 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        
        {/* Content */}
        <div className={cn('p-6', !title && !description && 'pt-12')}>
          {!title && !description && (
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 rounded-lg p-1 hover:bg-surface/80 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

Modal.displayName = 'Modal';

export { Modal };
