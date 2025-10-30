# Nidhi Pushtika Rules

1. The app is called Nidhi Pushtika
2. Its target audience is 40s Indian men part of social groups and orgs. 
3. Website style should be easy to navigate  and consistent so use styles.md to plan. 
4. Use Schema and API design.md to get a technical overview of the application. 
5. The app viewers will mostly use it on mobile so make it mobile compatible. 
6. Rely more on AntD for styling and less on Tailwind. 
7. Add very subtle animations to make it less clunky.
8. Always use a Spin component from AntD and not a plaintext "Loading..." See @Login.jsx to find out how.
9. Always use built in message to show errors and not plaintext error see @Login.jsx to find out how.
10. There may be two kinds of error: 
    a. State Error: For example data couldn't be loaded. 
    b. Instantaneous Error: Invalid user input
11. Handle state error with ErrorPlaceholder component. See SummaryStrip component to understand how to use it
12. Handle instantaneous error with a message. See @Login.jsx to find out how. 