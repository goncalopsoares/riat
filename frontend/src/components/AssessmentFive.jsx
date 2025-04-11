import { useProject } from "../contexts/ProjectContext";

const AssessmentFive = ({ allDimensions, dimensionsNumber, currentDimension, setCurrentDimension }) => {

    const { error, success, loading } = useProject();

    return (
        <>
            {allDimensions.length > 0 && (
                <>
                    <div style={{
                        backgroundColor: "#e0e0e0",
                        borderRadius: "8px",
                        height: "0.5rem",
                        width: "100%",
                        margin: "20px 0",
                        overflow: "hidden"
                    }}>
                        <div style={{
                            width: `${(currentDimension + 1 / dimensionsNumber) * 100}%`,
                            backgroundColor: "#4285F4",
                            height: "100%",
                            borderRadius: "8px",
                            transition: "width 0.3s ease-in-out"
                        }}>
                        </div>
                    </div>
                    <div>
                        <h1>{allDimensions[currentDimension].dimension_name}</h1>
                        <p>{allDimensions[currentDimension].dimension_description}</p>
                    </div>
                </>
            )}
        </>
    );
};

export default AssessmentFive;