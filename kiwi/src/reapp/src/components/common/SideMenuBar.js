import React, {useState} from 'react';
import '../../styles/components/common/SideMenuBar.css';

const SideMenuBar = ({menuItems}) => {

    const [items, setItems] = useState(menuItems);
    const [item, setItem] = useState(menuItems[0]);

    const handleOnClick = (url) => {

    }

    return (
        <div className='side-menu-bar'>
            <ul className='side-menu-bar-inner'>
                {items.map((item, index)=>(
                        <li key={index} onClick={()=>handleOnClick(item.url)} className='side-menu-bar-item'>
                            {item.name}
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default SideMenuBar;