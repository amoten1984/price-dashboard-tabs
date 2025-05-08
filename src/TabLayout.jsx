import React, { useEffect, useState, useRef } from "react";

export default function TabLayout() {
  const [data, setData] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const variantRef = useRef(null);

  useEffect(() => {
    fetch(
      "https://opensheet.elk.sh/1jUdicX66G1c3J7KrntHgCc9bj07xu6Re4fVV8nw45GQ/Sheet1"
    )
      .then((res) => res.json())
      .then((sheet) => {
        const cleaned = sheet.filter((row) => row.Brand !== "INFO" && row.Price);
        setData(cleaned);
      });
  }, []);

  const handleScrollTo = (ref) => {
    setTimeout(() => {
      ref?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100); // Delay for DOM render
  };

  const brands = [...new Set(data.map((item) => item.Brand))];
  const categories = [...new Set(data.filter(item => item.Brand === selectedBrand).map((item) => item.Category))];
  const models = [
    ...new Set(
      data
        .filter((item) => item.Brand === selectedBrand && item.Category === selectedCategory)
        .map((item) => item.Model)
    ),
  ];

  const filteredByModel = data.filter(
    (item) =>
      item.Brand === selectedBrand &&
      item.Category === selectedCategory &&
      item.Model === selectedModel
  );

  const availableConditions = [
    ...new Set(filteredByModel.map((item) => item.Condition)),
  ];
  const availableStorages = [
    ...new Set(filteredByModel.map((item) => item.Storage)),
  ];

  const allVariants = filteredByModel.map((item) => ({
    condition: item.Condition,
    storage: item.Storage,
    price: item.Price,
  }));

  const priceEntry = allVariants.find(
    (v) => v.condition === selectedCondition && v.storage === selectedStorage
  );

  const isDisabled = (condition, storage) => {
    return !allVariants.find(
      (v) => v.condition === condition && v.storage === storage
    );
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen text-gray-900">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
        📊 Price Lookup Dashboard (Tab View)
      </h1>

      {/* Brand selection */}
      <div className="mb-4">
        <p className="font-semibold">Step 1: Choose a Brand</p>
        <div className="flex gap-2 flex-wrap mt-2">
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => {
                setSelectedBrand(brand);
                setSelectedCategory("");
                setSelectedModel("");
                setSelectedCondition(null);
                setSelectedStorage(null);
              }}
              className={`px-3 py-1 rounded text-sm sm:text-base ${
                selectedBrand === brand
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Category selection */}
      {selectedBrand && (
        <div className="mb-4">
          <p className="font-semibold">Step 2: Choose a Category</p>
          <div className="flex gap-2 flex-wrap mt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedModel("");
                  setSelectedCondition(null);
                  setSelectedStorage(null);
                }}
                className={`px-3 py-1 rounded text-sm sm:text-base ${
                  selectedCategory === cat
                    ? "bg-green-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Model selection */}
      {selectedCategory && (
        <div className="mb-4">
          <p className="font-semibold mb-2">Step 3: Choose a Model</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {models.map((model) => {
              const minPrice = Math.min(
                ...data
                  .filter(
                    (item) =>
                      item.Brand === selectedBrand &&
                      item.Category === selectedCategory &&
                      item.Model === model
                  )
                  .map((item) => parseFloat(item.Price.replace(/[^\d.]/g, "")) || 0)
              );

              return (
                <button
                  key={model}
                  onClick={() => {
                    setSelectedModel(model);
                    setSelectedCondition(null);
                    setSelectedStorage(null);
                    handleScrollTo(variantRef);
                  }}
                  className={`aspect-square w-full rounded-md shadow text-left flex flex-col justify-center items-center transition-all duration-200 ${
                    selectedModel === model ? "bg-black text-white" : "bg-white"
                  }`}
                >
                  <span className="text-sm sm:text-base font-bold text-center leading-tight px-2">
                    {model}
                  </span>
                  <span className="text-xs sm:text-sm text-red-600 mt-1 text-center">
                    🔥 Starting from: ${minPrice}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Variant viewer */}
      {selectedModel && (
        <div
          ref={variantRef}
          className="bg-white rounded shadow p-4 mt-4 w-full max-w-md mx-auto"
        >
          <h2 className="text-lg font-semibold">{selectedModel}</h2>
          <p className="text-blue-600 text-sm mt-1">
            SKU: {selectedModel.toUpperCase().replace(/\s+/g, "_")}{" "}
            <span className="text-green-600">| In Stock</span>
          </p>

          <p className="text-2xl font-bold mt-2">
            {priceEntry ? priceEntry.price : <span className="text-lg">Select options</span>}
          </p>

          {/* Condition */}
          <div className="mt-4">
            <p className="font-medium mb-1">Condition:</p>
            <div className="flex gap-2 flex-wrap">
              {availableConditions.map((cond) => (
                <button
                  key={cond}
                  onClick={() => setSelectedCondition(cond)}
                  className={`px-3 py-1 rounded border text-sm ${
                    selectedCondition === cond
                      ? "bg-black text-white"
                      : "bg-white"
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>

          {/* Storage */}
          <div className="mt-4">
            <p className="font-medium mb-1">Storage:</p>
            <div className="flex gap-2 flex-wrap">
              {availableStorages.map((stor) => {
                const disabled = selectedCondition && isDisabled(selectedCondition, stor);
                const selected = stor === selectedStorage;

                return (
                  <button
                    key={stor}
                    onClick={() => !disabled && setSelectedStorage(stor)}
                    className={`px-3 py-1 rounded border text-sm ${
                      selected
                        ? "bg-black text-white"
                        : disabled
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white"
                    }`}
                    disabled={disabled}
                  >
                    {stor}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
