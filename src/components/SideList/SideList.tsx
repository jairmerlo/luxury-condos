import { useMemo } from "react";
import { MapPinned } from "lucide-react";
import type { Building } from "../../interfaces/buildings";
import "./SideList.css";

interface ListCardsProps {
    data: any;
    isLoading: boolean;
    isError: boolean;
    className?: string;
}

const groupByNeighborhood = (buildings: Building[]) => {
    const groups: Array<{ neighborhood: string; buildings: Building[] }> = [];

    buildings.forEach((building) => {
        const lastGroup = groups[groups.length - 1];
        if (lastGroup && lastGroup.neighborhood === building.neighborhood) {
            lastGroup.buildings.push(building);
        } else {
            groups.push({ neighborhood: building.neighborhood, buildings: [building] });
        }
    });

    return groups;
};

export const SideList = ({ data, isLoading, isError, className }: ListCardsProps) => {

    const buildings = data?.data.buildings ?? [];
    const groups = useMemo(() => groupByNeighborhood(buildings), [buildings]);

    return (
        <section className={`side-list${className ? ` ${className}` : ""}`}>
            {isLoading && <p>Loading buildings...</p>}
            {isError && <p>Failed to load buildings.</p>}

            <ul className="side-list-items">
                {groups.map((group) => (
                    <li key={group.neighborhood} className="side-list-group">
                        <h2 className="side-list-title">{group.neighborhood}</h2>

                        <ul className="side-list-group-items">
                            {group.buildings.map((building) => (
                                <li key={building.id} className="side-list-item">
                                    <div className="side-list-info">
                                        <h3>{building.name}</h3>
                                        <p>{building.address}</p>
                                    </div>

                                    <button className="map-button">
                                        <MapPinned size={20} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </section>
    )
};
