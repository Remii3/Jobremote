import AvatarUploader from "@/components/ui/avatar-uploader";
import { Label } from "@/components/ui/label";
import { DropzoneOptions } from "react-dropzone";

const dropzone = {
  accept: {
    "application/pdf": [".png", ".img", ".jpeg", ".jpg", ".webp"],
  },
  multiple: true,
  maxFiles: 1,
  maxSize: 4 * 1024 * 1024,
} satisfies DropzoneOptions;

interface AvatarSectionProps {
  selectedLogo: File[] | null;
  onLogoChange: (file: File[] | null) => void;
  oldLogo: {
    key: string;
    url: string;
    name: string;
  } | null;
}

export default function AvatarSection({
  selectedLogo,
  onLogoChange,
  oldLogo,
}: AvatarSectionProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label>Company logo</Label>
      <AvatarUploader
        dropzoneOptions={dropzone}
        onValueChange={onLogoChange}
        value={selectedLogo}
        oldFile={oldLogo}
      />
    </div>
  );
}
