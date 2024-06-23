import React, { useEffect, useState } from "react";
import './ResourcesHome.css';
import Header from "../components/header/Header";
import FilterBar from "../components/header/FilterBar";
import { userStore } from "../stores/UserStore";
import FilterOptions from "../components/FilterOptions";
import { IntlProvider } from "react-intl";
import languages from "../translations";
import SupplierService from "../services/SupplierService";
import ResourceService from "../services/ResourceService";
import ResourceInfo from "../components/resources/ResourceInfo";

const ResourcesHome = () => {
    const {locale, token} = userStore();
    const [componentsTotal, setComponentsTotal] = useState(0);

    const [resourcesData, setResourcesData] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const responseSuppliers = await SupplierService.getAllSuppliers();
            const responseBrands = await ResourceService.getAllBrands();
            const responseResources = await ResourceService.getAllResources();

            if (responseSuppliers) {
                setSuppliers(responseSuppliers);
            }

            if (responseBrands) {
                setBrands(responseBrands);
            }

            if (responseResources) {
                setResourcesData(responseResources);
                setComponentsTotal(responseResources.length);
            }
        }
        fetchData();
    }, [token]);

    return (
        <div>
            <Header />
            <FilterBar locale={locale} componentsTotal={componentsTotal}/>

            <IntlProvider locale={locale} messages={languages[locale]}>
                <div className="resources-home-container">
                    <div className="resources-home-left-container">
                        <FilterOptions 
                            locale={locale} 
                            isResourcesFilter={true} 
                            suppliers={suppliers} 
                            brands={brands}
                        />
                    </div>
                    <div className="resources-home-right-container">
                        {resourcesData.map(resource => (
                            <ResourceInfo 
                                key={resource.id} 
                                photo={resource.photo} 
                                id={resource.id} 
                                name={resource.name} 
                                brand={resource.brand}
                            />
                        ))}
                    </div>
                </div>
            </IntlProvider>
            
            
        </div>
    );
};

export default ResourcesHome;