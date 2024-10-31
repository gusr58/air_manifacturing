import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { CategoriesJSON } from "@/constants/Categories";

export default function BasicSelect({ personal, setSelectedUserRole }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  useEffect(() => {
    setSelectedCategory("");
    setSelectedSubCategory("");
    setSubCategories([]);
  }, [personal]);

  // Ana kategori değişikliği işleyici
  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    setSubCategories(CategoriesJSON[category]?.SubCategories || []);
    setSelectedSubCategory("");
  };

  // Alt kategori değişikliği işleyici
  const handleSubCategoryChange = (event) => {
    const subCategory = event.target.value;
    setSelectedSubCategory(subCategory);
    setSelectedUserRole(subCategory);
  };

  return (
    <Box sx={{ minWidth: 120, mt: 1 }}>
      {/* Ana Kategori Seçimi */}
      <FormControl fullWidth>
        <InputLabel id="category-label">Kategoriler</InputLabel>
        <Select
          labelId="category-label"
          id="category-select"
          value={selectedCategory}
          onChange={handleCategoryChange}
          label="Kategoriler"
        >
          {/* Sadece TAKIMLAR kategorisini göster */}
          <MenuItem key="teams" value="teams">
            {CategoriesJSON["teams"].CategoryTitle}
          </MenuItem>
        </Select>
      </FormControl>

      {/* Alt Kategori Seçimi */}
      {subCategories.length > 0 && (
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="sub-category-label">Alt Kategoriler</InputLabel>
          <Select
            labelId="sub-category-label"
            id="sub-category-select"
            value={selectedSubCategory}
            onChange={handleSubCategoryChange}
            label="Alt Kategoriler"
          >
            {subCategories.map((subCategory) => (
              <MenuItem key={subCategory.id} value={subCategory.id}>
                {subCategory.subCategoryTitle}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  );
}
