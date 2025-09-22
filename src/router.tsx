import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { AdminRoute } from './routes/AdminRoute';
import { ProjectsList } from './pages/ProjectsList';
import TemplateGallery  from './pages/TemplateGallery';
import { DocumentEditorPage } from './pages/DocumentEditorPage';
import { MyDocuments } from './pages/docs/MyDocuments';
import { ReviewsAssignedToMe } from './pages/reviews/ReviewsAssignedToMe';
import Library from "./pages/Library";
import { ReviewWorkspace } from './pages/ReviewWorkspace';
import { SignIn } from './pages/auth/SignIn';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminDocuments } from './pages/admin/AdminDocuments';
import Dashboard from './pages/Dashboard';
import { SubcategoryTemplates } from './pages/SubcategoryTemplates';
import { AuthHeader } from './components/AuthHeader';
import { AdminNavigation } from './components/AdminNavigation';
import { CMSChatbot } from './components/CMSChatbot';
import { Outlet } from 'react-router-dom';

const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AuthHeader />
      <AdminNavigation />
      <Outlet />
      <CMSChatbot />
    </div>
  );
};

export const router = createBrowserRouter([
  {
    path: '/auth/sign-in',
    element: <SignIn />,
  },
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '',
        element: (
          <ProtectedRoute>
            <AppLayout>
              <ProjectsList />
            </AppLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: 'projects',
        element: (
          <ProtectedRoute>
            <AppLayout>
              <ProjectsList />
            </AppLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: 'docs',
        element: (
          <ProtectedRoute>
            <AppLayout>
              <MyDocuments />
            </AppLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: 'reviews',
        element: (
          <ProtectedRoute>
            <AppLayout>
              <Library />
            </AppLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: 'reviews/:docId',
        element: (
          <ProtectedRoute>
            <ReviewWorkspace />
          </ProtectedRoute>
        ),
      },
      {
        path: 'projects/:projectId/templates',
        element: (
          <ProtectedRoute>
            <AppLayout>
              <TemplateGallery />
            </AppLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: 'projects/:projectId/subcategories/:subcategoryId/templates',
        element: (
          <ProtectedRoute>
            <AppLayout>
              <SubcategoryTemplates />
            </AppLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: 'docs/:docId',
        element: (
          <ProtectedRoute>
            <AppLayout>
              <DocumentEditorPage />
            </AppLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute>
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/users',
        element: (
          <ProtectedRoute>
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/documents',
        element: (
          <ProtectedRoute>
            <AdminRoute>
              <AdminDocuments />
            </AdminRoute>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);