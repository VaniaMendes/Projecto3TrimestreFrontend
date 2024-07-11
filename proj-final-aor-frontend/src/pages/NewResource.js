import React, { useEffect, useState } from "react";
import './NewResource.css';
import { HiMiniKey } from "react-icons/hi2";
import { HiMiniWrench } from "react-icons/hi2";
import Header from "../components/header/Header";
import { FormattedMessage, useIntl } from "react-intl";
import { userStore } from "../stores/UserStore";
import SupplierService from "../services/SupplierService";
import { toast } from "react-toastify";
import ResourceService from "../services/ResourceService";
import { uploadPhoto } from "../services/users";

const NewResource = () => {
    const {token} = userStore();

    return (
        <div className="new-resource-container">
            <Header />
              <div className="new-resource-form-container">
                  <h2><FormattedMessage id="newComponent"/></h2>
                  <NewResourceForm token={token}/>
              </div>
        </div>
    )
};

const NewResourceForm = (props) => {
    const {token} = props;
    const intl = useIntl();
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      observation: '',
      type: 'MATERIAL',
      brand: '',
      sourceId: '',
      suppliers: [{ name: '', contact: ''}],
      photo: null
    });
    const [photoPreview, setPhotoPreview] = useState(null);
    const [suppliersList, setSuppliersList] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSuppliersList, setShowSuppliersList] = useState(false);
    const [photoFile, setPhotoFile] = useState(null);

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
    }, [searchQuery]);

    useEffect(() => {
      return () => {
        if (photoPreview) {
          URL.revokeObjectURL(photoPreview);
        }
      };
    }, [photoPreview]);

    const handleChangePhoto = (event) => {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        const photoURL = URL.createObjectURL(file);
        setPhotoPreview(photoURL);
        setPhotoFile(file);
    
        setFormData(prevState => ({
          ...prevState,
          photo: photoURL
        }));
      }
    };
  
    const handleChange = (e) => {
        const { name, value } = e.target;

            setFormData({
                ...formData,
                [name]: value
            });
        
    };

    const handleSupplierChange = (e) => {
        const { value } = e.target;
        setSearchQuery(value);
        setFormData({
            ...formData,
            suppliers: [{ ...formData.suppliers[0], name: value }]
        });
        setShowSuppliersList(true);
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
        setSearchQuery(supplier.name);
        setShowSuppliersList(false);
    };
  
    const renderSuppliersList = () => {
      if (!showSuppliersList || !searchQuery) {
          return null;
      }

        const filteredSuppliers = suppliersList.filter(supplier =>
            supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (filteredSuppliers.length === 0) {
            return <div><FormattedMessage id="noMatchingSuppliers"/></div>;
        }

        return (
            <div className="suppliers-search-list">
                {filteredSuppliers.map((supplier, index) => (
                    <div key={index} className="supplier-item" onClick={() => selectSupplier(supplier)}>
                        {supplier.name}
                    </div>
                ))}
            </div>
        );
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
          let photoUrl = null; // Inicializa photoUrl como null
  
          // Tenta o upload da foto apenas se photoFile estiver definido
          if (photoFile) {
              photoUrl = await uploadPhoto(photoFile);
          }
  
          // Atualiza o estado do formulário com a URL da foto, se disponível
          const updatedForm = { ...formData, photo: photoUrl };

          const response = await ResourceService.register(token, updatedForm);
  
          if (response) {
              setFormData({
                  name: '',
                  description: '',
                  type: 'MATERIAL',
                  brand: '',
                  sourceId: '',
                  suppliers: [{ name: '', contact: '' }],
                  photo: null
              });
              setPhotoPreview(null);
  
              toast.success(intl.formatMessage({ id: "componentCreatedSuccess" }));
          } else {
              toast.warn(intl.formatMessage({ id: "componentCreatedError" }));
          }
      } catch (error) {
          toast.error(intl.formatMessage({ id: "componentCreatedError" }));
      }
  };
  
  
  
    return (
      <form className="new-resource-form" onSubmit={handleSubmit}>
        <div className="new-resource-form-top-container">
          <div className="nrftc-left">
            <div className="new-resource-input-container">
              <label className="new-resource-input-label" htmlFor="name"><FormattedMessage id="name"/> * :</label>
              <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} />
            </div>

            <div className="new-resource-input-container">
              <label className="new-resource-input-label" htmlFor="brand"><FormattedMessage id="brand" /> * :</label>
              <input type="text" id="brand" name="brand" required value={formData.brand} onChange={handleChange} />
            </div>

            <div className="new-resource-input-container">
              <label className="new-resource-input-label" htmlFor="sourceId"><FormattedMessage id="sourceId"/> * :</label>
              <input type="text" id="sourceId" name="sourceId" required value={formData.sourceId} onChange={handleChange} />
            </div>

            <div className="new-resource-input-type-container">
              <label className="new-resource-input-label-type" htmlFor="type"><FormattedMessage id="type" /> :</label>
              <select id="type" name="type" required value={formData.type} onChange={handleChange}>
                <option value="MATERIAL"><FormattedMessage id="material"/></option>
                <option value="DIGITAL"><FormattedMessage id="digital"/></option>
              </select>
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

        <div className="new-resource-input-container description-ctnr">
          <label className="new-resource-input-label description-label" htmlFor="description-newrsc"><FormattedMessage id="description"/> * :</label>
          <input type="text" id="description-new-rsc" name="description" required value={formData.description} onChange={handleChange} />
        </div>

        <div className="new-resource-input-container observations-ctnr">
          <label className="new-resource-input-label observations-label" htmlFor="observation"><FormattedMessage id="observations"/> :</label>
          <input type="text" id="observation" name="observation" value={formData.observation} onChange={handleChange} />
        </div>

        
        <div className="suppliers-input-container">
          <h3 className="supplier-label"><FormattedMessage id="supplier"/></h3>
          <div className="new-resource-input-container">
            <label className="new-resource-input-label" htmlFor="suppliersName"><FormattedMessage id="name"/> * :</label>
            <input type="text" id="suppliersName" name="name" placeholder="Supplier Name" required value={formData.suppliers[0].name} onChange={handleSupplierChange} />
            {renderSuppliersList()}
          </div>

          <div className="new-resource-input-container">
            <label className="new-resource-input-label" htmlFor="suppliersContact"><FormattedMessage id="contact"/> * :</label>
            <input type="text" id="suppliersContact" name="contact" placeholder="Supplier Contact" required value={formData.suppliers[0].contact} onChange={handleSupplierContactChange} />
          </div>
        </div>
  
        <button type="submit"><FormattedMessage id="save" /></button>
      </form>
    );
  };

export default NewResource;