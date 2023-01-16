type IconUnit = "rem";
type IconUnitValue = number;

const PlayIcon = ({
  height = 40,
  width = 40,
}: {
  height?: `${IconUnitValue}${IconUnit}` | number;
  width?: `${IconUnitValue}${IconUnit}` | number;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
    </svg>
  );
};

export default PlayIcon;