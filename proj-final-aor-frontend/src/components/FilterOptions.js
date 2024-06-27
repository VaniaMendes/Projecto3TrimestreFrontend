import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useActionsStore } from '../stores/ActionStore';
import { IntlProvider, FormattedMessage } from 'react-intl';
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import languages from '../translations';

const FilterOptions = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { locale, suppliers, brands, isProjectsFilterBar, isProjectsMobileFilter, isResourcesSideFilter, isResourcesFilterBar } = props;
    const { stateId, sortBy, vacancies, updateStateId, updateSortBy, updateVacancies, resetUseActionsStore } = useActionsStore();
    const [selectedState, setSelectedState] = useState(1);
    const [selectedSort, setSelectedSort] = useState("desc");
    const [stateSelected, setStateSelected] = useState(false);
    const [sortBySelected, setSortBySelected] = useState(false);
    const [selectedNameSort, setSelectedNameSort] = useState("");
    const [selectedProjectsSort, setSelectedProjectsSort] = useState("");

    const [selectedType, setSelectedType] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedSupplier, setSelectedSupplier] = useState("");

    useEffect(() => {
        resetUseActionsStore();
        setSelectedState(1);
        setSelectedSort("desc");
        setStateSelected(false);
        setSortBySelected(false);

        setSelectedType("");
        setSelectedBrand("");
        setSelectedSupplier("");
        setSelectedNameSort("");
        setSelectedProjectsSort("");
    }, [location.pathname]);

    useEffect(() => {
        setSelectedState(stateId);
        setSelectedSort(sortBy);
    }, [stateId, sortBy]);

    useEffect(() => {
        const currentPath = location.pathname;
        const newSearchParams = new URLSearchParams(location.search);

        // Set or delete 'type' parameter
        if (selectedType) {
            newSearchParams.set('type', selectedType);
        } else {
            newSearchParams.delete('type');
        }

        // Set or delete 'brand' parameter
        if (selectedBrand) {
            newSearchParams.set('brand', selectedBrand);
        } else {
            newSearchParams.delete('brand');
        }

        // Set or delete 'supplier' parameter
        if (selectedSupplier) {
            newSearchParams.set('supplier', selectedSupplier);
        } else {
            newSearchParams.delete('supplier');
        }

    
        navigate(`${currentPath}?${newSearchParams.toString()}`);
    }, [ selectedType, selectedBrand, selectedSupplier, location.pathname ]);

    useEffect(() => {
        const currentPath = location.pathname;
        const newSearchParams = new URLSearchParams(location.search);

        // Handle sort parameters ensuring only one is included at a time
        if (selectedSort) {
            newSearchParams.set('sort', selectedSort);
            newSearchParams.delete('name');
            newSearchParams.delete('projects');
        } else if (selectedNameSort) {
            newSearchParams.set('name', selectedNameSort);
            newSearchParams.delete('sort');
            newSearchParams.delete('projects');
        } else if (selectedProjectsSort) {
            newSearchParams.set('projects', selectedProjectsSort);
            newSearchParams.delete('sort');
            newSearchParams.delete('name');
        } else {
            // If none of the sort options are selected, ensure default option
            newSearchParams.set('sort', 'desc');
        }

        navigate(`${currentPath}?${newSearchParams.toString()}`);
    }, [ selectedSort, selectedNameSort, selectedProjectsSort, location.pathname ]);



    const handleStateChange = (event) => {
        const value = parseInt(event.target.value, 10);
        setSelectedState(value);
        updateStateId(value);
    };

    const handleSortChange = (event) => {
        setSelectedSort(event.target.value);
        
        if (isResourcesFilterBar) {
            setSelectedNameSort("");
            setSelectedProjectsSort("");
        }else {
            updateVacancies(false);
            updateSortBy(event.target.value);
        }
    };

    const handleVacanciesSortChange = (event) => {
        setSelectedSort(event.target.value);
        updateSortBy(event.target.value);
        updateVacancies(true);
    };

    const handleClickState = () => {
        setStateSelected(!stateSelected);
        setSortBySelected(false);
    };

    const handleClickSortBy = () => {
        setSortBySelected(!sortBySelected);
        setStateSelected(false);
    };

    const handleNameSortChange = (event) => {
        setSelectedSort("");
        setSelectedProjectsSort("");
        setSelectedNameSort(event.target.value);
    };

    const handleProjectsSortChange = (event) => {
        setSelectedSort("");
        setSelectedNameSort("");
        setSelectedProjectsSort(event.target.value);
    };

    const handleTypeChange = (event) => {
        const value = event.target.value;
       
        if (value === selectedType) {
            setSelectedType(''); 
            document.getElementById('type-none').checked = true;
        } else {
            setSelectedType(value);
        }
    };

    const handleBrandChange = (event) => {
        const value = event.target.value;
       
        if (value === selectedBrand) {
            setSelectedBrand(''); 
            document.getElementById('brand-none').checked = true;
        } else {
            setSelectedBrand(value);
        }
    };

    const handleSupplierChange = (event) => {
        const value = event.target.value;
        
        if (value === selectedSupplier) {
            setSelectedSupplier('');
            document.getElementById('supplier-none').checked = true;
        } else {
            setSelectedSupplier(value);
        }
    };


    if (isProjectsMobileFilter) {
        return (
            <IntlProvider locale={locale} messages={languages[locale]}>
                <div className="filter-options">
                    <p><FormattedMessage id="state" /></p>
                    <div>
                        <div className="radio-wrapper">
                            <input className="radio-input" type="radio" id="all" name="state" value={1} onChange={handleStateChange} checked={selectedState === 1} />
                            <label className="radio-label" htmlFor="all"><FormattedMessage id="all" /></label>
                        </div>
                        <div className="radio-wrapper">
                            <input className="radio-input" type="radio" id="planning" name="state" value={100} onChange={handleStateChange} checked={selectedState === 100} />
                            <label className="radio-label" htmlFor="planning"><FormattedMessage id="PLANNING" /></label>
                        </div>
                        <div className="radio-wrapper">
                            <input className="radio-input" type="radio" id="ready" name="state" value={200} onChange={handleStateChange} checked={selectedState === 200} />
                            <label className="radio-label" htmlFor="ready"><FormattedMessage id="READY" /></label>
                        </div>
                        <div className="radio-wrapper">
                            <input className="radio-input" type="radio" id="approved" name="state" value={300} onChange={handleStateChange} checked={selectedState === 300} />
                            <label className="radio-label" htmlFor="approved"><FormattedMessage id="APPROVED" /></label>
                        </div>
                        <div className="radio-wrapper">
                            <input className="radio-input" type="radio" id="inProgress" name="state" value={400} onChange={handleStateChange} checked={selectedState === 400} />
                            <label className="radio-label" htmlFor="inProgress"><FormattedMessage id="IN_PROGRESS" /></label>
                        </div>
                        <div className="radio-wrapper">
                            <input className="radio-input" type="radio" id="finished" name="state" value={500} onChange={handleStateChange} checked={selectedState === 500} />
                            <label className="radio-label" htmlFor="finished"><FormattedMessage id="FINISHED" /></label>
                        </div>
                        <div className="radio-wrapper">
                            <input className="radio-input" type="radio" id="cancelled" name="state" value={600} onChange={handleStateChange} checked={selectedState === 600} />
                            <label className="radio-label" htmlFor="cancelled"><FormattedMessage id="CANCELLED" /></label>
                        </div>
                    </div>
                </div>
                <div className="filter-options">
                    <p><FormattedMessage id="sortBy" /></p>
                    <div>
                        <div className="radio-wrapper">
                            <input className="radio-input" type="radio" id="newest" name="sort" value="desc" onChange={handleSortChange} checked={selectedSort === "desc" && !vacancies} />
                            <label className="radio-label" htmlFor="newest"><FormattedMessage id="newest" /></label>
                        </div>
                        <div className="radio-wrapper">
                            <input className="radio-input" type="radio" id="oldest" name="sort" value="asc" onChange={handleSortChange} checked={selectedSort === "asc" && !vacancies} />
                            <label className="radio-label" htmlFor="oldest"><FormattedMessage id="oldest" /></label>
                        </div>
                        <div className="radio-wrapper">
                            <input className="radio-input" type="radio" id="vacanciesLow" name="sort" value="asc" onChange={handleVacanciesSortChange} checked={selectedSort === "asc" && vacancies} />
                            <label className="radio-label" htmlFor="vacanciesLow"><FormattedMessage id="vacancies" /> : <FormattedMessage id="lowToHigh" /></label>
                        </div>
                        <div className="radio-wrapper">
                            <input className="radio-input" type="radio" id="vacanciesHigh" name="sort" value="desc" onChange={handleVacanciesSortChange} checked={selectedSort === "desc" && vacancies} />
                            <label className="radio-label" htmlFor="vacanciesHigh"><FormattedMessage id="vacancies" /> : <FormattedMessage id="highToLow" /></label>
                        </div>
                    </div>
                </div>
            </IntlProvider>
        );
    }

    if (isProjectsFilterBar) {
        return (
            <>
                <p className={stateSelected ? 'active-item' : ''} onClick={handleClickState}>
                    <FormattedMessage id="state" />
                    {stateSelected ? <MdArrowDropUp /> : <MdArrowDropDown />}
                </p>
                {stateSelected && (
                    <div className={`select-container ${stateSelected ? 'show' : ''}`}>
                        {/* State filter radio buttons */}
                        <div className="radio-wrapper">
                            <input className="radio-input" type="radio" id="all" name="state" value={1} onChange={handleStateChange} checked={selectedState === 1} />
                            <label className="radio-label" htmlFor="all"><FormattedMessage id="all" /></label>
                        </div>
                        <div className="radio-wrapper">
                            <input className="radio-input" type="radio" id="planning" name="state" value={100} onChange={handleStateChange} checked={selectedState === 100} />
                            <label className="radio-label" htmlFor="planning"><FormattedMessage id="PLANNING" /></label>
                        </div>
                        <div className="radio-wrapper">
                            <input className="radio-input" type="radio" id="ready" name="state" value={200} onChange={handleStateChange} checked={selectedState === 200} />
                            <label className="radio-label" htmlFor="ready"><FormattedMessage id="READY" /></label>
                        </div>
                        <div className="radio-wrapper">
                            <input className="radio-input" type="radio" id="approved" name="state" value={300} onChange={handleStateChange} checked={selectedState === 300} />
                            <label className="radio-label" htmlFor="approved"><FormattedMessage id="APPROVED" /></label>
                        </div>
                        <div className="radio-wrapper">
                            <input className="radio-input" type="radio" id="inProgress" name="state" value={400} onChange={handleStateChange} checked={selectedState === 400} />
                            <label className="radio-label" htmlFor="inProgress"><FormattedMessage id="IN_PROGRESS" /></label>
                        </div>
                        <div className="radio-wrapper">
                            <input className="radio-input" type="radio" id="finished" name="state" value={500} onChange={handleStateChange} checked={selectedState === 500} />
                            <label className="radio-label" htmlFor="finished"><FormattedMessage id="FINISHED" /></label>
                        </div>
                        <div className="radio-wrapper">
                            <input className="radio-input" type="radio" id="cancelled" name="state" value={600} onChange={handleStateChange} checked={selectedState === 600} />
                            <label className="radio-label" htmlFor="cancelled"><FormattedMessage id="CANCELLED" /></label>
                        </div>
                    </div>
                )}
                <p className={sortBySelected ? 'active-item' : ''} onClick={handleClickSortBy}>
                    <FormattedMessage id="sortBy" />
                    {sortBySelected ? <MdArrowDropUp /> : <MdArrowDropDown />}
                </p>
                {sortBySelected && (
                    <div className={`select-container ${sortBySelected ? 'show' : ''}`}>
                        {/* Sort by radio buttons */}
                        <div className="radio-wrapper">
                            <input className="radio-input" type="radio" id="newest" name="sort" value="desc" onChange={handleSortChange} checked={selectedSort === "desc" && !vacancies} />
                            <label className="radio-label" htmlFor="newest"><FormattedMessage id="newest" /></label>
                        </div>
                        <div className="radio-wrapper">
                            <input className="radio-input" type="radio" id="oldest" name="sort" value="asc" onChange={handleSortChange} checked={selectedSort === "asc" && !vacancies} />
                            <label className="radio-label" htmlFor="oldest"><FormattedMessage id="oldest" /></label>
                        </div>
                        <div className="radio-wrapper">
                            <input className="radio-input" type="radio" id="vacanciesLow" name="sort" value="asc" onChange={handleVacanciesSortChange} checked={selectedSort === "asc" && vacancies} />
                            <label className="radio-label" htmlFor="vacanciesLow"><FormattedMessage id="vacancies" /> : <FormattedMessage id="lowToHigh" /></label>
                        </div>
                        <div className="radio-wrapper">
                            <input className="radio-input" type="radio" id="vacanciesHigh" name="sort" value="desc" onChange={handleVacanciesSortChange} checked={selectedSort === "desc" && vacancies} />
                            <label className="radio-label" htmlFor="vacanciesHigh"><FormattedMessage id="vacancies" /> : <FormattedMessage id="highToLow" /></label>
                        </div>
                    </div>
                )}
            </>
        );
    }

    if (isResourcesSideFilter) {
        return (
            <div className='resources-side-filter'>
                <p className='resource-filter-label'>
                <FormattedMessage id="type" />
                </p>
                <div className='resource-filter-type-container'>
                    <input
                        type="radio"
                        id="type-none"
                        name="type"
                        value=""
                        onChange={handleTypeChange}
                        style={{ display: 'none' }}
                        checked={selectedType === ''}
                    />
                    <div className="radio-wrapper">
                        <input 
                            className="radio-input" 
                            type="radio" 
                            id="digital" 
                            name="type" 
                            value={"DIGITAL"} 
                            onChange={handleTypeChange}
                            onClick={(e) => {
                                if (selectedType === "DIGITAL") {
                                    handleTypeChange(e);
                                }
                            }}
                            checked={selectedType === "DIGITAL"} 
                        />
                        <label className="radio-label" htmlFor="digital"><FormattedMessage id="digital" /></label>
                    </div>
                    <div className="radio-wrapper">
                        <input 
                            className="radio-input" 
                            type="radio" 
                            id="material" 
                            name="type" 
                            value={"MATERIAL"} 
                            onChange={handleTypeChange}
                            onClick={(e) => {
                                if (selectedType === "MATERIAL") {
                                    handleTypeChange(e);
                                }
                            }}
                            checked={selectedType === "MATERIAL"} 
                        />
                        <label className="radio-label" htmlFor="material"><FormattedMessage id="material" /></label>
                    </div>
                </div>
                <p className='resource-filter-label'>
                    <FormattedMessage id="brand" />
                </p>
                <div className='resource-filter-brand-container'>
                    <input
                        type="radio"
                        id="brand-none"
                        name="brand"
                        value=""
                        onChange={handleBrandChange}
                        style={{ display: 'none' }}
                        checked={selectedBrand === ''}
                    />
                    {brands.map((brand, index) => (
                        <div className="radio-wrapper" key={index}>
                            <input
                                className="radio-input"
                                type="radio"
                                id={`brand-${index}`}
                                name="brand"
                                value={brand}
                                onChange={handleBrandChange}
                                onClick={(e) => {
                                    if (selectedBrand === brand) {
                                        handleBrandChange(e);
                                    }
                                }}
                                checked={selectedBrand === brand}
                            />
                            <label className="radio-label" htmlFor={`brand-${index}`}>
                                {brand}
                            </label>
                        </div>
                    ))}
                </div>

                <p className='resource-filter-label'>
                    <FormattedMessage id="supplier" />
                </p>
                <div className='resource-filter-supplier-container'>
                    <input
                        type="radio"
                        id="supplier-none"
                        name="supplier"
                        value=""
                        onChange={handleSupplierChange}
                        style={{ display: 'none' }}
                        checked={selectedSupplier === ''}
                    />
                    {suppliers.map((supplier) => (
                        <div className="radio-wrapper" key={supplier.id}>
                            <input
                                className="radio-input"
                                type="radio"
                                id={`supplier-${supplier.id}`}
                                name="supplier"
                                value={supplier.id}
                                onChange={handleSupplierChange}
                                checked={selectedSupplier === supplier.id}
                            />
                            <label className="radio-label" htmlFor={`supplier-${supplier.id}`}>
                                {supplier.name}
                            </label>
                        </div>
                    ))}
                </div>
        </div>
        );
    }

    if (isResourcesFilterBar) {
        return (
            <>
                <p className={sortBySelected ? 'active-item' : ''} onClick={handleClickSortBy}>
                    <FormattedMessage id="sortBy" />
                    {sortBySelected ? <MdArrowDropUp /> : <MdArrowDropDown />}
                </p>
                {sortBySelected && (
                    <div className={`select-container ${sortBySelected ? 'show' : ''}`}>
                        {/* Sort by radio buttons */}
                        <div className="radio-wrapper">
                            <input className="radio-input" type="radio" id="newest" name="sort" value="desc" onChange={handleSortChange} checked={selectedSort === "desc"} />
                            <label className="radio-label" htmlFor="newest"><FormattedMessage id="newest" /></label>
                        </div>
                        <div className="radio-wrapper">
                            <input className="radio-input" type="radio" id="oldest" name="sort" value="asc" onChange={handleSortChange} checked={selectedSort === "asc"} />
                            <label className="radio-label" htmlFor="oldest"><FormattedMessage id="oldest" /></label>
                        </div>
                        <div className="radio-wrapper">
                            <input className="radio-input" type="radio" id="nameAsc" name="sort" value="asc" onChange={handleNameSortChange} checked={selectedNameSort === "asc"} />
                            <label className="radio-label" htmlFor="nameAsc"><FormattedMessage id="name" /> : <FormattedMessage id="aToZ" /></label>
                        </div>
                        <div className="radio-wrapper">
                            <input className="radio-input" type="radio" id="nameDesc" name="sort" value="desc" onChange={handleNameSortChange} checked={selectedNameSort === "desc"} />
                            <label className="radio-label" htmlFor="nameDesc"><FormattedMessage id="name" /> : <FormattedMessage id="zToA" /></label>
                        </div>
                        <div className="radio-wrapper">
                            <input className="radio-input" type="radio" id="projectsHigh" name="sort" value="desc" onChange={handleProjectsSortChange} checked={selectedProjectsSort === "desc" } />
                            <label className="radio-label" htmlFor="projectsHigh"><FormattedMessage id="projects" /> : <FormattedMessage id="highToLow" /></label>
                        </div>
                        <div className="radio-wrapper">
                            <input className="radio-input" type="radio" id="projectsLow" name="sort" value="asc" onChange={handleProjectsSortChange} checked={selectedProjectsSort === "asc"} />
                            <label className="radio-label" htmlFor="projectsLow"><FormattedMessage id="projects" /> : <FormattedMessage id="lowToHigh" /></label>
                        </div>
                    </div>
                )}
            </>
        );
    }


    return null;
};

export default FilterOptions;