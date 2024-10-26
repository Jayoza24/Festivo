import { useState, useRef, useEffect } from "react";
import style from "../styles/profile.module.css";
import noProfile from "../assets/noProfile.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = (props) => {
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileImage, setSelectedFileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validEmails, setValidEmails] = useState([]);
  const [downloadLink, setDownloadLink] = useState("");
  const [event, setEvent] = useState("Wedding Invitation");
  const [name, setName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    if (props.uid) {
      getProfileImage(props.uid);
    }
  }, [props.uid]);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setSelectedFileImage(file);
    } else {
      alert("Please upload a valid image file (JPEG or PNG).");
    }
  };

  const handleProfileImageUpload = async () => {
    if (!selectedFileImage) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFileImage);

    try {
      await axios.post(
        `https://festivo.onrender.com/api/users/profile/image/${props.uid}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      getProfileImage(props.uid);
      alert("Profile picture updated successfully!");
      setSelectedFileImage(null);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("Error uploading profile picture.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === "text/csv") {
      setSelectedFile(file);
    } else {
      alert("Please upload a valid CSV file.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "text/csv") {
      setSelectedFile(file);
    } else {
      alert("Please upload a valid CSV file.");
    }
  };

  const logOut = () => {
    localStorage.removeItem("userInfo");
    location.reload();
  };

  const handleUpload = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "https://festivo.onrender.com/api/emails/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setDownloadLink(`http://localhost:5000/${response.data.validEmailsPath}`);
      setValidEmails(response.data.valid);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmails = async () => {
    setLoading(true);

    const message = {
      userName: props.user,
      invitationType: event,
      names: name,
      eventDate: eventDate,
      eventLocation: eventLocation,
      eventTime: eventTime,
    };

    try {
      await axios.post("https://festivo.onrender.com/api/emails/dispatch", {
        validEmails,
        message,
      });
      alert("Emails sent successfully to valid recipients!");
      window.location.reload();
    } catch (error) {
      console.error("Error sending emails:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProfileImage = async (uid) => {
    try {
      const response = await axios.get(
        `https://festivo.onrender.com/api/users/profile/image/${uid}`
      );
      setProfileImage(response.data);
    } catch (error) {
      console.log("Error fetching profile image:", error);
    }
  };

  return (
    <div className={style.mainProfile}>
      <div className={style.left}>
        <div className={style.profilePic}>
          {console.log(profileImage)}
          <img
            src={
              profileImage !== ""
                ? `https://festivo.onrender.com/uploads/profile/${profileImage}`
                : noProfile
            }
            alt="Profile Pic"
          />
          <h2>Welcome, {props.user}</h2>
          <input
            type="file"
            accept=".jpg, .jpeg, .png"
            style={{ display: "none" }}
            onChange={handleProfileImageChange}
            id="profileImageInput"
          />
          <button
            onClick={() => document.getElementById("profileImageInput").click()}
          >
            Change Profile Picture
          </button>
          {selectedFileImage && (
            <button onClick={handleProfileImageUpload}>
              {loading ? "Uploading..." : "Upload Profile Picture"}
            </button>
          )}
        </div>

        <button onClick={() => navigate("/vendors")}>Find Vendors</button>
        <button onClick={() => navigate("/planning")}>Start Planning</button>
        <button onClick={logOut}>LOGOUT</button>
      </div>
      <div className={style.right}>
        <div className={style.sendInvites}>
          <h2>Send Invites to your guests</h2>
          <div
            className={style.dragDropArea}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current.click()}
          >
            {selectedFile ? (
              <p>{selectedFile.name} selected</p>
            ) : (
              <p>Drag and drop a CSV file here, or click to select one</p>
            )}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept=".csv"
              onChange={handleFileChange}
            />
          </div>
          {selectedFile && !loading && (
            <button className={style.uploadButton} onClick={handleUpload}>
              Upload
            </button>
          )}
          {loading && <p>Loading... Please wait.</p>}
          {downloadLink && (
            <a href={downloadLink} download="valid_emails.csv">
              Download Valid Emails
            </a>
          )}
          {validEmails.length > 0 && !loading && (
            <>
              <select
                id={style.eventSelection}
                value={event}
                onChange={(e) => setEvent(e.target.value)}
              >
                <option value="Wedding Invitation">Wedding Invitation</option>
                <option value="Birthday Invitation">Birthday Invitation</option>
                <option value="Haldi Invitation">Haldi Invitation</option>
              </select>
              <input
                type="text"
                placeholder="Name of Invitees"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Event Location"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
              />
              <input
                type="date"
                placeholder="Event Date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
              />
              <input
                type="time"
                placeholder="Event Time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
              />
              <button
                className={style.sendEmailButton}
                onClick={handleSendEmails}
              >
                Send Email Invites
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
