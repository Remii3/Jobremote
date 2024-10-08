import React, { useMemo } from "react";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "./extension/file-upload";
import { FilePlusIcon } from "lucide-react";
import Image from "next/image";

const AvatarUploader = React.memo(function AvatarUploader({
  value,
  onValueChange,
  dropzoneOptions,
  className,
}: {
  value: File[] | null;
  onValueChange: (newValue: File[] | null) => void;
  dropzoneOptions: any;
  className?: string;
}) {
  const fileUrls = useMemo(
    () => value?.map((file) => URL.createObjectURL(file)) || [],
    [value]
  );
  return (
    <FileUploader
      value={value}
      onValueChange={onValueChange}
      dropzoneOptions={dropzoneOptions}
      reSelect
      className="h-full"
    >
      {(!value || (value && value.length <= 0)) && (
        <FileInput className="h-full">
          <div className="group p-4 h-full border-2 border-dashed rounded-full flex items-center justify-center gap-1 min-w-[160px] max-w-[160px] min-h-[160px] max-h-[160px]">
            <FilePlusIcon className="h-7 w-7 text-muted-foreground group-hover:text-foreground transition" />
          </div>
        </FileInput>
      )}
      {value && value.length > 0 && (
        <FileUploaderContent>
          {value.map((file: any, i: any) => (
            <FileUploaderItem
              key={i}
              index={i}
              aria-roledescription={`file ${i + 1} containing ${file.name}`}
              absoluteRemove
              className="p-0 rounded-full min-h-[160px] min-w-[160px] max-w-[160px] relative"
            >
              <div className="size-full relative">
                <Image
                  src={fileUrls[i]}
                  alt={file.name}
                  className="object-cover rounded-full aspect-square min-w-[160px] transition-all duration-75"
                  fill
                />
              </div>
            </FileUploaderItem>
          ))}
        </FileUploaderContent>
      )}
    </FileUploader>
  );
});
export default AvatarUploader;
