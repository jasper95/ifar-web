import React from 'react';
import cn from 'classnames';
import Link from 'react-router-dom/Link';

function SubMenu(props) {
  const { menu, currentPath, isActive } = props;
  return (
    <div className={cn('nav_menu_list_item_sub',
      { active: isActive })
    }
    >
      <div className="nav_menu_list">
        { menu.map(e => (
          <li
            key={e.id}
            className={cn('nav_menu_list_item',
              { active: currentPath === e.path })}
          >
            <Link className="text" to={e.path}>{e.label}</Link>
          </li>
        ))}
      </div>
    </div>
  );
}

export default SubMenu;
