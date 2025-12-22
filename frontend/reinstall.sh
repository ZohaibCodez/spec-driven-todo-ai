#!/bin/bash
echo "Cleaning node_modules..."
rm -rf node_modules package-lock.json .next

echo "Installing dependencies..."
npm install

echo "Done! Now run: npm run dev"
