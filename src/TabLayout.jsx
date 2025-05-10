import React, { useEffect, useState, useRef } from "react";

export default function WebsiteLayout() {
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
    <div className="bg-[#f9fafb] min-h-screen font-sans">
      {/* Hero Header */}
      <header className="w-full bg-white shadow border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            📈 Price Lookup Dashboard
          </h1>
          <a href="#details" className="text-sm text-blue-600 hover:underline">
            How it works
          </a>
        </div>
      </header>

      {/* Intro Section */}
      <section className="text-center py-10 px-4 bg-white border-b">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          Instantly Search Product Prices
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Let your customers check real-time pricing from your inventory using Google Sheets.
          No code. No delay. Just $99.
        </p>
      </section>

      {/* Tab Section */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-2">Step 1: Choose a Brand</h2>
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
                className={`px-4 py-2 rounded-md border text-sm font-medium transition shadow-sm ${
                  selectedBrand === brand
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {selectedBrand && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Step 2: Choose a Category</h2>
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
                  className={`px-4 py-2 rounded-md border text-sm font-medium transition shadow-sm ${
                    selectedCategory === cat
                      ? "bg-green-600 text-white"
                      : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
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
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Step 3: Choose a Model</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {models.map((model) => (
                <button
                  key={model}
                  onClick={() => {
                    setSelectedModel(model);
                    setSelectedCondition(null);
                    setSelectedStorage(null);
                  }}
                  className={`rounded-lg p-4 text-left border transition shadow-sm h-full ${
                    selectedModel === model
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-800 border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="text-base font-semibold mb-1">{model}</div>
                  <div className="text-sm text-red-500 font-medium">
                    🔥 Starting from: ${startingPrice(model)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedModel && (
          <div
            ref={detailRef}
            id="details"
            className="bg-white rounded-lg shadow p-6 max-w-lg mx-auto mt-10 border"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedModel}</h3>
            <p className="text-sm text-gray-600 mb-4">
              SKU: <span className="font-mono">{selectedModel.toUpperCase().replace(/\s+/g, "_")}</span> |{' '}
              <span className="text-green-600 font-medium">In Stock</span>
            </p>
            <div className="text-2xl font-bold text-green-600 mb-4">
              {priceEntry ? priceEntry.price : <span className="text-gray-400">Select options</span>}
            </div>

            {/* Condition */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Condition:</p>
              <div className="flex flex-wrap gap-2">
                {availableConditions.map((cond) => (
                  <button
                    key={cond}
                    onClick={() => setSelectedCondition(cond)}
                    className={`px-4 py-1.5 text-sm rounded border transition font-medium ${
                      selectedCondition === cond
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            {/* Storage */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Storage:</p>
              <div className="flex flex-wrap gap-2">
                {availableStorages.map((stor) => {
                  const disabled = selectedCondition && isDisabled(selectedCondition, stor);
                  const selected = stor === selectedStorage;

                  return (
                    <button
                      key={stor}
                      onClick={() => !disabled && setSelectedStorage(stor)}
                      className={`px-4 py-1.5 text-sm rounded border font-medium transition ${
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
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t text-center py-6 text-sm text-gray-500">
        © 2025 Price Dashboard Tabs. Built with Google Sheets.
      </footer>
    </div>
  );
}
