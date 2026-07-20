import "./MapViewInfo.css";

interface MapViewInfoProps {
    title: string;
    buildingName: string;
    address: string;
    unitBuilding: number;
    year: number;
    url: string;
    onClose?: () => void;
}

export const MapViewInfo = ({
    title,
    buildingName,
    address,
    unitBuilding,
    year,
    url,
    onClose,
}: MapViewInfoProps) => {
    return (
        <div className="mapview-container">
            <div className="mapview-header">
                <h2>{title}</h2>

                <button
                    type="button"
                    className="closeInfo"
                    onClick={onClose}
                    aria-label="Close"
                >
                    &times;
                </button>
            </div>

            <div className="mapview-body">
                <div className="mapview-item">
                    <h2 title={buildingName}>
                        <span>{buildingName}</span>
                    </h2>

                    <ul>
                        <li className="address">
                            <span>{address}</span>
                        </li>

                        <li className="details">
                            <span>Units:&nbsp;{unitBuilding}</span>
                            <span>Year:&nbsp;{year}</span>
                        </li>
                    </ul>

                    <a
                        href={url}
                        title={buildingName}
                        target="_blank"
                        rel="noopener noreferrer"
                    />
                </div>
            </div>
        </div>
    );
};