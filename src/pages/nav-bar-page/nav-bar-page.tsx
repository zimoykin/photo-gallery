import React, { ReactElement, useEffect } from "react";
import NavBar from "../../components/nav-bar/nav-bar-component";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import "./nav-bar-page-style.css";
import { useNavigate } from "react-router-dom";

interface Props {
    // eslint-disable-next-line
    child: ReactElement;
    secure?: boolean;
}

export const NavBarPage: React.FC<Props> = (
    { child }: Props
) => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const navigate = useNavigate();
    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    return (<div className="page-nav-bar">
        {isAuthenticated && <>
            <NavBar />
            {child}
        </>}
    </div>);
};