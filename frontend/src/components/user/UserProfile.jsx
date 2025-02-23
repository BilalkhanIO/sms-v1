// frontend/src/components/UserProfile.js (continued)
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from "../../api/usersApi";
import { useState, useEffect } from "react";

const UserProfile = () => {
    const { data: user, isLoading, error, refetch } = useGetUserProfileQuery(); // Add refetch
    const [updateProfile, { isLoading: isUpdating, isSuccess, error: updateError }] = useUpdateUserProfileMutation();
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (user) {
            setFormData(user); // Set initial form data when user data is available
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await updateProfile(formData).unwrap();
            // Handle successful update (e.g., show success message, refetch data)
            console.log("Profile updated:", result);
            refetch(); // Refetch the profile data to update the UI
            setSuccessMessage("Profile updated successfully!"); // Set success message
            setTimeout(() => setSuccessMessage(null), 3000); // Clear message after 3 seconds

        } catch (err) {
            console.error("Error updating profile:", err);
            setErrorMessage(err.data.message || "An error occurred during update."); // Set error message
        }
    };

    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    if (isLoading) {
        return <div>Loading profile...</div>;
    }

    if (error) {
        return <div>Error loading profile: {error.message}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">User Profile</h2>

            {successMessage && <p className="text-green-500 mb-2">{successMessage}</p>}
            {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}

            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="mb-4">
                    <label htmlFor="firstName" className="block text-gray-700 font-bold mb-2">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        value={formData.firstName || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="lastName" className="block text-gray-700 font-bold mb-2">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        value={formData.lastName || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
                {/* ... other input fields (email, profilePicture, password) */}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="profilePicture" className="block text-gray-700 font-bold mb-2">Profile Picture URL</label>
                    <input
                        type="text"
                        name="profilePicture"
                        id="profilePicture"
                        value={formData.profilePicture || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password (Leave blank to keep current)</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={formData.password || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>


                <button
                    type="submit"
                    disabled={isUpdating}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                >
                    {isUpdating ? "Updating..." : "Update Profile"}
                </button>
            </form>
        </div>
    );
};

export default UserProfile;