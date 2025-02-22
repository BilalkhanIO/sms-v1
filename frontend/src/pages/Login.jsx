// src/pages/Login.jsx
      import { useState, useEffect } from "react";
      import { useDispatch, useSelector } from "react-redux";
      import { useNavigate } from "react-router-dom";
      import { useLoginMutation } from "../api/authApi";
      import { setCredentials } from "../store/authSlice";

      function Login() {
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [formError, setFormError] = useState("");
        const [formSuccess, setFormSuccess] = useState("");

        const dispatch = useDispatch();
        const navigate = useNavigate();
        const [login, { isLoading }] = useLoginMutation();
        const { user } = useSelector((state) => state.auth);

        // Navigate if already authenticated
        useEffect(() => {
          if (user?.role) {
            const dashboardPath = getDashboardPath(user.role);
            navigate(dashboardPath, { replace: true });
          }
        }, [user?.role, navigate]);

        // Optional: Log error only when it changes
        useEffect(() => {
          if (formError) console.log(`form err: ${formError}`);
        }, [formError]);

        const getDashboardPath = (role) => {
          switch (role) {
            case "SUPER_ADMIN":
            case "SCHOOL_ADMIN":
              return "/dashboard/admin-dashboard";
            case "TEACHER":
              return "/dashboard/teacher-dashboard";
            case "STUDENT":
              return "/dashboard/student-dashboard";
            case "PARENT":
              return "/dashboard/parent-dashboard";
            default:
              return "/dashboard";
          }
        };

        const handleSubmit = async (e) => {
          e.preventDefault();
          setFormError("");
          setFormSuccess("");

          try {
            const result = await login({ email, password }).unwrap();
            console.log("Login success:", result);
            dispatch(setCredentials(result)); // <---- RE-ADD THIS DISPATCH CALL
            setFormSuccess("Login successful! Redirecting...");
            setTimeout(() => {
              navigate(getDashboardPath(result.data.role), { replace: true }); // <----- Access role from result.data.role
            }, 2000);
          } catch (err) {
            console.error("Login error:", err);
            // Attempt to extract a useful error message
            const errorMsg =
              err.data?.message ||
              err.error ||
              err.message ||
              "Login failed. Please check your credentials.";
            setFormError(errorMsg);
          }
        };

        return (
          <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="bg-gradient-to-b from-gray-700 to-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
              <h1 className="text-3xl text-white font-bold mb-6 text-center text-primary">
                Welcome Back!
              </h1>
              <p className="text-sm text-gray-400 text-center mb-6">
                Please log in to access your account.
              </p>

              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  <p className="text-sm">{formError}</p>
                </div>
              )}

              {formSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                  <p className="text-sm">{formSuccess}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-400 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-400 mb-1"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full uppercase bg-gradient-to-l from-blue-400 to-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>
              </form>

              <div className="mt-6 text-center">

                <p className="text-sm text-gray-600 mt-2">
                  <a
                    href="/forgot-password"
                    className="text-blue-600 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </p>
              </div>
            </div>
          </div>
        );
      }

      export default Login;