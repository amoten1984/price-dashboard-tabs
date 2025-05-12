import React, { useEffect, useState, useRef } from "react";
import { Building2, Box, Smartphone, Wrench, HardDrive } from "lucide-react";

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
    <div className="bg-gradient-to-b from-slate-50 to-slate-100 min-h-screen px-4 sm:px-6 lg:px-8 py-6 text-slate-800">
      {/* Hero Section */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-700 tracking-tight mb-2">
          Live Product Pricing
        </h1>
        <p className="text-base sm:text-lg text-slate-600">
          View and filter real-time prices — powered by Google Sheets.
        </p>
      </header>

      {/* Step 1: Brand */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <Building2 className="w-5 h-5" /> Step 1: Choose a Brand
        </h2>
        <div className="flex flex-wrap gap-3">
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
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition shadow-sm ${
                selectedBrand === brand
                  ? "bg-blue-700 text-white"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Category */}
      {selectedBrand && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Box className="w-5 h-5" /> Step 2: Choose a Category
          </h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedModel("");
                  setSelectedCondition(null);
                  setSelectedStorage(null);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition shadow-sm ${
                  selectedCategory === cat
                    ? "bg-green-600 text-white"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Model */}
      {selectedCategory && (
        <div className="mb-8" ref={modelRef}>
          <h2 className="text-xl font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Smartphone className="w-5 h-5" /> Step 3: Choose a Model
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {models.map((model) => (
              <button
                key={model}
                onClick={() => {
                  setSelectedModel(model);
                  setSelectedCondition(null);
                  setSelectedStorage(null);
                }}
                className={`rounded-xl p-4 h-full text-left shadow-md border transition-all duration-200 ${
                  selectedModel === model
                    ? "bg-slate-800 text-white border-slate-800"
                    : "bg-white border-gray-300 text-gray-800 hover:border-gray-400 hover:shadow"
                }`}
              >
                <div className="text-base font-semibold leading-tight">{model}</div>
                <div className="mt-1 text-sm text-red-500 font-medium">
                  🔥 Starting from: ${startingPrice(model)}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selection Details */}
      {selectedModel && (
        <div
          ref={detailRef}
          className="bg-white rounded-xl shadow-lg p-6 max-w-xl mt-6 mx-auto border border-slate-200"
        >
          <h2 className="text-2xl font-bold text-slate-800">{selectedModel}</h2>
          <p className="text-sm text-gray-500 mt-1">
            SKU:{" "}
            <span className="text-gray-600 font-mono">
              {selectedModel.toUpperCase().replace(/\s+/g, "_")}
            </span>{" "}
            <span className="text-green-600 font-semibold">| In Stock</span>
          </p>

          <div className="mt-4 mb-6">
            <p className="text-sm font-medium text-gray-600 mb-1">Current Price:</p>
            <div className="text-3xl font-bold text-green-600 tracking-tight">
              {priceEntry ? priceEntry.price : <span className="text-base text-gray-400">Select options</span>}
            </div>
          </div>

          <div className="mb-4">
            <p className="font-medium text-sm text-gray-700 mb-1 flex items-center gap-1">
              <Wrench className="w-4 h-4" /> Condition:
            </p>
            <div className="flex flex-wrap gap-2">
              {availableConditions.map((cond) => (
                <button
                  key={cond}
                  onClick={() => setSelectedCondition(cond)}
                  className={`px-4 py-1.5 rounded-md text-sm border font-medium transition ${
                    selectedCondition === cond
                      ? "bg-slate-800 text-white border-slate-800"
                      : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-medium text-sm text-gray-700 mb-1 flex items-center gap-1">
              <HardDrive className="w-4 h-4" /> Storage:
            </p>
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
                        ? "bg-slate-800 text-white border-slate-800"
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
  );
}
