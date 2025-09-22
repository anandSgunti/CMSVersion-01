# Application Modification Guide

This guide explains which files to modify for different types of changes in your healthcare document management application.

## 🎨 **UI/Visual Changes**

### **Colors & Branding**
- **`tailwind.config.js`** - Add custom colors, extend theme
- **`src/index.css`** - Global CSS overrides, custom styles
- **`src/components/docs/DocumentProgressBar.tsx`** - Progress bar colors and branding
- **`src/components/ui/Button.tsx`** - Button color variants
- **`src/providers/ThemeProvider.tsx`** - Dark/light mode color schemes

### **Layout & Styling**
- **`src/components/layout/AppLayout.tsx`** - Main application layout structure
- **`src/components/layout/AppSidebar.tsx`** - Sidebar styling and navigation
- **`src/components/AuthHeader.tsx`** - Header styling and user info display
- **Individual page files** - Page-specific styling and layout

### **Icons & Visual Elements**
- **Any component file** - Import from `lucide-react` and replace existing icons
- **`src/components/docs/DocumentProgressBar.tsx`** - Progress bar icons and visual elements

## 🔐 **Authentication & Permissions**

### **User Roles & Permissions**
- **`src/hooks/useProfile.ts`** - User profile data and role checking
- **`src/routes/AdminRoute.tsx`** - Admin-only route protection
- **`src/routes/ProtectedRoute.tsx`** - General authentication protection
- **Individual page components** - Add `isAdmin` checks for UI elements

### **Authentication Flow**
- **`src/pages/auth/SignIn.tsx`** - Sign-in form and logic
- **`src/providers/SessionProvider.tsx`** - Session management and auth state
- **`src/lib/supabaseClient.ts`** - Supabase configuration

## 📄 **Document Management**

### **Document Editor**
- **`src/pages/DocumentEditorPage.tsx`** - Main document editing interface
- **`src/components/RichTextEditor.tsx`** - Rich text editing functionality
- **`src/hooks/useDoc.ts`** - Document data fetching
- **`src/hooks/useUpdateDoc.ts`** - Document saving/updating

### **Document Workflow**
- **`src/components/docs/DocumentProgressBar.tsx`** - Workflow visualization
- **`src/components/EditorToolbar.tsx`** - Document actions (review, publish)
- **`src/hooks/useRequestReview.ts`** - Review request functionality
- **`src/hooks/usePublishDocument.ts`** - Document publishing

### **Document Lists & Cards**
- **`src/pages/docs/MyDocuments.tsx`** - User's document list
- **`src/components/docs/DocumentCard.tsx`** - Document card display
- **`src/components/docs/DocumentRow.tsx`** - Document table row display
- **`src/hooks/useMyDocuments.ts`** - Document list data fetching

## 📋 **Templates**

### **Template Management**
- **`src/pages/TemplateGallery.tsx`** - Template gallery page
- **`src/components/TemplateCard.tsx`** - Individual template cards
- **`src/components/CreateTemplateDialog.tsx`** - Template creation dialog
- **`src/hooks/useTemplates.ts`** - Template data fetching
- **`src/hooks/useCreateTemplate.ts`** - Template creation
- **`src/hooks/useCreateFromTemplate.ts`** - Document creation from template

## 🔍 **Search & Navigation**

### **Global Search**
- **`src/components/search/GlobalSearchBar.tsx`** - Global template search
- **`src/hooks/useGlobalTemplateSearch.ts`** - Search functionality

### **Navigation**
- **`src/router.tsx`** - Route definitions and navigation structure
- **`src/components/layout/AppSidebar.tsx`** - Sidebar navigation menu
- **`src/components/AdminNavigation.tsx`** - Admin navigation tabs

## 📊 **Projects**

### **Project Management**
- **`src/pages/ProjectsList.tsx`** - Projects overview page
- **`src/components/projects/ProjectCard.tsx`** - Project card display
- **`src/hooks/useProjectsOverview.ts`** - Project data with statistics

## 👥 **Reviews & Comments**

### **Review System**
- **`src/pages/ReviewWorkspace.tsx`** - Review interface
- **`src/pages/reviews/ReviewsAssignedToMe.tsx`** - Review assignments list
- **`src/components/reviews/ReviewRow.tsx`** - Review list item
- **`src/components/review/ReviewBanner.tsx`** - Review status banner
- **`src/hooks/useActiveReview.ts`** - Active review data
- **`src/hooks/useMyReviews.ts`** - User's review assignments
- **`src/hooks/useReviewActions.ts`** - Review approval/rejection

### **Comments System**
- **`src/components/review/CommentsPanel.tsx`** - Comments sidebar
- **`src/components/review/CommentThread.tsx`** - Comment thread display
- **`src/components/review/CommentComposer.tsx`** - Comment creation form
- **`src/hooks/useCommentsThreads.ts`** - Comment data fetching
- **`src/hooks/useAddComment.ts`** - Comment creation
- **`src/hooks/useToggleResolve.ts`** - Comment resolution

## 🛠 **Admin Features**

### **Admin Dashboard**
- **`src/pages/admin/AdminDashboard.tsx`** - Main admin dashboard
- **`src/components/admin/KpiCards.tsx`** - Key metrics display
- **`src/components/admin/ActivityList.tsx`** - Recent activity feed
- **`src/components/admin/TopProjects.tsx`** - Most active projects
- **`src/hooks/useAdminCounts.ts`** - Admin statistics
- **`src/hooks/useAdminRecentActivity.ts`** - Activity data
- **`src/hooks/useAdminTopProjects.ts`** - Project activity data

### **User Management**
- **`src/pages/admin/AdminUsers.tsx`** - User management interface
- **`src/hooks/useAdminUserList.ts`** - User list data
- **`src/hooks/useAdminSetUserRole.ts`** - User role management

### **Document Management**
- **`src/pages/admin/AdminDocuments.tsx`** - Document overview for admins
- **`src/hooks/useAdminDocumentsOverview.ts`** - Admin document data

## 🎨 **Theme & Dark Mode**

### **Theme System**
- **`src/providers/ThemeProvider.tsx`** - Theme context and management
- **`src/components/AuthHeader.tsx`** - Dark mode toggle button
- **`tailwind.config.js`** - Dark mode configuration
- **Individual components** - Add `dark:` classes for dark mode styling

## 🔧 **UI Components**

### **Reusable Components**
- **`src/components/ui/Button.tsx`** - Button component variants
- **`src/components/ui/Input.tsx`** - Input field component
- **`src/components/ui/Dialog.tsx`** - Modal dialog component
- **`src/components/ui/Select.tsx`** - Dropdown select component
- **`src/components/ui/Textarea.tsx`** - Text area component
- **`src/components/ui/Toast.tsx`** - Notification toast component
- **`src/components/ui/Spinner.tsx`** - Loading spinner component
- **`src/components/ui/EmptyState.tsx`** - Empty state display

### **Common Components**
- **`src/components/common/StatusBadge.tsx`** - Status indicator badges

## 📡 **Data & API**

### **Database Hooks**
- **`src/hooks/use*.ts`** - All data fetching and mutation hooks
- **`src/lib/supabaseClient.ts`** - Database client configuration

### **Providers**
- **`src/providers/SessionProvider.tsx`** - Authentication state
- **`src/providers/ToastProvider.tsx`** - Notification system
- **`src/providers/ThemeProvider.tsx`** - Theme management

## 🚀 **Configuration**

### **Build & Development**
- **`package.json`** - Dependencies and scripts
- **`vite.config.ts`** - Build configuration
- **`tailwind.config.js`** - CSS framework configuration
- **`tsconfig.json`** - TypeScript configuration

### **Environment**
- **`.env`** - Environment variables (Supabase keys, etc.)

---

## 📝 **Common Change Scenarios**

### **Adding a New Page**
1. Create page component in `src/pages/`
2. Add route in `src/router.tsx`
3. Add navigation link in `src/components/layout/AppSidebar.tsx`
4. Create data hooks in `src/hooks/` if needed

### **Modifying Document Workflow**
1. Update `src/components/docs/DocumentProgressBar.tsx` for visual changes
2. Modify `src/hooks/useRequestReview.ts` for review logic
3. Update `src/components/EditorToolbar.tsx` for workflow actions

### **Changing Permissions**
1. Update `src/hooks/useProfile.ts` for role checking
2. Modify individual components to check `isAdmin`
3. Update `src/routes/AdminRoute.tsx` for route protection

### **Adding New UI Components**
1. Create component in `src/components/ui/`
2. Export from `src/components/ui/index.ts`
3. Add dark mode styling with `dark:` classes

### **Modifying Branding/Colors**
1. Update `tailwind.config.js` for color definitions
2. Modify `src/components/docs/DocumentProgressBar.tsx` for brand elements
3. Update component-specific styling throughout the app

This guide should help you quickly identify which files to modify for any changes you want to make to the application!