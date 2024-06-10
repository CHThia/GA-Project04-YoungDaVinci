import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';


const CustomColorPicker = ({ color , onChange }) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChange = (color) => {
    onChange(color);
  };

  return (
    <div>
      <div className="color-picker-box" onClick={handleClick} style={{ backgroundColor: color }}></div>
      {displayColorPicker && (
        <div className="popover">
          <div className="cover" onClick={handleClose} />
          <HexColorPicker color={color} onChange={handleChange} />
        </div>
      )}
    </div>
  );
};

export default CustomColorPicker;
