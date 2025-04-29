import ScaleNumberInputs from './ScaleNumberInputs';

const ScaleAdmin = ({ scaleName, setScaleName, scaleLevels, scaleLabels, setScaleLevels, setNumberInputs, setLabelsArray }) => {

    return (
        <div>
            <h1>Create a new scale</h1>
            <input
                className='login-form-input'
                type='text'
                placeholder='Insert the name of the scale'
                value={scaleName}
                onChange={(e) => setScaleName(e.target.value)}
            >
            </input>
            <input
                className='login-form-input'
                type='text'
                placeholder='Insert the number of levels of the scale'
                value={scaleLevels}
                onChange={(e) => { setScaleLevels(e.target.value); setNumberInputs(e.target.value); }}
            >
            </input>
            <ScaleNumberInputs scaleLevels={scaleLevels} scaleLabels={scaleLabels} setLabelsArray={setLabelsArray} />
        </div>
    )
}

export default ScaleAdmin;