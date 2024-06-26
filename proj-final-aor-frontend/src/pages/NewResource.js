import React, { useEffect, useState } from "react";
import './NewResource.css';
import { HiMiniKey } from "react-icons/hi2";
import { HiMiniWrench } from "react-icons/hi2";
import Header from "../components/header/Header";
import { FormattedMessage, IntlProvider } from "react-intl";
import languages from "../translations";
import { userStore } from "../stores/UserStore";

const NewResource = () => {
    const {locale} = userStore();

    return (
        <div className="new-resource-container">
            <Header />

            <IntlProvider locale={locale} messages={languages[locale]}>
              <div className="new-resource-form-container">
                  <h2>New Resource</h2>
                  <NewResourceForm/>
              </div>
            </IntlProvider>
        </div>
    )
};

const NewResourceForm = () => {
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      type: 'MATERIAL',
      brand: '',
      sourceId: '',
      suppliers: [{ name: '' }],
      photo: null
    });
    const [photoPreview, setPhotoPreview] = useState(null);

    useEffect(() => {
      return () => {
        if (photoPreview) {
          URL.revokeObjectURL(photoPreview);
        }
      };
    }, [photoPreview]);
  
    const handleChange = (e) => {
      const { name, value, files } = e.target;
      if (name === 'photo' && files.length > 0) {
        setFormData({
          ...formData,
          photo: files[0]
        });
        setPhotoPreview(URL.createObjectURL(files[0]));
      } else if (name === 'suppliersName' || name === 'suppliersContact') {
        // Identifica qual propriedade do fornecedor está sendo atualizada
        const supplierProperty = name === 'suppliersName' ? 'name' : 'contact';
        // Atualiza o estado formData para o fornecedor
        setFormData({
          ...formData,
          suppliers: [{ ...formData.suppliers[0], [supplierProperty]: value }]
        });
      } else {
        setFormData({
          ...formData,
          [name]: value
        });
      }
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log(formData);
      // Here you would typically send formData to your server via AJAX
    };
  
    return (
      <form className="new-resource-form" onSubmit={handleSubmit}>
        <div className="new-resource-form-top-container">
          <div className="nrftc-left">
            <div className="new-resource-input-container">
              <label className="new-resource-input-label" htmlFor="name"><FormattedMessage id="name"/> :</label>
              <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} />
            </div>

            <div className="new-resource-input-type-container">
              <label className="new-resource-input-label-type" htmlFor="type"><FormattedMessage id="type" /> :</label>
              <select id="type" name="type" required value={formData.type} onChange={handleChange}>
                <option value="MATERIAL"><FormattedMessage id="material"/></option>
                <option value="DIGITAL"><FormattedMessage id="digital"/></option>
              </select>
            </div>
            

            <div className="new-resource-input-container">
              <label className="new-resource-input-label" htmlFor="brand"><FormattedMessage id="brand" /> :</label>
              <input type="text" id="brand" name="brand" required value={formData.brand} onChange={handleChange} />
            </div>

            <div className="new-resource-input-container">
              <label className="new-resource-input-label" htmlFor="sourceId"><FormattedMessage id="sourceId"/> :</label>
              <input type="text" id="sourceId" name="sourceId" required value={formData.sourceId} onChange={handleChange} />
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
              <label className="new-resource-input-label" htmlFor="photo">Photo:</label>
              <input type="file" id="photo" name="photo" onChange={handleChange} />
            </div>
          </div>
          
        </div>

        <div className="new-resource-input-container description">
          <label className="new-resource-input-label" htmlFor="description"><FormattedMessage id="description"/> :</label>
          <input type="text" id="description" name="description" required value={formData.description} onChange={handleChange} />
        </div>

        
        <div className="suppliers-input-container">
          <h3 className="supplier-label"><FormattedMessage id="supplier"/></h3>
          <div className="new-resource-input-container">
            <label className="new-resource-input-label" htmlFor="suppliersName"><FormattedMessage id="name"/> :</label>
            <input type="text" id="suppliersName" name="name" placeholder="Supplier Name" required value={formData.suppliers[0].name} onChange={handleChange} />
          </div>

          <div className="new-resource-input-container">
            <label className="new-resource-input-label" htmlFor="suppliersContact"><FormattedMessage id="contact"/> :</label>
            <input type="text" id="suppliersContact" name="contact" placeholder="Supplier Contact" required value={formData.suppliers[0].contact} onChange={handleChange} />
          </div>
        </div>
  
        <button type="submit"><FormattedMessage id="save" /></button>
      </form>
    );
  };

export default NewResource;