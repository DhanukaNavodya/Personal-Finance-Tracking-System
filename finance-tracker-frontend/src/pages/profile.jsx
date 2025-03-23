import React, { useState } from "react";
import { FaUser } from "react-icons/fa"; // Import the FaUser icon from react-icons

const Profile = () => {
  const [file, setFile] = useState(null); // State to store the selected file
  const [profileImage, setProfileImage] = useState(null); // State to store the profile image URL
  const [uploading, setUploading] = useState(false); // To manage the uploading state

  // Retrieve user details from localStorage
  const userDetails = JSON.parse(localStorage.getItem("user"));

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Handle file upload (simulated)
  const handleUpload = () => {
    if (!file) return; // Ensure there's a file to upload
    setUploading(true);

    // Simulate the upload process (this can be replaced with actual upload logic)
    setTimeout(() => {
      setUploading(false);
      setProfileImage(URL.createObjectURL(file)); // Preview the uploaded image
    }, 2000); // Simulate a delay for the upload
  };

  return (
    <div className="container my-5">
      <div className="card shadow-sm p-4">
        <div className="text-center mb-4">
          <h2>Profile</h2>
        </div>
        <div className="row justify-content-center">
          {/* Profile Image or Default Icon */}
          <div className="col-md-4">
            <div className="profile-image-container">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="rounded-circle img-fluid"
                  style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />
              ) : (
                <FaUser size={150} className="profile-icon rounded-circle" />
              )}
              <div className="mt-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  id="profile-upload"
                  style={{ display: "none" }}
                />
                <label htmlFor="profile-upload" className="btn btn-primary">
                  {uploading ? "Uploading..." : "Upload Profile Picture"}
                </label>
                {file && !uploading && (
                  <button className="btn btn-success mt-2" onClick={handleUpload}>
                    Upload
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <div className="profile-info">
              <div className="profile-item mb-3">
                <strong>Name: </strong>
                <span>{userDetails ? userDetails.username : "N/A"}</span>
              </div>
              <div className="profile-item mb-3">
                <strong>Contact No: </strong>
                <span>{userDetails ? userDetails.contactNumber : "N/A"}</span>
              </div>
              <div className="profile-item mb-3">
                <strong>Email: </strong>
                <span>{userDetails ? userDetails.email : "N/A"}</span>
              </div>
              <div className="profile-item mb-3">
                <strong>Role: </strong>
                <span>{userDetails ? userDetails.role : "N/A"}</span>
              </div>
            </div>

            <div className="profile-actions">
              <button className="btn btn-warning me-2">Edit Profile</button>
              <button className="btn btn-danger">Logout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
