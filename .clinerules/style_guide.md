# Style Guide

1. Use Tailwind and shadcn components. Always check in frontend/src/components to see if any components may be reused. You may also suggest npx shadcn@latest add <component>
2. Always use Link from react router dom
3. Never use plain old typography elements such as h1, p, small etc. Always use one from frontend/src/components/ui/typography. If it doesn't exist create a new one.
4. Use Card component to distinguish and clearly show the boundary of a section.  
5. Use bottom borders to show end of a section
6. Try not to define bottom margin. Only ever define top margin. Preferred: mt-4 or mt-2 based on relationship.
7. Always think mobile first. 
8. The target audience is 40 years old Indian people. So the UI needs to be very simple. Nothing hidden. Large buttons. Animations to show where something comes from and goes or to provide visual feedback.
9. Add subtle animations for visual feedback.
10. All pages are already in the Container component due to App.jsx so only focus on vertical padding and margin. No need to worry about horizontal ones. 
11. Always use Loader component to show loading state
12. There may be two kinds of error:
    a. State Error: For example data couldn't be loaded.
    b. Instantaneous Error: Invalid user input
    c. Handle state error with ErrorPlaceholder component. See SummaryStrip component to understand how to use it
    d. Handle instantaneous error with a message. See @Login.jsx to find out how.
