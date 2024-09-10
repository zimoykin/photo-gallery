import { useCallback, useEffect, useState } from "react";
import React from 'react';
import Folder from "./folder-component";
import { apiFetchUserFolders, IUserFolder } from "../../api/api-gallery";
import { useDispatch } from "react-redux";
import { storeFolders } from "../../features/folders/folders-slice";
import { useNavigate } from "react-router-dom";
import FolderSpinnerComponent from "./folder-spinner-component";
import './styles/folders-style.css';

const Folders: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [folders, setFolders] = useState<IUserFolder[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const getFolderSize = useCallback((ini: number = 100) => {
        const foldersMax = Math.max(4, folders.length);
        return `${ini / Math.min(foldersMax, 10)}vh`;
    }, [folders.length]);

    useEffect(() => {
        setIsLoading(true);
        apiFetchUserFolders().then((folders) => {
            console.log(folders);
            dispatch(
                storeFolders(folders)
            );
            setFolders(folders);
            setLineSize(getFolderSize());
        }).finally(() => {
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }).catch(() => {
            setIsLoading(false);
            navigate('/login');
        });
    }, [dispatch, navigate, getFolderSize]);


    const [lineSize, setLineSize] = useState(getFolderSize());
    const [openLineSize] = useState('75vh'); //TODO
    const [choosen, setChoosen] = useState(-1);

    const onClickLine = (ind: number) => {
        if (ind === choosen) {
            setChoosen(-1);
            setLineSize(getFolderSize());
        } else {
            setChoosen(ind);
            setLineSize(getFolderSize(50));
        }
    };

    return (
        <div style={{}}>
            {isLoading ? <FolderSpinnerComponent /> : <>
                {
                    folders.map((folder, index) => {
                        return (
                            <Folder
                                bgColor={folder.bgColor}
                                textColor={folder.color}
                                text={folder.title}
                                isOpen={index === choosen ? true : undefined}
                                lineSize={index === choosen ? openLineSize : lineSize}
                                key={index}
                                folderId={folder.id}
                                onClick={() => { onClickLine(index); }}
                            />
                        );
                    })
                } </>}
        </div>
    );
};

export default Folders;