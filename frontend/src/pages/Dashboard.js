import React, { useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from "../context/AuthProvider";
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faFontAwesomeIcon, FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BUILDINGS_URL = 'http://localhost:5206/api/Building/list';

const Dashboard = () => {
    const { auth, setAuth } = useContext(AuthContext); 
    const navigate = useNavigate();
    const [buildings, setBuildings] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [newBuilding, setNewBuilding] = useState({
        buildingType: '',
        buildingCost: '',
        constructionTime: ''
    });
    const [editingBuilding, setEditingBuilding] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        console.log("Current Auth Context:", auth); 
        fetchBuildings();
    }, []);

    const fetchBuildings = async () => {
        try {
            console.log("Sending Authorization Header:", `Bearer ${auth.token}`); 
            const response = await axios.get(BUILDINGS_URL, {
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                },
                withCredentials: true
            });
            console.log(response.data); 
            setBuildings(response.data);
        } catch (error) {
            if (!error.response) {
                setErrorMessage('No Server Response');
            } else if (error.response?.status === 400) {
                setErrorMessage('Bad Request');
            } else if (error.response?.status === 401) {
                setErrorMessage('Unauthorized');
            } else if (error.response?.status === 404) {
                setErrorMessage('Buildings not found');
            } else {
                setErrorMessage('Failed to fetch buildings');
            }
        }
    };

    const handleAddBuilding = async () => {
        console.log("Attempting to add building:", newBuilding); 
        try {
            const response = await axios.post('http://localhost:5206/api/Building/add', newBuilding, {
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                },
                withCredentials: true
            });
            if (response.status === 200) {
                fetchBuildings(); 
                setNewBuilding({
                    buildingType: '',
                    buildingCost: '',
                    constructionTime: ''
                });
                setShowAddForm(false); 
            }
        } catch (error) {
            if (!error.response) {
                setErrorMessage('No Server Response');
            } else if (error.response?.status === 400) {
                setErrorMessage('Invalid Building Data');
            } else if (error.response?.status === 409) {
                setErrorMessage('Building Type already exists');
            } else {
                setErrorMessage('Failed to add building');
            }
        }
    };

    const handleUpdateBuilding = async () => {

        if (!editingBuilding?.id) {
            console.error("invalid id for updating building:", editingBuilding?.id);
            setErrorMessage("Invalid building id");
            return;
        }
    
        console.log("Trying to update building with id:", editingBuilding.id);
    
        const updateUrl = `http://localhost:5206/api/Building/update/${editingBuilding.id}`;
    
        try {
            const response = await axios.put(updateUrl, newBuilding, {
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                },
                withCredentials: true
            });
    
            console.log("Update response:", response);
            if (response.status === 200) {
                fetchBuildings(); 
                setEditingBuilding(null);
                setNewBuilding({
                    buildingType: '',
                    buildingCost: '',
                    constructionTime: ''
                });
                setShowAddForm(false);
            }
        } catch (error) {
            if (!error.response) {
                setErrorMessage('No Server Response');
            } else if (error.response?.status === 400) {
                setErrorMessage('Missing or Invalid Building Data');
            } else if (error.response?.status === 409) {
                setErrorMessage('Building Type already exists');
            } else {
                setErrorMessage('Failed to update building');
            }
            console.error("Error updating building:", error);
        }
    };
    
    const handleDeleteBuilding = async (id) => {
        if (!id) {
            console.error("Invalid id:", id); 
            setErrorMessage("Invalid building ID.");
            return;
        }
        console.log("Trying to delete building with id:", id);
    
        const deleteUrl = `http://localhost:5206/api/Building/delete/${id}`;
        console.log("DELETE request to:", deleteUrl);
    
        try {
            const response = await axios.delete(deleteUrl, {
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                },
                withCredentials: true
            });
    
            console.log("Delete response:", response);
            if (response.status === 200) {
                fetchBuildings(); 
            }
        } catch (error) {
            if (!error.response) {
                setErrorMessage('No Server Response');
            } else if (error.response?.status === 404) {
                setErrorMessage('Building not found');
            } else {
                setErrorMessage('Failed to delete building');
            }
            console.error("Error deleting building:", error);
        }
    };
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBuilding(prevState => ({
            ...prevState,
            [name]: value
        }));
        console.log("Updated New Building State:", newBuilding);
    };

    const startEditing = (building) => {
        console.log("Editing building:", building);
        setEditingBuilding(building);
        setNewBuilding(building);
        setShowAddForm(true); 
    };

    const cancelEditing = () => {
        setEditingBuilding(null);
        setNewBuilding({
            buildingType: '',
            buildingCost: '',
            constructionTime: ''
        });
        setShowAddForm(false); 
    };

    const availableBuildingTypes = ["Farm", "Academy", "Headquarters", "LumberMill", "Barracks"].filter(
        type => !buildings.some(building => building.buildingType === type)
    );

    const handleLogout = () => {
        setAuth({});
        navigate('/login');
    };

    return (
        <section className="dashboard">
            <nav>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </nav>
            
            <div className="header">
                <h1>Buildings List</h1>
                
                {!showAddForm && (
                    <button className="add-button" onClick={() => setShowAddForm(true)}>Add</button>
                )}
            </div>
            {errorMessage && <p className="errmsg" aria-live="assertive">{errorMessage}</p>}

            {buildings.length > 0 ? (
    <div className="buildings-grid">
        <div className="grid-header">
            <div>Type</div>
            <div>Cost</div>
            <div>Time</div>
            <div>Actions</div>
        </div>
        {buildings.map((building) => (
            <div className="grid-row" key={building.id}>
                <div>{building.buildingType}</div>
                <div>{building.buildingCost}</div>
                <div>{building.constructionTime}</div>
                <div className='grid-buttons'>
                    <button onClick={() => startEditing(building)} className="edit-button">
                        {/* <FontAwesomeIcon icon={faEdit} /> */}
                        ✏️
                        </button>
                    <button onClick={() => handleDeleteBuilding(building.id)} className="delete-button"><FontAwesomeIcon icon={faTrash} /></button>
                </div>
            </div>
        ))}
    </div>
) : (
    <p>No buildings found</p>
)}
            {showAddForm && (
                <div className="add-building-form">
                    <h2>{editingBuilding ? 'Edit Building' : 'Add New Building'}</h2>
                    <form className="building-form" onSubmit={(e) => {
                        e.preventDefault();
                        editingBuilding ? handleUpdateBuilding() : handleAddBuilding();
                    }}>
                        <label>
                            Building Type:
                            <select name="buildingType" value={newBuilding.buildingType} onChange={handleInputChange} required>
                                <option value="">Building Type</option>
                                {availableBuildingTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Building Cost:
                            <input
                                type="number"
                                name="buildingCost"
                                value={newBuilding.buildingCost}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                        <label>
                            Construction Time:
                            <input
                                type="number"
                                name="constructionTime"
                                value={newBuilding.constructionTime}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                        <div className="form-actions">
                            <button type="submit">{editingBuilding ? 'Update Building' : 'Add Building'}</button>
                            <button type="button" onClick={cancelEditing}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </section>
    );
};

export default Dashboard;
