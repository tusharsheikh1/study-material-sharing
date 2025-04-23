import { useEffect, useState } from "react";
import FacultyList from "../../components/faculty/FacultyList";
import GlobalSpinner from "../../components/GlobalSpinner"; // ✅ Added

const FacultyPage = () => {
  const [loading, setLoading] = useState(true);

  // Simulate loading (if FacultyList has no internal loading)
  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="p-4">
      {loading ? (
        <GlobalSpinner /> // ✅ Optional spinner if FacultyList has no internal loading state
      ) : (
        <FacultyList />
      )}
    </div>
  );
};

export default FacultyPage;
