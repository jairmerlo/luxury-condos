import { useEffect } from "react";
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
        name: nameSelected,
        neighborhood: neighborhoodSelected,
        page: 1,
        limit: 1000,
    });

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
                    <MapView data={data} isLoading={isLoading} isError={isError} />
                ) : (
                    <ListCards data={data} isLoading={isLoading} isError={isError} />
                )
            }
        </>
    )
};
