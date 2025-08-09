# **App Name**: CustomPrint

## Core Features:

- Image upscaling tool: AI tool for upscaling the image which will be uploaded to product.
- User Authentication: User authentication through Firebase, handling registration, login, and session management.
- Product Catalog Display: Display a product selection fetched from the Printful API. This should focus on a simple layout for an MVP.
- Product Customization: Allow users to upload images and add text to product designs, displaying a live preview. Simple drag and drop.
- Shopping Cart and Checkout: Facilitate adding items to a cart, then proceeding through a standard e-commerce checkout process.
- Payment Processing: Integrate the PayPal API for handling payments during checkout.
- Order placement automation: Automatically create an order using the Printful API when an order is placed.

## Style Guidelines:

- Primary color: HSL(48, 100%, 50%) translated to bright, sunny yellow (#FFDA63) to invoke feelings of optimism and creation.
- Background color: Desaturated yellow HSL(48, 20%, 95%) translated to a light, airy off-white (#F9F6F0).
- Accent color: Analogous orange HSL(18, 80%, 55%) translated to a vibrant sunset orange (#E08230) for highlighting interactive elements.
- Font: 'Inter' (sans-serif) for both headlines and body text, Note: currently only Google Fonts are supported.
- Use simple, outlined icons from shadcn/ui to maintain a consistent, modern aesthetic.
- Implement a clean, grid-based layout with plenty of white space, utilizing Tailwind CSS and shadcn/ui components.
- Incorporate subtle animations for transitions and loading states to enhance the user experience without being distracting.