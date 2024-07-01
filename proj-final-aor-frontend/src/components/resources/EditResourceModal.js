import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import './EditResourceModal.css';
import { HiMiniKey, HiMiniWrench } from 'react-icons/hi2';
import ResourceService from '../../services/ResourceService';
import { userStore } from '../../stores/UserStore';
import SupplierService from '../../services/SupplierService';

const EditResourceModal = (props) => {
    const { id, onClose } = props;
    const { token } = userStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [suppliersSearchedList, setSuppliersSearchedList] = useState([]);
    const [suppliersList, setSuppliersList] = useState([]);

    const [resourceSuppliers, setResourceSuppliers] = useState([]);
    
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        sourceId: '',
        type: '',
        photo: '',
        description: '',
        suppliers: [{ name: '', contact: '' }],
    });

    const [photoPreview, setPhotoPreview] = useState('');

    useEffect(() => {
        const fetchResource = async () => {
            if (id) {
                try {
                    const response = await ResourceService.getResourceById(id, token);
                    if (response) {
                        setResourceSuppliers(response.suppliers);
                        setFormData({
                            name: response.name || '',
                            brand: response.brand || '',
                            sourceId: response.sourceId || '',
                            type: response.type || '',
                            photo: response.photo || '',
                            description: response.description || '',
                            suppliers: [{ name: '', contact: '' }],
                        });
                        setPhotoPreview(response.photo || '');
                    }
                } catch (error) {
                    console.error("Error fetching resource:", error);
                }
            }
        };
        fetchResource();
    }, [id, token]);

    useEffect(() => {
        const fetchSuppliers = async () => {
            const response = await SupplierService.search(token, searchQuery);
            if (response) {
                setSuppliersList(response);
            }
        };

        if (searchQuery) {
            fetchSuppliers();
        }
    }, [searchQuery, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleChangePhoto = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setPhotoPreview(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
        setFormData({ ...formData, photo: file });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedResource = { ...formData };
            await ResourceService.updateResource(token, id, updatedResource);

        
            await ResourceService.addSupplier(token, id, suppliersList[0].id);
            console.log("Resource updated successfully");
            onClose();
        } catch (error) {
            console.error("Error updating resource:", error);
        }
    };

    const handleSupplierChange = (e) => {
        const { value } = e.target;
        setSearchQuery(value);
        setFormData({
            ...formData,
            suppliers: [{ ...formData.suppliers[0], name: value }]
        });
    };

    const handleSupplierContactChange = (e) => {
        const { value } = e.target;
        setFormData({
            ...formData,
            suppliers: [{ ...formData.suppliers[0], contact: value }]
        });
    };

    const selectSupplier = (supplier) => {
        setFormData({
            ...formData,
            suppliers: [{ name: supplier.name, contact: supplier.contact }]
        });
        setSearchQuery('');
        setSuppliersList([]);
    };

    const renderSearchedSuppliersList = () => {
        return suppliersList.map((supplier, index) => (
            <div key={index} className="supplier-item" onClick={() => selectSupplier(supplier)}>
                <span>{supplier.name} - {supplier.contact}</span>
            </div>
        ));
    };

    const renderThisSuppliersList = () => {
        return (
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Contact</th>
                    </tr>
                </thead>
                <tbody>
                    {resourceSuppliers.map((supplier, index) => (
                        <tr key={index}>
                            <td>{supplier.name}</td>
                            <td>{supplier.contact}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="edit-resource-modal-overlay">
            <div className="edit-resource-modal-container">
                <button className="close-modal-button" onClick={onClose}><FormattedMessage id="close" /></button>
                <form className="new-resource-form" onSubmit={handleSubmit}>
                    <div className="edit-resource-form-top-container">
                        <div className="nrftc-left">
                            <div className="new-resource-input-container">
                                <label className="new-resource-input-label" htmlFor="name"><FormattedMessage id="name" /> :</label>
                                <input type="text" id="name" name="name" disabled value={formData.name} />
                            </div>
                            <div className="new-resource-input-container">
                                <label className="new-resource-input-label" htmlFor="brand"><FormattedMessage id="brand" /> :</label>
                                <input type="text" id="brand" name="brand" required value={formData.brand} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="nrftc-middle">
                            <div className="new-resource-input-container">
                                <label className="new-resource-input-label" htmlFor="sourceId"><FormattedMessage id="sourceId" /> :</label>
                                <input type="text" id="sourceId" name="sourceId" required value={formData.sourceId} onChange={handleChange} />
                            </div>
                            <div className="new-resource-input-container">
                                <label className="new-resource-input-label" htmlFor="type"><FormattedMessage id="type" /> :</label>
                                <input type="text" id="type" name="type" disabled value={formData.type} />
                            </div>
                        </div>
                        <div className="nrftc-right">
                            <div className="new-resource-photo-container">
                                {photoPreview || formData.photo ? (
                                    <div className="new-resource-photo-preview">
                                        {photoPreview ? (
                                            <img src={photoPreview} alt="Preview" className="resource-photo" />
                                        ) : (
                                            <img src={formData.photo} alt="Description of the image" className="resource-photo" />
                                        )}
                                    </div>
                                ) : formData.type === "DIGITAL" ? (
                                    <div className="new-resource-photo-preview">
                                        <HiMiniKey fontSize='2em'/>
                                    </div>
                                ) : formData.type === "MATERIAL" ? (
                                    <div className="new-resource-photo-preview">
                                        <HiMiniWrench fontSize='2em'/>
                                    </div>
                                ) : null}
                            </div>
                            <div className="new-resource-input-container">
                                <label className="new-resource-input-label" htmlFor="photo"><FormattedMessage id="photo" /> :</label>
                                <input type="file" id="photo" name="photo" onChange={handleChangePhoto} />
                            </div>
                        </div>
                    </div>
                    <div className="edit-resource-input-container description">
                        <label className="new-resource-input-label description-label" htmlFor="description"><FormattedMessage id="description" /> :</label>
                        <input type="text" id="description" name="description" required value={formData.description} onChange={handleChange} />
                    </div>
                    <div className="suppliers-input-container">
                        <h3 className="supplier-label"><FormattedMessage id="supplier" /></h3>
                        <div>
                            <div className="new-resource-input-container">
                                <label className="new-resource-input-label" htmlFor="suppliersName"><FormattedMessage id="name" /> :</label>
                                <input type="text" id="suppliersName" name="name" placeholder="Supplier Name" required value={formData.suppliers[0].name} onChange={handleSupplierChange} />
                                {renderSearchedSuppliersList()}
                            </div>

                            <div className="new-resource-input-container">
                                <label className="new-resource-input-label" htmlFor="suppliersContact"><FormattedMessage id="contact" /> :</label>
                                <input type="text" id="suppliersContact" name="contact" placeholder="Supplier Contact" required value={formData.suppliers[0].contact} onChange={handleSupplierContactChange} />
                            </div>
                        </div>
                        
                        <div className="suppliers-list-container">
                            {renderThisSuppliersList()}
                        </div>
                    </div>
                    

                    <button type="submit"><FormattedMessage id="save" /></button>
                </form>
            </div>
        </div>
    );
};

export default EditResourceModal;
