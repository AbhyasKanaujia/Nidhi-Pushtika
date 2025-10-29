In AuthContext let’s move out the useAuth to a custom hook.
Add checks to make sure that we are using it inside a provider

Let’s use Loading in App.jsx from AntD so that it is consistent throughout the application.

Record all styling decision in styles.md in docs so that we are not guessing each time we design our application. We need to be consistent. So record such info related to your recent changes. Write in the language of UI Design System. Pick a standard and then write instead writing too much or too little or too varied kind of info in this doc each time. 

No styles.md is written in the styles of a design system doc and not a css -> md equivalent. Only write such decision that may be used later to styles other components and keep things consistent. Not component or page level info.

Make sure that your recent code is in line with styles.md. I keep updating this file when i make any major styling decision to make sure that I don't keep guessing each time I design the application. If the document recommends something that you are not following, update your styling. 