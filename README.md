# CustomPrint - A Next.js Print-on-Demand Storefront

Welcome to CustomPrint! This is a web application built with Next.js that allows users to browse products, customize them with their own text and images, and simulate a checkout process. It's designed as a modern, responsive, and user-friendly storefront for a print-on-demand service.

The application uses Firebase for user authentication, allowing users to sign up, log in, and manage their accounts.

## Project Structure

Here is the file structure of the project:

```
.
├── .env
├── README.md
├── apphosting.yaml
├── components.json
├── next.config.ts
├── package.json
├── src
│   ├── app
│   │   ├── (auth)
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── (main)
│   │   │   ├── account/page.tsx
│   │   │   ├── cart/page.tsx
│   │   │   ├── checkout/page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── products/[id]/page.tsx
│   │   ├── actions.ts
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components
│   │   ├── auth/auth-form.tsx
│   │   ├── cart
│   │   │   ├── cart-button.tsx
│   │   │   ├── cart-item.tsx
│   │   │   └── cart-summary.tsx
│   │   ├── layout
│   │   │   ├── footer.tsx
│   │   │   └── header.tsx
│   │   ├── products
│   │   │   ├── product-card.tsx
│   │   │   └── product-customizer.tsx
│   │   └── ui/
│   ├── hooks
│   │   ├── use-auth.tsx
│   │   ├── use-cart.tsx
│   │   └── use-toast.ts
│   └── lib
│       ├── firebase.ts
│       ├── printful-mock-api.ts
│       ├── types.ts
│       └── utils.ts
├── tailwind.config.ts
└── tsconfig.json
```

## File-by-File Explanation

### Configuration Files (Root)

*   `.env`: Stores environment variables for the project, such as Firebase API keys.
*   `apphosting.yaml`: Configuration for deploying the application to Firebase App Hosting.
*   `next.config.ts`: Configuration file for Next.js, allowing customization of its behavior.
*   `package.json`: Lists the project's dependencies and scripts.
*   `tailwind.config.ts`: Configuration file for Tailwind CSS, used for styling the application.
*   `tsconfig.json`: The configuration file for the TypeScript compiler.
*   `components.json`: Configuration for `shadcn/ui`, managing UI component settings.

### `src/app` - Routing & Pages

This directory uses the Next.js App Router paradigm.

*   `layout.tsx`: The root layout for the entire application. It sets up the main HTML structure, includes global CSS, and wraps the app in context providers (`AuthProvider`, `CartProvider`).
*   `globals.css`: Global stylesheet for the application, including Tailwind CSS base styles and theme variables for `shadcn/ui`.
*   `actions.ts`: Contains server-side actions, such as the `placeOrderAction` used in the checkout process.
*   `(auth)/`: A route group for authentication-related pages.
    *   `login/page.tsx`: The user login page.
    *   `signup/page.tsx`: The user registration page.
*   `(main)/`: A route group for the main application pages that share a common layout.
    *   `layout.tsx`: The shared layout for the main app, including the `Header` and `Footer`.
    *   `page.tsx`: The homepage of the application, which displays a list of products.
    *   `account/page.tsx`: The user's account page, where they can view their details and sign out.
    *   `cart/page.tsx`: The shopping cart page, displaying items added to the cart.
    *   `checkout/page.tsx`: The checkout page where users enter shipping information to place an order.
    *   `products/[id]/page.tsx`: The dynamic product detail page. It displays details for a specific product and includes the `ProductCustomizer` component.

### `src/components` - React Components

This directory contains all the reusable React components.

*   `auth/auth-form.tsx`: A form component used for both login and signup, handling user input and authentication logic with Firebase.
*   `cart/`: Components related to the shopping cart.
    *   `cart-button.tsx`: A button in the header showing the number of items in the cart.
    *   `cart-item.tsx`: Renders a single item within the shopping cart, allowing quantity changes and removal.
    *   `cart-summary.tsx`: Displays the order summary, including subtotal, shipping, and total cost.
*   `layout/`: Components for the overall page structure.
    *   `header.tsx`: The main navigation header for the application.
    *   `footer.tsx`: The footer component.
*   `products/`: Components for displaying and interacting with products.
    *   `product-card.tsx`: A card component to display a product summary on the homepage.
    *   `product-customizer.tsx`: The core component for customizing a product with text and images.
*   `ui/`: Contains the `shadcn/ui` components (Button, Card, Input, etc.), which are the building blocks of the application's interface.

### `src/hooks` - Custom React Hooks

This directory contains custom hooks for managing state and logic across the application.

*   `use-auth.tsx`: Manages the user's authentication state using Firebase Auth. It provides the current user and loading state to any component that needs it.
*   `use-cart.tsx`: Manages the shopping cart's state (items, totals) using a reducer. It allows components to add, remove, and update items in the cart.
*   `use-toast.ts`: A custom hook for displaying toast notifications.

### `src/lib` - Libraries & Utilities

This directory contains helper functions, type definitions, and library initializations.

*   `firebase.ts`: Initializes and exports the Firebase app and auth instances.
*   `printful-mock-api.ts`: A mock API that simulates fetching product data, mimicking a real print-on-demand service API.
*   `types.ts`: Contains TypeScript type definitions used throughout the project (e.g., `Product`, `CartItem`).
*   `utils.ts`: Utility functions, including `cn` from `clsx` and `tailwind-merge` for constructing dynamic class names.
