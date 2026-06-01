import React from "react";
import { diseases } from "../data/diseases";

interface Props {
  lang: "en" | "mr";
}

const DiseaseLibrary: React.FC<Props> = ({ lang }) => {
  const [showChecker, setShowChecker] = React.useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = React.useState<string[]>([]);
  const [resultDiseases, setResultDiseases] = React.useState<any[]>([]);
  const symptoms = [
  {
    en: "Swollen Eyes",
    mr: "डोळे सुजणे"
  },
  {
    en: "Sneezing",
    mr: "शिंक येणे"
  },
  {
    en: "Nasal Discharge",
    mr: "नाकातून स्त्राव"
  },
  {
    en: "Green Diarrhea",
    mr: "हिरवे जुलाब"
  },
  {
    en: "Twisted Neck",
    mr: "मान वाकडी होणे"
  },
  {
    en: "Bloody Droppings",
    mr: "रक्तमिश्रित विष्ठा"
  },
  {
    en: "Breathing Difficulty",
    mr: "श्वास घेण्यास त्रास"
  },
  {
    en: "Loss of Appetite",
    mr: "भूक न लागणे"
  }
];
console.log(selectedSymptoms);
const checkDisease = () => {

  const matches = [];

  if (
    selectedSymptoms.includes("Swollen Eyes") ||
    selectedSymptoms.includes("Sneezing") ||
    selectedSymptoms.includes("Nasal Discharge")
  ) {
    const disease = diseases.find(
      d => d.nameEn === "Coryza"
    );

    if (disease) matches.push(disease);
  }

  if (
    selectedSymptoms.includes("Twisted Neck") ||
    selectedSymptoms.includes("Green Diarrhea")
  ) {
    const disease = diseases.find(
      d => d.nameEn === "Newcastle Disease"
    );

    if (disease) matches.push(disease);
  }

  if (
    selectedSymptoms.includes("Bloody Droppings")
  ) {
    const disease = diseases.find(
      d => d.nameEn === "Coccidiosis"
    );

    if (disease) matches.push(disease);
  }

  if (
    selectedSymptoms.includes("Breathing Difficulty")
  ) {
    const disease = diseases.find(
      d => d.nameEn === "CRD (Chronic Respiratory Disease)"
    );

    if (disease) matches.push(disease);
  }

  setResultDiseases(matches);
};
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
  <h1 className="text-3xl font-bold">
    {lang === "en"
      ? "Disease Library"
      : "रोग माहिती केंद्र"}
  </h1>

  <button
    onClick={() => setShowChecker(!showChecker)}
    className="bg-emerald-600 text-white px-4 py-2 rounded-lg"
  >
    {lang === "en"
      ? "🩺 Disease Checker"
      : "🩺 रोग तपासणी"}
  </button>
</div>

{showChecker && (
  <div className="bg-blue-50 border rounded-xl p-5 mb-6">

    <h2 className="text-xl font-bold mb-4">
      {lang === "en"
        ? "Select Symptoms"
        : "लक्षणे निवडा"}
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

      {symptoms.map((symptom, index) => (
        <label
          key={index}
          className="flex items-center gap-2"
        >
          <input
            type="checkbox"
            checked={selectedSymptoms.includes(symptom.en)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedSymptoms([
                  ...selectedSymptoms,
                  symptom.en
                ]);
              } else {
                setSelectedSymptoms(
                  selectedSymptoms.filter(
                    s => s !== symptom.en
                  )
                );
              }
            }}
          />

          {lang === "en"
            ? symptom.en
            : symptom.mr}
        </label>
      ))}

    </div>

   <button
  onClick={checkDisease}
  className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-lg"
>
  {lang === "en"
    ? "Check Disease"
    : "रोग तपासा"}
</button> 

  </div>
)}

{resultDiseases.length > 0 && (

  <div className="space-y-4 mb-6">

    <h2 className="text-2xl font-bold text-green-700">

      {lang === "en"
        ? "Most Likely Diseases"
        : "संभाव्य रोग"}

    </h2>

    {resultDiseases.map((disease, index) => (

      <div
        key={index}
        className="bg-green-50 border rounded-xl p-5"
      >

        <h3 className="font-bold text-lg mb-2">

          #{index + 1}{" "}

          {lang === "en"
            ? disease.nameEn
            : disease.nameMr}

        </h3>

        <p className="mb-2">

          <strong>
            {lang === "en"
              ? "Severity"
              : "तीव्रता"}
          </strong>

          : {" "}

          {lang === "en"
            ? disease.severityEn
            : disease.severityMr}

        </p>

        <p className="mb-2">

          <strong>
            {lang === "en"
              ? "Treatment"
              : "उपचार"}
          </strong>

          : {" "}

          {lang === "en"
            ? disease.treatmentEn
            : disease.treatmentMr}

        </p>

        <p>

          <strong>
            {lang === "en"
              ? "Prevention"
              : "प्रतिबंध"}
          </strong>

          : {" "}

          {lang === "en"
            ? disease.preventionEn
            : disease.preventionMr}

        </p>

        <h4 className="font-bold mt-4 mb-2">
  {lang === "en"
    ? "🚨 Immediate Action"
    : "🚨 तात्काळ कृती"}
</h4>

<ul className="list-disc ml-6">
  {(lang === "en"
    ? disease.actionEn
    : disease.actionMr
  ).map((action, i) => (
    <li key={i}>{action}</li>
  ))}
</ul>

      </div>

    ))}

  </div>

)}

      <div className="space-y-6">
        {diseases.map((disease, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow p-5 border"
          >
            <h2 className="text-xl font-bold text-red-600 mb-3">
              {lang === "en"
                ? disease.nameEn
                : disease.nameMr}
            </h2>

            <h3 className="font-semibold mb-2">
              {lang === "en"
                ? "Symptoms"
                : "लक्षणे"}
            </h3>

            <ul className="list-disc ml-6 mb-4">
              {(lang === "en"
                ? disease.symptomsEn
                : disease.symptomsMr
              ).map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>

            <h3 className="font-semibold mb-2">
  {lang === "en"
    ? "Prevention"
    : "प्रतिबंध"}
</h3>

<p className="mb-4">
  {lang === "en"
    ? disease.preventionEn
    : disease.preventionMr}
</p>

<h3 className="font-semibold mb-2">
  {lang === "en"
    ? "Severity"
    : "तीव्रता"}
</h3>

<div className="mb-4">
  <span
    className={`px-3 py-1 rounded-full text-white text-sm ${
      (lang === "en"
        ? disease.severityEn
        : disease.severityMr) === "High" ||
      (lang === "en"
        ? disease.severityEn
        : disease.severityMr) === "उच्च"
        ? "bg-red-500"
        : "bg-yellow-500"
    }`}
  >
    {lang === "en"
      ? disease.severityEn
      : disease.severityMr}
  </span>
</div>

<h3 className="font-semibold mb-2">
  {lang === "en"
    ? "Treatment"
    : "उपचार"}
</h3>

<p>
  {lang === "en"
    ? disease.treatmentEn
    : disease.treatmentMr}
</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiseaseLibrary;