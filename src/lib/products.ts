export type Product = {
  id: string;
  title: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  description: string;
  prime: boolean;
};

export const products: Product[] = [
  {
    id: "1",
    title: "Echo Dot (5th Gen) Smart Speaker with Alexa",
    price: 49.99,
    rating: 4.7,
    reviews: 234112,
    image: "https://m.media-amazon.com/images/I/71xoR4A6q-L._AC_SL1500_.jpg",
    category: "Electronics",
    description:
      "Our most popular smart speaker with a fabric design. It is our most compact smart speaker that fits perfectly into small spaces.",
    prime: true,
  },
  {
    id: "2",
    title: "Apple AirPods Pro (2nd Generation) Wireless Earbuds",
    price: 199.0,
    rating: 4.8,
    reviews: 88450,
    image: "https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg",
    category: "Electronics",
    description:
      "AirPods Pro feature up to 2x more Active Noise Cancellation, Adaptive Transparency, and Personalized Spatial Audio.",
    prime: true,
  },
  {
    id: "3",
    title: "Kindle Paperwhite (16 GB) – Now with a 6.8\" display",
    price: 149.99,
    rating: 4.6,
    reviews: 42010,
    image: "https://m.media-amazon.com/images/I/61Ww4abZqWL._AC_SL1000_.jpg",
    category: "Electronics",
    description:
      "The thinnest, lightest Kindle Paperwhite yet, with a flush-front design and 300 ppi glare-free display.",
    prime: true,
  },
  {
    id: "4",
    title: "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
    price: 89.95,
    rating: 4.7,
    reviews: 178902,
    image: "https://m.media-amazon.com/images/I/71V1LrY1MSL._AC_SL1500_.jpg",
    category: "Home & Kitchen",
    description:
      "America's most loved multi cooker. Pressure cook, slow cook, rice cooker, yogurt maker, steamer, sauté pan and warmer.",
    prime: true,
  },
  {
    id: "5",
    title: "Ninja AF101 Air Fryer, 4 Quart",
    price: 99.99,
    rating: 4.7,
    reviews: 51230,
    image: "https://m.media-amazon.com/images/I/71+8uTMDRFL._AC_SL1500_.jpg",
    category: "Home & Kitchen",
    description:
      "Healthier fried foods with up to 75% less fat than traditional frying methods.",
    prime: true,
  },
  {
    id: "6",
    title: "Atomic Habits by James Clear",
    price: 11.98,
    rating: 4.8,
    reviews: 152300,
    image: "https://m.media-amazon.com/images/I/81wgcld4wxL._SL1500_.jpg",
    category: "Books",
    description:
      "An easy & proven way to build good habits & break bad ones. Tiny changes, remarkable results.",
    prime: true,
  },
  {
    id: "7",
    title: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
    price: 348.0,
    rating: 4.6,
    reviews: 18920,
    image: "https://m.media-amazon.com/images/I/61+btxzpfDL._AC_SL1500_.jpg",
    category: "Electronics",
    description:
      "Industry-leading noise canceling with two processors and eight microphones. Crystal clear hands-free calling.",
    prime: true,
  },
  {
    id: "8",
    title: "LEGO Star Wars The Mandalorian's N-1 Starfighter",
    price: 59.99,
    rating: 4.9,
    reviews: 4321,
    image: "https://m.media-amazon.com/images/I/81fHJ2Cv9NL._AC_SL1500_.jpg",
    category: "Toys & Games",
    description:
      "Buildable model of Din Djarin's N-1 Starfighter with Grogu, IG-11 and Peli Motto minifigures.",
    prime: true,
  },
];

export const categories = [
  { name: "Electronics", image: "https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg" },
  { name: "Home & Kitchen", image: "https://m.media-amazon.com/images/I/71V1LrY1MSL._AC_SL1500_.jpg" },
  { name: "Books", image: "https://m.media-amazon.com/images/I/81wgcld4wxL._SL1500_.jpg" },
  { name: "Toys & Games", image: "https://m.media-amazon.com/images/I/81fHJ2Cv9NL._AC_SL1500_.jpg" },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);
