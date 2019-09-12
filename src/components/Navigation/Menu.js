import React, { useRef, useEffect, useState } from 'react';
import Button from 'react-md/lib/Buttons/Button';
import Link from 'react-router-dom/Link';
import cn from 'classnames';
import SubMenu from './SubMenu';

function Menu(props) {
  const node = useRef();
  const { menu, currentPath } = props;
  const { path, submenu } = menu;
  const isActive = currentPath === path || submenu && submenu.find(i => currentPath === i.path);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (typeof document === 'object') {
      // add when mounted
      document.addEventListener('mousedown', handleClick);
      // return function to be called when unmounted
      return () => {
        document.removeEventListener('mousedown', handleClick);
      };
    }
    return () => {};
  }, []);
  return (
    <li
      ref={node}
      className={cn('nav_menu_list_item',
        { active: isActive },
        { hasSubmenu: submenu })}
    >
      {menu.submenu ? (
        <span
          onClick={toggle}
          className="text"
        >
          {menu.label}
        </span>
      ) : (
        <Link className="text" to={menu.path}>{menu.label}</Link>
      )}
      {menu.submenu && (
        <>
          <Button
            icon
            flat
            className={cn('iBttn-toggleSubmenu', { active: isOpen })}
            onClick={toggle}
            children="keyboard_arrow_down"
          />
          <SubMenu
            menu={menu.submenu}
            currentPath={currentPath}
            isActive={isOpen}
          />
        </>
      )}
    </li>
  );

  function handleClick(event) {
    if (!node.current.contains(event.target)) {
      setIsOpen(false);
    }
  }

  function toggle(event) {
    event.stopPropagation();
    setIsOpen(!isOpen);
  }
}

export default Menu;
