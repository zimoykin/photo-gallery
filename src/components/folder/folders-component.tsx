import React, { useEffect, useState } from 'react';
import Folder from "./folder-component";
import { apiFetchUserFolders, IUserFolder } from "../../api/api-gallery";
import { useDispatch } from "react-redux";
import { storeFolders } from "../../features/folders/folders-slice";
import { useParams, useSearchParams } from "react-router-dom";
import FolderSpinnerComponent from "./folder-spinner-component";
import './styles/folders-style.css';

const Folders: React.FC = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const { userId } = useParams<{ userId: string; }>();
    const [folders, setFolders] = useState<IUserFolder[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [choosen, setChoosen] = useState(-1);

    useEffect(() => {
        const folderIdFromSearchParams = searchParams.get('folderId');
        if (folderIdFromSearchParams && folders.length > 0) {
            const index = folders.findIndex(f => f.id === folderIdFromSearchParams);
            if (index >= 0) {
                setChoosen(index);
            }
        }
    }, [folders, searchParams]);

    useEffect(() => {
        if (userId) {
            setIsLoading(true);
            apiFetchUserFolders(userId)
                .then((folders) => {
                    dispatch(
                        storeFolders(folders)
                    );
                    setFolders(folders);
                })
                .finally(() => {
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 1000);
                })
                .catch((error) => {
                    console.error(error);
                    setFolders([]);
                    setIsLoading(false);
                });
        }
    }, [dispatch, userId]);

    const onClickLine = (ind: number) => {
        if (ind === choosen) {
            setChoosen(-1);
            setSearchParams({ });
        } else {
            setChoosen(ind);
            const folderId = folders[ind].id;
            setSearchParams({ folderId });
        }
    };

    return (
        <div className="folder-container">
            {isLoading ? <FolderSpinnerComponent /> : <>
                {
                    folders?.map((folder, index) => {
                        return (
                            <Folder
                                bgColor={folder.bgColor}
                                textColor={folder.color}
                                text={folder.title}
                                isOpen={index === choosen ? true : undefined}
                                key={index}
                                folderId={folder.id}
                                onClick={() => { onClickLine(index); }}
                            />
                        );
                    })
                }
            </>}
        </div>
    );
};

export default Folders;