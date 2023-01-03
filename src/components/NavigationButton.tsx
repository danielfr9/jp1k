import type { ReactNode } from "react";

interface IProps {
  onClick: () => void;
  children: ReactNode;
}

const NavigationButton = ({ onClick, children }: IProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-md bg-slate-900 p-1 px-2 font-semibold transition-colors hover:bg-slate-700"
    >
      {children}
    </button>
  );
};

export default NavigationButton;