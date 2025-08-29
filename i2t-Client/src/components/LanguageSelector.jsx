// i2t-client/src/components/LanguageSelector.jsx

const LANGUAGES = [
  { code: "eng", name: "English" },
  { code: "jpn", name: "Japanese" },
  { code: "spa", name: "Spanish" },
];

export default function LanguageSelector({ selected, onChange }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Select Language</label>
      <select
        className="border p-2 rounded-md"
        value={selected}
        onChange={(e) => onChange(e.target.value)}
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}
