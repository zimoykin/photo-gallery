export interface IUserFolder {
    id: string;
    profileId: string;

    title: string;
    bgColor: string;
    color: string;
    description: string;
    sortOrder: number;
}

export type IFolder = Omit<IUserFolder, 'id' | 'profileId'>;