const MEDICAL_DOCUMENT_LABELS = new Set([
  "medicalfitnesscertificatebymbbsdr",
  "hivhepatitisbctestreport",
]);

export function isMedicalDocumentLabel(label: string) {
  const normalizedLabel = label.toLowerCase().replace(/[^a-z0-9]/g, "");
  return MEDICAL_DOCUMENT_LABELS.has(normalizedLabel);
}
