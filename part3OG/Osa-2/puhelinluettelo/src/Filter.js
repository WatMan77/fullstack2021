import React from 'react'

const Filter = ({ filtering, changeFilter }) => {
    return (
        <form>
            <div>
                set a filter: <input value={filtering} onChange={changeFilter} />
            </div>
        </form>
    )
}

export default Filter