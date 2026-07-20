import { useNavigate } from "react-router";
import type { Building } from "../../interfaces/buildings";
import "./ListCards.css";

interface ListCardsProps {
    data: any;
    isLoading: boolean;
    isError: boolean;
}

const slugify = (name: string) => name.trim().toLowerCase().replace(/\s+/g, "-");

export const ListCards = ({ data, isLoading, isError }: ListCardsProps) => {

    const navigate = useNavigate();
    const buildings = data?.data.buildings ?? [];

    return (
        <section className="building-table">
            <h2>Aventura</h2>

            {isLoading && <p>Loading buildings...</p>}
            {isError && <p>Failed to load buildings.</p>}

            {!isLoading && !isError && (
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
                        {buildings.map((building: Building) => (
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
            )}
        </section>
    )
};
