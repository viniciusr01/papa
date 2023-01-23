import styles from './Select.module.css'

function Select({ text, name, options, handleOnChange, value}){

    return(
        <div className={styles.form_control}>
            <label htmlFor={name}>{text}:</label>
            <select name={name} id={name} onChange={handleOnChange} >
                <option>Selecione um grupo</option>
               {options.map((options) =>(
                <option value={options.id} key={options.id}>
                    {options.name}
                </option>
               ))}
            </select>
        </div>
    )

}

export default Select