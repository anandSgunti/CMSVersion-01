import { QueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

class BackgroundSyncService {
  private queryClient: QueryClient;
  private syncInterval: NodeJS.Timeout | null = null;
  private isOnline = navigator.onLine;
  private userId: string | null = null;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
    this.setupNetworkListeners();
    this.setupVisibilityListeners();
  }

  // 🔥 NETWORK STATUS MONITORING
  private setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncPendingUpdates();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.stopSync();
    });
  }

  // 🔥 PAGE VISIBILITY OPTIMIZATION
  private setupVisibilityListeners() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stopSync();
      } else if (this.isOnline && this.userId) {
        this.startSync();
        this.syncCriticalData();
      }
    });
  }

  // 🔥 START BACKGROUND SYNC
  startSync(userId: string) {
    this.userId = userId;
    
    if (!this.isOnline || this.syncInterval) return;

    // Sync every 30 seconds when online and active
    this.syncInterval = setInterval(() => {
      if (this.isOnline && !document.hidden) {
        this.syncCriticalData();
      }
    }, 30000);
  }

  // 🔥 STOP BACKGROUND SYNC
  stopSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // 🔥 SYNC CRITICAL DATA IN BACKGROUND
  private async syncCriticalData() {
    if (!this.userId || !this.isOnline) return;

    try {
      // Prefetch user's most recent documents
      await this.queryClient.prefetchQuery({
        queryKey: ['my-documents', this.userId],
        staleTime: 1000 * 60 * 2, // 2 minutes
      });

      // Prefetch assigned documents
      await this.queryClient.prefetchQuery({
        queryKey: ['assigned-to-me', this.userId],
        staleTime: 1000 * 60 * 2,
      });

      // Prefetch active reviews
      await this.queryClient.prefetchQuery({
        queryKey: ['my-reviews', this.userId],
        staleTime: 1000 * 60 * 1, // 1 minute for more critical review data
      });

    } catch (error) {
      console.warn('Background sync failed:', error);
    }
  }

  // 🔥 SYNC PENDING UPDATES (when coming back online)
  private async syncPendingUpdates() {
    if (!this.userId) return;

    try {
      // Invalidate all queries to force fresh data
      await this.queryClient.invalidateQueries();
      
      // Force refetch critical data
      await this.queryClient.refetchQueries({
        queryKey: ['my-documents'],
        type: 'active',
      });

      await this.queryClient.refetchQueries({
        queryKey: ['assigned-to-me'],
        type: 'active',
      });

      await this.queryClient.refetchQueries({
        queryKey: ['my-reviews'],
        type: 'active',
      });

    } catch (error) {
      console.warn('Failed to sync pending updates:', error);
    }
  }

  // 🔥 INTELLIGENT CACHE CLEANUP
  cleanupCache() {
    // Remove old queries that haven't been used recently
    this.queryClient.getQueryCache().getAll().forEach(query => {
      const lastAccess = query.state.dataUpdatedAt;
      const hourAgo = Date.now() - (60 * 60 * 1000);
      
      // Remove queries older than 1 hour that aren't currently being used
      if (lastAccess < hourAgo && query.getObserversCount() === 0) {
        this.queryClient.removeQueries({ queryKey: query.queryKey });
      }
    });
  }

  // 🔥 PRELOAD DOCUMENT FOR EDITING
  async preloadDocument(docId: string) {
    if (!this.isOnline) return;

    try {
      // Preload document data
      await this.queryClient.prefetchQuery({
        queryKey: ['doc', docId],
        staleTime: 1000 * 60 * 5,
      });

      // Preload document with project/author info
      await this.queryClient.prefetchQuery({
        queryKey: ['doc-with-project-author', docId],
        staleTime: 1000 * 60 * 5,
      });

      // Preload comments
      await this.queryClient.prefetchQuery({
        queryKey: ['comments-threads', docId],
        staleTime: 1000 * 60 * 2,
      });

      // Preload active review
      await this.queryClient.prefetchQuery({
        queryKey: ['active-review', docId],
        staleTime: 1000 * 60 * 1,
      });

    } catch (error) {
      console.warn('Failed to preload document:', error);
    }
  }

  // 🔥 GET CACHE STATISTICS
  getCacheStats() {
    const cache = this.queryClient.getQueryCache();
    const queries = cache.getAll();
    
    return {
      totalQueries: queries.length,
      activeQueries: queries.filter(q => q.getObserversCount() > 0).length,
      staleQueries: queries.filter(q => q.isStale()).length,
      cachedDocuments: queries.filter(q => q.queryKey[0] === 'doc').length,
      cacheSize: this.estimateCacheSize(queries),
    };
  }

  private estimateCacheSize(queries: any[]) {
    // Rough estimation of cache size
    return queries.reduce((size, query) => {
      const data = query.state.data;
      if (data) {
        return size + JSON.stringify(data).length;
      }
      return size;
    }, 0);
  }
}

export default BackgroundSyncService;