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
    const firstRender = useRef(true);
    const [lastAnsweredIndex, setLastAnsweredIndex] = useState(null);
    const [expanded, setExpanded] = useState(true);
    const contentRef = useRef(null);
    const [maxHeight, setMaxHeight] = useState("0px");

    // Estado para posição fixa
    const [position, setPosition] = useState({ top: window.innerHeight * 0.25, right: 16 });

    // Dados para drag
    const dragData = useRef({ isDragging: false, startX: 0, startY: 0, startTop: 0, startRight: 0 });

    useEffect(() => {
        if (
            !existingAnswers ||
            Object.keys(existingAnswers).length === 0 ||
            !Array.isArray(topLevelDimensions) ||
            topLevelDimensions.length === 0 ||
            !firstRender.current
        ) return;

        const highestDimensionOrder = Math.max(
            ...Object.values(existingAnswers).map(answer => answer.dimension_order || 0)
        );

        const index = topLevelDimensions.findIndex(d => d.dimension_order === highestDimensionOrder);

        if (index !== -1) {
            setLastAnsweredIndex(index);
            setCurrentDimension(index);
        }

        firstRender.current = false;
    }, [existingAnswers, topLevelDimensions, currentIndex, setCurrentDimension]);

    useEffect(() => {
        if (expanded) {
            setMaxHeight(`${contentRef.current.scrollHeight + 200}px`);
        } else {
            setMaxHeight("4rem");
        }
    }, [expanded, topLevelDimensions]);

    // Drag events
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
                <button onMouseDown={handleMouseDown} className="btn btn-dark" style={{cursor: 'grab'}}><OpenWithIcon /></button>
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
                        cursor:'ponter'
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
                    const isEnabled = lastAnsweredIndex !== null ? idx <= lastAnsweredIndex : false;

                    return (
                        <button
                            key={dim.id || idx}
                            onClick={() => setCurrentDimension(idx)}
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
