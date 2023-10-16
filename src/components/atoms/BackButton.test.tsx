import React from "react";
import BackButton from "./BackButton"; // adjust the import to your file structure
import { fireEvent, render } from "@testing-library/react";

describe("<BackButton />", () => {
  it("renders without crashing", () => {
    render(<BackButton text="Go Back" handleClick={() => {}} />);
  });

  // it("displays the correct text from props", () => {
  //   const { getByText } = render(
  //     <BackButton text="Go Back" handleClick={() => {}} />
  //   );
  //   expect(getByText("Go Back")).toBeInTheDocument();
  // });

  it("calls handleClick when clicked", () => {
    const handleClick = jest.fn();
    const { getByRole } = render(
      <BackButton text="Go Back" handleClick={handleClick} />
    );
    fireEvent.click(getByRole("button"));
    expect(handleClick).toHaveBeenCalled();
  });

  // it("has correct class names", () => {
  //   const { getByRole } = render(
  //     <BackButton text="Go Back" handleClick={() => {}} />
  //   );
  //   const button = getByRole("button");
  //   expect(button).toHaveClass("flex");
  //   expect(button).toHaveClass("items-center");
  //   // ...and so on for other classes
  // });

  // it("renders the SVG correctly", () => {
  //   const { container } = render(
  //     <BackButton text="Go Back" handleClick={() => {}} />
  //   );
  //   const svg = container.querySelector("svg");
  //   expect(svg).toBeInTheDocument();
  //   expect(svg).toHaveAttribute("width", "15");
  //   expect(svg).toHaveAttribute("height", "13");
  // });
});
