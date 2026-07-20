import { MapPinned } from "lucide-react";
import type { Building } from "../../interfaces/buildings";
import "./SideList.css";

interface ListCardsProps {
    data: any;
    isLoading: boolean;
    isError: boolean;
    className?: string;
}

export const SideList = ({ data, isLoading, isError, className }: ListCardsProps) => {

    const buildings = data?.data.buildings ?? [];

    return (
        <section className={`side-list${className ? ` ${className}` : ""}`}>
            {isLoading && <p>Loading buildings...</p>}
            {isError && <p>Failed to load buildings.</p>}
            <h2 className="side-list-title">Aventura</h2>

            <ul className="side-list-items">
                {buildings.map((building: Building) => (
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
        </section>
    )
};
