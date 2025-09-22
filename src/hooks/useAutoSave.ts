import { useEffect, useRef, useCallback } from 'react';
import { useOptimisticUpdateDoc } from './useOptimisticUpdateDoc';

interface UseAutoSaveProps {
  docId: string;
  title: string;
  body: string;
  originalTitle: string;
  originalBody: string;
  enabled: boolean;
  onSaveStart?: () => void;
  onSaveSuccess?: () => void;
  onSaveError?: (error: Error) => void;
  debounceMs?: number;
}

export const useAutoSave = ({
  docId,
  title,
  body,
  originalTitle,
  originalBody,
  enabled,
  onSaveStart,
  onSaveSuccess,
  onSaveError,
  debounceMs = 2000, // 2 seconds default
}: UseAutoSaveProps) => {
  const updateDoc = useOptimisticUpdateDoc();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedRef = useRef({ title: originalTitle, body: originalBody });

  const saveDocument = useCallback(async () => {
    if (!enabled) return;

    const hasChanges = 
      title !== lastSavedRef.current.title || 
      body !== lastSavedRef.current.body;

    if (!hasChanges) return;

    try {
      onSaveStart?.();
      
      await updateDoc.mutateAsync({
        docId,
        patch: { title, body }
      });

      // Update last saved reference
      lastSavedRef.current = { title, body };
      onSaveSuccess?.();
    } catch (error) {
      onSaveError?.(error as Error);
    }
  }, [docId, title, body, enabled, updateDoc, onSaveStart, onSaveSuccess, onSaveError]);

  // Debounced auto-save effect
  useEffect(() => {
    if (!enabled) return;

    const hasChanges = 
      title !== lastSavedRef.current.title || 
      body !== lastSavedRef.current.body;

    if (!hasChanges) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      saveDocument();
    }, debounceMs);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [title, body, enabled, debounceMs, saveDocument]);

  // Manual save function
  const forceSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    saveDocument();
  }, [saveDocument]);

  // Update last saved reference when original values change
  useEffect(() => {
    lastSavedRef.current = { title: originalTitle, body: originalBody };
  }, [originalTitle, originalBody]);

  return {
    forceSave,
    isSaving: updateDoc.isPending,
    hasUnsavedChanges: title !== lastSavedRef.current.title || body !== lastSavedRef.current.body,
  };
};