# Stellar Payment DApp - Starter Guide

A simple web application that lets users connect their Stellar wallet and send payments on the Stellar blockchain. Built with Next.js, React, and TypeScript.

## 🎯 What This App Does (In Simple Terms)

Think of this like a simple PayPal or Venmo app, but for the Stellar blockchain:

1. **Users connect their wallet** - Similar to logging in, but using a crypto wallet browser extension called "Freighter"
2. **Users can send payments** - They enter a recipient's address and amount, then send XLM (Stellar's currency, similar to dollars)
3. **Everything happens on the blockchain** - Transactions are recorded permanently on the Stellar network (test network for now, so no real money)

The app currently has two main features:
- **Home page** (`/`) - Send XLM payments to other Stellar addresses
- **Counter page** (`/counter`) - Interact with a smart contract that counts increments

## 📁 Project Structure

Here's where everything is located:

```
stellar-dapp/
├── app/                          # Next.js pages (routes)
│   ├── page.tsx                  # Home page (payment sender)
│   ├── counter/page.tsx          # Counter smart contract page
│   ├── layout.tsx                # Main app layout/wrapper
│   └── globals.css               # Global styles
├── components/                   # Reusable React components
│   ├── Button.tsx                # Generic button component
│   ├── Input.tsx                 # Text input component
│   ├── ConnectWalletButton.tsx   # Wallet connection button
│   └── SendPaymentForm.tsx      # Payment form component
├── public/                       # Static assets (images, etc.)
├── package.json                  # Dependencies and scripts
└── tsconfig.json                 # TypeScript configuration
```

### Key Files Explained

- **`app/page.tsx`** - The main landing page. Handles wallet connection and payment sending logic
- **`app/counter/page.tsx`** - Example of interacting with a Stellar smart contract
- **`components/`** - Reusable UI pieces you can use anywhere in your app
- **`app/layout.tsx`** - Wraps all pages (header, footer, global styling)

## 🚀 Getting Started

### Prerequisites

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Freighter Wallet Extension** - [Install from Chrome/Firefox store](https://freighter.app/)

### Installation

1. **Clone or download this project**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Navigate to `http://localhost:3000` (or `https://localhost:3000` if using HTTPS)
   - Make sure you have Freighter wallet extension installed and set up

### Available Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build for production
- `npm run start` - Start production server (after building)
- `npm run lint` - Check code for errors

## 🎨 How to Edit Things

### Changing the Home Page

Edit `app/page.tsx`:
- **Title text**: Change line 89 (`<h2>Send Payment</h2>`)
- **Connection button text**: Change line 100 (`Connect Freighter Wallet`)
- **Styling**: Modify the `className` attributes (uses Tailwind CSS)

### Changing Styling/Colors

The app uses **Tailwind CSS**. Common classes:
- `bg-blue-500` - Blue background
- `text-white` - White text
- `rounded` - Rounded corners
- `hover:bg-blue-700` - Darker blue on hover

Change colors by modifying these classes in any component file.

### Modifying Components

**Example: Change button style**
1. Open `components/Button.tsx`
2. Modify the `className` on line 20 (the long string with Tailwind classes)
3. Save - changes appear automatically

**Example: Change input placeholder**
1. Open `components/SendPaymentForm.tsx`
2. Find the `placeholder` prop (line 32 for destination, line 47 for amount)
3. Change the text

### Adding New Features

#### 1. Create a New Page

**Option A: Simple page**
1. Create a new file in `app/` directory, e.g., `app/balance/page.tsx`
2. Add this template:
```tsx
"use client";

export default function BalancePage() {
  return (
    <div className="max-w-md mx-auto">
      <h1>My Balance</h1>
      {/* Your content here */}
    </div>
  );
}
```
3. Visit it at `http://localhost:3000/balance`

**Option B: Full page with wallet connection**
Copy the structure from `app/page.tsx` and modify:
- Import wallet functions: `getAddress`, `isConnected`, `setAllowed`
- Use `useState` to store the connected wallet address
- Use `useEffect` to check connection on page load

#### 2. Create a New Component

1. Create a file in `components/`, e.g., `components/BalanceDisplay.tsx`
2. Use this template:
```tsx
import React from "react";

interface BalanceDisplayProps {
  balance: string;
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ balance }) => {
  return (
    <div className="p-4 bg-gray-100 rounded">
      <p>Balance: {balance} XLM</p>
    </div>
  );
};

export default BalanceDisplay;
```
3. Import and use it in your page:
```tsx
import BalanceDisplay from "../components/BalanceDisplay";
// Then use: <BalanceDisplay balance="100" />
```

#### 3. Add a Wallet Feature (Read Account Balance)

In any page component, add this code:

```tsx
import { rpc as StellarRpc } from "@stellar/stellar-sdk";
import { getAddress } from "@stellar/freighter-api";

// Inside your component function:
const getBalance = async () => {
  try {
    const pubKey = await getAddress();
    const server = new StellarRpc.Server("https://soroban-testnet.stellar.org");
    const account = await server.getAccount(pubKey.address);
    
    // Get native XLM balance
    const balance = account.balances.find(b => b.asset_type === 'native');
    console.log("Balance:", balance?.balance);
    return balance?.balance || "0";
  } catch (error) {
    console.error("Error getting balance:", error);
  }
};
```

#### 4. Create a New Transaction Type

Look at `app/page.tsx`, specifically the `handleSendPayment` function (lines 43-85). You can:

- **Change transaction type**: Instead of `Operation.payment()`, use:
  - `Operation.accountMerge()` - Merge accounts
  - `Operation.setOptions()` - Change account settings
  - `Operation.manageData()` - Store data on account

- **Add multiple operations**: Chain more `.addOperation()` calls

Example template:
```tsx
const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
  fee: StellarSdk.BASE_FEE,
  networkPassphrase: StellarSdk.Networks.TESTNET,
})
  .addOperation(StellarSdk.Operation.payment({ /* ... */ }))
  .addOperation(StellarSdk.Operation.manageData({ /* ... */ })) // Add second operation
  .setTimeout(30)
  .build();
```

## 🔧 Common Customizations

### Change Network (Testnet vs Mainnet)

Currently using **Testnet** (fake money for testing). To switch to **Mainnet** (real money):

1. In `app/page.tsx`, change line 56:
   ```tsx
   // From:
   networkPassphrase: StellarSdk.Networks.TESTNET,
   // To:
   networkPassphrase: StellarSdk.Networks.PUBLIC,
   ```

2. Change server URL (line 51):
   ```tsx
   // From:
   "https://soroban-testnet.stellar.org"
   // To:
   "https://horizon.stellar.org"
   ```

⚠️ **Warning**: Mainnet uses real money. Only switch when you're ready!

### Change Styling Theme

All styling is done with Tailwind CSS classes. To change the overall theme:

1. Modify `app/layout.tsx` - change background colors, header style
2. Modify individual components in `components/` folder
3. Check [Tailwind CSS docs](https://tailwindcss.com/docs) for class names

### Add Form Validation

In `components/SendPaymentForm.tsx`, you can add validation:

```tsx
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validate Stellar address format
  if (!destination.startsWith('G') || destination.length !== 56) {
    alert('Invalid Stellar address');
    return;
  }
  
  // Validate amount
  if (parseFloat(amount) <= 0) {
    alert('Amount must be greater than 0');
    return;
  }
  
  onSubmit(destination, amount);
};
```

### Add Loading States

See example in `app/counter/page.tsx` (lines 159-190). Use a `loading` state:

```tsx
const [loading, setLoading] = useState(false);

// In your async function:
setLoading(true);
try {
  // Do transaction
} finally {
  setLoading(false);
}

// In JSX:
<button disabled={loading}>
  {loading ? 'Processing...' : 'Send Payment'}
</button>
```

## 📚 Key Concepts for Non-Blockchain Developers

### What is Stellar?
- A blockchain network (like Bitcoin or Ethereum, but faster and cheaper)
- **XLM** is the native currency (like dollars on PayPal)
- Transactions cost a tiny fee (~0.00001 XLM)

### What is a Wallet?
- Like a bank account, but it's a piece of software
- **Freighter** is a browser extension wallet (like a browser password manager, but for crypto)
- Wallets have:
  - **Public Key/Address**: Like an email address (share it to receive payments)
  - **Private Key**: Like a password (never share it, used to sign transactions)

### What is a Transaction?
- An action on the blockchain (send payment, change settings, etc.)
- Steps:
  1. Create transaction (what you want to do)
  2. Sign it with your wallet (prove you own it)
  3. Submit to network
  4. Wait for confirmation (~5 seconds)

### What is a Smart Contract?
- Code that runs on the blockchain
- The Counter page interacts with one - it's like calling a function that's stored on the blockchain
- More complex than regular payments

## 🛠️ Troubleshooting

**"Cannot find module '@stellar/stellar-sdk'"**
- Run `npm install` again

**Wallet connection fails**
- Make sure Freighter extension is installed and unlocked
- Check browser console (F12) for errors

**Transaction fails**
- Make sure you're using Testnet (not Mainnet) for testing
- Check you have test XLM in your wallet (get from [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test))
- Check browser console for error details

**Page not updating**
- Make sure dev server is running (`npm run dev`)
- Check for TypeScript errors
- Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

## 📦 Dependencies Explained

- **`next`** - React framework for building web apps
- **`react`** & **`react-dom`** - UI library
- **`@stellar/stellar-sdk`** - Official Stellar library for building transactions
- **`@stellar/freighter-api`** - Library to interact with Freighter wallet
- **`tailwindcss`** - CSS framework for styling
- **`typescript`** - Adds type checking to JavaScript

## 🚢 Building for Production

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Start production server:**
   ```bash
   npm start
   ```

3. **Deploy:**
   - Vercel (easiest): Connect GitHub repo to [Vercel](https://vercel.com)
   - Or any Node.js hosting service

## 📖 Learning Resources

- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev
- **Stellar Docs**: https://developers.stellar.org
- **Tailwind CSS**: https://tailwindcss.com/docs

## 💡 Next Steps / Ideas to Build

1. **Balance Display** - Show user's XLM balance on the home page
2. **Transaction History** - List recent transactions
3. **Multiple Assets** - Send currencies other than XLM
4. **QR Code Generator** - Generate QR codes for wallet addresses
5. **Batch Payments** - Send to multiple addresses at once
6. **Account Creation** - Create new Stellar accounts from the app
7. **Token Management** - Add/remove trustlines for custom tokens

## 🤝 Need Help?

- Check browser console (F12) for errors
- Check terminal where `npm run dev` is running
- Stellar Discord: https://discord.gg/stellar
- Stack Overflow: Tag questions with `stellar` and `nextjs`

---

## 📱 Follow the Developer

If you found this starter helpful or have questions, feel free to reach out!

[![Follow @fahmin_md on X](https://img.shields.io/twitter/follow/fahmin_md?style=social&label=Follow%20%40fahmin_md)](https://x.com/fahmin_md)

Or visit directly: [https://x.com/fahmin_md](https://x.com/fahmin_md)

---

**Happy building!** 🚀
