import ScaleNumberInputs from './ScaleNumberInputs';

const ScaleAdmin = ({ scaleName, setScaleName, scaleLevels, scaleLabels, setScaleLevels, setNumberInputs, setLabelsArray }) => {

    return (
        <div className='mt-5'>
            <h1 className='mb-3'>Create a new scale</h1>
            <div className='d-flex flex-direction-row gap-5'>
                <input
                    className='form-input my-3 w-50'
                    type='text'
                    placeholder='Insert the name of the scale'
                    value={scaleName}
                    onChange={(e) => setScaleName(e.target.value)}
                >
                </input>
                <input
                    className='form-input my-3 w-50'
                    type='text'
                    placeholder='Insert the number of levels of the scale'
                    value={scaleLevels}
                    onChange={(e) => { setScaleLevels(e.target.value); setNumberInputs(e.target.value); }}
                    maxLength={1}
                >
                </input>
            </div>
            <ScaleNumberInputs scaleLevels={scaleLevels} scaleLabels={scaleLabels} setLabelsArray={setLabelsArray} />
        </div>
    )
}

export default ScaleAdmin;