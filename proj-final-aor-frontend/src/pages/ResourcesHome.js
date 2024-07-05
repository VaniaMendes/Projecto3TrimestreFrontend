import React, { useEffect, useState } from "react";
import './ResourcesHome.css';
import Header from "../components/header/Header";
import FilterBar from "../components/header/FilterBar";
import { userStore } from "../stores/UserStore";
import FilterOptions from "../components/FilterOptions";
import SupplierService from "../services/SupplierService";
import ResourceService from "../services/ResourceService";
import ResourceInfo from "../components/resources/ResourceInfo";
import { useLocation, useNavigate } from "react-router";
import SliderContainer from "../components/SliderContainer";
import { useActionsStore } from "../stores/ActionStore";

const ResourcesHome = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {token} = userStore();
    const { isSliderOpen } = useActionsStore();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [componentsTotal, setComponentsTotal] = useState(0);

    const [resourcesData, setResourcesData] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [brands, setBrands] = useState([]);

    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get('type');
    const brand = queryParams.get('brand');
    const supplier = queryParams.get('supplier');
    const sort = queryParams.get('sort');
    const nameSort = queryParams.get('name');
    const projectsSort = queryParams.get('projects');

    useEffect(() => {
        if (!token) {
            navigate("/");
        }
    }, [token, navigate]);

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

            if (responseSuppliers) {
                setSuppliers(responseSuppliers);
            }

            if (responseBrands) {
                setBrands(responseBrands);
            }
        };
        fetchData();
    }, [token]);

    useEffect(() => {
        const fetchData = async () => {
            let responseResources;

            if (!sort && !nameSort && !projectsSort){
                responseResources = await ResourceService.getAllResources("desc", null, null);
            } else if (!type && !brand && !supplier) {
                responseResources = await ResourceService.getAllResources(sort, nameSort, projectsSort);
            } else {
                responseResources = await ResourceService.getResourcesFiltered(type, brand, supplier, sort, nameSort, projectsSort);
            }

            if (responseResources) {
                setResourcesData(responseResources);
                setComponentsTotal(responseResources.length);
            }
        };
        fetchData();
    }, [type, brand, supplier, sort, nameSort, projectsSort, location.search]);

    return (
        <div>
            <Header />
            <FilterBar componentsTotal={componentsTotal} />
            
                <div className="resources-home-container">
                    {!isMobile && (
                        <div className="resources-home-left-container">
                            <FilterOptions
                                isResourcesSideFilter={true}
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
                    {isMobile && (
                        <SliderContainer isOpen={isSliderOpen} isResourcesPage={true}>
                            <FilterOptions 
                                isResourcesSideFilter={true}
                                suppliers={suppliers}
                                brands={brands}
                            />
                        </SliderContainer>
                    )}
                </div>
            
        </div>
    );
};

export default ResourcesHome;