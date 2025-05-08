import React, { useEffect, useState } from 'react';
import data from './data.json';

const TabLayout = () => {
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [models, setModels] = useState([]);

  const brands = [...new Set(data.map((item) => item.Brand))];
  const categories = [...new Set(data.map((item) => item.Category))];

  useEffect(() => {
    if (selectedBrand && selectedCategory) {
      const filtered = data.filter(
        (item) =>
          item.Brand === selectedBrand &&
          item.Category === selectedCategory
      );
      const uniqueModels = [...new Set(filtered.map((item) => item.Model))];
      const modelWithPrices = uniqueModels.map((model) => {
        const modelItems = filtered.filter((item) => item.Model === model);
        const prices = modelItems.map((item) =>
          Number(item.Price.replace(/\$/g, ''))
        );
        return {
          model,
          minPrice: Math.min(...prices),
        };
      });
      setModels(modelWithPrices);
      setSelectedModel(null);
      setSelectedCondition(null);
      setSelectedStorage(null);
    }
  }, [selectedBrand, selectedCategory]);

  const getModelVariants = () => {
    if (!selectedModel) return [];
    return data.filter(
      (item) =>
        item.Brand === selectedBrand &&
        item.Category === selectedCategory &&
        item.Model === selectedModel
    );
  };

  const modelVariants = getModelVariants();

  const availableConditions = [
    ...new Set(modelVariants.map((item) => item.Condition)),
  ];

  const availableStorage = [
    ...new Set(modelVariants.map((item) => item.Storage)),
  ];

  const filteredVariant =
    selectedModel && selectedCondition && selectedStorage
      ? modelVariants.find(
          (item) =>
            item.Condition === selectedCondition &&
            item.Storage === selectedStorage
        )
      : null;

  const getUnavailableOptions = (type) => {
    if (!selectedModel) return [];

    if (type === 'Storage' && selectedCondition) {
      return availableStorage.filter((storage) => {
        return !modelVariants.find(
          (v) =>
            v.Condition === selectedCondition && v.Storage === storage
        );
      });
    }

    if (type === 'Condition' && selectedStorage) {
      return availableConditions.filter((condition) => {
        return !modelVariants.find(
          (v) =>
            v.Condition === condition && v.Storage === selectedStorage
        );
      });
    }

    return [];
  };

  const unavailableStorage = getUnavailableOptions('Storage');
  const unavailableConditions = getUnavailableOptions('Condition');

  return (
    <div className="bg-[#1e1e2f] min-h-screen p-4 text-white font-sans">
      <h1 className="text-2xl font-bold mb-4">📊 Price Lookup Dashboard (Tab View)</h1>

      {/* Step 1: Brand */}
      <div className="mb-4">
        <h2 className="font-semibold mb-2">Step 1: Choose a Brand</h2>
        <div className="flex flex-wrap gap-2">
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => {
                setSelectedBrand(brand);
                setSelectedCategory(null);
                setSelectedModel(null);
              }}
              className={`px-4 py-2 rounded ${
                selectedBrand === brand
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Category */}
      {selectedBrand && (
        <div className="mb-4">
          <h2 className="font-semibold mb-2">Step 2: Choose a Category</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedModel(null);
                }}
                className={`px-4 py-2 rounded ${
                  selectedCategory === cat
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Model */}
      {selectedBrand && selectedCategory && (
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Step 3: Choose a Model</h2>
          <div className="flex flex-wrap gap-3">
            {models.map(({ model, minPrice }) => (
              <button
                key={model}
                onClick={() => {
                  setSelectedModel(model);
                  setSelectedCondition(null);
                  setSelectedStorage(null);
                }}
                className={`px-4 py-2 border rounded text-left ${
                  selectedModel === model
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-gray-200'
                }`}
              >
                <div className="font-semibold">{model}</div>
                <div className="text-sm text-red-600">
                  🔥 Starting from: ${minPrice}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Variants */}
      {selectedModel && (
        <div className="bg-white text-black p-4 rounded shadow max-w-md">
          <h3 className="text-lg font-semibold mb-1">{selectedModel}</h3>
          <div className="text-sm text-blue-600 mb-2">
            SKU: {selectedModel.replace(/\s+/g, '_').toUpperCase()} |{' '}
            <span className="text-green-600">In Stock</span>
          </div>
          <div className="text-2xl font-bold mb-4">
            ${filteredVariant ? filteredVariant.Price.replace(/\$/g, '') : 'Select options'}
          </div>

          <div className="mb-3">
            <h4 className="font-medium">Condition:</h4>
            <div className="flex gap-2 mt-1 flex-wrap">
              {availableConditions.map((cond) => (
                <button
                  key={cond}
                  onClick={() => setSelectedCondition(cond)}
                  disabled={unavailableConditions.includes(cond)}
                  className={`px-4 py-1 rounded border ${
                    selectedCondition === cond
                      ? 'bg-black text-white'
                      : unavailableConditions.includes(cond)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-white text-black hover:bg-gray-200'
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium">Storage:</h4>
            <div className="flex gap-2 mt-1 flex-wrap">
              {availableStorage.map((stor) => (
                <button
                  key={stor}
                  onClick={() => setSelectedStorage(stor)}
                  disabled={unavailableStorage.includes(stor)}
                  className={`px-4 py-1 rounded border ${
                    selectedStorage === stor
                      ? 'bg-black text-white'
                      : unavailableStorage.includes(stor)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-white text-black hover:bg-gray-200'
                  }`}
                >
                  {stor}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabLayout;
