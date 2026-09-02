import { useRef } from "react";
import { ImagePlus, X } from "lucide-react";
import { useToast } from "../context/ToastContext";

const MAX_BYTES = 1.5 * 1024 * 1024; // 1.5MB — keeps the base64 doc size sane

export default function ImageUploadField({ label = "Photo", value, onChange }) {
  const inputRef = useRef(null);
  const { showToast } = useToast();

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please choose an image file.");
      return;
    }
    if (file.size > MAX_BYTES) {
      showToast("Image is too large — please pick one under 1.5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="field">
      <label>{label}</label>
      <div className="image-upload">
        {value ? (
          <div className="image-upload-preview">
            <img src={value} alt="Preview" />
            <button type="button" className="btn-icon btn-ghost image-upload-remove" onClick={() => onChange("")} aria-label="Remove image">
              <X size={14} />
            </button>
          </div>
        ) : (
          <button type="button" className="image-upload-empty" onClick={() => inputRef.current?.click()}>
            <ImagePlus size={20} />
            <span>Upload image</span>
          </button>
        )}
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} hidden />
        {value && (
          <button type="button" className="btn btn-outline btn-sm mt-8" onClick={() => inputRef.current?.click()}>Change Image</button>
        )}
      </div>
    </div>
  );
}
