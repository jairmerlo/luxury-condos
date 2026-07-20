import { useEffect, useMemo } from "react";
import { useGetBuildingsQuery } from "../../app/api/getBuildings";
import { useAppDispatch, useUi } from "../../app/hooks";
import { setBuildingsFilters } from "../../app/slices/ui";
import { Header } from "../../components";
import { ListCards } from "../../components/ListCards";
import { MapView } from "../../components/MapView";

export const PropertiesList = () => {
    const { nameSelected, neighborhoodSelected, typeOfView } = useUi();

    const dispatch = useAppDispatch();
    const { data, isLoading, isError } = useGetBuildingsQuery({
        page: 1,
        limit: 1000,
    });

    const filteredData = useMemo(() => {
        if (!data) return data;

        const buildings = [...data.data.buildings]
            .sort((a, b) => a.neighborhood.localeCompare(b.neighborhood))
            .filter((building) => !nameSelected || building.name.toLowerCase().includes(nameSelected.toLowerCase()))
            .filter((building) => !neighborhoodSelected || building.neighborhood === neighborhoodSelected);

        return { ...data, data: { ...data.data, buildings } };
    }, [data, nameSelected, neighborhoodSelected]);

    useEffect(() => {
        if (!data) return;

        dispatch(setBuildingsFilters({
            allBuildingNames: data.data.all_building_names,
            neighborhoods: data.data.neighborhoods,
        }));
    }, [data, dispatch]);

    return (
        <>
            <Header />
            {
                typeOfView === "map" ? (
                    <MapView data={filteredData} isLoading={isLoading} isError={isError} />
                ) : (
                    <ListCards data={filteredData} isLoading={isLoading} isError={isError} />
                )
            }
        </>
    )
};
