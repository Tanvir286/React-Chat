import React, { useState, useEffect } from 'react';
import "./ProfileUpdate.css";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { useSelector } from 'react-redux';

const ProfileUpdate = () => {
    const db = getDatabase();
    const ActiveUser = useSelector(state => state?.user?.value);

    const [profile, setProfile] = useState({
        username: '',
        email: '',
        photoURL: '',
        bio: '',
        address: '',
        gender: '',
        password: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    /*================================== 
           Fetch User Profile Details    
    ===================================*/
    useEffect(() => {
        const profileRef = ref(db, "users");
        onValue(profileRef, (snapshot) => {
            let userProfile = null;
            snapshot.forEach(item => {
                const data = item.val();
                if (ActiveUser.displayName === data.username) {
                    userProfile = { ...data, id: item.key };
                }
            });
            if (userProfile) {
                setProfile(userProfile);
            } else {
                setError('User profile not found.');
            }
        });
    }, [ActiveUser.displayName, db]);

    /*================================== 
           Handle Input Changes    
    ===================================*/
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prevProfile => ({ ...prevProfile, [name]: value }));
    };

    /*================================== 
           Handle Profile Update    
    ===================================*/
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        const userRef = ref(db, `users/${profile.id}`);
        
        update(userRef, {
            username: profile.username,
            email: profile.email,
            photoURL: profile.photoURL,
            bio: profile.bio,
            address: profile.address,
            gender: profile.gender,
            photoURL: profile.photoURL
        })
        .then(() => {
            setMessage('Profile updated successfully.');
        })
        .catch((error) => {
            console.error("Error updating profile:", error);
            setError("Error updating profile.");
        })
        .finally(() => {
            setLoading(false);
        });
    };

    return (
        <div className='main-area'>
            <div className='main-area-two'>
                <div className='profile-view'>
                    <div className='profile-view1'>
                        <img src={profile.photoURL || "default-placeholder.png"} alt={profile.username || "Profile Image"} className='profile-image-have' />
                    </div>
                    <form onSubmit={handleSubmit} className='input-all'>
                        {/*======= (username area start) ==========*/}
                        <div className='input-group'>
                            <label className='input-label'>Username</label>
                            <input
                                type="text"
                                name="username"
                                value={profile.username}
                                onChange={handleChange}
                                disabled
                                className='input1'
                            />
                        </div>
                         {/*======= (username area end ) ==========*/}
                         {/*======= (Email area Start ) ==========*/}
                        <div className='input-group'>
                            <label className='input-label'>Email</label>
                            <input
                                type="text"
                                name="email"
                                value={profile.email}
                                onChange={handleChange}
                                disabled
                                className='input2'
                            />
                        </div>
                        {/*======= (Email area End ) ==========*/}
                        {/*======= (Bio area Start ) ==========*/}
                        <div className='input-group'>
                            <label className='input-label'>Bio</label>
                            <input
                                type="text"
                                name="bio"
                                value={profile.bio}
                                onChange={handleChange}
                                placeholder="Bio"
                                className='input3'
                            />
                        </div>
                        {/*======= (Bio area end ) ==========*/}
                        {/*======= (Address area start ) ==========*/}
                        <div className='input-group'>
                            <label className='input-label'>Address</label>
                            <input
                                type="text"
                                name="address"
                                value={profile.address}
                                onChange={handleChange}
                                placeholder="Address"
                                className='input4'
                            />
                        </div>
                        {/*======= (Address area end ) ==========*/}
                        {/*======= (Gender area Start ) ==========*/}
                        <div className='input-group'>
                            <label className='input-label'>Gender</label>
                            <select
                                name="gender"
                                value={profile.gender}
                                onChange={handleChange}
                                className='input5'
                            >
                                <option value="" disabled>Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        {/*======= (Gender area end ) ==========*/}
                        {/*======= (Submit area start ) ==========*/}
                        <div className='main-submit-11'>
                           <button type="submit" className='submit-button-44' disabled={loading}>
                            {loading ? 'Updating...' : 'Update Profile'}
                          </button>
                        </div>
                       
                        {/*======= (Submit area end ) ==========*/}
                        {message && <p className='success-message'>{message}</p>}
                        {error && <p className='error-message'>{error}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileUpdate;
