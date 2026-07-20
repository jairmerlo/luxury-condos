import { useMemo } from "react";
import { useNavigate } from "react-router";
import type { Building } from "../../interfaces/buildings";
import "./ListCards.css";

interface ListCardsProps {
    data: any;
    isLoading: boolean;
    isError: boolean;
}

const slugify = (name: string) => name.trim().toLowerCase().replace(/\s+/g, "-");

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

export const ListCards = ({ data, isLoading, isError }: ListCardsProps) => {

    const navigate = useNavigate();
    const buildings = data?.data.buildings ?? [];
    const groups = useMemo(() => groupByNeighborhood(buildings), [buildings]);

    return (
        <section className="building-table">
            {isLoading && <p>Loading buildings...</p>}
            {isError && <p>Failed to load buildings.</p>}

            {!isLoading && !isError && groups.map((group) => (
                <div key={group.neighborhood} className="building-table__group">
                    <h2>{group.neighborhood}</h2>

                    <table>
                        <thead>
                            <tr>
                                <th>Building Name</th>
                                <th>Address</th>
                                <th>Units</th>
                                <th>Floors</th>
                                <th>Year</th>
                            </tr>
                        </thead>

                        <tbody>
                            {group.buildings.map((building) => (
                                <tr
                                    key={building.id}
                                    className="building-row"
                                    onClick={() => navigate(`/building/${slugify(building.name)}`)}
                                >
                                    <td>{building.name}</td>
                                    <td>{building.address}</td>
                                    <td>{building.beds}</td>
                                    <td>{building.floors}</td>
                                    <td>{building.year}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </section>
    )
};
