const ScaleAdmin = ({ scaleName, setScaleName, scaleLevels, setScaleLevels, numberInputs}) => {

    return (
        <div>
            <h1>Create or edit scale</h1>
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
                onChange={(e) => setScaleLevels(e.target.value)}
            >
            </input>
            {numberInputs}
        </div>
    )
}

export default ScaleAdmin;