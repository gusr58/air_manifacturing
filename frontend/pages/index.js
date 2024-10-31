import React from 'react';
import Box from '@mui/material/Box';
import styles from './Layout.module.css';
import Upside from '@/component/cards/Carousel';
import { MainCategories } from '@/constants/CardValues';
import CategoryCard from '@/component/cards/CategoryCard';

export default function Dashboard() {
  return (
    <>
      <Upside/>

      <Box className={styles.cardContainer}>
      {MainCategories.map((category, index) => (
          <CategoryCard
            key={index}
            cardImage={category.cardImage}
            cardTitle={category.cardTitle}
            urlPath={category.url_path}
            tooltipText={category.tooltipText}
          />
        ))}
      </Box>
    </>
  );
}
