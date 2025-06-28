import axios from 'axios';
import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import {useAuth} from '../Context/AuthContext'

const Register = () => {
   
    
    const {setAuthUser} = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        age: '',
        gender: '',
        password: '',
        confirmPassword: ''
    });
    const [profilePic, setProfilePic] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsLoading(true);
        const BASE_URL = import.meta.env.VITE_API_BASE_URL;

        try {
            
            const payload = {
                fullname: formData.fullName,
                username: formData.username,
                email: formData.email,
                age: formData.age,
                gender: formData.gender,
                password: formData.password,
                // profilepic: previewImage ,  
            };

            const response = await axios.post(
                `${BASE_URL} /auth/register`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true 
                }
            );

            const data = response.data;

            if (data.sucess === false) {
                toast.error(data.message);
            } else {
                setAuthUser(data);
                toast.success('Registered Successfully');
                window.location.href = '/login';
            }

        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <div className="register-container">
            <div className="register-card animate-pop-in">
                <h2 className="auth-title">Join Our Community</h2>
                <p className="auth-subtitle">Create your account in just a minute</p>

                <form onSubmit={handleSubmit} className="register-form">
                    {/* Top Row - Profile Picture and Basic Info */}
                    <div className="form-top-row">
                        {/* Profile Picture */}
                        <div className="profile-section">
                            <div
                                className="profile-upload-container"
                                onClick={triggerFileInput}
                            >
                                {previewImage ? (
                                    <img
                                        src={previewImage}
                                        alt="Profile preview"
                                        className="profile-image-preview"
                                    />
                                ) : (
                                    <div className="profile-placeholder">
                                        <svg className="profile-icon" viewBox="0 0 24 24">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                        </svg>
                                    </div>
                                )}
                                <div className="upload-overlay">
                                    <svg className="upload-icon" viewBox="0 0 24 24">
                                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="upload-text">Click to upload profile picture (optional)</p>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>

                        {/* Basic Info */}
                        <div className="basic-info-section">
                            <div className="input-group">
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    className="auth-input peer"
                                    placeholder=" "
                                />
                                <label htmlFor="fullName" className="auth-label">Full Name</label>
                                <div className="input-highlight"></div>
                            </div>

                            <div className="input-group">
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    className="auth-input peer"
                                    placeholder=" "
                                />
                                <label htmlFor="username" className="auth-label">Username</label>
                                <div className="input-highlight"></div>
                            </div>
                        </div>
                    </div>

                    {/* Middle Row - Email, Age, Gender */}
                    <div className="form-middle-row">
                        <div className="input-group">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="auth-input peer"
                                placeholder=" "
                            />
                            <label htmlFor="email" className="auth-label">Email</label>
                            <div className="input-highlight"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="input-group">
                                <input
                                    type="number"
                                    id="age"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    required
                                    min="13"
                                    max="120"
                                    className="auth-input peer"
                                    placeholder=" "
                                />
                                <label htmlFor="age" className="auth-label">Age</label>
                                <div className="input-highlight"></div>
                            </div>

                            <div className="input-group">
                                <select
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    required
                                    className="auth-input peer"
                                >
                                    <option value=""></option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                    <option value="prefer-not-to-say">Prefer not to say</option>
                                </select>
                                <label htmlFor="gender" className="auth-label">Gender</label>
                                <div className="input-highlight"></div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row - Passwords */}
                    <div className="form-bottom-row">
                        <div className="input-group">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength="8"
                                className="auth-input peer"
                                placeholder=" "
                            />
                            <label htmlFor="password" className="auth-label">Password</label>
                            <div className="input-highlight"></div>
                        </div>

                        <div className="input-group">
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                minLength="8"
                                className="auth-input peer"
                                placeholder=" "
                            />
                            <label htmlFor="confirmPassword" className="auth-label">Confirm Password</label>
                            <div className="input-highlight"></div>
                        </div>
                    </div>

                   


                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="auth-button relative overflow-hidden"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="absolute inset-0 flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </span>
                                <span className="invisible">Create Account</span>
                            </>
                        ) : (
                            <>
                                <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:translate-y-full">
                                    Get Started
                                </span>
                                <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                                    Create Account
                                </span>
                            </>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p className="text-gray-600">Already have an account?
                        <Link to="/login" className="text-indigo-600 font-medium hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;