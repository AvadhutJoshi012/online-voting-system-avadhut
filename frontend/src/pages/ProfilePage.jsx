import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile, uploadProfilePhoto } from '../services/api';
import { Container, Row, Col, Card, Form, Button, Alert, Image } from 'react-bootstrap';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [profilePhotoFile, setProfilePhotoFile] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        if (user?.profileImageUrl) {
            // Check if the URL is already absolute
            if (user.profileImageUrl.startsWith('http')) {
                setProfileImageUrl(user.profileImageUrl);
            } else if (user.profileImageUrl.startsWith('/api')) {
                setProfileImageUrl(`${user.profileImageUrl}?t=${new Date().getTime()}`);
            } else {
                setProfileImageUrl(`/api/user/profile/photo/${user.profileImageUrl}?t=${new Date().getTime()}`);
            }
        } else {
            setProfileImageUrl('/api/user/profile/photo/default.png');
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            const data = await getUserProfile();
            setUser(data);
            setFormData(data);
        } catch (err) {
            setError('Failed to load profile');
        }
    };

    const handlePhotoUpload = async () => {
        if (!profilePhotoFile) {
            setError('Please select a photo to upload.');
            return;
        }
        try {
            await uploadProfilePhoto(profilePhotoFile);
            setMessage('Photo uploaded successfully!');
            setError('');
            // Refresh profile to get new image URL
            fetchProfile();
        } catch (err) {
            setError('Failed to upload photo.');
            setMessage('');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUserProfile(formData);
            setMessage('Profile updated successfully');
            setEditMode(false);
            fetchProfile();
        } catch (err) {
            setError('Failed to update profile');
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card>
                        <Card.Header as="h3">My Profile</Card.Header>
                        <Card.Body>
                            {message && <Alert variant="success">{message}</Alert>}
                            {error && <Alert variant="danger">{error}</Alert>}

                            <div className="text-center mb-4">
                                <Image
                                    src={profileImageUrl}
                                    onError={(e) => { e.target.src = '/api/user/profile/photo/default.png'; }}
                                    roundedCircle
                                    width="150"
                                    height="150"
                                />
                                {editMode && (
                                    <Form.Group className="mt-2">
                                        <Form.Control type="file" onChange={(e) => setProfilePhotoFile(e.target.files[0])} />
                                        <Button size="sm" className="mt-2" onClick={handlePhotoUpload}>Upload Photo</Button>
                                    </Form.Group>
                                )}
                            </div>

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Full Name</Form.Label>
                                    <Form.Control type="text" value={user.fullName} readOnly />
                                    <Form.Text className="text-muted">Name cannot be changed directly.</Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={editMode ? formData.email : user.email}
                                        onChange={handleChange}
                                        readOnly={!editMode}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="phoneNumber"
                                        value={editMode ? formData.phoneNumber : user.phoneNumber}
                                        onChange={handleChange}
                                        readOnly={!editMode}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="address"
                                        value={editMode ? formData.address : user.address}
                                        onChange={handleChange}
                                        readOnly={!editMode}
                                    />
                                </Form.Group>

                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Label>City</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="city"
                                                value={editMode ? formData.city : user.city}
                                                onChange={handleChange}
                                                readOnly={!editMode}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Label>State</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="state"
                                                value={editMode ? formData.state : user.state}
                                                onChange={handleChange}
                                                readOnly={!editMode}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Pincode</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="pincode"
                                                value={editMode ? formData.pincode : user.pincode}
                                                onChange={handleChange}
                                                readOnly={!editMode}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Aadhar Number</Form.Label>
                                    <Form.Control type="text" value={user.aadharNumber} readOnly />
                                    <Form.Text className="text-muted">Primary ID cannot be changed.</Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Voter ID Number</Form.Label>
                                    <Form.Control type="text" value={user.voterIdNumber} readOnly />
                                    <Form.Text className="text-muted">Primary ID cannot be changed.</Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>PAN Card Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="panCardNumber"
                                        value={editMode ? (formData.panCardNumber || '') : (user.panCardNumber || 'Not Added')}
                                        onChange={handleChange}
                                        readOnly={!editMode || user.panCardNumber}
                                        placeholder={!user.panCardNumber && editMode ? "Enter PAN Card Number" : ""}
                                    />
                                    {user.panCardNumber && editMode && <Form.Text className="text-muted">Already added, cannot be changed.</Form.Text>}
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Passport Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="passportNumber"
                                        value={editMode ? (formData.passportNumber || '') : (user.passportNumber || 'Not Added')}
                                        onChange={handleChange}
                                        readOnly={!editMode || user.passportNumber}
                                        placeholder={!user.passportNumber && editMode ? "Enter Passport Number" : ""}
                                    />
                                    {user.passportNumber && editMode && <Form.Text className="text-muted">Already added, cannot be changed.</Form.Text>}
                                </Form.Group>

                                {editMode ? (
                                    <div className="d-flex gap-2">
                                        <Button variant="success" type="submit">Save Changes</Button>
                                        <Button variant="secondary" onClick={() => { setEditMode(false); setFormData(user); }}>Cancel</Button>
                                    </div>
                                ) : (
                                    <Button variant="primary" onClick={() => setEditMode(true)}>Edit Profile</Button>
                                )}
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ProfilePage;
