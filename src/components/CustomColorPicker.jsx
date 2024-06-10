import { useState } from 'react';
import { SketchPicker } from 'react-color';


export default function CustomColorPicker ({ color, onChange }) {

  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChange = (color) => {
    onChange(color.hex);
  };

  return (
    <div>
      <div className="color-picker-box" onClick={handleClick} style={{ backgroundColor: color }}></div>
      {displayColorPicker && (
        <div className="popover">
          <div className="cover" onClick={handleClose} />
          <SketchPicker color={color} onChange={handleChange} disableAlpha={true} />
        </div>
      )}
    </div>
  );
};

