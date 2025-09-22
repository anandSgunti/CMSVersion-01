import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DialogContextProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextProps | null>(null);

const useDialog = () => {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error('Dialog components must be used within a Dialog');
  }
  return context;
};

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ 
  open = false, 
  onOpenChange = () => {}, 
  children 
}) => {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
};

interface DialogContentProps {
  className?: string;
  children: React.ReactNode;
}

export const DialogContent: React.FC<DialogContentProps> = ({ 
  className, 
  children 
}) => {
  const { open, onOpenChange } = useDialog();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50" 
        onClick={() => onOpenChange(false)} 
      />
      <div className={cn(
        "bg-white rounded-lg shadow-xl w-full max-w-md mx-4 relative z-10",
        className
      )}>
        {children}
      </div>
    </div>
  );
};

interface DialogHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export const DialogHeader: React.FC<DialogHeaderProps> = ({ 
  className, 
  children 
}) => {
  return (
    <div className={cn("flex items-center justify-between p-6 border-b", className)}>
      {children}
    </div>
  );
};

interface DialogTitleProps {
  className?: string;
  children: React.ReactNode;
}

export const DialogTitle: React.FC<DialogTitleProps> = ({ 
  className, 
  children 
}) => {
  return (
    <h2 className={cn("text-lg font-semibold", className)}>
      {children}
    </h2>
  );
};

interface DialogCloseProps {
  className?: string;
  children?: React.ReactNode;
}

export const DialogClose: React.FC<DialogCloseProps> = ({ 
  className, 
  children 
}) => {
  const { onOpenChange } = useDialog();

  return (
    <button
      onClick={() => onOpenChange(false)}
      className={cn(
        "p-1 hover:bg-gray-100 rounded-md transition-colors", 
        className
      )}
    >
      {children || <X size={20} />}
    </button>
  );
};

// Legacy component for backward compatibility
interface LegacyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const LegacyDialog: React.FC<LegacyDialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          <DialogClose />
        </DialogHeader>
        <div className="p-6">{children}</div>
      </DialogContent>
    </Dialog>
  );
};