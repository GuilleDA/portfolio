import ramen from '../assets/ramen.png';
import arcade from '../assets/arcade.png';
import city from '../assets/city.png';
import airport from '../assets/girls.png';

export interface ImageData {
  src: string;
  alt: string;
}

export const baseImages: ImageData[] = [
  { src: ramen.src, alt: "Ramen bowl" },
  { src: arcade.src, alt: "Arcade game" },
  { src: city.src, alt: "City street" },
  { src: airport.src, alt: "Airport selfie" }
];

export const shuffleArray = (array: ImageData[]): ImageData[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const createRandomizedImages = (): ImageData[] => {
  const images: ImageData[] = [];
  const repetitions = 6;

  for (let i = 0; i < repetitions; i++) {
    images.push(...shuffleArray(baseImages));
  }

  return images;
};

