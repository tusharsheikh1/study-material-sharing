import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import ConfirmationPopup from './ConfirmationPopup';
import MaterialUploadForm from './MaterialUploadForm';
import UploadedMaterialList from './UploadedMaterialList';

const NotesOrQuestionUpload = ({ onUploadSuccess }) => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [formData, setFormData] = useState({
    materialType: '',
    courseId: '',
    semester: user?.semester || '',
    batch: user?.batch || '',
    file: null,
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loadingUploads, setLoadingUploads] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const batchOptions = Array.from({ length: 100 }, (_, i) => i + 1);
  const semesterOptions = Array.from({ length: 8 }, (_, i) => i + 1);

  useEffect(() => {
    fetchCourses();
    fetchUploads();
  }, [user._id]);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data);
    } catch (err) {
      toast.error('Failed to load courses');
    }
  };

  const fetchUploads = async () => {
    setLoadingUploads(true);
    try {
      const res = await api.get(`/materials?uploadedBy=${user._id}`);
      setUploads(res.data);
    } catch (err) {
      toast.error('Failed to load uploads');
    } finally {
      setLoadingUploads(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { courseId, semester, batch, file, materialType } = formData;

    if (!file || !courseId || !materialType || !semester || !batch) {
      toast.warn('Please fill all fields');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);
      const form = new FormData();
      form.append('courseId', courseId);
      form.append('semester', semester);
      form.append('batch', batch);
      form.append('materialType', materialType);
      form.append('file', file);
      form.append('title', file.name);
      form.append('filePublicId', file.name.split('.')[0]);
      form.append('fileUrl', 'placeholder');

      await api.post('/materials', form, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });

      toast.success('File uploaded successfully');
      if (onUploadSuccess) onUploadSuccess();

      setFormData({
        courseId: '',
        semester: user?.semester || '',
        batch: user?.batch || '',
        materialType: '',
        file: null,
      });
      fetchUploads();
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsPopupOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      await api.delete(`/materials/${deleteId}`);
      toast.success('File deleted');
      setUploads((prev) => prev.filter((item) => item._id !== deleteId));
    } catch (err) {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
      setIsPopupOpen(false);
    }
  };

  const cancelDelete = () => {
    setIsPopupOpen(false);
    setDeleteId(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <MaterialUploadForm
        formData={formData}
        courses={courses}
        semesterOptions={semesterOptions}
        batchOptions={batchOptions}
        uploading={uploading}
        uploadProgress={uploadProgress}
        handleChange={handleChange}
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
      />

      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-gray-800">📂 Your Uploads</h3>
        {loadingUploads ? (
          <p className="text-blue-500">Loading uploads...</p>
        ) : (
          <UploadedMaterialList
            uploads={uploads}
            userId={user._id}
            deleting={deleting}
            onDelete={handleDeleteClick}
          />
        )}
      </div>

      <ConfirmationPopup
        isOpen={isPopupOpen}
        message="Are you sure you want to delete this file? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default NotesOrQuestionUpload;