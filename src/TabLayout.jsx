import React, { useEffect, useState } from 'react';
import { fetchSheetData } from './utils';

export default function TabLayout() {
  const [data, setData] = useState([]);
  const [brand, setBrand] = useState(null);
  const [category, setCategory] = useState(null);
  const [model, setModel] = useState(null);
  const [condition, setCondition] = useState(null);
  const [storage, setStorage] = useState(null);

  useEffect(() => {
    fetchSheetData().then(setData);
  }, []);

  const brands = [...new Set(data.map(d => d.Brand))];
  const categories = [...new Set(data.filter(d => d.Brand === brand).map(d => d.Category))];
  const models = [...new Set(data.filter(d => d.Brand === brand && d.Category === category).map(d => d.Model))];

  const getStartingPrice = (model) => {
    const prices = data.filter(d => d.Model === model).map(d => parseFloat(d.Price.replace('$', '')));
    return prices.length ? Math.min(...prices) : null;
  };

  const modelData = data.filter(
    d => d.Brand === brand && d.Category === category && d.Model === model
  );

  const conditions = [...new Set(modelData.map(d => d.Condition))];
  const storages = [...new Set(modelData.map(d => d.Storage))];

  const currentPriceEntry = modelData.find(d => d.Condition === condition && d.Storage === storage);

  const unavailableStorages = storages.filter(s =>
    !modelData.some(d => d.Condition === condition && d.Storage === s)
  );

  const unavailableConditions = conditions.filter(c =>
    !modelData.some(d => d.Condition === c && d.Storage === storage)
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-center">📊 Price Lookup Dashboard (Tab View)</h1>

      {/* Step 1 */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Step 1: Choose a Brand</h2>
        <div className="flex flex-wrap gap-2">
          {brands.map(b => (
            <button
              key={b}
              onClick={() => {
                setBrand(b);
                setCategory(null);
                setModel(null);
                setCondition(null);
                setStorage(null);
              }}
              className={`px-4 py-2 rounded ${brand === b ? 'bg-blue-600 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2 */}
      {brand && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Step 2: Choose a Category</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => {
                  setCategory(c);
                  setModel(null);
                  setCondition(null);
                  setStorage(null);
                }}
                className={`px-4 py-2 rounded ${category === c ? 'bg-green-600 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3 */}
      {category && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Step 3: Choose a Model</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {models.map(m => (
              <button
                key={m}
                onClick={() => {
                  setModel(m);
                  setCondition(null);
                  setStorage(null);
                }}
                className={`text-left p-3 rounded border shadow ${
                  model === m ? 'bg-white text-black' : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <div className="font-bold">{m}</div>
                <div className="text-sm text-red-500 mt-1">
                  🔥 Starting from: ${getStartingPrice(m)}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Details */}
      {model && (
        <div className="mt-6 p-6 bg-gray-900 rounded shadow-md max-w-md">
          <h3 className="text-xl font-semibold mb-2">{model}</h3>
          <p className="text-sm text-blue-400 mb-4">
            SKU: {model.replace(/\s+/g, '_').toUpperCase()} |{' '}
            <span className="text-green-400">In Stock</span>
          </p>

          <p className="text-2xl font-bold mb-4">
            {currentPriceEntry ? `$${currentPriceEntry.Price.replace('$', '')}` : <span className="text-red-400">Select options</span>}
          </p>

          <div className="mb-4">
            <p className="mb-2 font-medium">Condition:</p>
            <div className="flex gap-2 flex-wrap">
              {conditions.map(c => (
                <button
                  key={c}
                  onClick={() => setCondition(c)}
                  className={`px-4 py-1 rounded ${
                    condition === c ? 'bg-white text-black' : unavailableConditions.includes(c) ? 'bg-gray-600 text-gray-300 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  disabled={unavailableConditions.includes(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-2">
            <p className="mb-2 font-medium">Storage:</p>
            <div className="flex gap-2 flex-wrap">
              {storages.map(s => (
                <button
                  key={s}
                  onClick={() => setStorage(s)}
                  className={`px-4 py-1 rounded ${
                    storage === s ? 'bg-white text-black' : unavailableStorages.includes(s) ? 'bg-gray-600 text-gray-300 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  disabled={unavailableStorages.includes(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
