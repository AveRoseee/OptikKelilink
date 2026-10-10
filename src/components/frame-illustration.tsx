type FrameIllustrationProps = {
  category?: string;
  color?: string;
  className?: string;
  label?: string;
};

export function FrameIllustration({
  category = "round",
  color = "#173e70",
  className,
  label = "Ilustrasi frame kacamata",
}: FrameIllustrationProps) {
  const shape = category.toLowerCase();

  return (
    <svg
      className={className}
      viewBox="0 0 280 140"
      role="img"
      aria-label={label}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {shape.includes("aviator") ? (
          <>
            <path
              d="M37 48c7-8 23-11 43-8l33 5 1 32c-1 20-14 37-34 39-22 2-38-17-42-43l-1-25Z"
              fill="#dceaff"
              fillOpacity=".68"
            />
            <path
              d="M243 48c-7-8-23-11-43-8l-33 5-1 32c1 20 14 37 34 39 22 2 38-17 42-43l1-25Z"
              fill="#dceaff"
              fillOpacity=".68"
            />
            <path d="M114 52c12-10 40-10 52 0M22 48l15 8m221-8-15 8" />
          </>
        ) : shape.includes("cat") ? (
          <>
            <path
              d="m29 48 18 5c6-8 18-12 35-12h23c12 0 20 7 22 18l-4 31c-2 17-14 28-33 28H69c-19 0-32-13-35-33l-5-37Z"
              fill="#dceaff"
              fillOpacity=".68"
            />
            <path
              d="m251 48-18 5c-6-8-18-12-35-12h-23c-12 0-20 7-22 18l4 31c2 17 14 28 33 28h21c19 0 32-13 35-33l5-37Z"
              fill="#dceaff"
              fillOpacity=".68"
            />
            <path d="M126 59c8-8 20-8 28 0M14 44l17 9m235-9-17 9" />
          </>
        ) : shape.includes("rectangle") ||
          shape.includes("square") ||
          shape.includes("wayfarer") ? (
          <>
            <rect
              x="27"
              y="38"
              width="94"
              height="65"
              rx="17"
              fill="#dceaff"
              fillOpacity=".68"
            />
            <rect
              x="159"
              y="38"
              width="94"
              height="65"
              rx="17"
              fill="#dceaff"
              fillOpacity=".68"
            />
            <path d="M121 55c11-8 27-8 38 0M27 48 12 41m241 7 15-7" />
          </>
        ) : (
          <>
            <circle cx="74" cy="70" r="34" fill="#dceaff" fillOpacity=".68" />
            <circle cx="206" cy="70" r="34" fill="#dceaff" fillOpacity=".68" />
            <path d="M108 62c10-8 26-8 36 0m28 0c10-8 26-8 36 0M39 51l-15-9m217 9 15-9" />
          </>
        )}
      </g>
      <path
        d="M45 119c45 9 145 9 190 0"
        stroke="#8ea4c1"
        strokeOpacity=".25"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}
