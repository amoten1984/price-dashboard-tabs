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
    (v) =>
      v.condition === selectedCondition && v.storage === selectedStorage
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

  // Auto scroll
  useEffect(() => {
    if (selectedModel && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedModel]);

  // Auto-select when one variant exists
  useEffect(() => {
    if (filteredByModel.length === 1) {
      setSelectedCondition(filteredByModel[0].Condition);
      setSelectedStorage(filteredByModel[0].Storage);
    }
  }, [selectedModel]);

  return (
    <div className="bg-[#f9fafb] min-h-screen px-4 sm:px-6 lg:px-8 py-6 text-gray-800">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <div className="text-3xl">📈</div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800 tracking-tight">
            Price Lookup Dashboard
          </h1>
        </div>
        <p className="mt-2 text-sm text-slate-500">
          Quickly browse available models by brand and category.
        </p>
      </header>

      {/* Step 1: Brand */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-slate-700 mb-2">Step 1: Choose a Brand</h2>
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
              className={`px-4 py-2 rounded-lg shadow-sm text-sm font-medium border transition ${
                selectedBrand === brand
                  ? "bg-blue-600 text-white"
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
          <h2 className="text-lg font-medium text-slate-700 mb-2">Step 2: Choose a Category</h2>
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
                className={`px-4 py-2 rounded-lg shadow-sm text-sm font-medium border transition ${
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
    <h2 className="text-lg font-medium text-slate-700 mb-4">Step 3: Choose a Model</h2>
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
              ? "bg-neutral-900 text-white border-neutral-900"
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
          className="bg-white rounded shadow p-4 max-w-md mt-6 mx-auto"
        >
          <h2 className="text-xl font-semibold">{selectedModel}</h2>
          <p className="text-blue-600 text-sm mt-1">
            SKU: {selectedModel.toUpperCase().replace(/\s+/g, "_")}{" "}
            <span className="text-green-600">| In Stock</span>
          </p>

          <p className="text-2xl font-bold mt-3">
            {priceEntry ? (
              priceEntry.price
            ) : (
              <span className="text-lg">Select options</span>
            )}
          </p>

          {/* Condition */}
          <div className="mt-4">
            <p className="font-medium mb-1">Condition:</p>
            <div className="flex gap-2 flex-wrap">
              {availableConditions.map((cond) => (
                <button
                  key={cond}
                  onClick={() => setSelectedCondition(cond)}
                  className={`px-4 py-1 rounded border text-sm ${
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
                    className={`px-4 py-1 rounded border text-sm ${
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
