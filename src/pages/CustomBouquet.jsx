import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "../context/cartContext";
import { useAuth } from "../context/authContext";
import axios from "axios";
import { toast } from "react-toastify";

// Car Brands (UNCHANGED)
const carBrands = [
  { id: "toyota", name: "Toyota", image: "../img/cars/toyota.png" },
  { id: "honda", name: "Honda", image: "../img/cars/honda.jpeg" },
  { id: "bmw", name: "BMW", image: "../img/cars/bmw.webp" },
  { id: "audi", name: "Audi", image: "../img/cars/audi.avif" },
  { id: "nissan", name: "Nissan", image: "../img/cars/nissan.jpeg" },
];

// Cars per brand (UNCHANGED)
const carsByBrand = {
  toyota: [
    { id: "corolla", name: "Corolla" },
    { id: "camry", name: "Camry" },
    { id: "prius", name: "Prius" },
    { id: "rav4", name: "RAV4" },
  ],
  honda: [
    { id: "civic", name: "Civic" },
    { id: "accord", name: "Accord" },
    { id: "crv", name: "CR-V" },
    { id: "hrv", name: "HR-V" },
  ],
  bmw: [
    { id: "series3", name: "3 Series" },
    { id: "series5", name: "5 Series" },
    { id: "x5", name: "X5" },
    { id: "x3", name: "X3" },
  ],
  audi: [
    { id: "a4", name: "A4" },
    { id: "a6", name: "A6" },
    { id: "q5", name: "Q5" },
    { id: "q7", name: "Q7" },
  ],
  nissan: [
    { id: "altima", name: "Altima" },
    { id: "maxima", name: "Maxima" },
    { id: "murano", name: "Murano" },
    { id: "rogue", name: "Rogue" },
  ],
};

// Model years (UNCHANGED)
const modelYears = [
  "2025",
  "2024",
  "2023",
  "2022",
  "2021",
  "2020",
  "2019",
  "2018",
  "2017",
  "2016",
  "2015",
  "2014",
  "2013",
  "2012",
  "2011",
  "2010",
  "2009",
  "2008",
  "2007",
  "2006",
  "2005",
  "2004",
  "2003",
  "2002",
  "2001",
  "2000",
];
const productCategories = ["exterior", "color"]; // merged paint & wrap

// Preset colors + custom (UNCHANGED)
const colorOptions = [
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FFA500",
  "#800080",
  "#00FFFF",
  "#000000",
  "custom",
];

// NEW HELPER FUNCTION for descriptive color names
const getDescriptiveColorName = (hexCode) => {
  switch (hexCode.toUpperCase()) {
    case "#FF0000":
      return "Vibrant Red Metallic";
    case "#00FF00":
      return "Lime Green Gloss";
    case "#0000FF":
      return "Deep Sapphire Blue";
    case "#FFFF00":
      return "High-Vis Yellow";
    case "#FFA500":
      return "Burning Orange Pearl";
    case "#800080":
      return "Royal Purple";
    case "#00FFFF":
      return "Electric Cyan";
    case "#000000":
      return "Jet Black Matte";
    default:
      // For custom colors, just use the word "color" plus the hex for unique ID
      return `${hexCode} Color`;
  }
};

const CustomCar = () => {
  const { addToCart } = useCart();
  const { token } = useAuth();

  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [aiGeneratedImage, setAiGeneratedImage] = useState(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  const fetchProducts = async (category) => {
    try {
      const res = await axios.get("/api/products", {
        params: { brand: selectedBrand.id, category },
      });
      setProducts(res.data.products);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch products");
    }
  };

  // Add product - MODIFIED LOGIC FOR COLOR
  const handleAddProduct = (product) => {
    // Determine the descriptive name and unique ID for color products
    if (product.category === "color") {
      const descriptiveName = getDescriptiveColorName(product.hex);
      const colorProduct = {
        ...product,
        _id: `color-${product.hex}`, // Ensure unique ID based on hex
        name: descriptiveName, // Use the descriptive name for display and cart
        price: product.price,
      };

      // Replace previous color
      setSelectedProducts((prev) => [
        ...prev.filter((p) => p.category !== "color"),
        colorProduct,
      ]);

      // Recalculate total price for color replacement
      setTotalPrice(() => {
        const productsWithoutOldColor = selectedProducts.filter(
          (p) => p.category !== "color"
        );
        return productsWithoutOldColor.reduce((sum, p) => sum + p.price, 0) + colorProduct.price;
      });
    } else {
      // Logic for non-color products (exterior/interior)
      if (!selectedProducts.find((p) => p._id === product._id)) {
        setSelectedProducts((prev) => [...prev, product]);
        // Recalculate total price for added product
        setTotalPrice((prev) => prev + product.price);
      }
    }
  };

  // Delete product (UNCHANGED)
  const handleDeleteProduct = (productId) => {
    const updatedProducts = selectedProducts.filter((p) => p._id !== productId);
    setSelectedProducts(updatedProducts);
    // Recalculate total
    setTotalPrice(updatedProducts.reduce((sum, p) => sum + p.price, 0));
  };

  // Add to cart (UNCHANGED - relies on updated selectedProducts.name)
  const handleAddToCart = () => {
    if (!selectedCar) return;
    if (!token) {
      toast.error("Login first to order");
      return;
    }

    const customData = {
      name: `${selectedBrand.name} ${selectedCar.name}`,
      price: selectedProducts.reduce((sum, p) => sum + p.price, 0),
      image: aiGeneratedImage || selectedCar.image,
      details: selectedProducts.map((p) => ({
        label: p.category.charAt(0).toUpperCase() + p.category.slice(1),
        // This will now use the descriptive name for color!
        value: p.name, 
        price: p.price,
      })),
    };

    addToCart({ customData, quantity: 1 });

    // Reset all
    setSelectedBrand(null);
    setSelectedCar(null);
    setSelectedYear(null);
    setActiveCategory(null);
    setSelectedProducts([]);
    setProducts([]);
    setAiGeneratedImage(null);
    setTotalPrice(0);
  };

  // AI Generation - MODIFIED LOGIC FOR COLOR PROMPT
  const generateAICar = async () => {
    if (!selectedCar || !selectedYear) {
      toast.error("Select a car model and year first");
      return;
    }

    setIsGeneratingAI(true);

    // 1. Identify and format selected components
    const selectedColorProduct = selectedProducts.find(
      (p) => p.category === "color"
    );
    // The name is now descriptive (e.g., "Deep Sapphire Blue")
    const colorDetail = selectedColorProduct ? selectedColorProduct.name.replace(/#\w+ /g, '').trim() : ""; 
    
    // Filter out exterior/interior product names
    const nonColorFeatures = selectedProducts
      .filter((p) => p.category !== "color")
      .map((p) => p.name);

    // Format the non-color features into a sentence
    const featureDetail =
      nonColorFeatures.length > 0
        ? ` with **${nonColorFeatures.join(", ")}**`
        : "";

    // 2. Construct the core car and year description
    const coreCarDescription = `${selectedYear} ${selectedBrand.name} ${selectedCar.name}`;

    // 3. Prioritize color: if a color is selected, make it the main descriptive element
    let colorPromptPart = "";
    if (colorDetail) {
      // Use the descriptive name in the prompt
      colorPromptPart = ` in a stunning, high-gloss **${colorDetail}** finish`;
    }

    // Combine everything into a single, cohesive, and detailed prompt
    const prompt = `A hyper-realistic, cinematic, high-resolution image of a ${coreCarDescription}${colorPromptPart}${featureDetail}. Include glossy paint, realistic reflections, detailed textures, studio lighting, realistic shadows, vibrant colors, ultra-detailed, photorealistic environment, dynamic angle, 8K resolution, award-winning car photography style.`;

    try {
      const res = await axios.post("/api/image/generate-ai", { prompt });
      setAiGeneratedImage(res.data.imageUrl);
    } catch (err) {
      console.error(err);
      toast.error("AI generation failed");
    } finally {
      setIsGeneratingAI(false);
    }

    // Optional: Log the final prompt to the console for debugging/checking
    console.log("Generated AI Prompt:", prompt);
  };

  // Reset steps after clicking a step button (UNCHANGED)
  const goToStep = (step) => {
    switch (step) {
      case "brand":
        setSelectedBrand(null);
        setSelectedCar(null);
        setSelectedYear(null);
        setActiveCategory(null);
        setSelectedProducts([]);
        setProducts([]);
        setAiGeneratedImage(null);
        setTotalPrice(0);
        break;
      case "car":
        setSelectedCar(null);
        setSelectedYear(null);
        setActiveCategory(null);
        setSelectedProducts([]);
        setProducts([]);
        setAiGeneratedImage(null);
        setTotalPrice(0);
        break;
      case "year":
        setSelectedYear(null);
        setActiveCategory(null);
        setSelectedProducts([]);
        setProducts([]);
        setAiGeneratedImage(null);
        setTotalPrice(0);
        break;
      case "category":
        setActiveCategory(null);
        setSelectedProducts([]);
        setProducts([]);
        setAiGeneratedImage(null);
        setTotalPrice(0);
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-red-600 text-center mb-8">
          Build Your Car
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel */}
          <div className="bg-slate-900 rounded-lg shadow-md p-6">
            {/* Step Buttons (UNCHANGED) */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {selectedBrand && (
                <button
                  onClick={() => goToStep("brand")}
                  className="px-3 py-1 bg-gray-700 rounded hover:bg-red-600 text-sm"
                >
                  Brand
                </button>
              )}
              {selectedCar && (
                <button
                  onClick={() => goToStep("car")}
                  className="px-3 py-1 bg-gray-700 rounded hover:bg-red-600 text-sm"
                >
                  Car
                </button>
              )}
              {selectedYear && (
                <button
                  onClick={() => goToStep("year")}
                  className="px-3 py-1 bg-gray-700 rounded hover:bg-red-600 text-sm"
                >
                  Year
                </button>
              )}
              {activeCategory && (
                <button
                  onClick={() => goToStep("category")}
                  className="px-3 py-1 bg-gray-700 rounded hover:bg-red-600 text-sm"
                >
                  {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
                </button>
              )}
            </div>

            {/* Brand Selection (UNCHANGED) */}
            {!selectedBrand && (
              <>
                <h2 className="text-xl font-bold mb-4">Select Brand</h2>
                <div className="grid grid-cols-3 gap-4">
                  {carBrands.map((brand) => (
                    <motion.div
                      key={brand.id}
                      whileHover={{ scale: 1.05 }}
                      className="cursor-pointer rounded-lg overflow-hidden border-2 border-transparent "
                      onClick={() => setSelectedBrand(brand)}
                    >
                      <div className="h-24 w-24 hover:border-red-600 bg-white border flex items-center justify-center">
                        <img
                          src={brand.image}
                          alt={brand.name}
                          className="max-h-16 "
                        />
                      </div>
                      <p className="text-center h-24 w-24  text-white mt-2">
                        {brand.name}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            {/* Car Selection (UNCHANGED) */}
            {selectedBrand && !selectedCar && (
              <>
                <h2 className="text-xl font-bold mb-4">Select Car</h2>
                <div className="grid grid-cols-4 gap-4">
                  {carsByBrand[selectedBrand.id].map((car) => (
                    <motion.div
                      key={car.id}
                      whileHover={{ scale: 1.05 }}
                      className="cursor-pointer rounded-lg overflow-hidden border-2 border-transparent hover:border-red-600"
                      onClick={() => setSelectedCar(car)}
                    >
                      <p className="text-center font-extrabold text-xl flex items-center justify-center bg-white min-h-20 rounded text-black ">
                        {car.name}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            {/* Model Year Selection (UNCHANGED) */}
            {selectedCar && !selectedYear && (
              <>
                <h2 className="text-xl font-bold mb-4">Select Model Year</h2>
                <div className="flex gap-4 flex-wrap">
                  {modelYears.map((year) => (
                    <button
                      key={year}
                      className="px-4 py-2 bg-gray-800 rounded hover:bg-red-600"
                      onClick={() => setSelectedYear(year)}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Category Tabs (UNCHANGED) */}
            {selectedYear && (
              <>
                <div className="flex gap-2 mb-4 flex-wrap">
                  {productCategories.map((cat) => (
                    <button
                      key={cat}
                      className={`px-4 py-2 rounded ${
                        activeCategory === cat
                          ? "bg-red-600"
                          : "bg-gray-800 hover:bg-red-600"
                      }`}
                      onClick={() => {
                        setActiveCategory(cat);
                        if (cat === "color") setProducts([]);
                        else fetchProducts(cat);
                      }}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Color Tab - MODIFIED onClick payload */}
                {activeCategory === "color" && (
                  <div className="flex flex-wrap gap-4 mb-4">
                    {colorOptions.map((color, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        {
                          <div
                            onClick={() =>
                              handleAddProduct({
                                // NOTE: ID is now handled inside handleAddProduct
                                hex: color, // Pass hex value
                                price: 150000,
                                category: "color",
                                image: "",
                              })
                            }
                            style={{ backgroundColor: color }}
                            className="w-24 h-24 rounded  border-gray-400 cursor-pointer"
                          />
                        }
                      </div>
                    ))}
                  </div>
                )}

                {/* Product Grid for exterior/interior (UNCHANGED) */}
                {activeCategory && activeCategory !== "color" && (
                  <div className="grid grid-cols-2 gap-4">
                    {products.map((product) => (
                      <motion.div
                        key={product._id}
                        whileHover={{ scale: 1.05 }}
                        className="cursor-pointer rounded-lg overflow-hidden border-2 border-transparent hover:border-red-600 p-2 bg-slate-800"
                        onClick={() => handleAddProduct(product)}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-24 object-cover mb-2"
                        />
                        <p className="text-white text-sm">{product.name}</p>
                        <p className="text-gray-400 text-xs">
                          PKR {product.price.toLocaleString()}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Panel (UNCHANGED) */}
          <div className="bg-slate-900 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Car Preview</h2>
            <div className="bg-slate-800 rounded-lg min-h-[300px] flex items-center justify-center mb-4">
              {isGeneratingAI ? (
                <p className="text-red-600 animate-pulse">Generating image, please wait...</p>
              ) : aiGeneratedImage ? (
                <img
                  src={aiGeneratedImage}
                  alt="AI Generated Car"
                  className="max-h-72 object-contain"
                />
              ) : selectedCar ? (
                // Assuming selectedCar.image exists for initial preview
                <div
                  className="h-16 w-32 text-2xl flex items-center justify-center bg-white text-center text-black rounded-xl object-contain"
                >{selectedCar.name}</div>
              ) : (
                <p className="text-gray-400">
                  Select a brand and car to see preview
                </p>
              )}
            </div>

            {/* Selected Products (UNCHANGED) */}
            {selectedProducts.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-medium text-red-600 mb-2">
                  Selected Products
                </h3>
                <div className="space-y-2">
                  {selectedProducts.map((p) => (
                    <div
                      key={p._id}
                      className="flex justify-between items-center bg-slate-700 p-2 rounded"
                    >
                      <p className="text-sm">{p.name}</p>
                      <button
                        onClick={() => handleDeleteProduct(p._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Generation */}
            {selectedProducts.length > 0 && !aiGeneratedImage && (
              <button
                onClick={generateAICar}
                disabled={isGeneratingAI}
                className="w-full py-2 bg-gradient-to-r from-red-600 to-gray-800 rounded text-white mb-4"
              >
                {isGeneratingAI ? "Generating AI..." : "Generate AI Car"}
              </button>
            )}

            {/* Total & Add to Cart (UNCHANGED) */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium text-white">Total:</span>
              <span className="text-2xl font-bold text-slate-300">
                PKR {totalPrice.toLocaleString()}
              </span>
            </div>
            <button
              onClick={handleAddToCart}
              className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomCar;