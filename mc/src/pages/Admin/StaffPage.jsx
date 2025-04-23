// /src/pages/admin/StaffPage.jsx
import { useEffect, useState } from "react";
import StaffList from "../../components/staff/StaffList";
import GlobalSpinner from "../../components/GlobalSpinner"; // ✅ Import spinner

const StaffPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate or wait for internal data loading
    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="p-4">
      {loading ? <GlobalSpinner /> : <StaffList />} {/* ✅ Spinner shown during initial load */}
    </div>
  );
};

export default StaffPage;
