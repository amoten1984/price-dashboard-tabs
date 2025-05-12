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
    ...new Set(
      data.filter((item) => item.Brand === selectedBrand).map((item) => item.Category)
    ),
  ];
  const models = [
    ...new Set(
      data
        .filter(
          (item) => item.Brand === selectedBrand && item.Category === selectedCategory
        )
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
    <div className="bg-[#f4f6f9] min-h-screen px-4 sm:px-6 lg:px-8 py-8 text-gray-900 font-sans">
      <header className="mb-10">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-900">Live Price Lookup</h1>
          <p className="text-sm text-gray-600 mt-2">
            Powered by Google Sheets – Real-time & Reliable
          </p>
        </div>
      </header>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">1. Choose Brand</h2>
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
              className={`px-4 py-2 rounded border shadow text-sm font-medium transition-all duration-200 ${
                selectedBrand === brand ? "bg-blue-600 text-white" : "bg-white hover:bg-blue-100"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {selectedBrand && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">2. Choose Category</h2>
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
                className={`px-4 py-2 rounded border shadow text-sm font-medium transition-all duration-200 ${
                  selectedCategory === cat ? "bg-green-600 text-white" : "bg-white hover:bg-green-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedCategory && (
        <div className="mb-10" ref={modelRef}>
          <h2 className="text-lg font-semibold mb-4">3. Choose Model</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {models.map((model) => (
              <button
                key={model}
                onClick={() => {
                  setSelectedModel(model);
                  setSelectedCondition(null);
                  setSelectedStorage(null);
                }}
                className={`p-4 rounded-xl shadow border transition text-left ${
                  selectedModel === model
                    ? "bg-blue-900 text-white border-blue-900"
                    : "bg-white hover:shadow-md"
                }`}
              >
                <div className="text-base font-semibold">{model}</div>
                <div className="text-sm text-red-500 mt-1">
                  Starting from: ${startingPrice(model)}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedModel && (
        <div
          ref={detailRef}
          className="bg-white rounded-xl shadow p-6 max-w-xl mx-auto mt-6"
        >
          <h2 className="text-xl font-bold mb-2">{selectedModel}</h2>
          <p className="text-sm text-gray-500 mb-4">
            SKU: {selectedModel.toUpperCase().replace(/\s+/g, "_")} | In Stock
          </p>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-600">Current Price:</h3>
            <div className="text-3xl font-bold text-green-600">
              {priceEntry ? priceEntry.price : <span className="text-base text-gray-400">Select options</span>}
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm font-medium mb-1">Condition</p>
            <div className="flex flex-wrap gap-2">
              {availableConditions.map((cond) => (
                <button
                  key={cond}
                  onClick={() => setSelectedCondition(cond)}
                  className={`px-3 py-1 rounded text-sm border font-medium transition ${
                    selectedCondition === cond
                      ? "bg-blue-900 text-white border-blue-900"
                      : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-1">Storage</p>
            <div className="flex flex-wrap gap-2">
              {availableStorages.map((stor) => {
                const disabled = selectedCondition && isDisabled(selectedCondition, stor);
                const selected = stor === selectedStorage;

                return (
                  <button
                    key={stor}
                    onClick={() => !disabled && setSelectedStorage(stor)}
                    className={`px-3 py-1 rounded text-sm font-medium border transition ${
                      selected
                        ? "bg-blue-900 text-white border-blue-900"
                        : disabled
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300"
                        : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
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
