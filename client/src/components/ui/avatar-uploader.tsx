import React, { useMemo } from "react";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "./extension/file-upload";
import { FileEditIcon, FilePlusIcon } from "lucide-react";
import Image from "next/image";

const AvatarUploader = React.memo(function AvatarUploader({
  value,
  onValueChange,
  dropzoneOptions,
  className,
  oldFile,
}: {
  value: File[] | null;
  onValueChange: (newValue: File[] | null) => void;
  dropzoneOptions: any;
  className?: string;
  oldFile?: any;
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
          {oldFile ? (
            <div className="whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-6 justify-between cursor-pointer flex items-center p-0 rounded-full min-h-[160px] min-w-[160px] max-w-[160px] relative">
              <div className="group font-medium leading-none tracking-tight flex items-center h-full w-full gap-1.5 relative">
                <div className="size-full relative">
                  <Image
                    src={oldFile.url}
                    alt="Company current uploaded logo"
                    className="object-cover rounded-full aspect-square min-w-[160px] transition-all duration-75"
                    fill
                    sizes="160px 160px"
                  />
                  <div className="group-hover:opacity-50 rounded-full bg-black opacity-0 h-full w-full absolute top-0 left-0 transition-opacity"></div>
                  <button
                    type="button"
                    className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FileEditIcon className="hidden group-hover:block w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:stroke-white duration-200 ease-in-out" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="group p-4 h-full border-2 border-dashed rounded-full flex items-center justify-center gap-1 min-w-[160px] max-w-[160px] min-h-[160px] max-h-[160px]">
              <FilePlusIcon className="h-7 w-7 text-muted-foreground group-hover:text-foreground transition" />
            </div>
          )}
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
                  sizes="160px 160px"
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
