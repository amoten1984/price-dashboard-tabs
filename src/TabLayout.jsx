import React, { useEffect, useState, useRef } from "react";

export default function TabLayout() {
  const [data, setData] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const modelRef = useRef(null);
  const detailRef = useRef(null);

  useEffect(() => {
    fetch("https://opensheet.elk.sh/1jUdicX66G1c3J7KrntHgCc9bj07xu6Re4fVV8nw45GQ/Sheet1")
      .then((res) => res.json())
      .then((sheet) => {
        const cleaned = sheet.filter((row) => row.Brand !== "INFO" && row.Price);
        setData(cleaned);
      });
  }, []);

  useEffect(() => {
    if (selectedModel && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (selectedCategory && modelRef.current) {
      modelRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedModel, selectedCategory]);

  const brands = [...new Set(data.map((item) => item.Brand))];
  const categories = [...new Set(data.filter(item => item.Brand === selectedBrand).map(item => item.Category))];
  const models = [...new Set(data.filter(item => item.Brand === selectedBrand && item.Category === selectedCategory).map(item => item.Model))];

  const filteredByModel = data.filter(item =>
    item.Brand === selectedBrand &&
    item.Category === selectedCategory &&
    item.Model === selectedModel
  );

  const availableConditions = [...new Set(filteredByModel.map(item => item.Condition))];
  const availableStorages = [...new Set(filteredByModel.map(item => item.Storage))];

  const allVariants = filteredByModel.map(item => ({
    condition: item.Condition,
    storage: item.Storage,
    price: item.Price,
  }));

  const priceEntry = allVariants.find(v =>
    v.condition === selectedCondition && v.storage === selectedStorage
  );

  const isDisabled = (condition, storage) => {
    return !allVariants.find(v => v.condition === condition && v.storage === storage);
  };

  const startingPrice = (model) => {
    const prices = data
      .filter(item =>
        item.Brand === selectedBrand &&
        item.Category === selectedCategory &&
        item.Model === model
      )
      .map(item => parseFloat(item.Price?.replace(/[^\d.]/g, "")) || 0);
    return Math.min(...prices);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-lg mb-6 shadow-md">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          📊 Price Lookup Dashboard (Tab View)
        </h1>
        <p className="text-sm text-white/90 mt-1">Instant price lookup by brand, category, and model</p>
      </div>

      {/* Step 1 */}
      <div className="bg-white p-4 rounded-lg mb-4 shadow-md">
        <p className="font-semibold text-lg mb-2">📱 Step 1: Choose a Brand</p>
        <div className="flex flex-wrap gap-2">
          {brands.map(brand => (
            <button
              key={brand}
              onClick={() => {
                setSelectedBrand(brand);
                setSelectedCategory("");
                setSelectedModel("");
                setSelectedCondition(null);
                setSelectedStorage(null);
              }}
              className={`px-4 py-2 rounded-full transition ${
                selectedBrand === brand
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2 */}
      {selectedBrand && (
        <div className="bg-white p-4 rounded-lg mb-4 shadow-md">
          <p className="font-semibold text-lg mb-2">🧩 Step 2: Choose a Category</p>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedModel("");
                  setSelectedCondition(null);
                  setSelectedStorage(null);
                }}
                className={`px-4 py-2 rounded-full transition ${
                  selectedCategory === cat
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3 */}
      {selectedCategory && (
        <div
          ref={modelRef}
          className="bg-white p-4 rounded-lg mb-4 shadow-md"
        >
          <p className="font-semibold text-lg mb-4">📦 Step 3: Choose a Model</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {models.map(model => (
              <button
                key={model}
                onClick={() => {
                  setSelectedModel(model);
                  setSelectedCondition(null);
                  setSelectedStorage(null);
                }}
                className={`rounded-xl p-4 h-full text-left shadow-sm transition ${
                  selectedModel === model
                    ? "bg-black text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                <div className="font-semibold text-base mb-1">{model}</div>
                <div className="text-sm text-red-500">
                  🔥 Starting from: ${startingPrice(model)}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Model Details */}
      {selectedModel && (
        <div
          ref={detailRef}
          className="bg-white p-4 rounded-lg shadow-md max-w-md mx-auto mt-6"
        >
          <h2 className="text-xl font-semibold">{selectedModel}</h2>
          <p className="text-blue-600 text-sm mt-1">
            SKU: {selectedModel.toUpperCase().replace(/\s+/g, "_")}{" "}
            <span className="text-green-600">| In Stock</span>
          </p>

          <p className="text-3xl font-bold mt-3">
            {priceEntry ? priceEntry.price : <span className="text-lg text-gray-500">Select options</span>}
          </p>

          <div className="mt-4">
            <p className="font-medium mb-1">Condition:</p>
            <div className="flex gap-2 flex-wrap">
              {availableConditions.map(cond => (
                <button
                  key={cond}
                  onClick={() => setSelectedCondition(cond)}
                  className={`px-4 py-1 rounded border ${
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

          <div className="mt-4">
            <p className="font-medium mb-1">Storage:</p>
            <div className="flex gap-2 flex-wrap">
              {availableStorages.map(stor => {
                const disabled = selectedCondition && isDisabled(selectedCondition, stor);
                const selected = stor === selectedStorage;

                return (
                  <button
                    key={stor}
                    onClick={() => !disabled && setSelectedStorage(stor)}
                    className={`px-4 py-1 rounded border ${
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
