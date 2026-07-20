export interface Building {
    id: string;
    name: string;
    year: string;
    beds: string;
    floors: string;
    city: string;
    codBuilding: string;
    coduser_cpanel: string;
    type_building: string;
    neighborhood: string;
    neighborhood_ids: string[];
    address: string;
    lat?: string | number;
    lng?: string | number;
    unitBuilding: string
}

export interface Neighborhood {
    id: string;
    name: string;
}

export interface GetBuildingsData {
    buildings: Building[];
    neighborhoods: Neighborhood[];
    all_building_names: string[];
}

export interface GetBuildingsPagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export interface GetBuildingsResponse {
    success: true;
    data: GetBuildingsData;
    pagination: GetBuildingsPagination;
}

export interface GetBuildingsParams {
    page?: number;
    limit?: number;
    name?: string;
    neighborhood?: string;
}