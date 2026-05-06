import { Category } from '../models/category.model';

export const CATEGORIES: Category[] = [
  {
    name: 'Electronics',
    subcategories: [
      { label: 'Mobiles', slug: 'mobiles' },
      { label: 'Laptops', slug: 'laptops' },
      { label: 'Headphones', slug: 'headphones' },
      { label: 'Smart Watches', slug: 'smart-watches' },
    ],
  },
  {
    name: 'Fashion',
    subcategories: [
      { label: "Men's Fashion", slug: 'mens-fashion' },
      { label: "Women's Fashion", slug: 'womens-fashion' },
    ],
  },
  {
    name: 'Bags',
    subcategories: [
      { label: 'Backpacks', slug: 'backpacks' },
      { label: 'Travel Bags', slug: 'travel-bags' },
    ],
  },
  {
    name: 'Footwear',
    subcategories: [
      { label: 'Sneakers', slug: 'sneakers' },
      { label: 'Sandals', slug: 'sandals' },
    ],
  },
  {
    name: 'Groceries',
    subcategories: [
      { label: 'Rice', slug: 'rice' },
      { label: 'Oil', slug: 'oil' },
      { label: 'Snacks', slug: 'snacks' },
    ],
  },
  {
    name: 'Beauty',
    subcategories: [
      { label: 'Makeup', slug: 'makeup' },
      { label: 'Skincare', slug: 'skincare' },
    ],
  },
  {
    name: 'Wellness',
    subcategories: [
      { label: 'Supplements', slug: 'supplements' },
      { label: 'Yoga', slug: 'yoga' },
    ],
  },
  {
    name: 'Jewellery',
    subcategories: [
      { label: 'Gold', slug: 'gold' },
      { label: 'Silver', slug: 'silver' },
      { label: 'Rings', slug: 'rings' },
    ],
  },
];

// import { Category } from '../models/category.model';

// export const CATEGORIES: Category[] = [
//   {
//     name: 'Electronics',
//     subcategories: ['Mobiles', 'Laptops', 'Headphones', 'Smart Watches'],
//   },
//   {
//     name: 'Fashion',
//     subcategories: ["Men's Fashion", "Women's Fashion"],
//   },
//   {
//     name: 'Bags',
//     subcategories: ['Backpacks', 'Travel Bags'],
//   },
//   {
//     name: 'Footwear',
//     subcategories: ['Sneakers', 'Sandals'],
//   },
//   {
//     name: 'Groceries',
//     subcategories: ['Rice', 'Oil', 'Snacks'],
//   },
//   {
//     name: 'Beauty',
//     subcategories: ['Makeup', 'Skincare'],
//   },
//   {
//     name: 'Wellness',
//     subcategories: ['Supplements', 'Yoga'],
//   },
//   {
//     name: 'Jewellery',
//     subcategories: ['Gold', 'Silver', 'Rings'],
//   },
// ];
