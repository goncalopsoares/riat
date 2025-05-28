import { useEffect, useRef, useState } from "react";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import OpenWithIcon from '@mui/icons-material/OpenWith';

const AssessmentNavigation = ({
    existingAnswers,
    topLevelDimensions,
    currentIndex,
    setCurrentDimension
}) => {
    const [expanded, setExpanded] = useState(true);
    const contentRef = useRef(null);
    const [maxHeight, setMaxHeight] = useState("0px");
    const [highestDimensionOrder, setHighestDimensionOrder] = useState(0);


    const [position, setPosition] = useState({ top: window.innerHeight * 0.25, right: 16 });
    const dragData = useRef({ isDragging: false, startX: 0, startY: 0, startTop: 0, startRight: 0 });


    useEffect(() => {
        if (!existingAnswers || typeof existingAnswers !== 'object') {
            setHighestDimensionOrder(0);
            return;
        }

        const values = Object.values(existingAnswers);
        if (!Array.isArray(values) || values.length === 0) {
            setHighestDimensionOrder(0);
            return;
        }

        const dimensionOrders = values
            .map(a => typeof a.dimension_order === 'number' ? a.dimension_order : 0);

        const calculatedOrder = Math.max(...dimensionOrders);

        setHighestDimensionOrder(calculatedOrder);
    }, [existingAnswers]);


    useEffect(() => {
        if (expanded) {
            setMaxHeight(`${contentRef.current.scrollHeight + 200}px`);
        } else {
            setMaxHeight("4rem");
        }
    }, [expanded, topLevelDimensions]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!dragData.current.isDragging) return;
            e.preventDefault();

            const deltaX = dragData.current.startX - e.clientX;
            const deltaY = e.clientY - dragData.current.startY;

            let newTop = dragData.current.startTop + deltaY;
            let newRight = dragData.current.startRight + deltaX;

            newTop = Math.max(0, Math.min(window.innerHeight - contentRef.current.offsetHeight, newTop));
            newRight = Math.max(0, Math.min(window.innerWidth - 100, newRight));

            setPosition({ top: newTop, right: newRight });
        };

        const handleMouseUp = () => {
            dragData.current.isDragging = false;
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    const handleMouseDown = (e) => {
        e.preventDefault();
        dragData.current = {
            isDragging: true,
            startX: e.clientX,
            startY: e.clientY,
            startTop: position.top,
            startRight: position.right,
        };
    };

    if (!Array.isArray(topLevelDimensions) || topLevelDimensions.length === 0) {
        return null;
    }

    return (
        <nav
            style={{
                position: 'fixed',
                top: position.top,
                right: position.right,
                width: '22.5vw',
                maxHeight: maxHeight,
                backgroundColor: 'rgba(0, 139, 190, 0.2)',
                boxShadow: '-2px 0 5px rgba(0,0,0,0.1)',
                padding: '1rem',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease',
                borderBottomLeftRadius: '8px',
                borderBottomRightRadius: '8px',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                cursor: dragData.current.isDragging ? 'grabbing' : 'default',
                userSelect: dragData.current.isDragging ? 'none' : 'auto',
            }}
        >
            <div className="d-flex flex-row mb-4">
                <button onMouseDown={handleMouseDown} className="btn btn-dark" style={{ cursor: 'grab' }}><OpenWithIcon /></button>
                <button
                    onClick={() => setExpanded(!expanded)}
                    style={{
                        alignSelf: "flex-end",
                        marginBottom: "0.5rem",
                        background: "none",
                        border: "none",
                        fontSize: "1rem",
                        userSelect: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        cursor: 'pointer'
                    }}
                    aria-expanded={expanded}
                    aria-label={expanded ? "Hide navigation" : "Expand navigation"}
                >
                    {expanded ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                    {expanded ? <b>Hide dimensions</b> : <b>Show dimensions</b>}
                </button>
            </div>
            <div ref={contentRef} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexWrap: 'wrap' }}>
                {topLevelDimensions.map((dim, idx) => {
                    const isCurrent = idx === currentIndex;
                    const isEnabled = dim.dimension_order <= highestDimensionOrder;

                    console.log(isEnabled, currentIndex, dim.dimension_order, highestDimensionOrder)

                    return (
                        <button
                            key={dim.id || idx}
                            onClick={() => isEnabled && setCurrentDimension(idx)}
                            disabled={!isEnabled}
                            style={{
                                fontWeight: isCurrent ? 'bold' : 'normal',
                                backgroundColor: isCurrent ? '#002d46' : 'grey',
                                cursor: isEnabled ? 'pointer' : 'not-allowed',
                            }}
                            className="btn btn-secondary text-start"
                        >
                            {dim.dimension_name || `Dimension ${idx + 1}`}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default AssessmentNavigation;
