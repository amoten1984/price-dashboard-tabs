import React, { useEffect, useState, useRef } from "react";
import { Flame, Smartphone, Layers, PackageCheck } from "lucide-react";

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
    fetch(
      "https://opensheet.elk.sh/1jUdicX66G1c3J7KrntHgCc9bj07xu6Re4fVV8nw45GQ/Sheet1"
    )
      .then((res) => res.json())
      .then((sheet) => {
        const cleaned = sheet.filter((row) => row.Brand !== "INFO" && row.Price);
        setData(cleaned);
      });
  }, []);

  const brands = [...new Set(data.map((item) => item.Brand))];
  const categories = [
    ...new Set(data.filter((item) => item.Brand === selectedBrand).map((item) => item.Category)),
  ];
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

  const availableConditions = [...new Set(filteredByModel.map((item) => item.Condition))];
  const availableStorages = [...new Set(filteredByModel.map((item) => item.Storage))];

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

  const startingPrice = (model) => {
    const entries = data.filter(
      (item) =>
        item.Brand === selectedBrand &&
        item.Category === selectedCategory &&
        item.Model === model
    );
    return Math.min(
      ...entries.map((item) => parseFloat(item.Price?.replace(/[^\d.]/g, "")) || 0)
    );
  };

  useEffect(() => {
    if (selectedModel && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedModel]);

  useEffect(() => {
    if (filteredByModel.length === 1) {
      setSelectedCondition(filteredByModel[0].Condition);
      setSelectedStorage(filteredByModel[0].Storage);
    }
  }, [selectedModel]);

  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-800 min-h-screen">
      {/* Hero Section */}
      <section className="text-center py-14 px-4 sm:px-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight">Live Product Pricing</h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
          Instantly share your latest pricing via Google Sheets. No code. Mobile optimized.
        </p>
        <a href="#dashboard" className="inline-block mt-6 px-6 py-3 bg-black text-white rounded-lg text-sm font-medium shadow hover:bg-gray-800 transition">
          View Live Demo
        </a>
      </section>

      {/* Dashboard */}
      <div id="dashboard" className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-2">
          <PackageCheck className="w-6 h-6 text-blue-500" /> Price Lookup Dashboard
        </h2>

        {/* Step 1 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-blue-600" /> Step 1: Choose a Brand
          </h3>
          <div className="flex flex-wrap gap-2">
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
                className={`px-4 py-2 rounded-md border text-sm font-medium transition ${
                  selectedBrand === brand ? "bg-blue-600 text-white" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2 */}
        {selectedBrand && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Layers className="w-5 h-5 text-green-600" /> Step 2: Choose a Category
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSelectedModel("");
                    setSelectedCondition(null);
                    setSelectedStorage(null);
                  }}
                  className={`px-4 py-2 rounded-md border text-sm font-medium transition ${
                    selectedCategory === cat ? "bg-green-600 text-white" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
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
          <div className="mb-8" ref={modelRef}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" /> Step 3: Choose a Model
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {models.map((model) => (
                <button
                  key={model}
                  onClick={() => {
                    setSelectedModel(model);
                    setSelectedCondition(null);
                    setSelectedStorage(null);
                  }}
                  className={`rounded-lg p-4 text-left border shadow-sm transition ${
                    selectedModel === model ? "bg-black text-white border-black" : "bg-white text-gray-800 border-gray-200 hover:shadow-md"
                  }`}
                >
                  <div className="font-semibold text-base">{model}</div>
                  <div className="text-sm text-red-500">🔥 Starting from: ${startingPrice(model)}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Details */}
        {selectedModel && (
          <div ref={detailRef} className="bg-white p-6 rounded-xl shadow-lg max-w-xl mx-auto">
            <h4 className="text-xl font-bold mb-1">{selectedModel}</h4>
            <p className="text-sm text-gray-500 mb-4">
              SKU: <span className="font-mono text-gray-600">{selectedModel.toUpperCase().replace(/\s+/g, "_")}</span> | <span className="text-green-600 font-medium">In Stock</span>
            </p>
            <div className="text-3xl font-extrabold text-green-600 mb-6">
              {priceEntry ? priceEntry.price : <span className="text-base text-gray-400">Select options</span>}
            </div>

            {/* Condition */}
            <div className="mb-4">
              <p className="font-semibold text-sm text-gray-700 mb-2">Condition:</p>
              <div className="flex flex-wrap gap-2">
                {availableConditions.map((cond) => (
                  <button
                    key={cond}
                    onClick={() => setSelectedCondition(cond)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium border transition ${
                      selectedCondition === cond ? "bg-black text-white border-black" : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            {/* Storage */}
            <div>
              <p className="font-semibold text-sm text-gray-700 mb-2">Storage:</p>
              <div className="flex flex-wrap gap-2">
                {availableStorages.map((stor) => {
                  const disabled = selectedCondition && isDisabled(selectedCondition, stor);
                  const selected = stor === selectedStorage;
                  return (
                    <button
                      key={stor}
                      onClick={() => !disabled && setSelectedStorage(stor)}
                      className={`px-4 py-1.5 rounded-md text-sm font-medium border transition ${
                        selected
                          ? "bg-black text-white border-black"
                          : disabled
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300"
                          : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
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
    </div>
  );
}
