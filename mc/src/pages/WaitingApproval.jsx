import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const WaitingApproval = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.approved) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-center px-4">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Account Pending Approval</h2>
        <p className="text-gray-600">
          Your account has been created successfully. Please wait for the admin to approve your account.
        </p>
      </div>
    </div>
  );
};

export default WaitingApproval;
