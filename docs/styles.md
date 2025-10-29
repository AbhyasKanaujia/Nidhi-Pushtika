# Styling Decisions - UI Design System

## Typography
- Use Ant Design (antd) Typography components for all textual elements to ensure consistent font sizes, weights, and spacing.
- For page titles and section headers, use `<Typography.Title>` with appropriate `level` prop (e.g., level={2} for main headings).

## Layout and Spacing
- Use Tailwind CSS utility classes for layout, spacing, and container styling.
- Containers should have max-width constraints (e.g., `max-w-md`), centered horizontally (`mx-auto`), and vertical margin (`mt-20`).
- Padding inside containers should use consistent spacing units (e.g., `p-6`).
- Borders should use `border` with rounded corners (`rounded`).
- Apply subtle shadows (`shadow`) for elevation.

## Forms and Inputs
- Use Ant Design Form components for form layout and validation.
- Use Ant Design Input and Input.Password components for text inputs.
- Buttons should use Ant Design Button component with `type="primary"` and `block` prop for full width.
