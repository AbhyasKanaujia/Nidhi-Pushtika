# Styling Decisions - UI Design System

## Typography
- Use Ant Design (antd) Typography components for all textual elements to ensure consistent font sizes, weights, and spacing.
- For page titles and section headers, use `<Typography.Title>` with appropriate `level` prop (e.g., level={2} for main headings).

## Layout and Spacing
- Use Tailwind CSS utility classes for layout, spacing, and container styling.
- Containers should have max-width constraints (e.g., `max-w-md` or `max-w-xs` for mobile), centered horizontally (`mx-auto`), and vertical margin (`mt-10` or `mt-20`).
- Padding inside containers should use consistent spacing units (e.g., `p-6`).
- Borders should use `border` with rounded corners (`rounded`).
- Apply subtle shadows (`shadow`) for elevation.
- Avoid custom magic numbers; rely on design tokens or Tailwind's spacing scale for consistency.

## Forms and Inputs
- Use Ant Design Form components for form layout and validation.
- Use Ant Design Input and Input.Password components for text inputs.
- Buttons should use Ant Design Button component with `type="primary"` and `block` prop for full width.
- Use the `size="large"` prop on inputs and buttons for better touch targets on mobile as target audience is 40 years old users.

## Colors and Theme
- Use a calm and professional color palette suitable for 40-year-old Indian public service group members.
- Primary colors should be subtle blues and grays to convey trust and ease of use.
- Use consistent colors for interactive elements like links and buttons, with clear hover and active states.
- Use subtle background colors (e.g., light grays) behind containers to add visual depth.

## Responsiveness
- Design all components to be mobile-first and responsive.
- Use Tailwind CSS responsive utilities to adjust layout and spacing on different screen sizes.
- Ensure text sizes and touch targets are appropriate for mobile users.
- For navigation bars and headers, use flex-wrap and margin utilities to stack elements vertically on small screens and horizontally on larger screens.
- Maintain adequate spacing between interactive elements for touch accessibility on mobile devices.

## Accessibility
- Follow best practices for keyboard navigation and screen reader support.
- Ensure all inputs have labels and ARIA attributes, leveraging Ant Design's built-in accessibility features.

## Navigation and Animations
- Use Ant Design's built-in components for navigation elements to leverage native animation support and consistent styling.
- Prefer minimal custom CSS or utility classes for layout; rely on design system components for interactive behavior.
- Implement mobile-first responsive navigation with collapsible menus to optimize screen real estate on small devices.
- Use React conditional rendering with media queries (e.g., `window.matchMedia`) to control visibility of navigation elements instead of relying solely on CSS classes.
- Ensure all interactive elements have accessible ARIA attributes and support keyboard navigation.
- Keep animations subtle and performant to enhance user experience without distraction.
