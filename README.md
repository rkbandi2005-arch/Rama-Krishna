# TaskFlow Landing Page

TaskFlow is a premium, fully responsive SaaS landing page developed as part of a mock front-end developer assessment. The project is designed with a modern dark-themed aesthetic (with light theme option), flexible Grid/Flex layouts, dynamic price options, responsive menus, custom client-side form validation, and blog cards fetched dynamically from the JSONPlaceholder REST API.

## Features

- **Responsive Grid Layout**: Structured navigation, a split hero section, a 6-card features grid, and a 3-tier pricing section utilizing CSS Grid and Flexbox.
- **Dynamic Theme Management**: Persistent Light/Dark theme switching utilizing local storage.
- **Client-Side Form Validation**: Real-time feedback and state reporting on name, email, and message inputs with simulated network submission and success alerts.
- **API Blog Integration**: Asynchronous API calls to retrieve dynamic articles from [JSONPlaceholder](https://jsonplaceholder.typicode.com/posts) complete with CSS pulse-animation loading skeletons and error state components.
- **Interactive Billing Toggler**: Toggle switch to update plans between Monthly and Annual pricing with an visual discount indicator.
- **Accessibility Friendly**: Built with HTML5 semantic elements (`<nav>`, `<main>`, `<section>`, `<header>`), ARIA attributes, image descriptions, contrast compliance, and keyboard navigability.
- **Optimized Assets**: Responsive, lightweight inline SVGs and clean CSS transitions.

## Project Structure

```
frontend-task/
├── index.html            # Main markup file containing SEO & layout elements
├── css/
│   ├── style.css         # Baseline styling system (variables, themes, animations)
│   └── responsive.css    # Responsive layout rules & hamburger menu adjustments
├── js/
│   └── app.js            # Controller script (Theme, menu, forms, API fetcher)
├── images/
│   └── hero.png          # Dashboard mockup preview image
└── README.md             # Project documentation and setup guidelines
```

## Setup & Running Instructions

1. Clone or download this repository to your local system.
2. Locate the root directory containing `index.html`.
3. Open `index.html` directly in any web browser of your choice.
   - Alternatively, serve the files locally using an extension such as VS Code's Live Server, or run a python server in the root folder:
     ```bash
     python -m http.server 8000
     ```
     Then navigate to `http://localhost:8000`.
4. Switch to the mobile/tablet preview mode inside your browser developer tools to verify responsiveness across device profiles.
