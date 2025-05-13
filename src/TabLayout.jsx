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
    ...new Set(filteredByModel.map((item) => item.Condition).filter(Boolean)),
  ];
  const availableStorages = [
    ...new Set(filteredByModel.map((item) => item.Storage)),
  ];

  const allVariants = filteredByModel.map((item) => ({
    condition: item.Condition,
    storage: item.Storage,
    price: item.Price,
  }));

  const priceEntry = allVariants.find((v) => {
    const conditionMatch =
      v.condition === selectedCondition || (!v.condition && !selectedCondition);
    const storageMatch = v.storage === selectedStorage;
    return conditionMatch && storageMatch;
  });

  const isDisabled = (condition, storage) => {
    return !allVariants.find(
      (v) =>
        (v.condition === condition || (!v.condition && !condition)) &&
        v.storage === storage
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
    <div className="bg-gradient-to-b from-white to-slate-100 min-h-screen px-4 sm:px-6 lg:px-8 py-6 text-gray-800">
      <section id="dashboard" className="py-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">Live Product Pricing</h2>
        <p className="text-center text-gray-600 mb-8">
          Instantly share your latest pricing via Google Sheets. No code. Mobile optimized.
        </p>

        <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span>📦</span> Price Lookup Dashboard
          </h3>

          {/* Step 1: Brand */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <span>📱</span> Step 1: Choose a Brand
            </h4>
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
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
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

          {/* Step 2: Category */}
          {selectedBrand && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span>📂</span> Step 2: Choose a Category
              </h4>
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
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
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

          {/* Step 3: Model */}
          {selectedCategory && (
            <div className="mb-6" ref={modelRef}>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>📋</span> Step 3: Choose a Model
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {models.map((model) => (
                  <button
                    key={model}
                    onClick={() => {
                      setSelectedModel(model);
                      setSelectedCondition(null);
                      setSelectedStorage(null);
                    }}
                    className={`rounded-lg p-4 text-left shadow border transition text-sm ${
                      selectedModel === model
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-900 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-semibold text-base">{model}</div>
                    <div className="text-red-500 mt-1">
                      🔥 Starting from: ${startingPrice(model)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selection Details */}
          {selectedModel && (
            <div ref={detailRef} className="mt-8 bg-gray-50 rounded-xl p-6 shadow">
              <h5 className="text-xl font-semibold text-gray-800">{selectedModel}</h5>
              <p className="text-sm text-gray-500 mt-1">
                SKU: <span className="font-mono text-gray-600">{selectedModel.toUpperCase().replace(/\s+/g, "_")}</span>{" "}
                <span className={priceEntry ? "text-green-600" : "text-red-500"}>{priceEntry ? "| In Stock" : "| Out of Stock"}</span>
              </p>

              <div className="text-3xl font-bold mt-4">
                {priceEntry ? (
                  <span className="text-green-700">{priceEntry.price}</span>
                ) : (
                  <span className="text-gray-400 text-lg">Sold Out</span>
                )}
              </div>

              {/* Condition */}
              <div className="mt-4">
                <p className="font-medium text-sm mb-1">Condition:</p>
                <div className="flex flex-wrap gap-2">
                  {availableConditions.map((cond) => (
                    <button
                      key={cond}
                      onClick={() => setSelectedCondition(cond)}
                      className={`px-4 py-1.5 rounded border text-sm font-medium transition ${
                        selectedCondition === cond
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>

              {/* Storage */}
              <div className="mt-4">
                <p className="font-medium text-sm mb-1">Storage:</p>
                <div className="flex flex-wrap gap-2">
                  {availableStorages.map((stor) => {
                    const disabled =
                      selectedCondition !== null && isDisabled(selectedCondition, stor);
                    const selected = stor === selectedStorage;

                    return (
                      <button
                        key={stor}
                        onClick={() => !disabled && setSelectedStorage(stor)}
                        disabled={disabled}
                        className={`px-4 py-1.5 rounded border text-sm font-medium transition ${
                          selected
                            ? "bg-black text-white border-black"
                            : disabled
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300"
                            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                        }`}
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
      </section>
    </div>
  );
}
