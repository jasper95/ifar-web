import React from 'react';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import FakeButton from 'react-md/lib/Helpers/AccessibleFakeButton';
import IconSeparator from 'react-md/lib/Helpers/IconSeparator';
import FontIcon from 'react-md/lib/FontIcons/FontIcon';

function SelectMenuButton(props) {
  const {
    options, onChange, value, ...restProps
  } = props;
  const selected = options.find(e => e.value === value);
  return (
    <MenuButton
      adjusted={false}
      raised
      primary
      simplifiedMenu={false}
      anchor={MenuButton.Positions.BOTTOM}
      repositionOnScroll={false}
      menuItems={options
        .map(e => ({ primaryText: e.label, onClick: () => onChange(e.value) }))
      }
      {...restProps}
    >
      <FakeButton
        component={IconSeparator}
        label={(
          <IconSeparator label={selected ? selected.label : ''}>
            <FontIcon>arrow_drop_down</FontIcon>
          </IconSeparator>
      )}
      />
    </MenuButton>
  );
}

export default SelectMenuButton;
