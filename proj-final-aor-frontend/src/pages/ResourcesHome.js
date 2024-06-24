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
import { useLocation } from "react-router";

const ResourcesHome = () => {
    const location = useLocation();
    const {locale, token} = userStore();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [componentsTotal, setComponentsTotal] = useState(0);

    const [resourcesData, setResourcesData] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [brands, setBrands] = useState([]);

    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get('type');
    const brand = queryParams.get('brand');
    const supplier = queryParams.get('supplier');

    useEffect(() => {
        const handleResize = () => {
          setIsMobile(window.innerWidth <= 768);
        };
    
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

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

            console.log(responseResources);
        }
        fetchData();
    }, [token]);

    useEffect(() => {
        console.log("Type: ", type);
        console.log("Brand: ", brand);
        console.log("Supplier: ", supplier);
    
        const fetchData = async () => {
            let responseResources;
            
            if (!type && !brand && !supplier) {
                responseResources = await ResourceService.getAllResources();
            } else {
                responseResources = await ResourceService.getResourcesFiltered(type, brand, supplier);
            }
    
            if (responseResources) {
                setResourcesData(responseResources);
                setComponentsTotal(responseResources.length);
            }
    
            console.log(responseResources);
        }
        fetchData();
    }, [type, brand, supplier]);

    return (
        <div>
            <Header />
            <FilterBar locale={locale} componentsTotal={componentsTotal}/>

            <IntlProvider locale={locale} messages={languages[locale]}>
                <div className="resources-home-container">
                {!isMobile && (
                    <div className="resources-home-left-container">
                        <FilterOptions
                        locale={locale}
                        isResourcesFilter={true}
                        suppliers={suppliers}
                        brands={brands}
                        />
                    </div>
                    )}
                    <div className="resources-home-right-container">
                        {resourcesData.map(resource => (
                            <ResourceInfo 
                                key={resource.id} 
                                photo={resource.photo} 
                                id={resource.id} 
                                name={resource.name} 
                                brand={resource.brand}
                                type={resource.type}
                                projectsNumber={resource.projectsNumber}
                            />
                        ))}
                    </div>
                </div>
            </IntlProvider>
            
            
        </div>
    );
};

export default ResourcesHome;