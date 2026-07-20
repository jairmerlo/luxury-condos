import { ChevronDown, List, MapPin, Search } from "lucide-react";
import { useAppDispatch, useUi } from "../../app/hooks";
import { setNameSelected, setNeighborhoodSelected, setTypeOfView } from "../../app/slices/ui";
import "./Navbar.css";

export const Navbar = () => {
    const dispatch = useAppDispatch();
    const { allBuildingNames, neighborhoods, nameSelected, neighborhoodSelected, typeOfView } = useUi();

    return (
        <nav className="navbar">
            <div className="navbar__search">
                <input
                    type="text"
                    placeholder="Search Condos"
                />

                <button>
                    <Search size={20} />
                </button>
            </div>

            <div className="navbar__select">
                <select
                    value={nameSelected}
                    onChange={(e) => dispatch(setNameSelected(e.target.value))}
                >
                    <option value="">Condos by Name</option>
                    {allBuildingNames.map((name) => (
                        <option key={name} value={name}>{name}</option>
                    ))}
                </select>
                <ChevronDown size={18} />
            </div>

            <div className="navbar__select">
                <select
                    value={neighborhoodSelected}
                    onChange={(e) => dispatch(setNeighborhoodSelected(e.target.value))}
                >
                    <option value="">All Neighborhoods</option>
                    {neighborhoods.map((neighborhood) => (
                        <option key={neighborhood.id} value={neighborhood.name}>{neighborhood.name}</option>
                    ))}
                </select>
                <ChevronDown size={18} />
            </div>

            <div className="navbar__view">
                <button className={typeOfView === "list" ? "active" : ""} onClick={() => dispatch(setTypeOfView("list"))}>
                    <span>List</span>
                    <List size={18} />
                </button>

                <button className={typeOfView === "map" ? "active" : ""} onClick={() => dispatch(setTypeOfView("map"))}>
                    <span>Map</span>
                    <MapPin size={18} />
                </button>
            </div>
        </nav>
    )
};
