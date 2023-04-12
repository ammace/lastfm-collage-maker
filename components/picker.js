import { useState } from "react";

export default function Picker({ options, option, setOption, placeholder }) {
  const [open, setOpen] = useState();

  return (
    <div className="under">
      <div className="button" onClick={() => setOpen((prev) => !prev)}>
        {option ? (
          <div>{option}</div>
        ) : (
          <div className="placeholder">{placeholder}</div>
        )}
      </div>
      <div className={"pickerMenu" + (open ? " open" : "")}>
        {options
          .filter((choice) => choice.name !== option)
          .map((value) => (
            <div
              key={value.name}
              className="pickerOption"
              onClick={() => {
                setOption(value.index);
                setOpen(false);
              }}
            >
              {value.name}
            </div>
          ))}
      </div>
    </div>
  );
}
