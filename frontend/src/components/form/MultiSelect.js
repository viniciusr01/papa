import React from 'react';
import Select from 'react-select';
import styles from './MultiSelect.module.css'

export const MultiSelect = () => {
    return (
        <>
        <Select 
        className={styles.MultiSelect} 
        isMulti options={options}
        isClearable={true}
        isSearchable={true}
        isDisabled={false}
        isLoading={false}
        isRtl={false}/>
        </>
    )
}