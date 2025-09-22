import { ContentForm } from '@/components/content/ContentForm';
import { useNavigate } from 'react-router-dom';

const ContentEditor = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/content');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <ContentForm 
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
};

export default ContentEditor;