import React, { useEffect, useState } from "react";

export default function TabLayout() {
  const [data, setData] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);

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
    (v) =>
      v.condition === selectedCondition && v.storage === selectedStorage
  );

  const isDisabled = (condition, storage) => {
    return !allVariants.find(
      (v) => v.condition === condition && v.storage === storage
    );
  };

  return (
    <div className="px-4 py-6 sm:px-6 bg-gray-100 min-h-screen max-w-screen-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        📊 Price Lookup Dashboard
      </h1>

      <div className="mb-5">
        <p className="font-semibold">Step 1: Choose a Brand</p>
        <div className="flex flex-wrap gap-2 mt-2">
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
              className={`px-4 py-2 rounded w-full sm:w-auto ${
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

      {selectedBrand && (
        <div className="mb-5">
          <p className="font-semibold">Step 2: Choose a Category</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedModel("");
                  setSelectedCondition(null);
                  setSelectedStorage(null);
                }}
                className={`px-4 py-2 rounded w-full sm:w-auto ${
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

      {selectedCategory && (
        <div className="mb-6">
          <p className="font-semibold mb-2">Step 3: Choose a Model</p>
          <div className="flex flex-wrap gap-3">
            {models.map((model) => {
              const priceList = data
                .filter(
                  (item) =>
                    item.Brand === selectedBrand &&
                    item.Category === selectedCategory &&
                    item.Model === model
                )
                .map((item) => parseFloat(item.Price?.replace(/[^\d.]/g, "")) || 0);
              const minPrice = Math.min(...priceList);

              return (
                <button
                  key={model}
                  onClick={() => {
                    setSelectedModel(model);
                    setSelectedCondition(null);
                    setSelectedStorage(null);
                  }}
                  className={`px-4 py-3 rounded min-w-[180px] w-full sm:w-auto text-left border ${
                    selectedModel === model
                      ? "bg-black text-white"
                      : "bg-white"
                  }`}
                >
                  <div className="text-sm font-medium">{model}</div>
                  <div className="text-xs text-red-600">
                    🔥 Starting from: ${minPrice}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedModel && (
        <div className="bg-white rounded shadow p-4 mt-6">
          <h2 className="text-xl font-semibold">{selectedModel}</h2>
          <p className="text-blue-600 text-sm mt-1">
            SKU: {selectedModel.toUpperCase().replace(/\s+/g, "_")}{" "}
            <span className="text-green-600">| In Stock</span>
          </p>

          <p className="text-2xl font-bold mt-2">
            {priceEntry ? priceEntry.price : <span className="text-lg">Select options</span>}
          </p>

          <div className="mt-4">
            <p className="font-medium mb-1">Condition:</p>
            <div className="flex flex-wrap gap-2">
              {availableConditions.map((cond) => (
                <button
                  key={cond}
                  onClick={() => setSelectedCondition(cond)}
                  className={`px-3 py-1 rounded border w-full sm:w-auto ${
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
            <div className="flex flex-wrap gap-2">
              {availableStorages.map((stor) => {
                const disabled = selectedCondition && isDisabled(selectedCondition, stor);
                const selected = stor === selectedStorage;

                return (
                  <button
                    key={stor}
                    onClick={() => !disabled && setSelectedStorage(stor)}
                    className={`px-3 py-1 rounded border w-full sm:w-auto ${
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
