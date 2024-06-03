import React from "react";
import Header from "../components/header/Header";
import FilterBar from "../components/FilterBar";
import {userStore} from "../stores/UserStore";

const Home = () => {
    const {token, userData, locale} = userStore();

    return (
        <div>
            <Header />
            <FilterBar locale={locale}/>
            <h1>Home</h1>
        </div>
    );
};

export default Home;